import React, { Component } from 'react'
import { omit } from 'lodash'

let handlers

function addHandler(key, fn) {
  if (!handlers) {
    handlers = new Map()
    const handler = e => {
      handlers.forEach(h => {
        h(e)
      })
    }
    document.addEventListener('touchend', handler, true)
    document.addEventListener('click', handler, true)
  }
  handlers.set(key, fn)
}

function removeHandler(key) {
  if (!handlers) return
  handlers.delete(key)
}

/**
 * @typedef {Object} ClickOutsideBaseProps
 * @property {(event: MouseEvent | TouchEvent) => void} onClickOutside
 */

/**
 * @typedef {ClickOutsideBaseProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>} ClickOutsideProps
 */

/**
 * @extends {React.Component<ClickOutsideProps, any>}
 */
export default class ClickOutside extends Component {
  isTouch = false

  getContainer = ref => {
    this.container = ref
  }

  componentDidMount() {
    addHandler(this, this.handle)
  }

  componentWillUnmount() {
    removeHandler(this)
  }

  handle = e => {
    if (e.type === 'touchend') this.isTouch = true
    if (e.type === 'click' && this.isTouch) return
    const { onClickOutside } = this.props
    const el = this.container
    if (el && !el.contains(e.target)) onClickOutside(e)
  }

  render() {
    const props = omit(this.props, ['onClickOutside'])
    return <div {...props} ref={this.getContainer} />
  }
}
