import React, { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'dva/router'
import { Helmet } from 'react-helmet'
import { createMemoryHistory } from 'history'
import fs from 'fs'

import Root from '../app/Root'
import createApp from '../app/createApp'

const manifest = JSON.parse(
  fs.readFileSync(`./dist/public/manifest.json`, 'utf8')
)

export default function render(req, res) {
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
  const preloadedState = app._store.getState()
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Page Title</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${helmet.title.toString()}
</head>
<body><div id="root">${appHTML}</div></body>
<script id="preload">
  window.PRELOADED_STATE = ${JSON.stringify(preloadedState)}
</script>
<script src=${manifest['main.js']}></script>
</html>
`
  res.send(html)
}
