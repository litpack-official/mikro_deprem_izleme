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
    bounds: { minLat: 40.2, maxLat: 41.2, minLon: 26.5, maxLon: 29.5 },
    minMag: 1.5,
    description: 'Kuzey Anadolu Fay Hattı - Yüksek sismik aktivite',
  },
  ege: {
    name: 'Ege Bölgesi',
    bounds: { minLat: 37.0, maxLat: 40.5, minLon: 26.0, maxLon: 30.0 },
    minMag: 1.5,
    description: 'Ege Graben Sistemi - Aktif genişleme bölgesi',
  },
  daf: {
    name: 'Doğu Anadolu Fayı',
    bounds: { minLat: 37.0, maxLat: 39.0, minLon: 36.0, maxLon: 41.0 },
    minMag: 1.5,
    description: 'Doğu Anadolu Fay Zonu - Transform fay sistemi',
  },
  akdeniz: {
    name: 'Batı Akdeniz',
    bounds: { minLat: 35.0, maxLat: 37.0, minLon: 27.0, maxLon: 32.0 },
    minMag: 1.5,
    description: 'Helen Yayı - Yitim zonu aktivitesi',
  },
  turkey: {
    name: 'Tüm Türkiye',
    bounds: { minLat: 36.0, maxLat: 42.0, minLon: 26.0, maxLon: 45.0 },
    minMag: 1.5,
    description: 'Türkiye geneli sismik aktivite',
  },
};
