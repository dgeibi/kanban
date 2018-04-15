import React from 'react'
import Header from './Header'

export default function Frame({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
