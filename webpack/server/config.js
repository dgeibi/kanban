const nodeExternals = require('webpack-node-externals')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

module.exports = ({ NODE_ENV }) => {
  const PROD_MODE = NODE_ENV === 'production'
  return {
    entry: ['./src/server/index.js'],
    output: {
      filename: 'server.js',
      chunkFilename: '[id].js',
      libraryTarget: 'commonjs2',
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    },
    devtool: 'source-map',
    node: {
      console: false,
      global: false,
      process: false,
      __filename: false,
      __dirname: false,
      Buffer: false,
      setImmediate: false,
    },
    target: 'node',
    externals: [
      nodeExternals({
        whitelist: [/^webpack\/hot\//],
      }),
    ],
    plugins: [
      new webpack.BannerPlugin({
        raw: true,
        banner: 'require("source-map-support").install();',
      }),
    ],
    optimization: {
      minimizer: PROD_MODE
        ? [
            new UglifyJsPlugin({
              cache: true,
              parallel: true,
              uglifyOptions: {
                compress: false,
                ecma: 8,
                mangle: true,
              },
              sourceMap: true,
            }),
          ]
        : undefined,
    },
  }
}
