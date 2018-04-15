token 放在 cookie 用于维持登陆




Board

不要直接用 GET，GET 也会带上cookie，`<a href="/board/1/delete" >x</a>`

https://www.ibm.com/developerworks/cn/web/1102_niugang_csrf/

/board/1/delete?token=

长轮询 GET /board/:board_id?version=x

获取：GET /api/board/:board_id
- boardVersion: STRING

创建：POST /api/board
更新：PUT /api/board/:board_id
删除：DELETE /api/board/:board_id
<!-- 部分更新：PATCH /tickets/12 -->

List

POST   /api/board/:board_id/list/:list_id
DELETE /api/board/:board_id/list/:list_id

# req field

- currentBoardVersion: STRING

# res field

- needUpdate: BOOLEAN

修改 patch

整个 list 更新吗？ 不

要建立一个card table

修改card属性/内容
增加card
移动card
card 有 order index

修改 list 的
title
位置

Get /auth/
