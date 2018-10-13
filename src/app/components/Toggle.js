import React from 'react'

class Toggle extends React.Component {
  state = {
    clicked: false,
  }

  click = () => {
    if (this.state.clicked) return
    this.setState({
      clicked: true,
    })
  }

  blur = () => {
    if (!this.state.clicked) return
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

export default Toggle
