import fetch from 'unfetch'
// import * as ErrorCodes from '~/ErrorCodes'

let csrfToken

export function setToken(token) {
  csrfToken = token
}

function isJSON(res) {
  const ret = res.headers.get('content-type')
  return ret && ret.indexOf('json') > 0
}

function takeJSON(response) {
  if (isJSON(response)) {
    return response.json()
  }
  return response.text()
}

function checkResponse(response) {
  if (response.ok) return takeJSON(response)
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

// function handleRejectd(error) {
//   return {
//     ok: false,
//     error,
//     code: ErrorCodes.CLIENT_UNKNOWN,
//   }
// }

// function logErr(error) {
//   // console
//   console.log
//   throw error
// }

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}
 */
function request(url, options = {}) {
  return fetch(url, {
    headers: {
      'CSRF-Token': csrfToken,
      'content-type': 'application/json',
      ...options.headers,
    },
    credentials: 'same-origin',
    ...options,
  }).then(checkResponse)
}

export default request

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  window.request = request
}
