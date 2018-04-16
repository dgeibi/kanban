import * as ErrorCodes from '~/ErrorCodes'

export default function handleError(err, req, res, next) {
  console.error(err)
  if (res.headersSent) {
    next(err)
  } else if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({
      ok: false,
      code: ErrorCodes.EBADCSRFTOKEN,
    })
  } else {
    res.status(500).json({
      ok: false,
      code: ErrorCodes.SEVER_UNKNOWN,
    })
  }
}
