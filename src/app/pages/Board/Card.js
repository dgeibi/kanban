import React from 'react'
import styled from 'react-emotion'
import { connect } from 'dva'

import { colors, grid } from './constants'
import CardInput from './CardInput'

const Container = styled.div`
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px ${colors.shadow}` : 'none'};
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
  /* display: flex; */
  /* align-items: center; */
`

@connect()
class Card extends React.PureComponent {
  handleCardChange = content => {
    const { card } = this.props

    this.props.dispatch({
      type: 'cards/save',
      payload: {
        [card.id]: {
          ...card,
          text: content,
        },
      },
    })
  }

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
        <CardInput onChange={this.handleCardChange}>
          {card && card.text}
        </CardInput>
      </Container>
    )
  }
}

export default Card
