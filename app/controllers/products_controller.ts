import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index({ response }: HttpContext) {
    const products = await Product.all()
    return response.ok(products)
  }

  async show({ params, response }: HttpContext) {
    const product = await Product.find(params.id)
    if (!product) return response.notFound({ message: 'Product not found' })
    return response.ok(product)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'amount'])
    const product = await Product.create(data)
    return response.created(product)
  }

  async update({ params, request, response }: HttpContext) {
    const product = await Product.find(params.id)
    if (!product) return response.notFound({ message: 'Product not found' })
    product.merge(request.only(['name', 'amount']))
    await product.save()
    return response.ok(product)
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.find(params.id)
    if (!product) return response.notFound({ message: 'Product not found' })
    await product.delete()
    return response.noContent()
  }
}