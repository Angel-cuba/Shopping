import { LOGGED_IN, LOGGED_OUT } from '../../interfaces/user/constants'
import { UserType } from '../../interfaces/user/UserType'

export function login(user: UserType) {
  return {
    type: LOGGED_IN,
    payload: user
  }
}

export function logout() {
  return {
    type: LOGGED_OUT,
    payload: null
  }
}
