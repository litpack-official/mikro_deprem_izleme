@echo off
chcp 65001 >nul
title Veritabani Kurulum
color 0B

echo.
echo ============================================================
echo      LITPACK SISMIK - VERITABANI KURULUM
echo ============================================================
echo.

echo Bu script SQLite veritabanini olusturacak ve
echo EMSC'den son 2 gunluk deprem verilerini yukleyecek.
echo.
pause

echo.
echo [1/2] Python kontrolu...
python --version >nul 2>&1
if errorlevel 1 (
    echo HATA: Python bulunamadi!
    echo Lutfen Python 3.10+ yukleyin: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo OK Python bulundu

echo.
echo [2/2] Deprem verileri yukleniyor (bu 1-2 dakika surebilir)...
python ingestor.py
if errorlevel 1 (
    echo HATA: Veri yukleme basarisiz!
    pause
    exit /b 1
)

echo.
echo ============================================================
echo.
echo BASARILI! Veritabani hazir.
echo.
echo Simdi CALISTIR.bat dosyasini calistirabilirsiniz.
echo.
echo ============================================================
echo.
pause
