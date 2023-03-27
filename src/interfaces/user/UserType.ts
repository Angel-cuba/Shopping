export type UserType = {
  aud: string
  azp: string
  email_verified: boolean
  exp: number
  email: string
  given_name: string
  family_name: string
  picture: string
  iat: number
  iss: string
  jti: string
  name: string
  nbf: number
  sub: string
  role?: Role
}

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
