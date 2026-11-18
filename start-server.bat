@echo off
title Bulk Screenshot - Local Chrome Server
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22 or newer is required. Download it from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)
echo Starting local full-page screenshot server on http://localhost:3456
echo Keep this window open while you use the Figma plugin or web app.
echo.
node server/index.js
pause
