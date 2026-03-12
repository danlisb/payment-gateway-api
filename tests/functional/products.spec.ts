import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Products', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should create a product as admin', async ({ client }) => {
    const user = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    })

    const response = await client
      .post('/products')
      .json({ name: 'Test Product', amount: 1000 })
      .loginAs(user)

    response.assertStatus(201)
    response.assertBodyContains({ name: 'Test Product', amount: 1000 })
  })

  test('should not create a product as regular user', async ({ client }) => {
    const user = await User.create({
      name: 'User',
      email: 'user@test.com',
      password: 'password123',
      role: 'user',
    })

    const response = await client
      .post('/products')
      .json({ name: 'Test Product', amount: 1000 })
      .loginAs(user)

    response.assertStatus(403)
  })

  test('should list all products', async ({ client }) => {
    const user = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    })

    const response = await client.get('/products').loginAs(user)

    response.assertStatus(200)
  })
})