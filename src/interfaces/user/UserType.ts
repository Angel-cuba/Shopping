export type UserType = {
  email: string
  given_name: string
  family_name: string
  picture: string
  name: string
  password: string
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  country: string | null
  cardHolder: string | null
  paymentType: string | null
  provider: string | null
  accountNumber: string | null
  expirationDate: string | null
  role?: Role
}

export type UserFromDB = {
  id: string
  email: string
  username: string
  firstname: string
  lastname: string
  phone: string
  password?: string
  address: string
  city: string
  postalCode: string
  country: string
  cardHolder: string
  paymentType: string
  provider: string
  accountNumber: string
  expirationDate: string
  role: Role
}

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
