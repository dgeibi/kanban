const { define } = require('./util')
const resolveConfig = require('./resolve.config')
const Env = require('./Env')

module.exports = ({ SERVER, PROD }) => {
  const babelReactPreset = ['dgeibi-react']
  if (SERVER) {
    babelReactPreset.push({
      targets: {
        node: 'current',
      },
    })
  }
  return {
    ...resolveConfig,
    plugins: [
      define({
        'process.env.SERVER': SERVER,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: Env.src,
          options: {
            babelrc: false,
            cacheDirectory: true,
            presets: [babelReactPreset],
            plugins: [
              ['emotion', { sourceMap: !PROD }],
            ],
          },
        },
      ],
    },
  }
}
