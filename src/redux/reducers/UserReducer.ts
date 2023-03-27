import { AnyAction } from 'redux'
import { UserState } from '../../interfaces/user/constants'

export const initialUserState: UserState = {
  user: null
}

export function userReducer(state = initialUserState, action: AnyAction) {
  switch (action.type) {
    case 'LOGGED_IN': {
      return {
        ...state,
        user: action.payload
      }
    }
    case 'LOGGED_OUT': {
      return {
        ...state,
        user: null
      }
    }
    default:
      return state
  }
}
