import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Gateway from '#models/gateway'

test.group('Gateways', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should toggle gateway active status', async ({ client, assert }) => {
    const user = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    })

    const gateway = await Gateway.create({
      name: 'TestGateway',
      isActive: true,
      priority: 1,
    })

    const response = await client
      .patch(`/gateways/${gateway.id}/toggle`)
      .loginAs(user)

    response.assertStatus(200)
    assert.equal(response.body().isActive, false)
  })

  test('should update gateway priority', async ({ client, assert }) => {
    const user = await User.create({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    })

    const gateway = await Gateway.create({
      name: 'TestGateway',
      isActive: true,
      priority: 1,
    })

    const response = await client
      .patch(`/gateways/${gateway.id}/priority`)
      .json({ priority: 5 })
      .loginAs(user)

    response.assertStatus(200)
    assert.equal(response.body().priority, 5)
  })
})