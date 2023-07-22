//封装ls存取token
const key = 'token'

const setToken = (token) => {
  return sessionStorage.setItem(key, token)
}
const getToken = () => {
  return sessionStorage.getItem(key)
}

const removeToken = () => {
  return sessionStorage.removeItem(key)
}

export {
  setToken,
  getToken,
  removeToken
}