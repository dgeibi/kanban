import Router from 'express-promise-router'
import bodyParser from 'body-parser'

import { security } from '~/server/security'
import login from '~/server/app/routes/login'
import logout from '~/server/app/routes/logout'
import join from '~/server/app/routes/join'
import api from '~/server/app/routes/api'

import fetchClientData from '~/server/app/fetchClientData'
import render from '~/server/app/render'

export default () => {
  const main = Router()
  main.use(bodyParser.json())
  main.use(security)
  main.use(join())
  main.use(login())
  main.use(logout())
  main.use(api())
  main.get('*', fetchClientData(), render())
  return main
}
