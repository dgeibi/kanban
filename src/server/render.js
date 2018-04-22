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
let manifest

if (process.env.HOT_MODE) {
  module.hot.accept(['../app/createApp', '../app/Root'])
}

const loadJSON = (p, xfs) => JSON.parse((xfs || fs).readFileSync(p, 'utf8'))

const ensureManifest = ({ outputPath }) => {
  if (!stats) {
    stats = loadJSON(path.join(__dirname, `react-loadable.json`))
  }
  if (!manifest) {
    manifest = {
      css: [],
      js: [],
    }
    const data = loadJSON(path.join(outputPath, '/manifest.json'), global.mfs)
    Object.keys(data).forEach(k => {
      const asset = data[k]
      if (asset.endsWith('.css')) {
        manifest.css.push(asset)
      } else if (asset.endsWith('.js')) {
        manifest.js.push(asset)
      }
    })
  }
}

export default function render(req, res) {
  const modules = []

  const context = {}
  const pathname = req.url
  const { publicPath, outputPath } = req
  ensureManifest({ outputPath })
  const app = createApp({
    history: createMemoryHistory({
      initialEntries: [pathname],
    }),
    initialState: req.initialState,
    router: () => (
      <StaticRouter location={pathname} context={context}>
        <Root />
      </StaticRouter>
    ),
  })
  const App = app.start()

  const appHTML = renderToString(
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      <App />
    </Loadable.Capture>
  )
  const helmet = Helmet.renderStatic()
  const bundles = getBundles(stats, modules)
  const formatUrl = x => `${publicPath}${x.file}`
  const styles = manifest.css.concat(
    bundles.filter(bundle => bundle.file.endsWith('.css')).map(formatUrl)
  )
  const scripts = manifest.js.concat(
    bundles.filter(bundle => bundle.file.endsWith('.js')).map(formatUrl)
  )
  const preloadData = JSON.stringify({
    state: app._store.getState(),
    token: req.csrfToken(),
  })

  const htmlString = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${helmet.title.toString()}
  ${styles.map(style => `<link href="${style}" rel="stylesheet"/>`).join('\n')}
</head>
<body><div id="root">${appHTML}</div>
<script>window.__PRELOAD__=${preloadData};</script>
${scripts.map(script => `<script src="${script}"></script>`).join('\n')}
<script>window.__main__();delete window.__main__;</script>
</body>
</html>
`
  res.status(context.status || 200).send(htmlString)
}
