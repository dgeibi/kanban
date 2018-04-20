const css = ({ NODE_ENV, SERVER }) => {
  const PROD = NODE_ENV === 'production'
  
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')

  const CSS_LOADER = SERVER ? 'css-loader/locals' : 'css-loader'
  let CSS_RES_LOADER = null
  if (!SERVER) {
    CSS_RES_LOADER = PROD ? MiniCssExtractPlugin.loader : 'style-loader'
  }

  const sourceMap = !PROD
  const Opts = {
    css: {
      minimize: PROD,
      sourceMap,
    },
  }

  const rules = [
    {
      test: /\.css$/,
      use: [
        {
          loader: CSS_LOADER,
          options: Opts.css,
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
  if (CSS_RES_LOADER) {
    rules.forEach(rule => {
      rule.use.unshift(CSS_RES_LOADER)
    })
  }

  const parts = {
    module: {
      rules,
    },
  }
  if (!SERVER && PROD) {
    parts.plugins = [new MiniCssExtractPlugin()]
  }
  return parts
}

module.exports = css
