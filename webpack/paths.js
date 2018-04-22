const path = require('path')

const configurePaths = root => ({
  src: path.join(root, 'src'),
  outputPath: path.join(root, 'dist/public'),
  publicPath: '/public/',
  initialAssets: path.join(root, 'dist/initialAssets.json'),
  asyncChunksStats: path.join(root, 'dist/asyncChunksStats.json'),
})
module.exports = configurePaths(process.cwd())
