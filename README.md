# 🌍 Litpack Sismik Analiz - Modern Masaüstü Uygulaması

**Profesyonel sismik veri analizi ve gerçek zamanlı deprem izleme platformu**

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)

## 📸 Ekran Görüntüleri

Modern, profesyonel arayüz ile deprem verilerini analiz edin:
- 📊 Anlık b-değeri analizi (Gutenberg-Richter)
- 📈 Zamansal trend grafikleri
- 🗺️ İnteraktif deprem haritası
- 📋 Detaylı deprem tablosu

## ✨ Özellikler

### 🎯 Temel Fonksiyonlar
- **Gerçek Zamanlı b-Değeri Analizi** - Gutenberg-Richter yasasına göre bölgesel stres hesaplama
- **Zamansal Trend Analizi** - 3 aylık periyotlarla b-değeri değişimini izleme
- **İnteraktif Harita** - Leaflet ile deprem konumlarını görselleştirme
- **Deprem Tablosu** - Detaylı kayıtlar ve filtreleme
- **Otomatik Güncelleme** - Her 5 dakikada bir yeni deprem verisi
- **Dinamik Filtreler** - Enlem, boylam ve büyüklük bazlı özelleştirilebilir sorgular
- **Bölge Presetleri** - Marmara, Ege, DAF, Akdeniz için hazır filtreler

### 🎨 Kullanıcı Arayüzü
- **Modern Tasarım** - Açık mavi-yeşil renk paleti ile profesyonel görünüm
- **Glassmorphism** - Şeffaf kartlar ve backdrop blur efektleri
- **Animasyonlar** - Framer Motion ile akıcı geçişler
- **Responsive** - Tüm ekran boyutlarına uyumlu tasarım
- **Masaüstü Uygulaması** - Electron ile native uygulama

### 📊 Görselleştirmeler
- **Gauge Chart** - Animasyonlu b-değeri göstergesi
- **Trend Grafiği** - Recharts ile interaktif zaman serisi
- **Harita** - React-Leaflet ile coğrafi görselleştirme
- **Tablo** - Renkli büyüklük göstergeleri ile detaylı kayıtlar

## 🛠️ Teknoloji Yığını

### Backend
- **FastAPI** - Modern, hızlı REST API framework
- **PostgreSQL + PostGIS** - Coğrafi veri depolama
- **Pandas** - Zamansal veri analizi
- **NumPy** - Bilimsel hesaplamalar
- **EMSC API** - Deprem verisi kaynağı

### Frontend
- **React 18** + **TypeScript** - Modern UI framework
- **Vite** - Hızlı build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animasyon kütüphanesi
- **Recharts** - Grafik görselleştirme
- **React-Leaflet** - İnteraktif haritalar
- **Electron** - Masaüstü uygulama

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+ (PostGIS extension)

### 1. Repository'yi Klonlayın
```bash
git clone https://github.com/[kullanici-adi]/litpack-sismik.git
cd litpack-sismik
```

### 2. Backend Kurulumu
```bash
# Python bağımlılıklarını yükle
pip install fastapi uvicorn psycopg2-binary pandas numpy python-dotenv python-dateutil requests

# Veritabanını oluştur (PostgreSQL çalışıyor olmalı)
createdb -U postgres sismik_db
psql -U postgres -d sismik_db -c "CREATE EXTENSION postgis;"

# Tablo oluştur
psql -U postgres -d sismik_db -f database_schema.sql

# İlk veri yüklemesi (12 aylık)
python ingestor.py

# API sunucusunu başlat
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Frontend Kurulumu
```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Development modunda çalıştır
npm run dev

# Tarayıcıda otomatik açılır: http://localhost:5173
```

### 4. Otomatik Güncelleme (Opsiyonel)
```bash
# Yeni terminal açın
python auto_updater.py
```

## 🚀 Kullanım

### Development Modu
1. Backend: `uvicorn main:app --reload`
2. Frontend: `cd frontend && npm run dev`
3. Auto-updater: `python auto_updater.py` (opsiyonel)

### Masaüstü Uygulaması
```bash
cd frontend

# Electron ile çalıştır
npm run electron:dev

# Production build
npm run build
npm run electron:build
```

## 📊 API Endpoints

### GET `/b_value`
Anlık b-değeri analizi
- **Parametreler:** `min_lat`, `max_lat`, `min_lon`, `max_lon`, `min_mag`
- **Döner:** b-değeri, deprem sayısı, analiz parametreleri

### GET `/b_value_over_time`
Zamansal trend analizi
- **Parametreler:** `min_lat`, `max_lat`, `min_lon`, `max_lon`, `min_mag`
- **Döner:** 3 aylık periyotlar halinde b-değeri değişimi

### GET `/depremler`
Deprem listesi
- **Parametreler:** `min_lat`, `max_lat`, `min_lon`, `max_lon`, `max_mag`
- **Döner:** Filtrelenmiş deprem verisi (max 1000)

## 🔬 Bilimsel Temel

### Gutenberg-Richter b-Değeri
```
log₁₀(N) = a - b·M
```

**Yorumlama:**
- **b < 0.8** 🔴 Yüksek stres - Enerji birikimi
- **0.8 ≤ b < 1.0** 🟡 Dikkat - Normalin üzerinde
- **b ≥ 1.0** 🟢 Normal stres seviyesi

## 🔄 Otomatik Güncelleme

Sistem her 5 dakikada bir:
1. EMSC API'den son 1 saatlik depremleri çeker
2. Yeni depremleri veritabanına ekler
3. Frontend otomatik olarak yenilenir
4. Kullanıcı manuel yenileyebilir

Detaylı bilgi: [GERCEK_ZAMANLI_GUNCELLEME.md](GERCEK_ZAMANLI_GUNCELLEME.md)

## 📁 Proje Yapısı

```
litpack_sismik/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI bileşenleri
│   │   ├── services/        # API servisleri
│   │   ├── types/           # TypeScript tipleri
│   │   └── lib/             # Utility fonksiyonlar
│   ├── electron/            # Electron yapılandırması
│   └── package.json
├── main.py                  # FastAPI backend
├── ingestor.py             # İlk veri yükleme
├── auto_updater.py         # Otomatik güncelleme servisi
└── README.md
```

## 🎨 Renk Paleti

```css
Primary (Cyan):      #06B6D4
Secondary (Emerald): #10B981
Accent (Sky):        #0EA5E9
Background:          #F0FDFA
```

## 🐛 Sorun Giderme

### Backend bağlantı hatası
```bash
# PostgreSQL çalışıyor mu kontrol et
psql -U postgres -d sismik_db

# API sunucusu çalışıyor mu
curl http://127.0.0.1:8000
```

### Frontend build hatası
```bash
# node_modules temizle ve yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

### CORS hatası
Backend `main.py` dosyasında CORS ayarları yapılandırılmış. Farklı port kullanıyorsanız `allow_origins` listesini güncelleyin.

## 📝 Lisans

Bu proje eğitim ve araştırma amaçlıdır.

## 👨‍💻 Geliştirici

**Litpack Sismik Analiz Ekibi**
- Version: 3.0.0
- Modern Desktop Edition

## 🙏 Teşekkürler

- **EMSC** - Deprem verisi sağlayıcısı
- **React** - UI framework
- **FastAPI** - Backend framework
- **PostgreSQL/PostGIS** - Veritabanı

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

---

**⚠️ Not:** Production kullanımı için veritabanı şifresini environment variable olarak ayarlayın:
```bash
# .env dosyası oluştur
DB_PASSWORD=your_secure_password
```
