@echo off
title Vitality-OS Smart Hospital Cloud
echo ============================================================
echo   VITALITY-OS: SMART HOSPITAL CLOUD & CLINICAL INTELLIGENCE
echo ============================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed on this computer!
    echo Please download and install Node.js (LTS version) from:
    echo https://nodejs.org/
    echo.
    echo After installing Node.js, double-click this file again.
    echo.
    pause
    exit /b 1
)

if not exist node_modules (
    echo [INFO] First-time setup detected. Installing hospital dependencies...
    echo This takes about 1-2 minutes. Please wait...
    echo.
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] npm install encountered an error.
        pause
        exit /b 1
    )
)

echo.
echo [INFO] Launching Vitality-OS at http://localhost:3000/ ...
echo Your web browser will open automatically!
echo (Keep this window open while using the hospital portals)
echo.
call npm run dev -- --open
pause
