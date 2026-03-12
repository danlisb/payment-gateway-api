import Transaction from '#models/transaction'
import Client from '#models/client'
import Product from '#models/product'
import GatewayManager from '#services/gateways/gateway_manager'
import type { HttpContext } from '@adonisjs/core/http'

export default class TransactionsController {
  async index({ response }: HttpContext) {
    const transactions = await Transaction.query()
      .preload('client')
      .preload('gateway')
      .preload('products')
    return response.ok(transactions)
  }

  async show({ params, response }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('client')
      .preload('gateway')
      .preload('products')
      .first()

    if (!transaction) return response.notFound({ message: 'Transaction not found' })
    return response.ok(transaction)
  }

  async store({ request, response }: HttpContext) {
    const { name, email, cardNumber, cvv, products } = request.only([
      'name', 'email', 'cardNumber', 'cvv', 'products',
    ])

    // products: [{ id: 1, quantity: 2 }, ...]
    const productRecords = await Product.query().whereIn('id', products.map((p: any) => p.id))
    if (productRecords.length !== products.length) {
      return response.unprocessableEntity({ message: 'One or more products not found' })
    }

    const amount = productRecords.reduce((total: number, product: Product) => {
      const item = products.find((p: any) => p.id === product.id)
      return total + product.amount * item.quantity
    }, 0)

    let client = await Client.findBy('email', email)
    if (!client) {
      client = await Client.create({ name, email })
    }

    const manager = new GatewayManager()
    const { gateway, result } = await manager.createTransaction({
      amount,
      name,
      email,
      cardNumber,
      cvv,
    })

    const transaction = await Transaction.create({
      clientId: client.id,
      gatewayId: gateway.id,
      externalId: result.externalId,
      status: 'approved',
      amount: result.amount,
      cardLastNumbers: result.cardLastNumbers,
    })

    await transaction.related('products').attach(
      Object.fromEntries(products.map((p: any) => [p.id, { quantity: p.quantity }]))
    )

    await transaction.load('products')
    await transaction.load('gateway')

    return response.created(transaction)
  }

  async refund({ params, response }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('gateway')
      .first()

    if (!transaction) return response.notFound({ message: 'Transaction not found' })
    if (transaction.status === 'refunded') {
      return response.badRequest({ message: 'Transaction already refunded' })
    }

    const manager = new GatewayManager()
    await manager.refundTransaction(transaction.gateway.name, transaction.externalId)

    transaction.status = 'refunded'
    await transaction.save()

    return response.ok(transaction)
  }
}