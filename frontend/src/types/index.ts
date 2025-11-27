/**
 * Type definitions for Litapack Sismik Application
 */

export interface Earthquake {
  event_id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  depth: number;
  magnitude: number;
  location_text: string;
  detailed_location?: string; // Geocoding ile elde edilen detaylı konum
}

export interface BValueAnalysis {
  status: string;
  b_value: number;
  analiz_parametreleri: {
    bolgedeki_toplam_deprem: number;
    analize_giren_deprem_sayisi_N: number;
    min_buyukluk_Mc: number;
  };
}

export interface BValueTrendPoint {
  timestamp: string;
  b_value: number;
  deprem_sayisi_N: number;
}

export interface BValueTrendResponse {
  status: string;
  data: BValueTrendPoint[];
}

export interface EarthquakeResponse {
  status: string;
  data: Earthquake[];
}

export interface RegionBounds {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export interface FilterState {
  latRange: [number, number];
  lonRange: [number, number];
  minMag: number;
  maxMag: number;
  startDate?: string;  // YYYY-MM-DD formatında
  endDate?: string;    // YYYY-MM-DD formatında
}

export interface RegionPreset {
  name: string;
  bounds: RegionBounds;
  minMag: number;
  description: string;
}

export const REGION_PRESETS: Record<string, RegionPreset> = {
  marmara: {
    name: 'Marmara Bölgesi',
    bounds: { minLat: 40.0, maxLat: 41.5, minLon: 26.0, maxLon: 30.0 },
    minMag: 1.5,
    description: 'Kuzey Anadolu Fay Hattı - Yüksek sismik aktivite',
  },
  istanbul: {
    name: 'İstanbul',
    bounds: { minLat: 40.8, maxLat: 41.3, minLon: 28.5, maxLon: 29.5 },
    minMag: 1.0,
    description: 'İstanbul Metropoliten - Kritik sismik bölge',
  },
  tekirdag: {
    name: 'Tekirdağ',
    bounds: { minLat: 40.7, maxLat: 41.2, minLon: 26.8, maxLon: 28.0 },
    minMag: 1.0,
    description: 'Tekirdağ - Marmara Denizi kıyısı',
  },
  canakkale: {
    name: 'Çanakkale',
    bounds: { minLat: 39.8, maxLat: 40.5, minLon: 25.8, maxLon: 27.5 },
    minMag: 1.0,
    description: 'Çanakkale - Ege-Marmara geçiş bölgesi',
  },
  ege: {
    name: 'Ege Bölgesi',
    bounds: { minLat: 37.0, maxLat: 40.5, minLon: 26.0, maxLon: 30.0 },
    minMag: 1.5,
    description: 'Ege Graben Sistemi - Aktif genişleme bölgesi',
  },
  izmir: {
    name: 'İzmir',
    bounds: { minLat: 38.2, maxLat: 38.8, minLon: 26.8, maxLon: 27.5 },
    minMag: 1.0,
    description: 'İzmir Metropoliten - Ege graben sistemi',
  },
  manisa: {
    name: 'Manisa',
    bounds: { minLat: 38.8, maxLat: 39.5, minLon: 27.2, maxLon: 28.5 },
    minMag: 1.0,
    description: 'Manisa - Gediz grabeni',
  },
  aydin: {
    name: 'Aydın',
    bounds: { minLat: 37.5, maxLat: 38.2, minLon: 27.5, maxLon: 28.8 },
    minMag: 1.0,
    description: 'Aydın - Büyük Menderes grabeni',
  },
  mugla: {
    name: 'Muğla',
    bounds: { minLat: 36.5, maxLat: 37.5, minLon: 27.8, maxLon: 29.5 },
    minMag: 1.0,
    description: 'Muğla - Güneybatı Anadolu',
  },
  daf: {
    name: 'Doğu Anadolu Fayı',
    bounds: { minLat: 37.0, maxLat: 39.0, minLon: 36.0, maxLon: 41.0 },
    minMag: 1.5,
    description: 'Sol yanal doğru atım fayı - Yüksek sismik risk',
  },
  elazig: {
    name: 'Elazığ',
    bounds: { minLat: 38.2, maxLat: 38.8, minLon: 38.8, maxLon: 39.8 },
    minMag: 1.0,
    description: 'Elazığ - Doğu Anadolu Fayı üzerinde',
  },
  malatya: {
    name: 'Malatya',
    bounds: { minLat: 37.8, maxLat: 38.5, minLon: 37.5, maxLon: 38.5 },
    minMag: 1.0,
    description: 'Malatya - DAF güney kolu',
  },
  van: {
    name: 'Van',
    bounds: { minLat: 38.2, maxLat: 38.8, minLon: 42.8, maxLon: 43.8 },
    minMag: 1.0,
    description: 'Van - Doğu Anadolu yüksek platosu',
  },
  akdeniz: {
    name: 'Akdeniz Bölgesi',
    bounds: { minLat: 35.0, maxLat: 37.5, minLon: 27.0, maxLon: 36.0 },
    minMag: 1.5,
    description: 'Helen Yayı yitim zonu - Orta sismik aktivite',
  },
  antalya: {
    name: 'Antalya',
    bounds: { minLat: 36.5, maxLat: 37.2, minLon: 30.2, maxLon: 31.5 },
    minMag: 1.0,
    description: 'Antalya - Batı Toroslar',
  },
  mersin: {
    name: 'Mersin',
    bounds: { minLat: 36.2, maxLat: 36.9, minLon: 33.8, maxLon: 35.0 },
    minMag: 1.0,
    description: 'Mersin - Doğu Akdeniz kıyısı',
  },
  adana: {
    name: 'Adana',
    bounds: { minLat: 36.8, maxLat: 37.2, minLon: 34.8, maxLon: 35.5 },
    minMag: 1.0,
    description: 'Adana - Çukurova ovası',
  },
  karadeniz: {
    name: 'Karadeniz Bölgesi',
    bounds: { minLat: 40.5, maxLat: 42.0, minLon: 26.0, maxLon: 42.0 },
    minMag: 1.5,
    description: 'Düşük sismik aktivite - Kararlı bölge',
  },
  samsun: {
    name: 'Samsun',
    bounds: { minLat: 41.0, maxLat: 41.5, minLon: 35.8, maxLon: 36.8 },
    minMag: 1.0,
    description: 'Samsun - Orta Karadeniz kıyısı',
  },
  trabzon: {
    name: 'Trabzon',
    bounds: { minLat: 40.8, maxLat: 41.2, minLon: 39.2, maxLon: 40.2 },
    minMag: 1.0,
    description: 'Trabzon - Doğu Karadeniz',
  },
  ic_anadolu: {
    name: 'İç Anadolu',
    bounds: { minLat: 38.0, maxLat: 40.5, minLon: 30.0, maxLon: 36.0 },
    minMag: 1.5,
    description: 'Orta Anadolu - Düşük-orta sismik aktivite',
  },
  ankara: {
    name: 'Ankara',
    bounds: { minLat: 39.5, maxLat: 40.2, minLon: 32.2, maxLon: 33.2 },
    minMag: 1.0,
    description: 'Ankara - İç Anadolu platosu',
  },
  konya: {
    name: 'Konya',
    bounds: { minLat: 37.5, maxLat: 38.2, minLon: 32.0, maxLon: 33.0 },
    minMag: 1.0,
    description: 'Konya - Konya ovası',
  },
  turkiye: {
    name: 'Türkiye Geneli',
    bounds: { minLat: 36.0, maxLat: 42.0, minLon: 26.0, maxLon: 45.0 },
    minMag: 1.5,
    description: 'Tüm Türkiye - Kapsamlı sismik analiz',
  },
};
