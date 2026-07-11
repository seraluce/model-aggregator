@echo off
start "modelhub-server" cmd /c "cd /d D:\Website\model-aggregator && npx -w server tsx watch src/index.ts"
start "modelhub-client" cmd /c "cd /d D:\Website\model-aggregator && npx -w client vite"
echo Started. Wait a few seconds then open http://localhost:5173
