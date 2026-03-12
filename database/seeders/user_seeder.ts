import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.query().delete()
    await User.create({
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin123',
      role: 'admin',
    })
  }
}