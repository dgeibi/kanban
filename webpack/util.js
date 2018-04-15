const webpack = require('webpack')

const define = (opts = {}) => {
  const keys = Object.keys(opts)
  if (keys.length < 1) return null

  const definitions = {}
  keys.forEach(key => {
    const value = JSON.stringify(opts[key])
    definitions[key] = value
  })
  return new webpack.DefinePlugin(definitions)
}

const css = ({ PROD, SSR }) => {
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')

  const CSS_LOADER = SSR ? 'css-loader/locals' : 'css-loader'

  // eslint-disable-next-line
  const CSS_RES_LOADER = isSSR
    ? null
    : PROD
      ? MiniCssExtractPlugin.loader
      : 'style-loader'
  const parts = {
    module: {
      rules: [
        {
          test: /\.modules.css$/,
          use: [
            CSS_RES_LOADER,
            {
              loader: CSS_LOADER,
              options: {
                minimize: true,
                importLoaders: 1,
                modules: true,
                sourceMap: !PROD,
              },
            },
            // {
            //   loader: 'postcss-loader',
            //   options: {
            //     sourceMap: !PROD,
            //   },
            // },
          ].filter(Boolean),
        },
      ],
    },
  }
  if (!SSR && PROD) {
    parts.plugins = [new MiniCssExtractPlugin()]
  }
  return parts
}

module.exports = {
  css,
  define,
}
