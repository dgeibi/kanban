const nodeExternals = require('webpack-node-externals')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge')
const getBase = require('./get.base.config')

module.exports = merge(getBase({ SERVER: true, PROD: true }), {
  entry: './src/server/server.js',
  mode: process.env.NODE_ENV || 'development',
  output: {
    filename: 'server.js',
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
  externals: [nodeExternals()],
  optimization: {
    minimizer: [
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
    ],
  },
})
