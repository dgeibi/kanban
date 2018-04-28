import React from 'react'
import { Card } from 'antd'
import Login from './Login'
import Join from './Join'

const tabList = [
  {
    key: 'join',
    tab: '注册',
  },
  {
    key: 'login',
    tab: '登录',
  },
]

class LoginOrJoin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      key: 'join',
    }
  }

  onTabChange = key => {
    this.setState({ key })
  }

  render() {
    const { key } = this.state
    const { onLogin, onJoin, className } = this.props
    return (
      <Card
        tabList={tabList}
        onTabChange={this.onTabChange}
        activeTabKey={key}
        className={className}
      >
        {key === 'join' ? (
          <Join onJoin={onJoin} />
        ) : (
          <Login onLogin={onLogin} />
        )}
      </Card>
    )
  }
}

export default LoginOrJoin
