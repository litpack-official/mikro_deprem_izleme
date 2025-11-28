@echo off
chcp 65001 >nul
title Litpack Sismik Analiz - Baslatici
color 0A

echo.
echo ============================================================
echo      LITPACK SISMIK ANALIZ - OTOMATIK BASLATICI
echo ============================================================
echo.

REM Bulundugumuz dizine git
cd /d "%~dp0"

echo [1/4] Python kontrolu...
python --version >nul 2>&1
if errorlevel 1 (
    echo HATA: Python bulunamadi!
    pause
    exit /b 1
)
echo OK Python bulundu

echo.
echo [2/4] Veritabani kontrolu...
if not exist "sismik.db" (
    echo UYARI: Veritabani bulunamadi!
    echo.
    echo Lutfen once VERITABANI_KURULUM.bat dosyasini calistirin.
    echo.
    pause
    exit /b 1
)
echo OK Veritabani bulundu

echo.
echo [3/4] Node.js kontrolu...
node --version >nul 2>&1
if errorlevel 1 (
    echo HATA: Node.js bulunamadi!
    pause
    exit /b 1
)
echo OK Node.js bulundu

echo.
echo [4/4] Servisler baslatiliyor...
echo.

REM Backend'i arka planda baslat
echo Backend baslatiliyor (Port 8000)...
start /B cmd /c "uvicorn main:app --host 127.0.0.1 --port 8000 2>backend_error.log"

REM Backend'in baslamasi icin bekle
timeout /t 5 /nobreak >nul

REM Frontend'i baslat
echo Frontend baslatiliyor (Port 5173)...
cd frontend
start /B cmd /c "npm run dev"

REM Frontend'in baslamasi icin bekle
timeout /t 10 /nobreak >nul

REM Tarayiciyi ac
echo.
echo Tarayici aciliyor...
start http://localhost:5173

echo.
echo ============================================================
echo.
echo UYGULAMA BASLATILDI!
echo.
echo Backend API: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
echo ONEMLI: Bu pencereyi KAPATMAYIN!
echo Kapatirsan uygulama durur.
echo.
echo Uygulamayi kapatmak icin bu pencereyi kapatin veya CTRL+C basin.
echo.
echo ============================================================
echo.

REM Sonsuz dongu - pencere acik kalsin
:loop
timeout /t 60 /nobreak >nul
goto loop
