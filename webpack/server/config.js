const nodeExternals = require('webpack-node-externals')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = ({ NODE_ENV }) => {
  const PROD_MODE = NODE_ENV === 'production'
  return {
    entry: ['./src/server/server.js'],
    output: {
      filename: 'server.js',
      chunkFilename: '[id].js',
      libraryTarget: 'commonjs2',
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
