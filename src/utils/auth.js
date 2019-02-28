import Cookies from 'js-cookie'

const TokenKey = 'token'
const ErrorKey = 'errorMsg'
const UserNameKey = "UserName"

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setUserName(UserName) {
  return Cookies.set(UserNameKey, UserName)
}

export function getUserName() {
  return Cookies.get(UserNameKey)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setError(data) {
  return Cookies.set(ErrorKey,data)
}
