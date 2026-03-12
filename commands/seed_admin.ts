import { BaseCommand } from '@adonisjs/core/ace'
import { inject } from '@adonisjs/core'

export default class SeedAdmin extends BaseCommand {
  static commandName = 'seed:admin'
  static description = 'Create admin user'

  @inject()
  async run() {
    const { default: User } = await import('#models/user')

    await User.query().delete()
    await User.create({
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin123',
      role: 'admin',
    })
    this.logger.success('Admin user created!')
  }
}