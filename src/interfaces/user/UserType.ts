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
  expiryDate: string | null
  role?: Role
}

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
