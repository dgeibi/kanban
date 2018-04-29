import React from 'react'
import { css, cx } from 'emotion'
import { container, footer } from './css'

export default function Footer() {
  return (
    <footer className={footer}>
      <div
        className={cx(
          container,
          css`
            padding: 16px;
            text-align: center;
          `
        )}
      >
        FOOTER
      </div>
    </footer>
  )
}
