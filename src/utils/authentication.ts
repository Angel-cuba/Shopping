const userToken = localStorage.getItem('token');
const decodedUserRole = JSON.parse(localStorage.getItem('decodedUser') || '{}').role;

export const isAdmin = () => {
  return decodedUserRole === 'ADMIN' && userToken;
};
export const isUserAuthenticated = () => {
  return decodedUserRole && userToken;
};
