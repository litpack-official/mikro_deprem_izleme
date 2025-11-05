# 🔄 Gerçek Zamanlı Deprem Güncelleme Sistemi

## 📋 Sistem Mimarisi

### 1️⃣ Backend Otomatik Güncelleme (`auto_updater.py`)
- **Görev**: EMSC API'den her 5 dakikada bir yeni depremleri çeker
- **Kapsam**: Son 1 saatlik Türkiye depremleri
- **Çalışma**: Arka planda sürekli çalışır

### 2️⃣ Frontend Otomatik Yenileme
- **Görev**: Her 5 dakikada bir API'den veri çeker
- **Özellik**: Manuel yenileme butonu
- **Gösterge**: Son güncelleme zamanı

## 🚀 Kullanım

### Adım 1: Otomatik Güncelleyiciyi Başlat

Yeni bir terminal açın:

```bash
cd c:\Users\Victus\Desktop\litpack_sismik
python auto_updater.py
```

**Çıktı:**
```
🚀 Litpack Sismik - Otomatik Güncelleme Servisi Başlatıldı
⏱️ Güncelleme aralığı: 300 saniye (5.0 dakika)
============================================================

🔄 [2025-11-05 16:48:00] Güncelleme başlatılıyor...
✅ EMSC'den 15 deprem kaydı alındı
✨ 3 yeni deprem veritabanına eklendi!
⏳ Sonraki güncelleme: 300 saniye sonra...
```

### Adım 2: Backend API'yi Çalıştır

```bash
uvicorn main:app --reload
```

### Adım 3: Frontend'i Başlat

```bash
cd frontend
npm run dev
```

## ✨ Özellikler

### Otomatik Güncelleme
- ⏰ **5 dakikada bir** otomatik veri çekme
- 🔄 **Arka planda** sürekli çalışır
- 📊 **Yeni depremler** otomatik veritabanına eklenir
- 🚫 **Tekrar önleme** - Aynı deprem 2 kez eklenmez

### Manuel Yenileme
- 🔄 **Yenile Butonu** - Header'da refresh ikonu
- ⏱️ **Son Güncelleme** - Zamanı gösterir
- 🔵 **Animasyon** - Yüklenirken dönen ikon

### Akıllı Sistem
- 🌐 **API Bağlantı Kontrolü** - 30 saniyede bir
- ⚠️ **Hata Yönetimi** - Bağlantı hatalarında otomatik tekrar
- 📝 **Loglama** - Tüm işlemler konsola yazılır

## 🔧 Ayarlar

### Güncelleme Aralığını Değiştirme

**Backend (`auto_updater.py`):**
```python
UPDATE_INTERVAL = 300  # 5 dakika (saniye)
# Örnek: 180 = 3 dakika, 600 = 10 dakika
```

**Frontend (`App.tsx`):**
```typescript
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 dakika
// Örnek: 3 * 60 * 1000 = 3 dakika
```

### Veri Kapsam Değiştirme

**`auto_updater.py` - Zaman aralığı:**
```python
one_hour_ago = now - timedelta(hours=1)  # Son 1 saat
# Örnek: timedelta(hours=2) = Son 2 saat
```

## 📊 Veri Akışı

```
EMSC API
   ↓
auto_updater.py (Her 5 dk)
   ↓
PostgreSQL Veritabanı
   ↓
FastAPI Backend
   ↓
React Frontend (Her 5 dk otomatik yenileme)
   ↓
Kullanıcı Arayüzü
```

## 🎯 Production Kullanımı

### Windows Servisi Olarak Çalıştırma

1. **NSSM (Non-Sucking Service Manager) İndir:**
   ```
   https://nssm.cc/download
   ```

2. **Servis Oluştur:**
   ```bash
   nssm install LitpackAutoUpdater
   # Path: C:\Python312\python.exe
   # Arguments: C:\Users\Victus\Desktop\litpack_sismik\auto_updater.py
   # Startup directory: C:\Users\Victus\Desktop\litpack_sismik
   ```

3. **Servisi Başlat:**
   ```bash
   nssm start LitpackAutoUpdater
   ```

### Linux/Mac Cron Job

```bash
# Crontab düzenle
crontab -e

# Her 5 dakikada bir çalıştır
*/5 * * * * cd /path/to/litpack_sismik && python3 auto_updater.py
```

## 🐛 Sorun Giderme

### Auto Updater Çalışmıyor
```bash
# Veritabanı bağlantısını kontrol et
psql -U postgres -d sismik_db

# Python bağımlılıklarını kontrol et
pip install requests psycopg2-binary python-dateutil python-dotenv
```

### Frontend Yenilenmiyor
- Tarayıcı konsolunu açın (F12)
- `🔄 Otomatik veri yenileme...` mesajını kontrol edin
- API bağlantısını kontrol edin

### Yeni Depremler Görünmüyor
- `auto_updater.py` çalışıyor mu kontrol edin
- Backend API çalışıyor mu kontrol edin
- Veritabanında yeni kayıtlar var mı kontrol edin:
  ```sql
  SELECT COUNT(*) FROM earthquakes 
  WHERE timestamp > NOW() - INTERVAL '1 hour';
  ```

## 📝 Notlar

- ⚠️ EMSC API'yi yormamak için 5 dakikadan daha sık güncelleme önerilmez
- 💾 Veritabanı boyutu zamanla büyür, periyodik temizleme yapılabilir
- 🔒 Production'da DB şifresini environment variable olarak kullanın
- 📊 Logları izleyerek sistem sağlığını kontrol edin

## 🎉 Sonuç

Artık masaüstü uygulamanız:
- ✅ Her 5 dakikada otomatik güncellenir
- ✅ Yeni depremler anında veritabanına eklenir
- ✅ Kullanıcı manuel yenileyebilir
- ✅ Son güncelleme zamanını gösterir
- ✅ Arka planda sürekli çalışır
