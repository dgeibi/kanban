import React from 'react'
import { connect } from 'dva'
import { map } from 'lodash'
import { Card } from 'antd'

function Boards({ boards }) {
  return map(boards, board => <Card title={board.title} key={board.id} />)
}

export default connect(({ boards }) => ({ boards }))(Boards)
