/* eslint-disable import/no-extraneous-dependencies */
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

export default async function ({ config, historyApiFallback }) {
  const webpackConfig = await normalizeConfig(config);
  webpackConfig.plugins = webpackConfig.plugins || [];
  const firstBuildDone = new Promise(resolve => {
    webpackConfig.plugins.push(function buildDone() {
      this.hooks.done.tap('firstBuildDone', resolve);
    });
  });
  const compiler = webpack(webpackConfig);
  const middleware = [
    webpackDevMiddleware(compiler, {
      publicPath: '/',
    }),
    webpackHotMiddleware(compiler),
  ];
  if (historyApiFallback) {
    middleware.push(historyApi({ compiler }));
  }
  await firstBuildDone;
  global.mfs = compiler.outputFileSystem;
  console.log('client build done!！');
  return middleware;
}
