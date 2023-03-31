import { LOGGED_IN, LOGGED_OUT } from '../../interfaces/user/constants'
import { UserType } from '../../interfaces/user/UserType'

export function login(user: UserType) {
  const newUser = {
    ...user,
    role: user.email === 'araozangel842@gmail.com' ? 'ADMIN' : 'USER'
  }
  return {
    type: LOGGED_IN,
    payload: newUser
  }
}

export function logout() {
  return {
    type: LOGGED_OUT,
    payload: null
  }
}
