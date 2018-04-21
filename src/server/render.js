import React, { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'dva/router'
import { Helmet } from 'react-helmet'
import { createMemoryHistory } from 'history'
import fs from 'fs'
import path from 'path'

import Root from '../app/Root'
import createApp from '../app/createApp'

let manifest

if (process.env.HOT_MODE) {
  module.hot.accept(['../app/createApp', '../app/Root'])
}

const ensureManifest = () => {
  if (!manifest) {
    manifest = JSON.parse(
      (global.mfs || fs).readFileSync(
        path.resolve(`./dist/public/manifest.json`),
        'utf8'
      )
    )
  }
}

export default function render(req, res) {
  ensureManifest()
  const context = {}
  const pathname = req.url
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
  const appHTML = renderToString(createElement(app.start()))
  const helmet = Helmet.renderStatic()
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
  <link rel="stylesheet" href="${manifest['main.css']}">
  ${helmet.title.toString()}
</head>
<body><div id="root">${appHTML}</div></body>
<script>window.__PRELOAD__ = ${preloadData}</script>
<script src="${manifest['main.js']}"></script>
</html>
`
  res.status(context.status || 200).send(htmlString)
}
