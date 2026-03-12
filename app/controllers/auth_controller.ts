import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)
      return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token: token.value!.release(),
      }
    } catch {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user as any
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return response.noContent()
  }
}