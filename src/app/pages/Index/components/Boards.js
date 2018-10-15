import React from 'react'
import { connect } from 'dva'
import { map } from 'lodash'
import styled from 'react-emotion'
import { BoardLink, BoardCreator } from './BoardCard'

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const others = 16 * 2
const unit = 210

const getP = n => `${n * unit + others}px`

const Div = styled.div`
  width: ${unit * 4}px;
  margin: 0 auto;

  @media (max-width: ${getP(4)}) {
    width: ${unit * 3}px;
  }
  @media (max-width: ${getP(3)}) {
    width: ${unit * 2}px;
  }
  @media (max-width: ${getP(2)}) {
    width: ${unit}px;
  }
`

const H1 = styled.h1`
  margin-left: 5px;
`

function Boards({ boards, dispatch }) {
  return (
    <Div>
      <header>
        <H1>看板</H1>
      </header>
      <CardContainer>
        {map(boards, board => (
          <BoardLink
            id={board.id}
            date={board.createdAt}
            title={board.title}
            key={board.id}
          />
        ))}
        <BoardCreator
          onCreate={({ title }) => {
            dispatch({
              type: 'boards/create',
              payload: { title },
            })
          }}
        />
      </CardContainer>
    </Div>
  )
}

export default connect(({ boards }) => ({ boards }))(Boards)
