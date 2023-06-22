export type PaymentType = {
  id?: string
  cardHolderName: string
  cardNumber: string
  expirationDate: string
  createdAt: string
  updatedAt: string
  paymentType: string
  provider: string 
}

export type PaymentToSend = {
  cardHolderName: string | undefined
  cardNumber: string | undefined
  expirationDate: string | undefined
  paymentType: string | undefined 
  provider: string | undefined
  user: {
    id: string | undefined
  }
}