# 📤 GitHub'a Yükleme Adımları

## ✅ Tamamlanan İşlemler

1. ✅ `.gitignore` dosyası oluşturuldu
2. ✅ `README.md` dosyası oluşturuldu
3. ✅ Git repository başlatıldı
4. ✅ Tüm dosyalar commit edildi

## 🚀 GitHub'a Yükleme

### Adım 1: GitHub'da Yeni Repository Oluştur

1. **GitHub'a git:** https://github.com
2. **Sağ üstteki "+" butonuna tıkla** → "New repository"
3. **Repository bilgilerini gir:**
   - **Repository name:** `litpack-sismik`
   - **Description:** `🌍 Modern masaüstü sismik analiz uygulaması - Gerçek zamanlı deprem izleme ve b-değeri analizi`
   - **Public** veya **Private** seç
   - ❌ **"Initialize this repository with a README" seçeneğini İŞARETLEME**
   - ❌ **".gitignore" ekleme**
   - ❌ **"license" ekleme**
4. **"Create repository" butonuna tıkla**

### Adım 2: Local Repository'yi GitHub'a Bağla

GitHub'da repository oluşturduktan sonra gösterilen komutları kullan:

```bash
cd c:\Users\Victus\Desktop\litpack_sismik

# GitHub repository'nizi ekleyin (URL'i kendi repository'nizle değiştirin)
git remote add origin https://github.com/[KULLANICI-ADI]/litpack-sismik.git

# Ana branch'i main olarak ayarla (GitHub standardı)
git branch -M main

# İlk push
git push -u origin main
```

**Örnek:**
```bash
git remote add origin https://github.com/johndoe/litpack-sismik.git
git branch -M main
git push -u origin main
```

### Adım 3: GitHub Kimlik Doğrulama

Push yaparken kimlik doğrulama isteyecek:

**Seçenek 1: Personal Access Token (Önerilen)**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → "Generate new token (classic)"
3. Scope: `repo` seçeneğini işaretle
4. Token'ı kopyala
5. Git push yaparken:
   - Username: GitHub kullanıcı adınız
   - Password: Kopyaladığınız token

**Seçenek 2: GitHub CLI**
```bash
# GitHub CLI yükle
winget install GitHub.cli

# Giriş yap
gh auth login

# Push yap
git push -u origin main
```

## 📝 Sonraki Güncellemeler

Değişiklik yaptıktan sonra:

```bash
# Değişiklikleri ekle
git add .

# Commit yap
git commit -m "Açıklayıcı mesaj"

# GitHub'a push et
git push
```

## 🎯 Repository Ayarları

### README.md'yi Güzelleştir

GitHub repository'nizde README.md otomatik görünecek. İsterseniz:
- Ekran görüntüleri ekleyin
- Badges ekleyin
- Demo linki ekleyin

### Topics Ekle

Repository sayfasında "About" bölümünden topics ekleyin:
- `earthquake`
- `seismology`
- `react`
- `typescript`
- `fastapi`
- `postgresql`
- `electron`
- `desktop-app`
- `data-visualization`

### GitHub Pages (Opsiyonel)

Eğer web versiyonu deploy etmek isterseniz:
1. Settings → Pages
2. Source: GitHub Actions
3. Frontend'i build edip deploy edin

## 📊 Commit Mesajı Örnekleri

İyi commit mesajları:
```bash
git commit -m "feat: Add real-time earthquake auto-update system"
git commit -m "fix: Resolve gauge chart needle overlap issue"
git commit -m "docs: Update README with installation instructions"
git commit -m "style: Improve table UI with color-coded magnitudes"
git commit -m "refactor: Optimize API data fetching with parallel calls"
```

## 🔒 Güvenlik

**ÖNEMLİ:** `.gitignore` dosyası şunları hariç tutuyor:
- ✅ `.env` (veritabanı şifresi)
- ✅ `node_modules/`
- ✅ `__pycache__/`
- ✅ IDE ayarları

**Kontrol edin:**
```bash
# .env dosyasının git'e eklenmediğinden emin olun
git status

# Eğer .env görünüyorsa:
git rm --cached .env
git commit -m "Remove .env from git"
```

## 📦 Release Oluşturma

Stable bir versiyon hazır olduğunda:

1. **Tag oluştur:**
```bash
git tag -a v3.0.0 -m "Release v3.0.0 - Modern Desktop Edition"
git push origin v3.0.0
```

2. **GitHub'da Release oluştur:**
   - Releases → "Create a new release"
   - Tag: v3.0.0
   - Title: "v3.0.0 - Modern Desktop Edition"
   - Description: Özellikler ve değişiklikler
   - Electron build'i (.exe) ekle

## 🎉 Tamamlandı!

Repository başarıyla GitHub'a yüklendi! 

**Repository URL'niz:**
```
https://github.com/[KULLANICI-ADI]/litpack-sismik
```

**Clone komutu:**
```bash
git clone https://github.com/[KULLANICI-ADI]/litpack-sismik.git
```
