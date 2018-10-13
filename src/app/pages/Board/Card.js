import React from 'react'
import styled from 'react-emotion'
import { connect } from 'dva'

import { colors, grid } from './constants'
import { CardInput } from './CardInput'

const Container = styled.div`
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px ${colors.shadow}` : 'none'};
  margin-bottom: ${grid}px;
  user-select: none;
  transition: background-color 0.1s ease;
  color: ${colors.black};
  &:hover {
    color: ${colors.black};
    text-decoration: none;
  }
  &:focus {
    outline: 2px solid ${colors.purple};
    box-shadow: none;
  }
`

@connect()
class Card extends React.PureComponent {
  handleCardChange = values => {
    const { card, listId, boardId } = this.props

    this.props.dispatch({
      type: 'cards/update',
      payload: {
        cardId: card.id,
        listId,
        boardId,
        data: values,
      },
    })
  }

  render() {
    const { card, isDragging, provided } = this.props
    return (
      <Container
        isDragging={isDragging}
        innerRef={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <CardInput onSubmit={this.handleCardChange} values={card} />
      </Container>
    )
  }
}

export default Card
