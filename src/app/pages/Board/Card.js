import React from 'react'
import styled from 'react-emotion'
import { borderRadius, colors, grid } from './constants'

const Container = styled.div`
  border-radius: ${borderRadius}px;
  border: 1px solid grey;
  background-color: ${({ isDragging }) =>
    isDragging ? colors.green : colors.white};
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px ${colors.shadow}` : 'none'};
  padding: ${grid}px;
  min-height: 40px;
  margin-bottom: ${grid}px;
  user-select: none;
  transition: background-color 0.1s ease;
  /* anchor overrides */
  color: ${colors.black};
  &:hover {
    color: ${colors.black};
    text-decoration: none;
  }
  &:focus {
    outline: 2px solid ${colors.purple};
    box-shadow: none;
  }
  /* flexbox */
  display: flex;
  align-items: center;
`

const Content = styled.div`
  /* flex child */
  flex-grow: 1;
  /* Needed to wrap text in ie11 */
  /* https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox */
  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
`

const BlockQuote = styled.div`
  &::before {
    content: open-quote;
  }
  &::after {
    content: close-quote;
  }
`

export default class Card extends React.PureComponent {
  render() {
    const {
      card,
      isDragging,
      provided,
      // boardId, listId
    } = this.props
    return (
      <Container
        isDragging={isDragging}
        innerRef={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <Content>
          <BlockQuote>{card && card.text}</BlockQuote>
        </Content>
      </Container>
    )
  }
}
