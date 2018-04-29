const path = require('path')

const configurePaths = root => ({
  src: path.join(root, 'src'),
  outputPath: path.join(root, 'dist/static'),
  publicPath: '/static/',
  initialAssets: path.join(root, 'dist/initialAssets.json'),
  asyncChunksStats: path.join(root, 'dist/asyncChunksStats.json'),
  config: path.join(root, 'webpack'),
})
module.exports = configurePaths(process.cwd())
