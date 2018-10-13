import React from 'react'
import enhanceWithClickOutside from 'react-click-outside'

@enhanceWithClickOutside
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

  handleClickOutside() {
    if (this.props.onClickOutSide) {
      this.props.onClickOutSide()
    }
    this.blur()
  }

  render() {
    return (
      <div>
        {this.props.children({
          clicked: this.state.clicked,
          click: this.click,
          blur: this.blur,
        })}
      </div>
    )
  }
}

export default Toggle
