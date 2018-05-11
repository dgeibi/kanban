import express from 'express'
import logger from 'morgan'
import Loadable from '@7rulnik/react-loadable'
import prepareStatic from './static'

import handleError from './handleError'
import appRouter from './app'

const app = express()

// eslint-disable-next-line import/no-mutable-exports
export let preloadPromise = Loadable.preloadAll()

app.use(logger('dev'))
app.use(prepareStatic())

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
