import { UserType } from './UserType'

export const LOGGED_IN = 'LOGGED_IN'
export const LOGGED_OUT = 'LOGGED_OUT'

export type LoggedInAction = {
  type: typeof LOGGED_IN
  payload: UserType
}

export type LoggedOutAction = {
  type: typeof LOGGED_OUT
  payload: null
}

export type UserActionTypes = LoggedInAction | LoggedOutAction

export type UserState = {
  user: UserType | null
}
