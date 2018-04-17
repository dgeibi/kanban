const resolveConfig = require('../parts/resolve.part')
const paths = require('../paths')

module.exports = ({ SERVER, NODE_ENV }) => {
  const PROD = NODE_ENV === 'production'
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
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: paths.src,
          options: {
            babelrc: false,
            cacheDirectory: true,
            presets: [babelReactPreset],
            plugins: [['emotion', { sourceMap: !PROD }]],
          },
        },
      ],
    },
  }
}
