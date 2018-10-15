import React from 'react'
import Helmet from 'react-helmet'

const base = 'KanKanKanban'

function DocumentTitle({ title, children }) {
  const t = children || title

  return (
    <Helmet>
      <title>{t ? `${t} | ${base}` : base}</title>
    </Helmet>
  )
}

export default DocumentTitle
