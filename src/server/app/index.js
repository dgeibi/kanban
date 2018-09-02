import express from 'express'
import logger from 'morgan'
import Loadable from '@7rulnik/react-loadable'
import favicon from 'serve-favicon'
import path from 'path'

import prepareStatic from './static'
import handleError from './handleError'
import main from './main'

export default ({ addTask }) => {
  const app = express()
  let preloadPromise = Loadable.preloadAll()
  addTask(preloadPromise)
  app.use(handleError)

  app.use(logger('dev'))
  app.use(prepareStatic({ addTask }))
  app.use(favicon(path.resolve('favicon.ico')))

  let router = main()

  const mainLogic = process.env.HOT_MODE
    ? (req, res, next) => {
        preloadPromise.then(() => {
          router(req, res, next)
        })
      }
    : router

  app.use(mainLogic)

  if (process.env.HOT_MODE) {
    module.hot.accept('./main', () => {
      router = main()
      preloadPromise = Loadable.preloadAll()
    })
  }

  return app
}
