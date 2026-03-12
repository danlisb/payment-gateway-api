import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100),
    amount: vine.number().positive().withoutDecimals(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100).optional(),
    amount: vine.number().positive().withoutDecimals().optional(),
  })
)