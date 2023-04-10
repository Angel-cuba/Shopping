import { LOGGED_IN, LOGGED_OUT } from '../../interfaces/user/constants';
import { UserType } from '../../interfaces/user/UserType';

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
    expiryDate: '',
  };
  const userToStorage = {
    ...newUser,
    role: user.email === 'araozangel842@gmail.com' ? 'ADMIN' : 'USER',
  };
  return {
    type: LOGGED_IN,
    payload: userToStorage,
  };
}

export function logout() {
  return {
    type: LOGGED_OUT,
    payload: null,
  };
}
