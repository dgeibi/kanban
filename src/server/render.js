import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'dva/router'
import { Helmet } from 'react-helmet'
import { createMemoryHistory } from 'history'
import { getBundles } from '@7rulnik/react-loadable/webpack'
import Loadable from '@7rulnik/react-loadable'
import fse from 'fs-extra'

import Root from '../app/Root'
import createApp from '../app/createApp'

let asyncChunksStats
let initialAssets

if (process.env.HOT_MODE) {
  module.hot.accept(['../app/createApp', '../app/Root'])
}

const paths = require('config/paths')

const loadManifests = () => {
  if (!asyncChunksStats) {
    asyncChunksStats = fse.readJSONSync(paths.asyncChunksStats)
  }
  if (!initialAssets) {
    initialAssets = fse.readJSONSync(paths.initialAssets)
  }
}

const selectUrl = x => x.publicPath
const isStyle = x => x.file.endsWith('.css')
const isScript = x => x.file.endsWith('.js')

const getAssets = modules => {
  const bundles = getBundles(asyncChunksStats, modules)

  return {
    styles: initialAssets.styles.concat(bundles.filter(isStyle).map(selectUrl)),
    scripts: initialAssets.scripts.concat(
      bundles.filter(isScript).map(selectUrl)
    ),
  }
}

export default function render(req, res) {
  const modules = []
  const context = {}
  const location = req.url
  loadManifests()

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
  const appHTML = renderToString(<App />)
  const helmet = Helmet.renderStatic()
  const preloadData = JSON.stringify({
    state: app._store.getState(),
    token: req.csrfToken(),
  })
  const { scripts, styles } = getAssets(modules)

  res.status(context.status || 200).send(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
${helmet.title.toString()}
${styles.map(x => `<link href="${x}" rel="stylesheet"/>`).join('')}
</head>
<body><div id="root">${appHTML}</div>
<script>window.__PRELOAD__=${preloadData};</script>
${scripts.map(x => `<script src="${x}"></script>`).join('')}
<script>window.__main__();delete window.__main__;</script>
</body>
</html>`)
}
