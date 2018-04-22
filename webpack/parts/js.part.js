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
  const importAntd = [
    'import',
    SERVER
      ? {
          libraryName: 'antd',
        }
      : {
          libraryName: 'antd',
          style: 'css',
          libraryDirectory: 'es',
        },
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
                      'lodash',
                      importAntd,
                      '@babel/plugin-syntax-dynamic-import',
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
