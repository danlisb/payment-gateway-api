# Payment Gateway API

API RESTful para gerenciamento de pagamentos multi-gateway desenvolvida com AdonisJS v6 (Node.js) e MySQL.

## 📋 Requisitos

- Node.js v22+
- Docker e Docker Compose
- npm v10+

## 🚀 Como instalar e rodar

### 1. Clone o repositório

```bash
git clone https://github.com/danlisb/payment-gateway-api
cd payment-gateway-api
```

### 2. Instale as dependências

```bash
npm install --legacy-peer-deps
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

Valores padrão do `.env`:

```env
TZ=UTC
PORT=3333
HOST=localhost
NODE_ENV=development
APP_KEY=sua_chave_aqui
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=payment_gateway
```

### 4. Suba os containers Docker

**MySQL:**
```bash
docker run -d \
  --name payment-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=payment_gateway \
  -p 3306:3306 \
  mysql:8.0
```

**Mocks dos Gateways (com autenticação):**
```bash
docker run -d \
  --name gateways-mock \
  -p 3001:3001 \
  -p 3002:3002 \
  matheusprotzen/gateways-mock
```

### 5. Execute as migrations e seeders

```bash
node ace migration:run
node ace db:seed --files database/seeders/gateway_seeder.ts
node ace db:seed --files database/seeders/user_seeder.ts
```

### 6. Inicie o servidor

```bash
node ace serve --watch
```

A API estará disponível em `http://localhost:3333`.

### Usuário admin padrão

```
email: admin@admin.com
senha: admin123
```

## 🧪 Rodando os testes

```bash
node ace test
```

## 🛣 Rotas

### Rotas Públicas

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/login` | Autenticação do usuário |
| POST | `/purchases` | Realizar uma compra |

#### Login
```json
POST /login
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

#### Realizar compra
```json
POST /purchases
{
  "name": "João Silva",
  "email": "joao@email.com",
  "cardNumber": "5569000000006063",
  "cvv": "010",
  "products": [
    { "id": 1, "quantity": 2 }
  ]
}
```

---

### Rotas Privadas

> Todas as rotas privadas requerem o header:
> `Authorization: Bearer {token}`

#### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| DELETE | `/logout` | Encerrar sessão |

#### Usuários *(somente admin)*

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/users` | Listar usuários |
| GET | `/users/:id` | Detalhe do usuário |
| POST | `/users` | Criar usuário |
| PUT | `/users/:id` | Atualizar usuário |
| DELETE | `/users/:id` | Remover usuário |

```json
POST /users
{
  "name": "Novo Usuário",
  "email": "novo@email.com",
  "password": "senha123",
  "role": "user"
}
```

> `role` aceita: `admin` ou `user`

#### Gateways

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/gateways` | Listar gateways |
| PATCH | `/gateways/:id/toggle` | Ativar/desativar gateway |
| PATCH | `/gateways/:id/priority` | Alterar prioridade |

```json
PATCH /gateways/1/priority
{
  "priority": 2
}
```

#### Produtos

| Método | Rota | Descrição | Role |
|--------|------|-----------|------|
| GET | `/products` | Listar produtos | qualquer |
| GET | `/products/:id` | Detalhe do produto | qualquer |
| POST | `/products` | Criar produto | admin |
| PUT | `/products/:id` | Atualizar produto | admin |
| DELETE | `/products/:id` | Remover produto | admin |

```json
POST /products
{
  "name": "Produto Exemplo",
  "amount": 5000
}
```

> `amount` é em centavos (5000 = R$ 50,00)

#### Clientes

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/clients` | Listar clientes |
| GET | `/clients/:id` | Detalhe do cliente e suas compras |

#### Transações

| Método | Rota | Descrição | Role |
|--------|------|-----------|------|
| GET | `/transactions` | Listar transações | qualquer |
| GET | `/transactions/:id` | Detalhe da transação | qualquer |
| POST | `/transactions/:id/refund` | Realizar reembolso | admin |

## 🏗 Arquitetura

```
app/
├── controllers/        # Controladores das rotas
├── middleware/         # Middlewares (auth, adminOnly)
├── models/             # Models Lucid ORM
└── services/
    └── gateways/       # Serviço multi-gateway
        ├── gateway_interface.ts   # Contrato base
        ├── gateway1_service.ts    # Implementação Gateway 1
        ├── gateway2_service.ts    # Implementação Gateway 2
        └── gateway_manager.ts     # Orquestrador com fallback
database/
├── migrations/         # Migrations do banco
└── seeders/            # Seeders iniciais
tests/
└── functional/         # Testes funcionais com Japa
```

## 🔌 Multi-Gateway

O sistema tenta processar pagamentos seguindo a ordem de prioridade dos gateways ativos. Se o gateway de maior prioridade falhar, tenta automaticamente o próximo.

Para adicionar um novo gateway:

1. Crie `app/services/gateways/gateway_novo_service.ts` implementando `GatewayInterface`
2. Registre no `switch` do `gateway_manager.ts`
3. Insira o registro no banco via seeder

## 🔒 Segurança

- Senhas armazenadas com hash via `scrypt`
- Autenticação via Access Tokens (Bearer)
- Controle de acesso por roles (`admin` / `user`)
- Dados sensíveis de cartão: apenas os 4 últimos dígitos são armazenados
