@echo off
set "PATH=%PATH%;C:\Program Files\Git\cmd;C:\Program Files\Git\bin"
cd /d "e:\medi-reminder"

echo ========================================================
echo   Pushing Vitality-OS to GitHub
echo   Target: https://github.com/jeet-chowdhury12/vitality-os.git
echo ========================================================
echo.

git branch -M main
git remote set-url origin https://github.com/jeet-chowdhury12/vitality-os.git 2>nul || git remote add origin https://github.com/jeet-chowdhury12/vitality-os.git

echo Uploading commits to GitHub...
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Successfully pushed to GitHub!
    echo Your repository is live at: https://github.com/jeet-chowdhury12/vitality-os
    echo.
    echo Next Step:
    echo Go to your Vercel dashboard (https://vercel.com/dashboard), click "Import Git Repository",
    echo select "vitality-os", and click "Deploy"!
) else (
    echo [NOTE] If a browser login window appeared, please authorize GitHub and run this script again.
)
echo.
pause
