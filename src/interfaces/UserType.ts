export type UserType = {
  email: string
  password: string
  role: Role
}

type Role = 'ADMIN' | 'USER'
