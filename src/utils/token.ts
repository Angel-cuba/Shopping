import jwtDecode from "jwt-decode";
import { isDecodedUser } from "./type-guards"


export function getTokenFromLocalStorage(){
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  if(!token) return null;
 const decodedUser = jwtDecode(token);
  const now = Date.now().valueOf() / 1000;
  if (!isDecodedUser(decodedUser) || decodedUser.exp < now) {
    localStorage.removeItem("token");
    return null;
  }
  localStorage.setItem("decodedUser", JSON.stringify(decodedUser));
  return token;
};

export function isTokenExpired(token: string) {
  const decodedUser = jwtDecode(token);
  const now = Date.now().valueOf() / 1000;
  if (!isDecodedUser(decodedUser) || decodedUser.exp < now) {
    return true;
  }
  return false;
}

export function isTokenValid(token: string) {
  return !isTokenExpired(token);
}