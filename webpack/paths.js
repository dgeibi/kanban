const path = require('path')

const configurePaths = root => ({
  src: path.join(root, 'src'),
  dist: {
    public: path.join(root, 'dist/public'),
  },
})
module.exports = configurePaths(process.cwd())
