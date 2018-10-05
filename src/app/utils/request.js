import fetch from 'unfetch'
import { getToken } from './csrfToken'
import { getSocket } from './socket'

function isJSON(res) {
  const ret = res.headers.get('content-type')
  return ret && ret.indexOf('json') > 0
}

function takeJSON(response) {
  if (isJSON(response)) {
    return response.json()
  }
  return { response }
}

function checkResponse(response) {
  if (response.ok) return takeJSON(response)
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {Promise<object>}
 */
function request(url, options) {
  options = options || {}
  const headers = {}
  if (options.method && options.method !== 'GET') {
    const socket = getSocket()
    if (socket && socket.id) {
      headers['socket-id'] = socket.id
    }
    headers['csrf-token'] = getToken()
    if (typeof options.body === 'string') {
      headers['Content-Type'] = 'application/json'
    }
  }
  if (options.headers) {
    Object.assign(headers, options.headers)
  }
  return fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers,
  }).then(checkResponse)
}

export default request

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  window.request = request
}
