import React from 'react'
import { css } from 'emotion'
import { Button, Input } from 'antd'
import ClickOutside from '~/app/components/react-click-outside'

const { TextArea } = Input

const cardStyle = css`
  word-wrap: break-word;
  font-variant: tabular-nums;
  box-sizing: border-box;
  margin: 0;
  list-style: none;
  position: relative;
  display: inline-block;
  padding: 4px 11px;
  width: 100%;
  min-height: 32px;
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
  overflow: hidden;
  white-space: pre-wrap;

  :focus {
    border-color: #d991c2;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(204, 105, 176, 0.2);
    border-right-width: 1px !important;
  }
`

const btnGapCSS = css`
  margin-right: 5px;
`

const gap = {
  margin: '8px 0',
}

class CustomTextArea extends React.Component {
  saveRef = inst => {
    this.antdTextArea = inst
    this.textAreaRef = inst && inst.textAreaRef
    this.resizeTextarea = inst && inst.resizeTextarea
  }

  focus() {
    this.textAreaRef.focus()
  }

  blur() {
    this.textAreaRef.blur()
  }

  changeValue(v) {
    if (this.props.onChange) this.props.onChange(v)
  }

  handleChange = e => {
    this.changeValue(e.target.value)
  }

  handleKeyDown = e => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e)
    }

    const { keyCode } = e
    if (!e.ctrlKey) {
      if (keyCode === 13) {
        if (this.props.onSubmit) {
          e.preventDefault()
          this.props.onSubmit()
        }
      } else if (keyCode === 27 && this.props.onCancel) {
        this.props.onCancel()
      }
    } else if (keyCode === 13) {
      this.changeValue(`${e.target.value}\n`)
    }
  }

  render() {
    const { onSubmit, onCancel, ...props } = this.props
    return (
      <TextArea
        prefixCls=""
        className={cardStyle}
        ref={this.saveRef}
        autosize
        {...props}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
      />
    )
  }
}

class CardForm extends React.Component {
  state = {
    values: this.props.values || {},
  }

  static getDerivedStateFromProps(props) {
    if (props.active) return null
    return {
      values: props.values || {},
    }
  }

  submit = e => {
    if (e) e.preventDefault()
    const {
      props: { onSubmit },
      state: { values },
    } = this

    if (values.text) {
      onSubmit(values)
    }
  }

  handleTextChange = value => {
    const { values } = this.state
    this.setState({
      values: {
        ...values,
        text: value,
      },
    })
  }

  render() {
    const { onCancel, refTextArea } = this.props
    const { text } = this.state.values

    return (
      <form onSubmit={this.submit}>
        <CustomTextArea
          onCancel={onCancel}
          autoFocus
          onSubmit={this.submit}
          ref={refTextArea}
          onChange={this.handleTextChange}
          value={text}
        />
        <div style={gap}>
          <Button htmlType="submit" type="primary" className={btnGapCSS}>
            保存
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </div>
      </form>
    )
  }
}

const hide = {
  display: 'none',
}

class CardInput extends React.Component {
  state = {
    clicked: false,
  }

  handleClick = () => {
    this.setState(
      {
        clicked: true,
      },
      () => {
        this.textAreaRef.select()
        this.textAreaInst.resizeTextarea()
      }
    )
  }

  handleClickOutside = () => {
    if (!this.state.clicked) return
    this.form.submit()
  }

  saveTextAreaInst = inst => {
    this.textAreaInst = inst
    this.textAreaRef = inst && inst.textAreaRef
  }

  cancel = () => {
    this.setState({
      clicked: false,
    })
  }

  submit = v => {
    const {
      state: { clicked },
      props: { onSubmit },
    } = this

    if (clicked) {
      onSubmit(v)
      this.setState({
        clicked: false,
      })
    }
  }

  saveForm = form => {
    this.form = form
  }

  render() {
    const { values } = this.props
    const { clicked } = this.state
    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <div
          onClick={this.handleClick}
          className={cardStyle}
          style={clicked ? hide : undefined}
        >
          {values && values.text}
        </div>
        <div style={clicked ? undefined : hide}>
          <CardForm
            ref={this.saveForm}
            refTextArea={this.saveTextAreaInst}
            values={values}
            onCancel={this.cancel}
            onSubmit={this.submit}
            active={clicked}
          />
        </div>
      </ClickOutside>
    )
  }
}

class CardCreator extends React.Component {
  handleClickOutside = () => {
    if (this.form) {
      this.form.submit()
    }
  }

  saveForm = inst => {
    this.form = inst
  }

  render() {
    const { active } = this.props
    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        {active && <CardForm ref={this.saveForm} {...this.props} />}
      </ClickOutside>
    )
  }
}

export { CardInput, CardForm, CardCreator }
