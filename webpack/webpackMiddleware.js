const webpack = require('webpack')
const path = require('path')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const fs = require('fs')

const getHistoryApiFallbackMiddleware = ({ compiler, filename }) => {
  const filesystem = compiler.outputFileSystem || fs
  return function historyApiFallback(req, res, next) {
    if (
      req.method !== 'GET' &&
      req.method !== 'HEAD' &&
      req.get('accept').indexOf('html') < 0
    ) {
      next()
      return
    }
    filesystem.readFile(
      path.resolve(compiler.outputPath, filename || 'index.html'),
      (err, result) => {
        if (err) {
          next(err)
          return
        }
        res.set('Content-Type', 'text/html')
        res.end(result)
      }
    )
  }
}

const defaults = {
  hotMiddleware: {},
  historyApiFallback: false,
}

module.exports = function webpackMiddleware(opts) {
  const options = Object.assign({}, defaults, opts)
  const compiler = webpack(options.config)
  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: options.publicPath,
    ...options.devMiddleware,
  })
  const hotMiddleware = webpackHotMiddleware(compiler, options.hotMiddleware)
  const middlewares = [devMiddleware, hotMiddleware]
  if (options.historyApiFallback) {
    middlewares.push(
      getHistoryApiFallbackMiddleware({
        ...options.historyApiFallback,
        compiler,
      })
    )
  }
  const untilValid = new Promise(res => devMiddleware.waitUntilValid(res))
  const middleware = (req, res, next) => {
    if (options.publicPath && req.url.indexOf(options.publicPath) !== 0) {
      return next()
    } else {
      return middlewares.reduceRight(
        (_next, mid) => e => {
          if (e) {
            next(e)
          } else {
            try {
              mid(req, res, _next)
            } catch (err) {
              next(err)
            }
          }
        },
        next
      )()
    }
  }

  const close = callback => {
    devMiddleware.close(callback)
  }

  Object.assign(middleware, {
    devMiddleware,
    hotMiddleware,
    compiler,
    untilValid,
    close,
  })
  return middleware
}
