import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Users', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should list users as admin', async ({ client }) => {
    const user = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    })

    const response = await client.get('/users').loginAs(user)
    response.assertStatus(200)
  })

  test('should list users as manager', async ({ client }) => {
    const user = await User.create({
      name: 'Manager',
      email: 'manager@test.com',
      password: 'password123',
      role: 'manager',
    })

    const response = await client.get('/users').loginAs(user)
    response.assertStatus(200)
  })

  test('should not list users as finance', async ({ client }) => {
    const user = await User.create({
      name: 'Finance',
      email: 'finance@test.com',
      password: 'password123',
      role: 'finance',
    })

    const response = await client.get('/users').loginAs(user)
    response.assertStatus(403)
  })

  test('should not list users as regular user', async ({ client }) => {
    const user = await User.create({
      name: 'User',
      email: 'user@test.com',
      password: 'password123',
      role: 'user',
    })

    const response = await client.get('/users').loginAs(user)
    response.assertStatus(403)
  })

  test('should create user with valid data', async ({ client }) => {
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    })

    const response = await client
      .post('/users')
      .json({
        name: 'New User',
        email: 'newuser@test.com',
        password: 'password123',
        role: 'user',
      })
      .loginAs(admin)

    response.assertStatus(201)
    response.assertBodyContains({ email: 'newuser@test.com', role: 'user' })
  })

  test('should not delete user as manager', async ({ client }) => {
    const manager = await User.create({
      name: 'Manager',
      email: 'manager@test.com',
      password: 'password123',
      role: 'manager',
    })

    const response = await client.delete('/users/1').loginAs(manager)
    response.assertStatus(403)
  })
})