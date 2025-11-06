# 🚀 Ngrok ile Dünyanın Her Yerinden Erişim

## ✅ Yapılandırma Tamamlandı!

Artık kullanıcı **dünyanın her yerinden** uygulamanıza bağlanabilir!

## 📋 Adım Adım Kurulum

### 1️⃣ Ngrok İndir ve Kur

**İndirme linki açıldı tarayıcınızda.**

1. "Download for Windows" butonuna tıklayın
2. `ngrok-v3-stable-windows-amd64.zip` indirilecek
3. ZIP'i açın
4. `ngrok.exe` dosyasını `C:\ngrok\` klasörüne koyun

### 2️⃣ Ngrok Hesabı Oluştur

1. https://dashboard.ngrok.com/signup
2. Email ile ücretsiz hesap oluşturun
3. Dashboard'a giriş yapın

### 3️⃣ Authtoken Ayarla

Dashboard'da "Your Authtoken" bölümünü bulun ve kopyalayın.

**Terminal açın ve çalıştırın:**
```bash
C:\ngrok\ngrok.exe config add-authtoken YOUR_TOKEN_HERE
```

### 4️⃣ Backend'i Başlat

**Terminal 1:**
```bash
cd c:\Users\Victus\Desktop\litpack_sismik
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 5️⃣ Ngrok'u Başlat

**Terminal 2 (YENİ TERMINAL):**
```bash
C:\ngrok\ngrok.exe http 8000
```

**Çıktıda göreceksiniz:**
```
Session Status: online
Forwarding: https://abc123-456-789.ngrok-free.app -> http://localhost:8000
```

### 6️⃣ URL'i Kopyala ve Ayarla

**Ngrok URL'inizi kopyalayın** (örnek: `https://abc123-456-789.ngrok-free.app`)

**`.env.production` dosyasını düzenleyin:**
```bash
# frontend/.env.production
VITE_API_BASE_URL=https://abc123-456-789.ngrok-free.app
```

### 7️⃣ Yeni .exe Oluştur

```bash
cd frontend
npm run build
npm run electron:build
```

### 8️⃣ Kullanıcıya Gönder

`.exe` dosyası burada:
```
frontend\dist-electron\Litpack Sismik Analiz Setup 3.0.0.exe
```

## 🎉 Tamamlandı!

Artık kullanıcı:
- ✅ Dünyanın her yerinden bağlanabilir
- ✅ Farklı WiFi'de olabilir
- ✅ Farklı şehir/ülkede olabilir
- ✅ Sizin bilgisayarınız açık olduğu sürece çalışır

## 🔄 Her Seferinde Yapılacaklar

**Ngrok ücretsiz planda her yeniden başlatmada URL değişir!**

### Senaryo 1: URL Değişti

1. Ngrok'u yeniden başlattınız
2. Yeni URL aldınız: `https://xyz789.ngrok-free.app`
3. `.env.production` dosyasını güncelleyin
4. Yeni build yapın: `npm run build && npm run electron:build`
5. Yeni `.exe`'yi kullanıcıya gönderin

### Senaryo 2: Sabit URL İstiyorsanız

**Ngrok Pro ($8/ay):**
```bash
C:\ngrok\ngrok.exe http 8000 --domain=litpack-api.ngrok.app
```

Artık URL hep aynı kalır, her seferinde yeni `.exe` gerekmez!

## 📊 Çalışma Şekli

```
[Kullanıcı - İstanbul]
        ↓
   .exe Uygulaması
        ↓
https://abc123.ngrok-free.app (İnternet)
        ↓
   Ngrok Sunucuları
        ↓
   Sizin Bilgisayarınız (Ankara)
        ↓
Backend API (Port 8000)
        ↓
PostgreSQL Veritabanı
```

## ⚠️ Önemli Notlar

### Sizin Bilgisayarınızda Çalışması Gerekenler:

**1. Backend API:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

**2. Ngrok:**
```bash
C:\ngrok\ngrok.exe http 8000
```

**3. Otomatik Güncelleme (Opsiyonel):**
```bash
python auto_updater.py
```

**4. PostgreSQL:**
- Servis çalışıyor olmalı

### Bilgisayarınız:
- ✅ Açık olmalı
- ✅ İnternet bağlantısı olmalı
- ❌ Aynı ağda olmanız gerekmez!

## 🐛 Sorun Giderme

### Ngrok "command not found"

```bash
# Tam yol ile çalıştırın
C:\ngrok\ngrok.exe http 8000

# Veya PATH'e ekleyin
setx PATH "%PATH%;C:\ngrok"
```

### URL Değişti, Ne Yapmalıyım?

1. Yeni URL'i kopyalayın
2. `.env.production` güncelleyin
3. Build yapın
4. Yeni `.exe`'yi gönderin

### Kullanıcı "API Bağlantısı Yok" Görüyor

**Kontrol edin:**
1. ✅ Backend çalışıyor mu?
2. ✅ Ngrok çalışıyor mu?
3. ✅ `.env.production`'da doğru URL var mı?
4. ✅ Yeni build yaptınız mı?

**Test edin:**
```bash
# Tarayıcıda açın
https://YOUR-NGROK-URL.ngrok-free.app
```

## 💡 İpuçları

### 1. Ngrok'u Arka Planda Çalıştır

```bash
# Windows Task Scheduler ile otomatik başlat
# Veya startup'a ekle
```

### 2. Sabit URL İçin Ngrok Pro

- $8/ay
- Sabit domain
- Her seferinde yeni `.exe` gerekmez

### 3. Alternatif: Cloud Sunucu

- DigitalOcean, AWS, Railway
- Bilgisayarınız kapalı olabilir
- Daha profesyonel

## 📝 Hızlı Komutlar

```bash
# Backend başlat
uvicorn main:app --host 0.0.0.0 --port 8000

# Ngrok başlat
C:\ngrok\ngrok.exe http 8000

# URL'i .env.production'a yaz
# Örnek: VITE_API_BASE_URL=https://abc123.ngrok-free.app

# Build yap
cd frontend
npm run build
npm run electron:build

# .exe'yi gönder
# frontend\dist-electron\Litpack Sismik Analiz Setup 3.0.0.exe
```

## 🎯 Özet

**Artık:**
- ✅ Kullanıcı dünyanın her yerinden bağlanabilir
- ✅ Aynı ağda olmanız gerekmez
- ✅ Depremler otomatik güncellenir
- ✅ Sizin veritabanınızı kullanır

**Tek gereksinim:**
- Sizin bilgisayarınız açık ve backend + ngrok çalışıyor olmalı!
