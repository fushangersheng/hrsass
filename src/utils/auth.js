import Cookies from "js-cookie";

const TokenKey = "hrsass_token";
const TimeKey = "time_key";
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getTime() {
  return Cookies.get(TimeKey);
}

export function setTime() {
  Cookies.set(TimeKey, Date.now());
}
