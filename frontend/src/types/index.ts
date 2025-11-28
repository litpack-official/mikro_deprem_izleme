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
  turkiye: {
    name: 'Türkiye Geneli',
    bounds: { minLat: 36.0, maxLat: 42.0, minLon: 26.0, maxLon: 45.0 },
    minMag: 1.5,
    description: 'Tüm Türkiye - Kapsamlı sismik analiz',
  },
  kaf: {
    name: 'Kuzey Anadolu Fayı (KAF)',
    bounds: { minLat: 40.0, maxLat: 41.5, minLon: 26.0, maxLon: 42.0 },
    minMag: 1.5,
    description: 'Kuzey Anadolu Fay Hattı - Sağ yanal doğrultu atımlı fay, yüksek sismik risk',
  },
  daf: {
    name: 'Doğu Anadolu Fayı (DAF)',
    bounds: { minLat: 37.0, maxLat: 39.5, minLon: 36.0, maxLon: 44.0 },
    minMag: 1.5,
    description: 'Doğu Anadolu Fay Hattı - Sol yanal doğrultu atımlı fay, yüksek sismik risk',
  },
  baf: {
    name: 'Batı Anadolu Fayları',
    bounds: { minLat: 37.0, maxLat: 40.5, minLon: 26.0, maxLon: 30.0 },
    minMag: 1.5,
    description: 'Ege Graben Sistemi - Normal faylar, aktif genişleme rejimi',
  },
  kafz: {
    name: 'Kahramanmaraş Fay Zonu',
    bounds: { minLat: 36.5, maxLat: 38.5, minLon: 35.5, maxLon: 38.5 },
    minMag: 1.5,
    description: 'Kahramanmaraş Fay Zonu - Sol yanal doğrultu atımlı fay, DAF ile bağlantılı',
  },
};
