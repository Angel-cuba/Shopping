import { UserType } from './UserType';

export type DecodedUser = {
  role: string;
  user_id: string;
  username: string;
  sub: string;
  iat: number;
  exp: number;
};

export const LOGGED_IN = 'LOGGED_IN';
export const LOGGED = 'LOGGED';
export const LOGGED_OUT = 'LOGGED_OUT';

export type LoggedInAction = {
  type: typeof LOGGED_IN;
  payload: UserType;
};

export type LoggedAction = {
  type: typeof LOGGED;
  payload: DecodedUser;
};

export type LoggedOutAction = {
  type: typeof LOGGED_OUT;
  payload: null;
};

export type UserActionTypes = LoggedInAction | LoggedAction | LoggedOutAction;

export type UserState = {
  user: UserType | null;
  userFromToken: DecodedUser | null;
};
