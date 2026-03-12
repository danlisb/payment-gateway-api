import {
  GatewayInterface,
  CreateTransactionData,
  TransactionResponse,
} from './gateway_interface.js'

export default class Gateway1Service implements GatewayInterface {
  private baseUrl = 'http://localhost:3001'
  private token: string | null = null

  private async authenticate(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'dev@betalent.tech',
        token: 'FEC9BB078BF338F464F96B48089EB498',
      }),
    })

    if (!response.ok) throw new Error('Gateway1: authentication failed')

    const data = (await response.json()) as any
    this.token = data.token
  }

  async createTransaction(data: CreateTransactionData): Promise<TransactionResponse> {
    await this.authenticate()

    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        amount: data.amount,
        name: data.name,
        email: data.email,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
      }),
    })

    if (!response.ok) throw new Error('Gateway1: transaction failed')

    const result = (await response.json()) as any
    return {
      externalId: result.id,
      status: result.status,
      amount: data.amount, // usa o amount que enviamos, não o retornado
      cardLastNumbers: data.cardNumber.slice(-4),
    }
  }

  async refundTransaction(externalId: string): Promise<void> {
    await this.authenticate()

    const response = await fetch(`${this.baseUrl}/transactions/${externalId}/charge_back`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })

    if (!response.ok) throw new Error('Gateway1: refund failed')
  }
}
