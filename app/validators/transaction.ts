import vine from '@vinejs/vine'

export const createTransactionValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(100),
    email: vine.string().email(),
    cardNumber: vine.string().fixedLength(16),
    cvv: vine.string().minLength(3).maxLength(4),
    products: vine.array(
      vine.object({
        id: vine.number().positive().withoutDecimals(),
        quantity: vine.number().positive().withoutDecimals(),
      })
    ).minLength(1),
  })
)