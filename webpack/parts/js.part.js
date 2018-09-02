const paths = require('../paths')

module.exports = ({ SERVER, NODE_ENV }) => {
  const PROD = NODE_ENV === 'production'
  const babelReactPreset = ['@dgeibi/babel-preset-react-app']
  if (SERVER) {
    babelReactPreset.push({
      targets: {
        node: 'current',
      },
    })
  } else {
    // todo ie10 classes broken
    babelReactPreset.push({
      useBuiltIns: 'usage',
    })
  }
  const importAntd = [
    'import',
    SERVER
      ? {
          libraryName: 'antd',
        }
      : {
          libraryName: 'antd',
          style: true,
          libraryDirectory: 'es',
        },
    `antd-${SERVER ? 'server' : 'client'}`,
  ]

  return {
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
                    plugins: [
                      ['emotion', { sourceMap: !PROD }],
                      importAntd,
                      [
                        'import',
                        {
                          libraryName: 'lodash',
                          libraryDirectory: '',
                          camel2DashComponentName: false,
                        },
                        'lodash',
                      ],
                      '@7rulnik/react-loadable/babel',
                    ],
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
                    compact: true,
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
