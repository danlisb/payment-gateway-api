import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AccessTokenController {
  async store({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: token.value!.release(),
    }
  }

 async destroy({ auth, response }: HttpContext) {
  const user = auth.user as any
  await User.accessTokens.delete(user, user.currentAccessToken!.identifier)
  return response.noContent()
}
}