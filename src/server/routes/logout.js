import { Router } from 'express'

const logout = Router()

logout.post('/', (req, res) => {
  req.logout()
  res.status(204).end()
})

export default logout
