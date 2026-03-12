import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const GatewaysController = () => import('#controllers/gateways_controller')
const ClientsController = () => import('#controllers/clients_controller')
const ProductsController = () => import('#controllers/products_controller')
const TransactionsController = () => import('#controllers/transactions_controller')

// ─── Rotas Públicas ───────────────────────────────────────────────────────────
router.post('/login', [AuthController, 'login'])
router.post('/purchases', [TransactionsController, 'store'])

// ─── Rotas Privadas ───────────────────────────────────────────────────────────
router.group(() => {

  router.delete('/logout', [AuthController, 'logout'])

  // Gateways
  router.get('/gateways', [GatewaysController, 'index'])
  router.patch('/gateways/:id/toggle', [GatewaysController, 'toggleActive'])
  router.patch('/gateways/:id/priority', [GatewaysController, 'updatePriority'])

  // Users (admin only)
  router.group(() => {
    router.get('/users', [UsersController, 'index'])
    router.get('/users/:id', [UsersController, 'show'])
    router.post('/users', [UsersController, 'store'])
    router.put('/users/:id', [UsersController, 'update'])
    router.delete('/users/:id', [UsersController, 'destroy'])
  }).use(middleware.adminOnly())

  // Products
  router.get('/products', [ProductsController, 'index'])
  router.get('/products/:id', [ProductsController, 'show'])
  router.post('/products', [ProductsController, 'store']).use(middleware.adminOnly())
  router.put('/products/:id', [ProductsController, 'update']).use(middleware.adminOnly())
  router.delete('/products/:id', [ProductsController, 'destroy']).use(middleware.adminOnly())

  // Clients
  router.get('/clients', [ClientsController, 'index'])
  router.get('/clients/:id', [ClientsController, 'show'])

  // Transactions
  router.get('/transactions', [TransactionsController, 'index'])
  router.get('/transactions/:id', [TransactionsController, 'show'])
  router.post('/transactions/:id/refund', [TransactionsController, 'refund']).use(middleware.adminOnly())

}).use(middleware.auth())