# 🌐 Ngrok ile Uzaktan Erişim

## Kullanıcı Farklı Ağdaysa (Farklı WiFi/Şehir/Ülke)

### 1️⃣ Ngrok Kurulumu

**İndir:**
```
https://ngrok.com/download
```

**Ücretsiz hesap aç:**
```
https://dashboard.ngrok.com/signup
```

**Authtoken al:**
```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

### 2️⃣ Backend'i Ngrok ile Yayınla

**Terminal 1: Backend**
```bash
cd c:\Users\Victus\Desktop\litpack_sismik
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Terminal 2: Ngrok**
```bash
ngrok http 8000
```

**Çıktı:**
```
Session Status: online
Forwarding: https://abc123.ngrok-free.app -> http://localhost:8000
```

### 3️⃣ Frontend'i Güncelle

**frontend/src/services/api.ts:**
```typescript
// Ngrok URL'inizi buraya yapıştırın
const API_BASE_URL = 'https://abc123.ngrok-free.app';
```

### 4️⃣ Yeni .exe Oluştur

```bash
cd frontend
npm run build
npm run electron:build
```

### 5️⃣ Kullanıcıya Ver

Artık kullanıcı:
- ✅ Dünyanın her yerinden bağlanabilir
- ✅ Farklı WiFi'de olabilir
- ✅ Farklı şehirde olabilir
- ✅ Sizin bilgisayarınız açık olduğu sürece çalışır

## ⚠️ Ngrok Sınırlamaları

**Ücretsiz Plan:**
- ✅ 1 ngrok URL
- ✅ Sınırsız bağlantı
- ❌ URL her yeniden başlatmada değişir
- ❌ Statik domain yok

**Ücretli Plan ($8/ay):**
- ✅ Sabit URL (değişmez)
- ✅ Özel domain
- ✅ Daha hızlı

## 🔄 Her Seferinde Yapılacaklar

**1. Backend'i başlat:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

**2. Ngrok'u başlat:**
```bash
ngrok http 8000
```

**3. Yeni URL'i kopyala:**
```
https://xyz789.ngrok-free.app
```

**4. Frontend'i güncelle ve build et:**
```bash
# api.ts'de URL'i değiştir
npm run build
npm run electron:build
```

**5. Yeni .exe'yi kullanıcıya gönder**

## 💡 Sabit URL İçin (Ücretli)

**Ngrok Pro ile:**
```bash
ngrok http 8000 --domain=litpack-api.ngrok.app
```

Artık URL hep aynı kalır, her seferinde yeni .exe gerekmez!
