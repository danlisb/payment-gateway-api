import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Auth', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should login with valid credentials', async ({ client }) => {
    await User.create({
      name: 'Test Admin',
      email: 'test@admin.com',
      password: 'password123',
      role: 'admin',
    })

    const response = await client.post('/login').json({
      email: 'test@admin.com',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertBodyContains({ user: { email: 'test@admin.com' } })
  })

  test('should reject invalid credentials', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'wrong@email.com',
      password: 'wrongpassword',
    })

    response.assertStatus(401)
  })

  test('should reject login with invalid email format', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'not-an-email',
      password: 'password123',
    })

    response.assertStatus(422)
  })

  test('should reject login with short password', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'test@admin.com',
      password: '123',
    })

    response.assertStatus(422)
  })
})