import React from 'react'
import { css } from 'emotion'
import styled from 'react-emotion'
import ClickOutside from '~/app/components/react-click-outside'
import { grid } from './constants'

const wrapperStyle = css`
  flex-grow: 1;
  overflow: hidden;
  overflow-wrap: break-word;
`

const style = css`
  position: relative;
  box-sizing: border-box;
  padding: ${grid}px;
  margin: 0;
  padding: 4px 11px;
  width: 100%;
  height: auto;
  min-height: 32px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  border: 1px solid #d9d9d9;
  transition: background-color ease 0.2s;
  user-select: none;
`

const Input = styled.input`
  ${style};
  border-radius: 4px;
  background-image: none;
  color: rgba(0, 0, 0, 0.65);
  display: inline-block;
  list-style: none;

  :focus {
    border-color: #d991c2;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(204, 105, 176, 0.2);
    border-right-width: 1px !important;
  }
`

const H4 = styled.h4`
  ${style};
  border-color: transparent;
`

const hide = {
  display: 'none',
}

class Title extends React.Component {
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

  handleClickOutside = () => {
    if (!this.state.clicked) return
    this.submit()
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

  cancel() {
    this.setState({
      clicked: false,
      value: this.props.children,
    })
  }

  submit = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    }
    this.setState({
      clicked: false,
    })
  }

  render() {
    const { clicked, value } = this.state
    return (
      <ClickOutside
        className={wrapperStyle}
        onClickOutside={this.handleClickOutside}
      >
        <H4 onClick={this.handleClick} style={clicked ? hide : undefined}>
          {value}
        </H4>
        <Input
          value={value}
          onChange={this.handleInputChange}
          style={clicked ? undefined : hide}
          innerRef={this.saveInput}
          onKeyDown={this.handleKeyDown}
        />
      </ClickOutside>
    )
  }
}

export default Title
