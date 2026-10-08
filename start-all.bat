@echo off
title AI-Powered Network Anomaly Detection System
echo ======================================================================
echo   Launching Complete AI-Powered Network Anomaly Detection System
echo ======================================================================
start "1. ML Service (FastAPI :8000)" cmd /k "%~dp0start-ml.bat"
timeout /t 3 /nobreak >nul
start "2. Backend API (Node/Express :5000)" cmd /k "%~dp0start-backend.bat"
timeout /t 2 /nobreak >nul
start "3. Frontend UI (React :5173)" cmd /k "%~dp0start-frontend.bat"
echo.
echo All 3 services launched successfully!
echo Frontend will be accessible at: http://localhost:5173
echo.
