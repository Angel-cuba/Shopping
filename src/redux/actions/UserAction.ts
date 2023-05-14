import { LOGGED, LOGGED_IN, LOGGED_OUT } from '../../interfaces/user/constants';
import { UserType } from '../../interfaces/user/UserType';
import { DecodedUser } from '../../utils/type-guards';

export function login(user: UserType) {
  const newUser: UserType = {
    email: user.email,
    given_name: user.given_name,
    family_name: user.family_name,
    picture: user.picture,
    name: user.name,
    password: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    cardHolder: '',
    paymentType: '',
    provider: '',
    accountNumber: '',
    expirationDate: '',
  };
  const userToStorage = {
    ...newUser,
    role: user.email === 'araozangel842@gmail.com' || 'santeri.auvinen@elisa.fi' ? 'ADMIN' : 'USER',
  };
  return {
    type: LOGGED_IN,
    payload: userToStorage,
  };
}

export function logged(user: DecodedUser) {
  return {
    type: LOGGED,
    payload: user,
  };
}

export function logout() {
  return {
    type: LOGGED_OUT,
    payload: null,
  };
}
