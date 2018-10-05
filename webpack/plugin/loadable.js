const fs = require('fs')
const path = require('path')
const url = require('url')

function buildManifest(compiler, compilation) {
  const manifest = {}
  const _publicPath = compilation.outputOptions.publicPath || ''
  for (const chunkGroup of compilation.chunkGroups) {
    const files = []
    for (const chunk of chunkGroup.chunks) {
      for (const file of chunk.files) {
        files.push({
          file,
          publicPath: url.resolve(_publicPath, file),
        })
      }
    }

    for (const block of chunkGroup.blocksIterable) {
      manifest[block.request] = files
    }
  }

  return manifest
}

class ReactLoadablePlugin {
  constructor(opts = {}) {
    this.filename = opts.filename
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'ReactLoadablePlugin',
      (compilation, callback) => {
        const manifest = buildManifest(compiler, compilation)
        const json = JSON.stringify(manifest, null, 2)
        const outputDirectory = path.dirname(this.filename)
        try {
          fs.mkdirSync(outputDirectory)
        } catch (err) {
          if (err.code !== 'EEXIST') {
            throw err
          }
        }
        fs.writeFileSync(this.filename, json)
        callback()
      }
    )
  }
}

function getBundles(manifest, moduleIds) {
  return moduleIds.reduce(
    (bundles, moduleId) => bundles.concat(manifest[moduleId]),
    []
  )
}

exports.ReactLoadablePlugin = ReactLoadablePlugin
exports.getBundles = getBundles
