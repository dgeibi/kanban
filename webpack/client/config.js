const ManifestPlugin = require('webpack-manifest-plugin')
const { extname } = require('path')
const { ReactLoadablePlugin } = require('../plugin/loadable')
const paths = require('../paths')

module.exports = ({ NODE_ENV }) => {
  const PROD_MODE = NODE_ENV === 'production'
  return {
    ...(NODE_ENV !== 'production' && {
      devtool: 'cheap-module-source-map',
    }),
    ...(PROD_MODE
      ? {
          optimization: {
            runtimeChunk: 'single',
            splitChunks: {
              chunks: 'all',
            },
          },
        }
      : {
          optimization: {
            runtimeChunk: true,
          },
        }),
    output: {
      publicPath: paths.publicPath,
      path: paths.outputPath,
      chunkFilename: PROD_MODE ? '[id].[contenthash:8].js' : '[id].js',
      filename: PROD_MODE ? '[name].[contenthash:8].js' : '[name].js',
    },
    entry: ['./src/client/client.js'],
    plugins: [
      new ReactLoadablePlugin({
        filename: paths.asyncChunksStats,
      }),
      new ManifestPlugin({
        filter: x => x.isInitial,
        writeToFileEmit: true,
        fileName: paths.initialAssets,
        generate: (x, files) => {
          const seed = {
            styles: [],
            scripts: [],
          }
          files.reduce((assets, { path }) => {
            const ext = extname(path)
            if (ext === '.css') {
              assets.styles.push(path)
            } else if (ext === '.js') {
              assets.scripts.push(path)
            }
            return assets
          }, seed)
          return seed
        },
      }),
    ],
  }
}
