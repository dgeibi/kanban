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
          test: /\.js$/,
          oneOf: [
            {
              include: paths.src,
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                compact: true,
                babelrc: false,
                configFile: false,
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
                  'react-loadable/babel',
                ],
              },
            },
            {
              loader: 'babel-loader',
              exclude: /node_modules[\\/](?:react|react-dom)[\\/]|@babel[\\/]runtime/,
              options: {
                babelrc: false,
                configFile: false,
                cacheDirectory: true,
                compact: true,
                presets: ['@dgeibi/babel-preset-react-app/dependencies'],
              },
            },
          ],
        },
      ],
    },
  }
}
