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

  test('should create a product as manager', async ({ client }) => {
    const user = await User.create({
      name: 'Manager',
      email: 'manager@test.com',
      password: 'password123',
      role: 'manager',
    })

    const response = await client
      .post('/products')
      .json({ name: 'Manager Product', amount: 2000 })
      .loginAs(user)

    response.assertStatus(201)
  })

  test('should create a product as finance', async ({ client }) => {
    const user = await User.create({
      name: 'Finance',
      email: 'finance@test.com',
      password: 'password123',
      role: 'finance',
    })

    const response = await client
      .post('/products')
      .json({ name: 'Finance Product', amount: 3000 })
      .loginAs(user)

    response.assertStatus(201)
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

  test('should reject product with invalid amount', async ({ client }) => {
    const user = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    })

    const response = await client
      .post('/products')
      .json({ name: 'Test Product', amount: -100 })
      .loginAs(user)

    response.assertStatus(422)
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