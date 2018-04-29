import React from 'react'
import { cx, css } from 'emotion'
import Header from './Header'
import Footer from './Footer'
import { container, mainWrapper } from './css'

export default function Frame({ children }) {
  return (
    <>
      <Header />
      <div className={mainWrapper}>
        <div
          className={cx(
            container,
            css`
              padding-top: 16px;
              padding-bottom: 16px;
            `
          )}
        >
          {children}
        </div>
      </div>
      <Footer />
    </>
  )
}
