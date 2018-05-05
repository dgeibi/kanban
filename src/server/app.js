import Router from 'express-promise-router'
import bodyParser from 'body-parser'
import favicon from 'serve-favicon'
import path from 'path'
import Loadable from '@7rulnik/react-loadable'

import security from './security/middleware'
import { auenticated } from './security/auth'

import login from './routes/login'
import logout from './routes/logout'
import join from './routes/join'
import api from './routes/api'

import fetchClientData from './fetchClientData'
import render from './render'

const app = Router()

app.use(bodyParser.json())
app.use(security)
app.use(favicon(path.resolve('favicon.ico')))

app.use('/join', join)
app.use('/login', login)
app.use('/logout', logout)
app.use('/api', auenticated, api)
app.get('*', fetchClientData, render)

export default Loadable.preloadAll().then(() => app)
