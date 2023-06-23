export type AddressType = {
  id?: string 
  address: string
  city: string
  country: string
  postalCode: string
  createdAt: string
  updatedAt: string
  }

  export type AddressToSend = {
    address: string | undefined
    city:  string | undefined
    country: string | undefined
    postalCode: string | undefined
    user: {
      id: string | undefined
    }
  }