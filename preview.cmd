@echo off

set NODE_ENV=production
call npm run -s build

set HOST=127.0.0.1
set DEBUG=app:*
set SESSION_KEY=ACssw1231!dwee3j84fxryn
set DB_USERNAME=root
set DB_PASSWORD=Seven7i!
set DB_NAME=kanban
set DB_HOSTNAME=localhost

call npm run -s start