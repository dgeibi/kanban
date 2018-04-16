const merge = require('webpack-merge')
const ManifestPlugin = require('webpack-manifest-plugin')
const getBase = require('./get.base.config')
const Env = require('./Env')

const mode = process.env.NODE_ENV || 'development'
const PROD = mode === 'production'

module.exports = merge([
  getBase({ SERVER: false, PROD }),
  {
    ...(!PROD && {
      devtool: 'cheap-module-source-map',
    }),
    // ...(PROD && {
    //   optimization: {
    //     runtimeChunk: 'single',
    //     splitChunks: {
    //       chunks: 'all',
    //     },
    //   },
    // }),
    mode,
    output: {
      publicPath: '/public/',
      path: Env.Dist.public,
      filename: PROD ? '[name].[chunkhash:8].js' : '[name].js',
    },
    entry: ['./src/client/client.js'],
    plugins: [new ManifestPlugin()],
  },
])
