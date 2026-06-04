export const isAdmin = () => {
  const role = JSON.parse(localStorage.getItem('decodedUser') || '{}').role;
  const token = localStorage.getItem('token');
  return role === 'ADMIN' && !!token;
};

export const isUserAuthenticated = () => {
  const role = JSON.parse(localStorage.getItem('decodedUser') || '{}').role;
  const token = localStorage.getItem('token');
  return !!role && !!token;
};
