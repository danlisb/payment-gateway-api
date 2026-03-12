import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

type Role = 'admin' | 'manager' | 'finance' | 'user'

export default class AdminOnlyMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn, allowedRoles: Role[] = ['admin']) {
    const user = auth.user!
    if (!allowedRoles.includes(user.role)) {
      return response.forbidden({ message: 'Access denied: insufficient permissions' })
    }
    return next()
  }
}