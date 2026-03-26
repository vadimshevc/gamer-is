@echo off
echo [GamerIS] Starting Production Build and Deploy...
call npm run lint
call npm run build
call npm run deploy
echo [GamerIS] Deployment Finished!
pause