/* eslint-disable no-restricted-syntax, no-await-in-loop */
const webpackMerge = require('webpack-merge')

async function merge(opts, env) {
  const configs = []

  async function push(x) {
    if (x && typeof x === 'object') {
      if (x instanceof Promise) {
        const px = await x
        if (px && typeof px === 'object') {
          configs.push(px)
        }
      } else {
        configs.push(x)
      }
    }
  }

  async function pushConfig(x) {
    if (!x) return
    if (typeof x === 'function') {
      await push(x(env))
    } else {
      await push(x)
    }
  }

  for (const x of opts) {
    await pushConfig(x)
  }

  return webpackMerge(configs)
}

merge.sync = function sync(opts, env) {
  const configs = []

  function push(x) {
    if (x && typeof x === 'object') {
      configs.push(x)
    }
  }

  function pushConfig(x) {
    if (!x) return
    if (typeof x === 'function') {
      push(x(env))
    } else {
      push(x)
    }
  }

  for (const x of opts) {
    pushConfig(x)
  }

  return webpackMerge(configs)
}

module.exports = merge
