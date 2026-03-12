import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async store({ request }: HttpContext) {
    const { name, email, password } = request.only(['name', 'email', 'password'])
    const user = await User.create({ name, email, password })
    const token = await User.accessTokens.create(user)
    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: token.value!.release(),
    }
  }
}