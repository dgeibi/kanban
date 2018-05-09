let csrfToken

export function setToken(token) {
  csrfToken = token
}

export function getToken() {
  return csrfToken
}
