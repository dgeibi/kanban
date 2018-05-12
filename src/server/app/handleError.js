export default function handleError(err, req, res, next) {
  if (res.headersSent) {
    next(err)
  } else if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).end()
  } else {
    res.status(500).end()
  }
}
