import Gateway from '#models/gateway'
import { updatePriorityValidator } from '#validators/gateway'
import type { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController {
  async index({ response }: HttpContext) {
    const gateways = await Gateway.query().orderBy('priority', 'asc')
    return response.ok(gateways)
  }

  async toggleActive({ params, response }: HttpContext) {
    const gateway = await Gateway.find(params.id)
    if (!gateway) return response.notFound({ message: 'Gateway not found' })
    gateway.isActive = !gateway.isActive
    await gateway.save()
    return response.ok(gateway)
  }

  async updatePriority({ params, request, response }: HttpContext) {
    const gateway = await Gateway.find(params.id)
    if (!gateway) return response.notFound({ message: 'Gateway not found' })
    const { priority } = await request.validateUsing(updatePriorityValidator)
    gateway.priority = priority
    await gateway.save()
    return response.ok(gateway)
  }
}