import Gateway from '#models/gateway'
import Gateway1Service from './gateway1_service.js'
import Gateway2Service from './gateway2_service.js'
import { GatewayInterface } from './gateway_interface.js'

export default class GatewayManager {
  private getGatewayService(name: string): GatewayInterface {
    switch (name) {
      case 'Gateway1':
        return new Gateway1Service()
      case 'Gateway2':
        return new Gateway2Service()
      default:
        throw new Error(`Gateway ${name} not implemented`)
    }
  }

  async createTransaction(data: {
    amount: number
    name: string
    email: string
    cardNumber: string
    cvv: string
  }) {
    const gateways = await Gateway.query()
      .where('is_active', true)
      .orderBy('priority', 'asc')

    if (gateways.length === 0) throw new Error('No active gateways available')

    const errors: string[] = []

    for (const gateway of gateways) {
      try {
        const service = this.getGatewayService(gateway.name)
        const result = await service.createTransaction(data)
        return { gateway, result }
      } catch (error: any) {
        errors.push(`${gateway.name}: ${error.message}`)
      }
    }

    throw new Error(`All gateways failed: ${errors.join(' | ')}`)
  }

  async refundTransaction(gatewayName: string, externalId: string): Promise<void> {
    const service = this.getGatewayService(gatewayName)
    await service.refundTransaction(externalId)
  }
}