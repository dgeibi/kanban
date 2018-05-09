## Rest

### Board

创建：POST /api/board
获取：GET /api/board/:board_id
删除：DELETE /api/board/:board_id

### List

创建：POST /api/board/:board_id/list
获取：GET /api/board/:board_id/list/:list_id
删除：DELETE /api/board/:board_id/list/:list_id

### Card

创建：POST /api/board/:board_id/list/:list_id/card
获取：GET /api/board/:board_id/list/:list_id/card/:card_id
删除：DELETE /api/board/:board_id/list/:list_id/card/:card_id

## SocketIO

https://github.com/PlatziDev/socket.io-redux/blob/master/lib/index.js
https://github.com/alexjg/redux-effects-socketio

`board list-moved`

* param.id `boardId`
* param.lists `Array<listId>`

`list updated`

`list card-moved` param 要有 boardId
