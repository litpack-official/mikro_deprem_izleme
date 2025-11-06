# 🚀 Otomatik Başlatma Kurulumu

## ✅ Hazır Dosya Oluşturuldu!

`start_all.bat` dosyası oluşturuldu. Bu dosya tüm servisleri otomatik başlatır:
- Backend API
- Ngrok
- Auto Updater

## 📋 Windows Başlangıcına Ekleme

### Yöntem 1: Startup Klasörü (Önerilen)

1. **Windows + R** tuşlarına basın
2. Şunu yazın: `shell:startup`
3. Enter'a basın (Startup klasörü açılır)
4. `start_all.bat` dosyasının **kısayolunu** bu klasöre kopyalayın

**Kısayol oluşturma:**
- `start_all.bat` dosyasına sağ tıklayın
- "Kısayol oluştur" seçin
- Kısayolu Startup klasörüne taşıyın

Artık bilgisayar açıldığında otomatik başlayacak!

### Yöntem 2: Manuel Başlatma

Her seferinde `start_all.bat` dosyasına çift tıklayın.

## 🔄 Nasıl Çalışır?

**Bilgisayar açıldığında:**
1. Backend API başlar (Port 8000)
2. 3 saniye bekler
3. Ngrok başlar (Tunnel oluşturur)
4. 3 saniye bekler
5. Auto Updater başlar (Her 5 dk güncelleme)

**3 ayrı CMD penceresi açılır:**
- Backend API
- Ngrok (URL'i buradan kopyalayın)
- Auto Updater (Logları gösterir)

## ⚠️ Önemli Notlar

### Ngrok URL'i Değişirse

Bilgisayarı her yeniden başlattığınızda Ngrok yeni URL verir:
```
https://FARKLI-URL.ngrok-free.dev
```

**Yapmanız gerekenler:**
1. Yeni URL'i kopyalayın
2. `frontend/src/services/api.ts` dosyasını açın
3. `API_BASE_URL` satırını güncelleyin
4. Yeni build yapın:
```bash
cd frontend
npm run build
npm run electron:build
```
5. Yeni `.exe`'yi kullanıcıya gönderin

### Sabit URL İçin (Ngrok Pro)

**$8/ay ile:**
```bash
ngrok http 8000 --domain=litpack-api.ngrok.app
```
URL hep aynı kalır, her seferinde yeni build gerekmez!

## 🛑 Servisleri Durdurma

Tüm CMD pencerelerini kapatın veya:
```bash
taskkill /F /IM uvicorn.exe
taskkill /F /IM ngrok.exe
taskkill /F /IM python.exe
```

## 🔍 Sorun Giderme

### Servisler Başlamıyorsa

1. **PostgreSQL çalışıyor mu?**
   - Windows Services → postgresql kontrol edin

2. **Python yolu doğru mu?**
   - CMD'de `python --version` çalışıyor mu?

3. **Ngrok kurulu mu?**
   - CMD'de `ngrok version` çalışıyor mu?

### Auto Updater Çalışmıyor

CMD penceresinde hata mesajlarını kontrol edin:
- PostgreSQL bağlantı hatası
- EMSC API erişim hatası
- Python modül eksik

## 📝 Manuel Kontrol

Servislerin çalışıp çalışmadığını kontrol edin:

```bash
# Backend
curl http://127.0.0.1:8000

# Ngrok
curl https://YOUR-NGROK-URL.ngrok-free.dev

# Auto Updater
# CMD penceresinde log mesajlarını görün
```

## 🎯 Özet

**Artık:**
- ✅ Bilgisayar açıldığında tüm servisler otomatik başlar
- ✅ Auto Updater her 5 dakikada yeni depremleri çeker
- ✅ Kullanıcı uygulamayı açtığında güncel veriler görür
- ✅ Hiçbir şey yapmanıza gerek yok!

**Tek yapmanız gereken:**
- Bilgisayarı açık tutun
- Ngrok URL'i değişirse yeni build yapın (veya Ngrok Pro alın)
