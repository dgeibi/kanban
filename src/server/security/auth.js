export const auenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).end()
  } else {
    next()
  }
}

export const unauenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(401).end()
  } else {
    next()
  }
}
