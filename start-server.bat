@echo off
echo Starting Waytone ERP Server on http://localhost:3000/...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
