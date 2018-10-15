import React from 'react'
import Header from './Header'
import { mainContainer } from './css'

export default function Frame({ children }) {
  return (
    <>
      <Header />
      <div className={mainContainer}>{children}</div>
    </>
  )
}
