import { Router } from 'express'

const logout = Router()

logout.post('/', (req, res) => {
  req.logout()
  res.end()
})

export default logout