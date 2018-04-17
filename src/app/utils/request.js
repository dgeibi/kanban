import fetch from 'unfetch'
import * as ErrorCodes from '~/ErrorCodes'

let csrfToken

export function setToken(token) {
  csrfToken = token
}

function isJSON(res) {
  const ret = res.headers.get('content-type')
  return ret && ret.indexOf('json') > 0
}

function handleResolved(response) {
  const { ok, status } = response
  const result = {
    ok,
    status,
    error: ok ? null : Error(response.statusText),
    code: ok ? undefined : ErrorCodes.CLIENT_UNKNOWN,
  }
  if (isJSON(response)) {
    return response
      .json()
      .then(data => Object.assign(result, data))
      .catch(() => result)
  }
  return result
}

function handleRejectd(error) {
  return {
    ok: false,
    error,
    code: ErrorCodes.CLIENT_UNKNOWN,
  }
}

function logErr(result) {
  if (!result.ok) {
    // console.error(result.error)
  }
  return result
}

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
  })
    .then(handleResolved, handleRejectd)
    .then(logErr)
}

export default request

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  window.request = request
}
