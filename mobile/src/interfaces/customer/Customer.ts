export type CustomerType = {
  id: number
  name: string
  picture: string
  lastSeen: string
  orders: number
  total_spents: string
  last_purchase: Purchase
  news: boolean
  segments: string
}

type Purchase = {
  date: string
  time: string
}
