import { AnyAction } from 'redux'
import { LOGGED, LOGGED_IN, LOGGED_OUT, UserState } from '../../interfaces/user/constants'

export const initialUserState: UserState = {
  user: null,
  userFromToken: null
}

export function userReducer(state = initialUserState, action: AnyAction) {
  switch (action.type) {
    case LOGGED_IN: {
      return {
        ...state,
        user: action.payload
      }
    }
    case LOGGED : {
      return {
        ...state,
        userFromToken: action.payload
      }
    }
    case LOGGED_OUT: {
      return {
        ...state,
        user: null,
        userFromToken: null
      }
    }
    default:
      return state
  }
}
