const css = ({ NODE_ENV, SERVER, HOT_MODE }) => {
  const EXTRACT = !SERVER && !HOT_MODE
  let resourceLoader = null
  const plugins = []

  if (EXTRACT) {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')
    resourceLoader = MiniCssExtractPlugin.loader
    plugins.push(new MiniCssExtractPlugin())
  } else if (!SERVER) {
    resourceLoader = 'style-loader'
  }

  const cssLoader = SERVER ? 'css-loader/locals' : 'css-loader'
  const PROD = NODE_ENV === 'production'
  const sourceMap = !PROD

  const rules = [
    {
      test: /\.css$/,
      use: [
        {
          loader: cssLoader,
          options: {
            minimize: PROD,
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
