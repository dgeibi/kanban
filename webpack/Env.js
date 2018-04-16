const path = require('path')

module.exports = {
  src: path.join(__dirname, '../src'),
  Dist: {
    public: path.join(__dirname, '../dist/public'),
  },
  definitions: {
    'process.env.HOT_MODE': false,
  },
}
