# 🌟 Ngrok Pro - Sabit URL Kurulumu

## Neden Ngrok Pro?

**Ücretsiz Plan Sorunu:**
- ❌ Her yeniden başlatmada URL değişir
- ❌ Her URL değişiminde yeni .exe gerekir
- ❌ Kullanıcıya sürekli yeni dosya göndermeniz gerekir

**Pro Plan Avantajı:**
- ✅ Sabit URL (değişmez)
- ✅ Bir kere .exe oluştur, hep çalışır
- ✅ Bilgisayarı yeniden başlatsan bile aynı URL
- ✅ $8/ay

## 📋 Kurulum Adımları

### 1. Ngrok Pro'ya Geçin

1. https://dashboard.ngrok.com/billing/subscription
2. "Pro" planı seçin ($8/ay)
3. Ödeme bilgilerini girin

### 2. Sabit Domain Alın

1. Dashboard → Domains
2. "Create Domain" tıklayın
3. Domain adı seçin (örn: `litpack-api`)
4. Tam domain: `litpack-api.ngrok.app`

### 3. Ngrok'u Sabit Domain ile Başlatın

**Eski komut (URL değişir):**
```bash
ngrok http 8000
```

**Yeni komut (URL sabit):**
```bash
ngrok http 8000 --domain=litpack-api.ngrok.app
```

### 4. Frontend'i Güncelle

```typescript
// frontend/src/services/api.ts
const API_BASE_URL = 'https://litpack-api.ngrok.app';
```

### 5. Son Kez Build Yap

```bash
cd frontend
npm run build
npm run electron:build
```

### 6. .exe'yi Dağıt

Artık bu `.exe` dosyası **HEP ÇALIŞIR**:
- ✅ Bilgisayarı yeniden başlatsan
- ✅ Ngrok'u yeniden başlatsan
- ✅ URL hep aynı kalır

## 🔄 start_all.bat'ı Güncelle

```batch
@echo off
echo Litpack Sismik Analiz - Tum Servisler Baslatiliyor...
echo.

REM Backend API
start "Backend API" cmd /k "cd /d C:\Users\Victus\Desktop\litpack_sismik && uvicorn main:app --host 0.0.0.0 --port 8000"

REM Ngrok (Sabit Domain)
timeout /t 3 /nobreak >nul
start "Ngrok Tunnel" cmd /k "ngrok http 8000 --domain=litpack-api.ngrok.app"

REM Auto Updater
timeout /t 3 /nobreak >nul
start "Auto Updater" cmd /k "cd /d C:\Users\Victus\Desktop\litpack_sismik && python auto_updater.py"

echo.
echo Tum servisler baslatildi!
echo - Backend API: http://127.0.0.1:8000
echo - Ngrok: https://litpack-api.ngrok.app
echo - Auto Updater: Her 5 dakikada guncelleme
echo.
pause
```

## 💰 Maliyet Analizi

**Ngrok Pro:**
- $8/ay = ~₺240/ay (kur: 30 TL)
- Yıllık: ~₺2,880

**Alternatif: Cloud Sunucu**
- DigitalOcean: $6/ay
- Railway: $5/ay
- Ama kurulum daha zor

## 🎯 Özet

**Ngrok Pro ile:**
- ✅ Bir kere .exe oluştur
- ✅ Herkese gönder
- ✅ Sonsuza kadar çalışır
- ✅ URL değişmez
- ✅ Yeni build gerekmez

**Ücretsiz ile:**
- ❌ Her yeniden başlatmada yeni .exe
- ❌ Kullanıcılara sürekli yeni dosya
- ❌ Çok zahmetli
