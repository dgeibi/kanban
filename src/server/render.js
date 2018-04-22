import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'dva/router'
import { Helmet } from 'react-helmet'
import { createMemoryHistory } from 'history'
import fs from 'fs'
import path from 'path'
import { getBundles } from '@7rulnik/react-loadable/webpack'
import Loadable from '@7rulnik/react-loadable'
import Root from '../app/Root'
import createApp from '../app/createApp'

let stats
let assets

if (process.env.HOT_MODE) {
  module.hot.accept(['../app/createApp', '../app/Root'])
}

const loadJSON = (p, xfs) => JSON.parse((xfs || fs).readFileSync(p, 'utf8'))

const loadManifests = ({ outputPath }) => {
  if (!stats) {
    stats = loadJSON(path.join(__dirname, `react-loadable.json`))
  }
  if (!assets) {
    const manifest = loadJSON(
      path.join(outputPath, '/manifest.json'),
      global.mfs
    )
    assets = {
      styles: [],
      scripts: [],
    }
    Object.keys(manifest).forEach(k => {
      const x = manifest[k]
      if (x.endsWith('.css')) {
        assets.styles.push(x)
      } else if (x.endsWith('.js')) {
        assets.scripts.push(x)
      }
    })
  }
}

const { outputPath } = require('~/../webpack/paths')

export default function render(req, res) {
  const modules = []
  const context = {}
  const location = req.url
  loadManifests({ outputPath })

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

  // flush assets
  const bundles = getBundles(stats, modules)
  const selectUrl = x => x.publicPath
  const styles = assets.styles.concat(
    bundles.filter(bundle => bundle.file.endsWith('.css')).map(selectUrl)
  )
  const scripts = assets.scripts.concat(
    bundles.filter(bundle => bundle.file.endsWith('.js')).map(selectUrl)
  )
  res.status(context.status || 200).send(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
${helmet.title.toString()}
${styles.map(x => `<link href="${x}" rel="stylesheet"/>`).join('\n')}
</head>
<body><div id="root">${appHTML}</div>
<script>window.__PRELOAD__=${preloadData};</script>
${scripts.map(x => `<script src="${x}"></script>`).join('\n')}
<script>window.__main__();delete window.__main__;</script>
</body>
</html>`)
}
