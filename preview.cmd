@echo off

set NODE_ENV=production
call npm run -s build

set HOST=127.0.0.1
set DEBUG=app:*
set SESSION_KEYS=ACssw1231!dwee3j84fxryn,xsdfl4vrnfg39ncf22#11,mfk9jf#1cHw21111
REM set DB_USERNAME=root
REM set DB_PASSWORD=Seven7i!
REM set DB_NAME=kanban
REM set DB_HOSTNAME=localhost

call npm run -s start