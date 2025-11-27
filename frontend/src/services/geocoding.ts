// Koordinatları şehir/ilçe ismine çeviren servis
import { formatLocationName } from './cityMapping';

// OpenStreetMap Nominatim API kullanarak reverse geocoding
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1&accept-language=tr`,
      {
        headers: {
          'User-Agent': 'LitpackSismikAnaliz/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding API hatası');
    }

    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      
      // Türkiye için uygun alanları seç
      const city = address.city || address.town || address.village || address.municipality;
      const district = address.district || address.county || address.suburb;
      const province = address.province || address.state;
      
      // Formatla
      let location = '';
      
      if (city && province) {
        if (district && district !== city) {
          location = `${city}, ${district}, ${province}`;
        } else {
          location = `${city}, ${province}`;
        }
      } else if (province) {
        location = province;
      } else if (city) {
        location = city;
      } else {
        // Display name'den şehir/il çıkarmaya çalış
        const parts = data.display_name?.split(',') || [];
        const cleanParts = parts.map((p: string) => p.trim()).filter((p: string) => p && p !== 'Türkiye' && p !== 'Turkey');
        location = cleanParts.slice(0, 2).join(', ') || 'Bilinmiyor';
      }
      
      return location;
    }
    
    // API başarısız olursa offline fallback kullan
    return formatLocationName(lat, lon);
  } catch (error) {
    console.error('Geocoding hatası:', error);
    // Hata durumunda da offline fallback kullan
    return formatLocationName(lat, lon);
  }
}

// Batch geocoding - birden fazla koordinat için
export async function batchReverseGeocode(coordinates: Array<{lat: number, lon: number, id: string}>): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  
  // Rate limiting için delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  for (const coord of coordinates) {
    try {
      const location = await reverseGeocode(coord.lat, coord.lon);
      results.set(coord.id, location);
      
      // API rate limit için 500ms bekle
      await delay(500);
    } catch (error) {
      console.error(`Geocoding hatası ${coord.id}:`, error);
      results.set(coord.id, 'Konum alınamadı');
    }
  }
  
  return results;
}

// Cache için localStorage kullan
const GEOCODING_CACHE_KEY = 'geocoding_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 saat

interface CacheEntry {
  location: string;
  timestamp: number;
}

export function getCachedLocation(lat: number, lon: number): string | null {
  try {
    const cache = JSON.parse(localStorage.getItem(GEOCODING_CACHE_KEY) || '{}');
    const key = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
    const entry: CacheEntry = cache[key];
    
    if (entry && (Date.now() - entry.timestamp) < CACHE_EXPIRY) {
      return entry.location;
    }
    
    return null;
  } catch {
    return null;
  }
}

export function setCachedLocation(lat: number, lon: number, location: string): void {
  try {
    const cache = JSON.parse(localStorage.getItem(GEOCODING_CACHE_KEY) || '{}');
    const key = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
    
    cache[key] = {
      location,
      timestamp: Date.now()
    };
    
    localStorage.setItem(GEOCODING_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Cache kaydetme hatası:', error);
  }
}

// Cache'li reverse geocoding
export async function reverseGeocodeWithCache(lat: number, lon: number): Promise<string> {
  // Önce cache'e bak
  const cached = getCachedLocation(lat, lon);
  if (cached) {
    return cached;
  }
  
  // Cache'de yoksa önce offline fallback dene
  const offlineLocation = formatLocationName(lat, lon);
  
  // Eğer offline'da şehir bulunduysa onu kullan (API'ye gerek yok)
  if (offlineLocation && offlineLocation !== 'Türkiye' && !offlineLocation.includes('Bölgesi')) {
    setCachedLocation(lat, lon, offlineLocation);
    return offlineLocation;
  }
  
  // Offline'da bulunamazsa API'yi dene
  try {
    const location = await reverseGeocode(lat, lon);
    setCachedLocation(lat, lon, location);
    return location;
  } catch (error) {
    // API başarısızsa offline sonucu döndür
    setCachedLocation(lat, lon, offlineLocation);
    return offlineLocation;
  }
}
