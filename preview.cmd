@echo off

set NODE_ENV=production
call npm run -s build

set PASSWORD_SECRET=123deeaxvcd
set SESSION_KEY=cat_sjjsj

call npm run -s start