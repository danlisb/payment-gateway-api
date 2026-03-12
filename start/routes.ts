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

  // Gateways — admin only
  router.get('/gateways', [GatewaysController, 'index'])
  router.patch('/gateways/:id/toggle', [GatewaysController, 'toggleActive'])
    .use(middleware.adminOnly(['admin']))
  router.patch('/gateways/:id/priority', [GatewaysController, 'updatePriority'])
    .use(middleware.adminOnly(['admin']))

  // Users — admin e manager
  router.get('/users', [UsersController, 'index'])
    .use(middleware.adminOnly(['admin', 'manager']))
  router.get('/users/:id', [UsersController, 'show'])
    .use(middleware.adminOnly(['admin', 'manager']))
  router.post('/users', [UsersController, 'store'])
    .use(middleware.adminOnly(['admin', 'manager']))
  router.put('/users/:id', [UsersController, 'update'])
    .use(middleware.adminOnly(['admin', 'manager']))
  router.delete('/users/:id', [UsersController, 'destroy'])
    .use(middleware.adminOnly(['admin']))

  // Products — admin, manager e finance
  router.get('/products', [ProductsController, 'index'])
  router.get('/products/:id', [ProductsController, 'show'])
  router.post('/products', [ProductsController, 'store'])
    .use(middleware.adminOnly(['admin', 'manager', 'finance']))
  router.put('/products/:id', [ProductsController, 'update'])
    .use(middleware.adminOnly(['admin', 'manager', 'finance']))
  router.delete('/products/:id', [ProductsController, 'destroy'])
    .use(middleware.adminOnly(['admin', 'manager', 'finance']))

  // Clients
  router.get('/clients', [ClientsController, 'index'])
  router.get('/clients/:id', [ClientsController, 'show'])

  // Transactions
  router.get('/transactions', [TransactionsController, 'index'])
  router.get('/transactions/:id', [TransactionsController, 'show'])
  router.post('/transactions/:id/refund', [TransactionsController, 'refund'])
    .use(middleware.adminOnly(['admin', 'finance']))

}).use(middleware.auth())