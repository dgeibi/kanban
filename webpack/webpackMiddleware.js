const webpack = require('webpack')
const path = require('path')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const fs = require('fs')

const normalizeConfig = anyConfig => {
  if (typeof func === 'function') return anyConfig()
  return anyConfig
}

const historyApi = ({ compiler, filename }) => {
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

module.exports = function webpackMiddleware({
  config,
  historyApiFallback,
  publicPath,
  hot = {},
  dev = {},
}) {
  const compiler = webpack(normalizeConfig(config))
  const middlewares = [
    webpackDevMiddleware(compiler, {
      publicPath,
      ...dev,
    }),
    webpackHotMiddleware(compiler, hot),
  ]
  if (historyApiFallback) {
    middlewares.push(historyApi({ ...historyApiFallback, compiler }))
  }

  const webpackDevFull = (req, res, next) => {
    if (publicPath && req.url.indexOf(publicPath) !== 0) {
      next()
    } else {
      middlewares.reduceRight(
        (_next, fn) => e => {
          if (e) {
            next(e)
          } else {
            try {
              fn(req, res, _next)
            } catch (err) {
              next(err)
            }
          }
        },
        next
      )()
    }
  }
  webpackDevFull.compiler = compiler
  return webpackDevFull
}
