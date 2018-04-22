const path = require('path')

const configurePaths = root => ({
  src: path.join(root, 'src'),
  outputPath: path.join(root, 'dist/public'),
  publicPath: '/public/',
})
module.exports = configurePaths(process.cwd())
