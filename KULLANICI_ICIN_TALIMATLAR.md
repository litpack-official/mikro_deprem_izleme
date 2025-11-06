# 📱 Litpack Sismik Analiz - Kullanım Talimatları

## ✅ Sistem Durumu

### Nasıl Çalışıyor?

```
[Kullanıcının Bilgisayarı]          [Sizin Bilgisayarınız]
        ↓                                    ↓
   .exe Uygulaması  ←──────────→    Backend API (Port 8000)
   (Sadece Arayüz)      İnternet         ↓
                                    PostgreSQL Veritabanı
                                         ↓
                                    auto_updater.py
                                    (Her 5 dk yeni deprem)
```

## 🎯 Özet Cevaplar

### ✅ EVET - Sizin Veritabanınıza Bağlı
- Kullanıcı uygulamayı açtığında **sizin bilgisayarınızdaki** veritabanına bağlanır
- IP: `172.20.10.2:8000`

### ✅ EVET - Depremler Otomatik Güncellenir
- `auto_updater.py` her 5 dakikada EMSC'den yeni depremleri çeker
- Veritabanına otomatik kaydeder
- Kullanıcının uygulaması her 5 dakikada API'yi çağırır
- Yeni veriler otomatik görünür

## 🚀 Kullanıcı İçin Adımlar

### 1️⃣ Uygulamayı Yükle
```
1. "Litpack Sismik Analiz Setup 3.0.0.exe" dosyasını çift tıkla
2. Kurulum sihirbazını takip et
3. "Kur" butonuna tıkla
4. Masaüstünde kısayol oluşacak
```

### 2️⃣ Uygulamayı Aç
```
1. Masaüstündeki kısayola çift tıkla
2. Uygulama açılacak
3. Veriler yüklenmeye başlayacak
```

### 3️⃣ Kullan
```
- Anlık Analiz: b-değeri göstergesi
- Zamansal Trend: Grafik
- Deprem Tablosu: Detaylı kayıtlar
- Harita: İnteraktif görselleştirme
```

## ⚙️ Sizin İçin Gereksinimler

### Backend'i Çalıştırın (SÜREKLİ AÇIK OLMALI!)

**Terminal 1: Backend API**
```bash
cd c:\Users\Victus\Desktop\litpack_sismik
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Terminal 2: Otomatik Güncelleme**
```bash
cd c:\Users\Victus\Desktop\litpack_sismik
python auto_updater.py
```

**Terminal 3: PostgreSQL**
```bash
# PostgreSQL servisinin çalıştığından emin olun
# Windows Services'te "postgresql" kontrol edin
```

### ⚠️ ÖNEMLİ NOTLAR

**1. Bilgisayarınız Açık Olmalı**
- Kullanıcı uygulamayı kullanırken sizin bilgisayarınız AÇIK olmalı
- Backend çalışıyor olmalı
- PostgreSQL çalışıyor olmalı

**2. Aynı Ağda Olmalısınız**
- Kullanıcı sizinle **aynı WiFi/ağda** olmalı
- Farklı ağdaysa çalışmaz!
- Çözüm: Ngrok veya cloud sunucu

**3. Güvenlik Duvarı**
- Windows Firewall port 8000'i açmalı
- İlk çalıştırmada izin verin

## 🌐 Farklı Ağdaki Kullanıcı İçin

### Seçenek 1: Ngrok (Kolay)

**1. Ngrok İndir:**
```
https://ngrok.com/download
```

**2. Ngrok Başlat:**
```bash
ngrok http 8000
```

**3. URL'i Kopyala:**
```
https://abc123.ngrok.io
```

**4. Frontend'i Güncelle:**
```typescript
// frontend/src/services/api.ts
const API_BASE_URL = 'https://abc123.ngrok.io';
```

**5. Yeni .exe Oluştur:**
```bash
cd frontend
npm run build
npm run electron:build
```

### Seçenek 2: Cloud Sunucu (Profesyonel)

**Backend'i bir sunucuya deploy edin:**
- AWS, DigitalOcean, Heroku vb.
- PostgreSQL + PostGIS
- FastAPI + Uvicorn
- Domain: `api.litpack.com`

**Frontend URL'ini güncelle:**
```typescript
const API_BASE_URL = 'https://api.litpack.com';
```

## 📊 Veri Akışı

### Otomatik Güncelleme Döngüsü

```
1. auto_updater.py çalışıyor (her 5 dk)
   ↓
2. EMSC API'den son 1 saatlik depremler
   ↓
3. PostgreSQL'e kaydet
   ↓
4. Kullanıcının uygulaması (her 5 dk)
   ↓
5. Backend API'ye istek
   ↓
6. Yeni veriler gösterilir
```

### Kullanıcı Ne Görür?

**Otomatik güncellenen:**
- ✅ Yeni depremler (5 dk)
- ✅ b-değeri analizi
- ✅ Trend grafikleri
- ✅ Harita noktaları
- ✅ Tablo kayıtları

**Manuel yenileme:**
- 🔄 Sağ üstteki yenileme butonu
- ⏱️ Son güncelleme zamanı gösterilir

## 🐛 Sorun Giderme

### Kullanıcı "API Bağlantısı Yok" Görüyorsa

**Kontrol edin:**
1. ✅ Sizin bilgisayarınız açık mı?
2. ✅ Backend çalışıyor mu? (`uvicorn main:app...`)
3. ✅ Aynı ağda mısınız?
4. ✅ Firewall port 8000'i engelliyor mu?

**Test edin:**
```bash
# Kullanıcının bilgisayarında
curl http://172.20.10.2:8000

# Veya tarayıcıda
http://172.20.10.2:8000
```

### Veriler Güncellenmiyor

**Kontrol edin:**
1. ✅ `auto_updater.py` çalışıyor mu?
2. ✅ PostgreSQL çalışıyor mu?
3. ✅ EMSC API'ye erişim var mı?

**Logları kontrol edin:**
```bash
# auto_updater.py çıktısına bakın
# "✨ X yeni deprem eklendi" mesajı görmeli
```

## 📝 Özet

### Kullanıcı Tarafı
- ✅ Sadece .exe dosyasını çalıştırır
- ✅ Hiçbir kurulum gerekmez
- ✅ Veriler otomatik güncellenir
- ✅ Her 5 dakikada yeni depremler

### Sizin Tarafınız
- 🖥️ Bilgisayar sürekli açık
- 🔧 Backend çalışıyor (uvicorn)
- 🔄 auto_updater.py çalışıyor
- 💾 PostgreSQL çalışıyor
- 🌐 Aynı ağda veya ngrok

### Veri Güncellemeleri
- ✅ Otomatik (her 5 dk)
- ✅ Gerçek zamanlı
- ✅ Kullanıcı hiçbir şey yapmaz
- ✅ Sizin veritabanınızdan gelir

## 🎉 Sonuç

**EVET, tam olarak istediğiniz gibi çalışıyor:**
1. ✅ Kullanıcı sizin veritabanınıza bağlı
2. ✅ Depremler otomatik güncelleniyor
3. ✅ Kullanıcı sadece uygulamayı açıp kullanıyor
4. ✅ Sizin bilgisayarınız backend görevi görüyor

**Tek gereksinim:**
- Sizin bilgisayarınız açık ve backend çalışıyor olmalı!
