const css = ({ NODE_ENV, SERVER, HOT_MODE }) => {
  const EXTRACT = !SERVER && !HOT_MODE
  let resourceLoader = null
  const plugins = []

  const PROD_MODE = NODE_ENV === 'production'

  if (EXTRACT) {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')
    resourceLoader = MiniCssExtractPlugin.loader
    plugins.push(
      new MiniCssExtractPlugin({
        filename: PROD_MODE ? '[name].[contenthash:8].css' : '[name].css',
        chunkFilename: PROD_MODE ? '[id].[contenthash:8].css' : '[id].css',
      })
    )
  } else if (!SERVER) {
    resourceLoader = 'style-loader'
  }

  const cssLoader = SERVER ? 'css-loader/locals' : 'css-loader'
  const sourceMap = !PROD_MODE

  const rules = [
    {
      test: /\.css$/,
      use: [
        {
          loader: cssLoader,
          options: {
            minimize: PROD_MODE,
            sourceMap,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap,
          },
        },
      ],
    },
  ]
  if (resourceLoader) {
    rules.forEach(rule => {
      rule.use.unshift(resourceLoader)
    })
  }
  return {
    module: {
      rules,
    },
    plugins,
  }
}

module.exports = css
