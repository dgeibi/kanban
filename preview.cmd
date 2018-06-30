@echo off

set NODE_ENV=production
call npm run -s build

set HOST=127.0.0.1
set DEBUG=app:*
set KEY1=ACssw1231!dwee3j84fxryn
set KEY2=xsdfl4vrnfg39ncf22#11
set KEY3=mfk9jf#1cHw21111
set DB_USERNAME=root
set DB_PASSWORD=Seven7i!
set DB_NAME=kanban
set DB_HOSTNAME=localhost

call npm run -s start