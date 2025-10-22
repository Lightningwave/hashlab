@echo off
REM HashLab Deployment Script for Windows
REM This script will prepare and guide you through deploying to GitHub Pages

echo ==========================================
echo   HashLab - GitHub Pages Deployment
echo ==========================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Git is not installed. Please install git first.
    pause
    exit /b 1
)

echo [OK] Prerequisites check passed
echo.

REM Build WASM
echo Building WASM module...
cd rust-wasm
call wasm-pack build --release --target web --out-dir ..\pkg --out-name rust_wasm
if %ERRORLEVEL% NEQ 0 (
    echo Error: WASM build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] WASM module built successfully
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: npm install failed
    cd ..
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
echo.

REM Build frontend
echo Building frontend...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error: Frontend build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend built successfully
echo.

REM Initialize git if not already
if not exist ".git" (
    echo Initializing git repository...
    git init
    echo [OK] Git repository initialized
    echo.
)

echo ==========================================
echo   Ready to Deploy!
echo ==========================================
echo.
echo Next steps:
echo.
echo 1. Create a GitHub repository:
echo    - Go to https://github.com/new
echo    - Name it 'hashlab' (or your preferred name)
echo    - Don't initialize with README
echo.
echo 2. Run these commands (replace YOUR_USERNAME):
echo.
echo    git add .
echo    git commit -m "Initial commit: HashLab cryptographic tools"
echo    git branch -M main
echo    git remote add origin https://github.com/YOUR_USERNAME/hashlab.git
echo    git push -u origin main
echo.
echo 3. Enable GitHub Pages:
echo    - Go to repository Settings -^> Pages
echo    - Source: Select 'GitHub Actions'
echo.
echo 4. Your site will be live at:
echo    https://YOUR_USERNAME.github.io/hashlab/
echo.
echo ==========================================
echo Build complete! Ready to push to GitHub
echo ==========================================
echo.
pause

