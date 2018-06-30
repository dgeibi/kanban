import pwd from 'pbkdf2-password'

const hasher = pwd({
  saltLength: 64,
  digest: 'sha512',
  iterations: 10000,
  keyLength: 128,
})

/**
 * @param {string} password
 * @returns {Promise<string>}
 */
export const phash = password =>
  new Promise((resolve, reject) => {
    hasher({ password }, (err, pass, salt, hash) => {
      if (err) {
        reject(err)
      } else {
        resolve(`${salt}$${hash}`)
      }
    })
  })

/**
 * @param {string} password
 * @param {string} saltHash
 * @returns {Promise<boolean>}
 */
export const pcompare = (password, saltHash) => {
  if (typeof password !== 'string') {
    return Promise.reject(TypeError('password should be string'))
  }
  if (typeof saltHash !== 'string') {
    return Promise.reject(TypeError('saltHash should be string'))
  }
  const idx = saltHash.indexOf('$')
  if (idx < 0) return Promise.reject(Error('saltHash should have $'))
  const [salt, hash1] = [saltHash.slice(0, idx), saltHash.slice(idx + 1)]

  return new Promise((resolve, reject) => {
    hasher({ password, salt }, (err, _pass, _salt, hash2) => {
      if (err) {
        reject(err)
      } else {
        resolve(hash1 === hash2)
      }
    })
  })
}

export function normalizePort(val) {
  const port = Math.floor(val)

  if (Number.isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

export const wrapMiddlewares = middlewares => (req, res, next) => {
  middlewares.reduceRight(
    (_next, fn) => e => {
      if (e) {
        next(e)
      } else {
        try {
          fn(req, res, _next)
        } catch (err) {
          next(err)
        }
      }
    },
    next
  )()
}
