const resolveConfig = require('../parts/resolve.part')
const css = require('../parts/css.part')
const js = require('../parts/js.part')
const merge = require('../utils/merge')

module.exports = env => merge.sync([resolveConfig, css, js], env)
