export interface CreateTransactionData {
  amount: number
  name: string
  email: string
  cardNumber: string
  cvv: string
}

export interface TransactionResponse {
  externalId: string
  status: string
  amount: number
  cardLastNumbers: string
}

export interface GatewayInterface {
  createTransaction(data: CreateTransactionData): Promise<TransactionResponse>
  refundTransaction(externalId: string): Promise<void>
}