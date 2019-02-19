import Cookies from 'js-cookie'

const TokenKey = 'token'
const ErrorKey = 'errorMsg'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setError(data) {
  return Cookies.set(ErrorKey,data)
}
