import webpack from 'webpack'
import path from 'path'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

function normalizeConfig(anyConfig) {
  if (typeof func === 'function') return anyConfig()
  return anyConfig
}

const historyApi = ({ compiler, filename }) =>
  function historyApiFallback(req, res, next) {
    if (
      req.method !== 'GET' &&
      req.method !== 'HEAD' &&
      req.get('accept').indexOf('html') < 0
    ) {
      next()
      return
    }
    const _filename = path.resolve(
      compiler.outputPath,
      filename || 'index.html'
    )
    compiler.outputFileSystem.readFile(_filename, (err, result) => {
      if (err) {
        next(err)
        return
      }
      res.set('Content-Type', 'text/html')
      res.end(result)
    })
  }

const skip = match => x => (req, res, next) => {
  if (match(req)) {
    x(req, res, next)
  } else {
    next()
  }
}

export default async function({
  config,
  historyApiFallback,
  publicPath,
  hot = {},
}) {
  const webpackConfig = await normalizeConfig(config)
  webpackConfig.plugins = webpackConfig.plugins || []
  const compiler = webpack(webpackConfig)
  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath,
  })
  const hotMiddleware = webpackHotMiddleware(compiler, hot)
  let middlewares = [devMiddleware, hotMiddleware]
  if (historyApiFallback) {
    middlewares.push(historyApi({ compiler }))
  }
  middlewares = publicPath
    ? middlewares.map(skip(req => req.url.indexOf(publicPath) === 0))
    : middlewares
  global.mfs = compiler.outputFileSystem
  return middlewares
}
