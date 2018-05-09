import Router from 'express-promise-router'

const logout = Router()

logout.post('/', (req, res) => {
  req.logout()
  res.status(204).end()
})

export default logout
