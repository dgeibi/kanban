const ManifestPlugin = require('webpack-manifest-plugin')
const paths = require('../paths')
const path = require('path')
const { ReactLoadablePlugin } = require('@7rulnik/react-loadable/webpack')

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
      publicPath: paths.publicPath,
      path: paths.outputPath,
      chunkFilename: PROD ? '[name].[chunkhash:8].js' : '[name].js',
      filename: PROD ? '[name].[chunkhash:8].js' : '[name].js',
    },
    entry: ['./src/client/client.js'],
    plugins: [
      new ReactLoadablePlugin({
        filename: path.resolve('./dist/react-loadable.json'),
      }),
      new ManifestPlugin({
        filter: x => x.isInitial,
        writeToFileEmit: true,
      }),
    ],
  }
}
