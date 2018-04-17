const ManifestPlugin = require('webpack-manifest-plugin')
const paths = require('../paths')

module.exports = ({ NODE_ENV }) => {
  const PROD = NODE_ENV === 'production'
  return {
    ...(NODE_ENV !== 'production' && {
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
    mode: NODE_ENV,
    output: {
      publicPath: '/public/',
      path: paths.dist.public,
      filename: PROD ? '[name].[chunkhash:8].js' : '[name].js',
    },
    entry: ['./src/client/client.js'],
    plugins: [new ManifestPlugin()],
  }
}
