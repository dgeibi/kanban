import React from 'react'

export default class Toggle extends React.Component {
  state = {
    clicked: false,
  }

  click = () => {
    this.setState({
      clicked: true,
    })
  }

  blur = () => {
    this.setState({
      clicked: false,
    })
  }

  render() {
    return this.props.children({
      clicked: this.state.clicked,
      click: this.click,
      blur: this.blur,
    })
  }
}
