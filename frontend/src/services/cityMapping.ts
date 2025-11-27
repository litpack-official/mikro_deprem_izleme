// Koordinatlara göre şehir tespiti - Offline fallback

interface CityBounds {
  name: string;
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

// Türkiye'nin başlıca şehirleri ve koordinat sınırları
const CITY_BOUNDS: CityBounds[] = [
  // Marmara Bölgesi
  { name: 'İstanbul', minLat: 40.8, maxLat: 41.3, minLon: 28.5, maxLon: 29.5 },
  { name: 'Tekirdağ', minLat: 40.7, maxLat: 41.2, minLon: 26.8, maxLon: 28.0 },
  { name: 'Çanakkale', minLat: 39.8, maxLat: 40.5, minLon: 25.8, maxLon: 27.5 },
  { name: 'Balıkesir', minLat: 39.2, maxLat: 40.0, minLon: 27.5, maxLon: 28.5 },
  { name: 'Bursa', minLat: 40.0, maxLat: 40.5, minLon: 28.8, maxLon: 29.5 },
  { name: 'Kocaeli', minLat: 40.5, maxLat: 41.0, minLon: 29.5, maxLon: 30.5 },
  { name: 'Sakarya', minLat: 40.5, maxLat: 41.0, minLon: 30.0, maxLon: 31.0 },
  { name: 'Yalova', minLat: 40.6, maxLat: 40.8, minLon: 29.2, maxLon: 29.5 },
  { name: 'Kırklareli', minLat: 41.5, maxLat: 42.0, minLon: 26.8, maxLon: 28.0 },
  { name: 'Edirne', minLat: 41.5, maxLat: 42.0, minLon: 26.0, maxLon: 27.0 },

  // Ege Bölgesi
  { name: 'İzmir', minLat: 38.2, maxLat: 38.8, minLon: 26.8, maxLon: 27.5 },
  { name: 'Manisa', minLat: 38.8, maxLat: 39.5, minLon: 27.2, maxLon: 28.5 },
  { name: 'Aydın', minLat: 37.5, maxLat: 38.2, minLon: 27.5, maxLon: 28.8 },
  { name: 'Muğla', minLat: 36.5, maxLat: 37.5, minLon: 27.8, maxLon: 29.5 },
  { name: 'Denizli', minLat: 37.5, maxLat: 38.0, minLon: 28.8, maxLon: 29.5 },
  { name: 'Uşak', minLat: 38.5, maxLat: 39.0, minLon: 29.0, maxLon: 29.8 },
  { name: 'Afyonkarahisar', minLat: 38.5, maxLat: 39.0, minLon: 30.0, maxLon: 31.0 },
  { name: 'Kütahya', minLat: 39.2, maxLat: 39.8, minLon: 29.5, maxLon: 30.2 },

  // Akdeniz Bölgesi
  { name: 'Antalya', minLat: 36.5, maxLat: 37.2, minLon: 30.2, maxLon: 31.5 },
  { name: 'Mersin', minLat: 36.2, maxLat: 36.9, minLon: 33.8, maxLon: 35.0 },
  { name: 'Adana', minLat: 36.8, maxLat: 37.2, minLon: 34.8, maxLon: 35.5 },
  { name: 'Hatay', minLat: 35.8, maxLat: 36.5, minLon: 35.8, maxLon: 36.8 },
  { name: 'Osmaniye', minLat: 37.0, maxLat: 37.5, minLon: 36.0, maxLon: 36.5 },
  { name: 'Kahramanmaraş', minLat: 37.2, maxLat: 37.8, minLon: 36.5, maxLon: 37.5 },
  { name: 'Burdur', minLat: 37.2, maxLat: 37.8, minLon: 29.8, maxLon: 30.8 },
  { name: 'Isparta', minLat: 37.5, maxLat: 38.0, minLon: 30.2, maxLon: 31.0 },

  // İç Anadolu
  { name: 'Ankara', minLat: 39.5, maxLat: 40.2, minLon: 32.2, maxLon: 33.2 },
  { name: 'Konya', minLat: 37.5, maxLat: 38.2, minLon: 32.0, maxLon: 33.0 },
  { name: 'Kayseri', minLat: 38.5, maxLat: 39.0, minLon: 35.2, maxLon: 36.0 },
  { name: 'Sivas', minLat: 39.2, maxLat: 39.8, minLon: 36.8, maxLon: 37.5 },
  { name: 'Yozgat', minLat: 39.5, maxLat: 40.0, minLon: 34.5, maxLon: 35.2 },
  { name: 'Kırıkkale', minLat: 39.5, maxLat: 40.0, minLon: 33.2, maxLon: 34.0 },
  { name: 'Çankırı', minLat: 40.3, maxLat: 40.8, minLon: 33.2, maxLon: 34.0 },
  { name: 'Karaman', minLat: 37.0, maxLat: 37.5, minLon: 32.8, maxLon: 33.5 },
  { name: 'Aksaray', minLat: 38.2, maxLat: 38.8, minLon: 33.8, maxLon: 34.5 },
  { name: 'Nevşehir', minLat: 38.5, maxLat: 39.0, minLon: 34.5, maxLon: 35.2 },
  { name: 'Niğde', minLat: 37.8, maxLat: 38.2, minLon: 34.5, maxLon: 35.0 },

  // Karadeniz Bölgesi
  { name: 'Samsun', minLat: 41.0, maxLat: 41.5, minLon: 35.8, maxLon: 36.8 },
  { name: 'Trabzon', minLat: 40.8, maxLat: 41.2, minLon: 39.2, maxLon: 40.2 },
  { name: 'Ordu', minLat: 40.8, maxLat: 41.0, minLon: 37.5, maxLon: 38.2 },
  { name: 'Giresun', minLat: 40.8, maxLat: 41.0, minLon: 38.2, maxLon: 39.0 },
  { name: 'Rize', minLat: 40.8, maxLat: 41.2, minLon: 40.2, maxLon: 41.0 },
  { name: 'Artvin', minLat: 41.0, maxLat: 41.5, minLon: 41.5, maxLon: 42.5 },
  { name: 'Sinop', minLat: 41.8, maxLat: 42.2, minLon: 34.8, maxLon: 35.5 },
  { name: 'Kastamonu', minLat: 41.2, maxLat: 41.8, minLon: 33.5, maxLon: 34.5 },
  { name: 'Çorum', minLat: 40.2, maxLat: 40.8, minLon: 34.5, maxLon: 35.2 },
  { name: 'Amasya', minLat: 40.5, maxLat: 40.8, minLon: 35.5, maxLon: 36.2 },
  { name: 'Tokat', minLat: 40.2, maxLat: 40.5, minLon: 36.2, maxLon: 37.0 },
  { name: 'Zonguldak', minLat: 41.2, maxLat: 41.8, minLon: 31.5, maxLon: 32.5 },
  { name: 'Bartın', minLat: 41.5, maxLat: 41.8, minLon: 32.2, maxLon: 32.8 },
  { name: 'Karabük', minLat: 41.0, maxLat: 41.5, minLon: 32.5, maxLon: 33.2 },
  { name: 'Bolu', minLat: 40.5, maxLat: 41.0, minLon: 31.2, maxLon: 32.0 },
  { name: 'Düzce', minLat: 40.5, maxLat: 41.0, minLon: 30.8, maxLon: 31.5 },

  // Doğu Anadolu
  { name: 'Erzurum', minLat: 39.5, maxLat: 40.0, minLon: 41.0, maxLon: 42.0 },
  { name: 'Van', minLat: 38.2, maxLat: 38.8, minLon: 42.8, maxLon: 43.8 },
  { name: 'Elazığ', minLat: 38.2, maxLat: 38.8, minLon: 38.8, maxLon: 39.8 },
  { name: 'Malatya', minLat: 37.8, maxLat: 38.5, minLon: 37.5, maxLon: 38.5 },
  { name: 'Diyarbakır', minLat: 37.8, maxLat: 38.2, minLon: 39.8, maxLon: 40.5 },
  { name: 'Şanlıurfa', minLat: 37.0, maxLat: 37.5, minLon: 38.5, maxLon: 39.5 },
  { name: 'Gaziantep', minLat: 36.8, maxLat: 37.2, minLon: 37.2, maxLon: 38.0 },
  { name: 'Kilis', minLat: 36.5, maxLat: 37.0, minLon: 37.0, maxLon: 37.5 },
  { name: 'Mardin', minLat: 37.2, maxLat: 37.5, minLon: 40.5, maxLon: 41.5 },
  { name: 'Batman', minLat: 37.8, maxLat: 38.2, minLon: 41.0, maxLon: 41.8 },
  { name: 'Siirt', minLat: 37.8, maxLat: 38.2, minLon: 41.8, maxLon: 42.5 },
  { name: 'Şırnak', minLat: 37.2, maxLat: 37.8, minLon: 42.2, maxLon: 43.0 },
  { name: 'Hakkari', minLat: 37.2, maxLat: 37.8, minLon: 43.5, maxLon: 44.5 },
  { name: 'Ağrı', minLat: 39.5, maxLat: 40.0, minLon: 43.0, maxLon: 44.0 },
  { name: 'Iğdır', minLat: 39.8, maxLat: 40.2, minLon: 43.8, maxLon: 44.5 },
  { name: 'Kars', minLat: 40.5, maxLat: 41.0, minLon: 42.8, maxLon: 43.5 },
  { name: 'Ardahan', minLat: 41.0, maxLat: 41.5, minLon: 42.5, maxLon: 43.2 },
  { name: 'Erzincan', minLat: 39.5, maxLat: 40.0, minLon: 39.2, maxLon: 40.0 },
  { name: 'Tunceli', minLat: 39.0, maxLat: 39.5, minLon: 39.2, maxLon: 40.0 },
  { name: 'Bingöl', minLat: 38.8, maxLat: 39.2, minLon: 40.2, maxLon: 41.0 },
  { name: 'Muş', minLat: 38.5, maxLat: 39.0, minLon: 41.2, maxLon: 42.0 },
  { name: 'Bitlis', minLat: 38.2, maxLat: 38.8, minLon: 42.0, maxLon: 42.8 },

  // Güneydoğu Anadolu
  { name: 'Adıyaman', minLat: 37.5, maxLat: 38.0, minLon: 37.8, maxLon: 38.8 }
];

// Koordinatlara göre şehir tespit et
export function detectCityByCoordinates(lat: number, lon: number): string | null {
  for (const city of CITY_BOUNDS) {
    if (lat >= city.minLat && lat <= city.maxLat && 
        lon >= city.minLon && lon <= city.maxLon) {
      return city.name;
    }
  }
  return null;
}

// Koordinatlara göre bölge tespit et
export function detectRegionByCoordinates(lat: number, lon: number): string {
  // Önce şehir tespit et
  const city = detectCityByCoordinates(lat, lon);
  if (city) {
    return city;
  }

  // Şehir bulunamazsa bölge tespit et
  if (lat >= 40.0 && lat <= 42.0 && lon >= 26.0 && lon <= 30.0) {
    return 'Marmara Bölgesi';
  }
  if (lat >= 37.0 && lat <= 40.5 && lon >= 26.0 && lon <= 30.0) {
    return 'Ege Bölgesi';
  }
  if (lat >= 35.0 && lat <= 37.5 && lon >= 27.0 && lon <= 36.0) {
    return 'Akdeniz Bölgesi';
  }
  if (lat >= 40.5 && lat <= 42.0 && lon >= 26.0 && lon <= 42.0) {
    return 'Karadeniz Bölgesi';
  }
  if (lat >= 38.0 && lat <= 40.5 && lon >= 30.0 && lon <= 36.0) {
    return 'İç Anadolu Bölgesi';
  }
  if (lat >= 37.0 && lat <= 40.0 && lon >= 36.0 && lon <= 45.0) {
    return 'Doğu Anadolu Bölgesi';
  }
  if (lat >= 36.0 && lat <= 38.0 && lon >= 37.0 && lon <= 43.0) {
    return 'Güneydoğu Anadolu Bölgesi';
  }

  return 'Türkiye';
}

// Gelişmiş konum formatlaması
export function formatLocationName(lat: number, lon: number, apiResult?: string): string {
  // Önce API sonucunu kontrol et
  if (apiResult && apiResult !== 'Konum alınamadı' && apiResult !== 'Konum bulunamadı') {
    return apiResult;
  }

  // API başarısızsa koordinat tabanlı tespit kullan
  const city = detectCityByCoordinates(lat, lon);
  if (city) {
    return city;
  }

  // Şehir bulunamazsa bölge döndür
  const region = detectRegionByCoordinates(lat, lon);
  return region;
}
