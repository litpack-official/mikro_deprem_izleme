@echo off
echo Litpack Sismik Analiz - Tum Servisler Baslatiliyor...
echo.

REM Backend API
start "Backend API" cmd /k "cd /d C:\Users\Victus\Desktop\litpack_sismik && uvicorn main:app --host 0.0.0.0 --port 8000"

REM Ngrok
timeout /t 3 /nobreak >nul
start "Ngrok Tunnel" cmd /k "ngrok http 8000"

REM Auto Updater
timeout /t 3 /nobreak >nul
start "Auto Updater" cmd /k "cd /d C:\Users\Victus\Desktop\litpack_sismik && python auto_updater.py"

echo.
echo Tum servisler baslatildi!
echo - Backend API: http://127.0.0.1:8000
echo - Ngrok: Pencereyi kontrol edin
echo - Auto Updater: Her 5 dakikada guncelleme
echo.
pause
