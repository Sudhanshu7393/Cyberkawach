@echo off
title AI Network Anomaly Detection - ML Microservice
echo ========================================================
echo   Starting Python ML FastAPI Service (Port 8000)...
echo ========================================================
cd /d "%~dp0ml-service"
call .\venv\Scripts\activate.bat
python -m uvicorn app:app --port 8000 --host 127.0.0.1 --reload
pause
