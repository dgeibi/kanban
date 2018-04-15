import React from 'react'
import Helmet from 'react-helmet'

function DocumentTitle({ title, children }) {
  return (
    <Helmet>
      <title>{children || title}</title>
    </Helmet>
  )
}

export default DocumentTitle