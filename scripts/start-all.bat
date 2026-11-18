@echo off
title Site Screenshots - Server and Web App
cd /d "%~dp0.."
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22 or newer is required. Download it from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)
echo Starting Local Chrome Screenshot Server (http://localhost:3456)...
start "Bulk Screenshot - Local Chrome Server" cmd /k "cd /d "%~dp0.." && node server/index.js"
echo Starting Next.js Artboard Web App (http://localhost:3000)...
if not exist "web\node_modules" (
  echo Installing web dependencies first...
  call npm --prefix web install
)
npm --prefix web run dev
pause
