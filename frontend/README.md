# 🌍 Litapack Sismik Analiz - Modern Masaüstü Uygulaması

**Profesyonel sismik veri analizi ve gerçek zamanlı deprem izleme platformu**

## ✨ Özellikler

### 🎯 Temel Fonksiyonlar
- **Gerçek Zamanlı b-Değeri Analizi**: Gutenberg-Richter yasasına göre bölgesel stres hesaplama
- **Zamansal Trend Analizi**: 3 aylık periyotlarla b-değeri değişimini izleme
- **İnteraktif Harita**: Leaflet ile deprem konumlarını görselleştirme
- **Dinamik Filtreler**: Enlem, boylam ve büyüklük bazlı özelleştirilebilir sorgular
- **Bölge Presetleri**: Marmara, Ege, DAF, Akdeniz için hazır filtreler

### 🎨 Kullanıcı Arayüzü
- **Modern Tasarım**: Açık mavi-yeşil renk paleti ile profesyonel görünüm
- **Glassmorphism**: Şeffaf kartlar ve backdrop blur efektleri
- **Animasyonlar**: Framer Motion ile akıcı geçişler
- **Responsive**: Tüm ekran boyutlarına uyumlu tasarım
- **Dark Mode Ready**: Kolay tema değişimi altyapısı

### 📊 Görselleştirmeler
- **Gauge Chart**: Animasyonlu b-değeri göstergesi
- **Trend Grafiği**: Recharts ile interaktif zaman serisi
- **Harita**: React-Leaflet ile coğrafi görselleştirme
- **İstatistikler**: Gerçek zamanlı metrikler ve kartlar

## 🛠️ Teknoloji Yığını

### Frontend
- **React 18** + **TypeScript** - Modern UI framework
- **Vite** - Hızlı build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animasyon kütüphanesi
- **Recharts** - Grafik görselleştirme
- **React-Leaflet** - İnteraktif haritalar
- **Axios** - HTTP client
- **Lucide React** - İkon kütüphanesi

### Desktop
- **Electron** - Masaüstü uygulama paketleme
- **Electron Builder** - Installer oluşturma

### Backend
- **FastAPI** - Python REST API
- **PostgreSQL** + **PostGIS** - Coğrafi veritabanı
- **Pandas** - Veri analizi
- **NumPy** - Bilimsel hesaplamalar

## 📦 Kurulum

### Gereksinimler
- Node.js 18+ 
- Python 3.10+
- PostgreSQL 14+ (PostGIS extension)

### 1. Backend Kurulumu

```bash
# Ana dizine git
cd c:\Users\Victus\Desktop\litpack_sismik

# Python bağımlılıklarını yükle
pip install fastapi uvicorn psycopg2-binary pandas numpy python-dotenv

# Veritabanını başlat (PostgreSQL çalışıyor olmalı)
# İlk kurulum için ingestor.py ile veri yükle
python ingestor.py

# API sunucusunu başlat
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Frontend Kurulumu

```bash
# Frontend dizinine git
cd frontend

# Bağımlılıkları yükle
npm install

# Development modunda çalıştır
npm run dev

# Tarayıcıda otomatik açılır: http://localhost:5173
```

### 3. Electron ile Masaüstü Uygulaması

```bash
# Development modunda (backend çalışıyor olmalı)
npm run electron:dev

# Production build
npm run build
npm run electron:build

# dist-electron klasöründe .exe dosyası oluşur
```

## 🚀 Kullanım

### Development Modu

1. **Backend'i başlat:**
   ```bash
   uvicorn main:app --reload
   ```

2. **Frontend'i başlat:**
   ```bash
   cd frontend
   npm run dev
   ```

3. Tarayıcıda `http://localhost:5173` adresine git

### Production Build

```bash
# Frontend build
cd frontend
npm run build

# Electron ile paketleme
npm run electron:build
```

## 📁 Proje Yapısı

```
litpack_sismik/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI bileşenleri
│   │   │   ├── ui/         # Temel UI bileşenleri
│   │   │   ├── GaugeChart.tsx
│   │   │   ├── EarthquakeMap.tsx
│   │   │   ├── TrendChart.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── services/       # API servisleri
│   │   ├── types/          # TypeScript tipleri
│   │   ├── lib/            # Utility fonksiyonlar
│   │   ├── App.tsx         # Ana uygulama
│   │   └── main.tsx        # Entry point
│   ├── electron/           # Electron yapılandırması
│   ├── package.json
│   └── vite.config.ts
├── main.py                 # FastAPI backend
├── ingestor.py            # Veri toplama
└── dashboard.py           # Eski Streamlit UI (opsiyonel)
```

## 🎨 Renk Paleti

```css
Primary (Cyan):   #06B6D4
Secondary (Emerald): #10B981
Accent (Sky):     #0EA5E9
Background:       #F0FDFA
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
- **b < 0.8**: 🔴 Yüksek stres - Enerji birikimi
- **0.8 ≤ b < 1.0**: 🟡 Dikkat - Normalin üzerinde
- **b ≥ 1.0**: 🟢 Normal stres seviyesi

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

---

**Not:** Production kullanımı için veritabanı şifresini environment variable olarak ayarlayın:
```bash
# .env dosyası oluştur
DB_PASSWORD=your_secure_password
```
