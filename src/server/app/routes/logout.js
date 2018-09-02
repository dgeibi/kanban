import Router from 'express-promise-router'

export default () => {
  const router = Router()

  router.post('/logout', (req, res) => {
    req.logout()
    res.status(204).end()
  })

  return router
}
