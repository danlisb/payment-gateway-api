import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100),
    email: vine.string().email(),
    password: vine.string().minLength(6),
    role: vine.enum(['admin', 'manager', 'finance', 'user']),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100).optional(),
    email: vine.string().email().optional(),
    password: vine.string().minLength(6).optional(),
    role: vine.enum(['admin', 'manager', 'finance', 'user']).optional(),
  })
)