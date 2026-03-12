import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ response }: HttpContext) {
    const users = await User.all()
    return response.ok(users.map((u) => ({
      id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt,
    })))
  }

  async show({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) return response.notFound({ message: 'User not found' })
    return response.ok({ id: user.id, name: user.name, email: user.email, role: user.role })
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)
    const user = await User.create(data)
    return response.created({ id: user.id, name: user.name, email: user.email, role: user.role })
  }

  async update({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) return response.notFound({ message: 'User not found' })
    const data = await request.validateUsing(updateUserValidator)
    user.merge(data)
    await user.save()
    return response.ok({ id: user.id, name: user.name, email: user.email, role: user.role })
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) return response.notFound({ message: 'User not found' })
    await user.delete()
    return response.noContent()
  }
}