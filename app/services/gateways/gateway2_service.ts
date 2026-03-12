import {
  GatewayInterface,
  CreateTransactionData,
  TransactionResponse,
} from './gateway_interface.js'

export default class Gateway2Service implements GatewayInterface {
  private baseUrl = 'http://localhost:3002'
  private headers = {
    'Content-Type': 'application/json',
    'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
    'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
  }

  async createTransaction(data: CreateTransactionData): Promise<TransactionResponse> {
    const response = await fetch(`${this.baseUrl}/transacoes`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        valor: data.amount,
        nome: data.name,
        email: data.email,
        numeroCartao: data.cardNumber,
        cvv: data.cvv,
      }),
    })

    if (!response.ok) throw new Error('Gateway2: transaction failed')

    const result = (await response.json()) as any
    return {
      externalId: result.id,
      status: result.status,
      amount: data.amount, // usa o amount que enviamos
      cardLastNumbers: data.cardNumber.slice(-4),
    }
  }

  async refundTransaction(externalId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/transacoes/reembolso`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ id: externalId }),
    })

    if (!response.ok) throw new Error('Gateway2: refund failed')
  }
}
