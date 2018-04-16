import * as ErrorCodes from '~/ErrorCodes'

const auth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ ok: false, code: ErrorCodes.UNAUTHORIZED })
  } else {
    next()
  }
}

export default auth
