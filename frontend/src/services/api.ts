import axios, { AxiosError } from 'axios';
import type {
  BValueAnalysis,
  BValueTrendResponse,
  EarthquakeResponse,
  RegionBounds,
} from '@/types';

// API URL - Local backend
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for heavy computations
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Ngrok browser warning'i atla
  },
});

/**
 * Error handler for API calls
 */
function handleApiError(error: AxiosError): never {
  if (error.response) {
    const detail = (error.response.data as any)?.detail || 'Bilinmeyen hata';
    throw new Error(`API Hatası: ${detail}`);
  } else if (error.request) {
    throw new Error('API sunucusuna bağlanılamıyor. Lütfen backend servisinin çalıştığından emin olun.');
  } else {
    throw new Error(`İstek hatası: ${error.message}`);
  }
}

/**
 * Fetch instant b-value analysis for a region
 */
export async function fetchBValue(
  bounds: RegionBounds,
  minMag: number
): Promise<BValueAnalysis> {
  try {
    const response = await api.get<BValueAnalysis>('/b_value', {
      params: {
        min_lat: bounds.minLat,
        max_lat: bounds.maxLat,
        min_lon: bounds.minLon,
        max_lon: bounds.maxLon,
        min_mag: minMag,
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
}

/**
 * Fetch b-value trend over time
 */
export async function fetchBValueTrend(
  bounds: RegionBounds,
  minMag: number
): Promise<BValueTrendResponse> {
  try {
    const response = await api.get<BValueTrendResponse>('/b_value_over_time', {
      params: {
        min_lat: bounds.minLat,
        max_lat: bounds.maxLat,
        min_lon: bounds.minLon,
        max_lon: bounds.maxLon,
        min_mag: minMag,
      },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
}

/**
 * Fetch earthquake data for map visualization
 */
export async function fetchEarthquakes(
  bounds: RegionBounds,
  maxMag: number = 9.9,
  startDate?: string,  // YYYY-MM-DD formatında
  endDate?: string     // YYYY-MM-DD formatında
): Promise<EarthquakeResponse> {
  try {
    const params: any = {
      min_lat: bounds.minLat,
      max_lat: bounds.maxLat,
      min_lon: bounds.minLon,
      max_lon: bounds.maxLon,
      max_mag: maxMag,
    };
    
    // Tarih filtrelerini ekle
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get<EarthquakeResponse>('/depremler', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
}

/**
 * Health check for API
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    await api.get('/');
    return true;
  } catch {
    return false;
  }
}
