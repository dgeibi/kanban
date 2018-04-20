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
          oneOf: [
            {
              test: /\.js$/,
              include: paths.src,
              use: [
                'thread-loader',
                {
                  loader: 'babel-loader',
                  options: {
                    babelrc: false,
                    cacheDirectory: true,
                    presets: [babelReactPreset],
                    plugins: [['emotion', { sourceMap: !PROD }], 'lodash'],
                  },
                },
              ],
            },
            {
              test: /\.js$/,
              use: [
                'thread-loader',
                {
                  loader: 'babel-loader',
                  options: {
                    babelrc: false,
                    cacheDirectory: true,
                    presets: [
                      [
                        '@babel/preset-env',
                        {
                          modules: false,
                          shippedProposals: true,
                        },
                      ],
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  }
}