# 💻 Masaüstü Uygulaması Kullanım Kılavuzu

## 📦 Paketleme Tamamlandı!

Electron ile Windows masaüstü uygulaması oluşturuldu.

## 📁 Dosya Konumu

Build tamamlandıktan sonra `.exe` dosyası burada olacak:
```
c:\Users\Victus\Desktop\litpack_sismik\frontend\dist-electron\
```

**Dosya adı:**
```
Litpack Sismik Analiz Setup 3.0.0.exe
```

## 🚀 Kullanıcıya Dağıtım

### 1️⃣ Tek Dosya Gönder
- `Litpack Sismik Analiz Setup 3.0.0.exe` dosyasını kullanıcıya gönderin
- Kullanıcı çift tıklayarak yükleyecek
- Masaüstünde kısayol oluşacak

### 2️⃣ Kullanıcı Gereksinimleri
✅ **Sadece Windows** (64-bit)
❌ **Node.js gerekmez**
❌ **Python gerekmez**
❌ **Hiçbir ek kurulum gerekmez**

### 3️⃣ İlk Çalıştırma
1. `.exe` dosyasını çift tıkla
2. Kurulum sihirbazı açılır
3. "İleri" → "Kur" → "Bitir"
4. Uygulama otomatik açılır

## ⚠️ ÖNEMLİ: Backend Gereksinimi

**Masaüstü uygulaması çalışması için backend API çalışıyor olmalı!**

### Seçenek 1: Yerel Backend (Önerilen)
Kullanıcının bilgisayarında:
```bash
# PostgreSQL kurulu olmalı
# Python kurulu olmalı

# Backend başlat
cd c:\Users\Victus\Desktop\litpack_sismik
uvicorn main:app --host 127.0.0.1 --port 8000
```

### Seçenek 2: Uzak Sunucu (Production)
- Backend'i bir sunucuda çalıştırın (örn: AWS, DigitalOcean)
- Frontend'deki API URL'ini güncelleyin
- Kullanıcı sadece `.exe` çalıştırır

## 🔄 Güncelleme Sistemi

### ❌ Otomatik Güncelleme YOK

**Masaüstü uygulaması güncellenmiyor çünkü:**
- `.exe` dosyası "donmuş" koddur
- GitHub'daki değişiklikler yansımaz
- Her güncelleme için yeni `.exe` gerekir

### ✅ Veri Güncellemeleri OTOMATIK

**Şunlar otomatik güncellenir:**
- ✅ Yeni depremler (auto_updater.py)
- ✅ b-değeri hesaplamaları
- ✅ Harita verileri
- ✅ Tablo kayıtları

**Çünkü:**
- Veriler backend API'den gelir
- Backend sürekli EMSC'den veri çeker
- Frontend her 5 dakikada API'yi çağırır

### 🔄 UI Güncellemesi Gerekirse

**Yeni özellik eklediyseniz:**
1. Kodu güncelleyin
2. Yeni build yapın:
   ```bash
   cd frontend
   npm run build
   npm run electron:build
   ```
3. Yeni `.exe` dosyasını kullanıcıya gönderin
4. Kullanıcı eski uygulamayı kapatıp yenisini yükler

## 📊 Kullanım Senaryoları

### Senaryo 1: Tek Kullanıcı (Siz)
```
1. Backend'i başlatın (uvicorn main:app)
2. auto_updater.py'yi başlatın (opsiyonel)
3. Masaüstü uygulamasını açın
4. Kullanın!
```

### Senaryo 2: Başka Kullanıcıya Verme
```
Seçenek A: Tam Paket
- PostgreSQL kurulum dosyası
- Python kurulum dosyası
- Proje dosyaları (backend)
- .exe dosyası
- Kurulum talimatları

Seçenek B: Sadece Frontend (Backend uzak sunucuda)
- Sadece .exe dosyası
- Backend URL'i ayarlanmış
- Kullanıcı sadece çift tıklar
```

## 🎯 Önerilen Dağıtım Yöntemi

### Production İçin:

**1. Backend'i Sunucuya Deploy Edin**
```bash
# Örnek: DigitalOcean Droplet
# Ubuntu 22.04
# PostgreSQL + PostGIS
# FastAPI + Uvicorn
# Domain: api.litpack.com
```

**2. Frontend API URL'ini Güncelleyin**
```typescript
// frontend/src/services/api.ts
const API_BASE_URL = 'https://api.litpack.com';
```

**3. Yeni Build Yapın**
```bash
npm run build
npm run electron:build
```

**4. .exe'yi Paylaşın**
- Kullanıcı sadece .exe indirir
- Çift tıklar
- Uygulama çalışır
- Backend sunucudan veri çeker

## 📝 Versiyon Yönetimi

### Yeni Versiyon Çıkarma

**1. package.json'da versiyonu artırın:**
```json
{
  "version": "3.1.0"  // 3.0.0'dan 3.1.0'a
}
```

**2. Build yapın:**
```bash
npm run build
npm run electron:build
```

**3. GitHub Release oluşturun:**
```bash
git tag -a v3.1.0 -m "Version 3.1.0"
git push origin v3.1.0
```

**4. .exe'yi GitHub Releases'e yükleyin**

**5. Kullanıcılara duyurun:**
```
Yeni versiyon çıktı!
- İndirin: https://github.com/Burakztrk123/mikro_deprem_izleme/releases
- Eski uygulamayı kapatın
- Yeni .exe'yi çalıştırın
```

## 🔒 Güvenlik

### .exe Dosyası Güvenli mi?

✅ **Evet, güvenlidir çünkü:**
- Kendi kodunuzu paketliyorsunuz
- Virüs/malware yok
- Electron resmi framework

⚠️ **Ama:**
- Windows SmartScreen uyarısı verebilir (imzasız .exe)
- "Bilinmeyen yayıncı" uyarısı normal
- Kullanıcı "Yine de çalıştır" diyebilir

### Dijital İmza (Opsiyonel)

Profesyonel dağıtım için:
```bash
# Code signing certificate alın
# electron-builder ile imzalayın
# SmartScreen uyarısı kalkar
```

## 🎉 Özet

**Kullanıcı için:**
1. `.exe` dosyasını indir
2. Çift tıkla
3. Kur
4. Kullan

**Geliştirici için:**
1. Kod değişikliği yap
2. `npm run build && npm run electron:build`
3. Yeni `.exe`'yi dağıt

**Veri güncellemeleri:**
- ✅ Otomatik (backend sayesinde)
- ✅ Her 5 dakikada yenilenir
- ✅ Kullanıcı hiçbir şey yapmaz

**UI güncellemeleri:**
- ❌ Manuel (yeni .exe gerekir)
- 📦 Yeni versiyon dağıtılır
