/* eslint-disable no-restricted-syntax, no-await-in-loop */
const webpackMerge = require('webpack-merge')
const isFunction = require('lodash/isFunction')
const isObject = require('lodash/isObject')

const isThenable = x => x && isFunction(x.then)

async function merge(opts, env) {
  const configs = []

  async function push(x) {
    if (isObject(x)) {
      if (isThenable(x)) {
        const px = await x
        if (isObject(x)) {
          configs.push(px)
        }
      } else {
        configs.push(x)
      }
    }
  }

  async function pushConfig(x) {
    if (!x) return
    if (isFunction(x)) {
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
    if (isObject(x)) {
      configs.push(x)
    }
  }

  function pushConfig(x) {
    if (!x) return
    if (isFunction(x)) {
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
