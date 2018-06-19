import express from 'express'
import logger from 'morgan'
import Loadable from '@7rulnik/react-loadable'
import { addTask } from '~/server/tasks'
import favicon from 'serve-favicon'
import path from 'path'

import prepareStatic from './static'
import handleError from './handleError'
import appRouter from './app'

const app = express()

let preloadPromise = Loadable.preloadAll()

addTask(preloadPromise)

app.use(logger('dev'))
app.use(prepareStatic())
app.use(favicon(path.resolve('favicon.ico')))

app.use(
  process.env.HOT_MODE
    ? (req, res, next) => {
        preloadPromise.then(() => {
          appRouter(req, res, next)
        })
      }
    : appRouter
)

app.use(handleError)

if (process.env.HOT_MODE) {
  module.hot.accept('./app', () => {
    preloadPromise = Loadable.preloadAll()
  })
}

export default app
