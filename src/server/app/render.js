import React from 'react'
import { btoa } from 'abab'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'dva/router'
import { Helmet } from 'react-helmet'
import { createMemoryHistory } from 'history'
import { getBundles } from 'config/plugin/loadable'
import Loadable from 'react-loadable'
import { renderStylesToString } from 'emotion-server'
import fse from 'fs-extra'
import 'raf/polyfill'
import { resetServerContext } from 'react-beautiful-dnd'
import Root from '~/app/Root'
import createApp from '~/app/createApp'

if (process.env.HOT_MODE) {
  module.hot.accept(['~/app/createApp', '~/app/Root'])
}

export default () => {
  const paths = require('config/paths')

  const loadManifests = () =>
    Promise.all([
      fse.readJSON(paths.asyncChunksStats),
      fse.readJSON(paths.initialAssets),
    ]).then(([asyncChunksStats, initialAssets]) => ({
      asyncChunksStats,
      initialAssets,
    }))

  const manifestsPromise = process.env.HOT_MODE
    ? new Promise((resolve, reject) => {
        const waitOn = require('wait-on') // eslint-disable-line
        waitOn(
          {
            resources: [paths.initialAssets, paths.asyncChunksStats],
            interval: 300,
          },
          error => {
            if (error) {
              reject(error)
              return
            }

            resolve(loadManifests())
          }
        )
      })
    : loadManifests()

  const selectUrl = x => x.publicPath
  const isStyle = x => x.file.endsWith('.css')
  const isScript = x => x.file.endsWith('.js')

  return async function render(req, res) {
    const { asyncChunksStats, initialAssets } = await manifestsPromise
    const location = req.url
    const modules = []
    const context = {}

    const app = createApp({
      history: createMemoryHistory({
        initialEntries: [location],
      }),
      initialState: req.initialState,
      router: () => (
        <StaticRouter location={location} context={context}>
          <Loadable.Capture report={moduleName => modules.push(moduleName)}>
            <Root />
          </Loadable.Capture>
        </StaticRouter>
      ),
    })
    const App = app.start()
    resetServerContext()
    const appHTML = renderStylesToString(renderToString(<App />))
    const helmet = Helmet.renderStatic()
    const preloadData = btoa(
      encodeURI(
        JSON.stringify({
          state: app._store.getState(),
          token: req.csrfToken(),
        })
      )
    )

    const getAssets = () => {
      const bundles = getBundles(asyncChunksStats, modules)

      return {
        styles: initialAssets.styles.concat(
          bundles.filter(isStyle).map(selectUrl)
        ),
        scripts: [
          ...bundles.filter(isScript).map(selectUrl),
          ...initialAssets.scripts,
        ],
      }
    }

    const { scripts, styles } = getAssets(modules)

    res.status(context.status || 200).send(`<!DOCTYPE html>
  <html lang="zh-Hans">
  <head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${helmet.title.toString()}
  ${styles.map(x => `<link href="${x}" rel="stylesheet">`).join('')}
  ${scripts.map(x => `<link href="${x}" rel="preload" as="script">`).join('')}
  </head>
  <body><div id="root">${appHTML}</div>
  <div id="app-data" hidden>${preloadData}</div>
  ${scripts.map(x => `<script src="${x}"></script>`).join('')}
  </body>
  </html>`)
  }
}
