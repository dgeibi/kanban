import Router from 'express-promise-router'
import bodyParser from 'body-parser'
import favicon from 'serve-favicon'
import path from 'path'

import login from '~/server/app/routes/login'
import security from '~/server/security/middleware'
import { auenticated } from '~/server/security/auth'

import logout from '~/server/app/routes/logout'
import join from '~/server/app/routes/join'
import api from '~/server/app/routes/api'

import fetchClientData from '~/server/app/fetchClientData'
import render from '~/server/render'

const app = Router()

app.use(bodyParser.json())
app.use(security)
app.use(favicon(path.resolve('favicon.ico')))

app.use('/join', join)
app.use('/login', login)
app.use('/logout', logout)
app.use('/api', auenticated, api)
app.get('*', fetchClientData, render)

export default app
