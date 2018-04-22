const ManifestPlugin = require('webpack-manifest-plugin')
const paths = require('../paths')
const path = require('path')
const { ReactLoadablePlugin } = require('@7rulnik/react-loadable/webpack')

module.exports = ({ NODE_ENV }) => {
  const PROD_MODE = NODE_ENV === 'production'
  return {
    ...(NODE_ENV !== 'production' && {
      devtool: 'cheap-module-source-map',
    }),
    ...(PROD_MODE && {
      optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
        },
      },
    }),
    mode: NODE_ENV,
    output: {
      publicPath: paths.publicPath,
      path: paths.outputPath,
      chunkFilename: PROD_MODE ? '[id].[contenthash:8].js' : '[id].js',
      filename: PROD_MODE ? '[name].[contenthash:8].js' : '[name].js',
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
