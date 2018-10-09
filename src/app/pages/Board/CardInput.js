import React from 'react'
import { css } from 'emotion'
import enhanceWithClickOutside from 'react-click-outside'
import { Button } from 'antd'

const cardStyle = css`
  font-variant: tabular-nums;
  box-sizing: border-box;
  margin: 0;
  list-style: none;
  position: relative;
  display: inline-block;
  padding: 4px 11px;
  width: 100%;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  max-width: 100%;
  vertical-align: bottom;
  transition: all 0.3s, height 0s;
  min-height: 32px;

  :focus {
    border-color: #d991c2;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(204, 105, 176, 0.2);
    border-right-width: 1px !important;
  }
`

const hide = {
  display: 'none',
}

const gap = {
  marginBottom: '8px',
}

@enhanceWithClickOutside
class CardInput extends React.Component {
  state = {
    clicked: false,
    value: this.props.children,
  }

  static getDerivedStateFromProps(props, state) {
    if (state.clicked) return null
    return {
      value: props.children,
    }
  }

  handleClick = () => {
    this.setState(
      {
        clicked: true,
      },
      () => {
        this.input.select()
      }
    )
  }

  handleClickOutside() {
    this.cancel()
  }

  handleInputChange = e => {
    this.setState({
      value: e.target.value,
    })
  }

  saveInput = inst => {
    this.input = inst
  }

  handleKeyDown = e => {
    if (!e.ctrlKey) {
      const { keyCode } = e
      if (keyCode === 13) {
        this.submit()
      } else if (keyCode === 27) {
        this.cancel()
      }
    }
  }

  cancel = () => {
    this.setState({
      clicked: false,
      value: this.props.children,
    })
  }

  submit = () => {
    this.setState({
      clicked: false,
    })
    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    }
  }

  render() {
    const { clicked, value } = this.state
    return (
      <div>
        <div
          onClick={this.handleClick}
          className={cardStyle}
          style={clicked ? hide : undefined}
        >
          {value}
        </div>
        <div style={clicked ? undefined : hide}>
          <textarea
            value={value}
            className={cardStyle}
            onChange={this.handleInputChange}
            ref={this.saveInput}
            onKeyDown={this.handleKeyDown}
            style={gap}
          />
          <Button
            onClick={this.submit}
            type="primary"
            className={css`
              margin-right: 5px;
            `}
          >
            保存
          </Button>
          <Button onClick={this.cancel}>取消</Button>
        </div>
      </div>
    )
  }
}

export default CardInput
