import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { GaugeChart } from './components/GaugeChart';
import { EarthquakeMap } from './components/EarthquakeMap';
import { TrendChart } from './components/TrendChart';
import { fetchBValue, fetchBValueTrend, fetchEarthquakes, checkApiHealth } from './services/api';
import type { FilterState, RegionPreset, BValueAnalysis, BValueTrendResponse, EarthquakeResponse } from './types';
import { Activity, TrendingUp, Map as MapIcon, AlertCircle, Wifi, WifiOff, Table, RefreshCw, FileDown } from 'lucide-react';
import { formatNumber } from './lib/utils';
import { generatePDFReport } from '@/utils/pdfGenerator';
import { reverseGeocodeWithCache } from '@/services/geocoding';

function App() {
  // State Management
  const [filters, setFilters] = useState<FilterState>({
    latRange: [36.0, 42.0],
    lonRange: [26.0, 45.0],
    minMag: 1.5,
    maxMag: 9.9,
  });

  const [activeTab, setActiveTab] = useState<'instant' | 'trend' | 'table'>('instant');
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Data State
  const [bValueData, setBValueData] = useState<BValueAnalysis | null>(null);
  const [trendData, setTrendData] = useState<BValueTrendResponse | null>(null);
  const [earthquakeData, setEarthquakeData] = useState<EarthquakeResponse | null>(null);

  // Check API Health on Mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkApiHealth();
      setApiConnected(isHealthy);
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  // Fetch Data
  const loadData = async () => {
    if (!apiConnected) {
      setError('API sunucusuna bağlanılamıyor. Lütfen backend servisinin çalıştığından emin olun.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bounds = {
        minLat: filters.latRange[0],
        maxLat: filters.latRange[1],
        minLon: filters.lonRange[0],
        maxLon: filters.lonRange[1],
      };

      // Parallel data fetching for better performance
      const [bValue, trend, earthquakes] = await Promise.all([
        fetchBValue(bounds, filters.minMag),
        fetchBValueTrend(bounds, filters.minMag),
        fetchEarthquakes(bounds, filters.maxMag, filters.startDate, filters.endDate),
      ]);

      // Geocoding ile detaylı konum bilgilerini al (ilk 50 deprem için)
      const earthquakesWithLocation = [...earthquakes.data];
      const topEarthquakes = earthquakesWithLocation.slice(0, 50);
      
      // Geocoding işlemini arka planda yap
      Promise.all(
        topEarthquakes.map(async (eq, index) => {
          try {
            const detailedLocation = await reverseGeocodeWithCache(eq.latitude, eq.longitude);
            earthquakesWithLocation[index] = { ...eq, detailed_location: detailedLocation };
          } catch (error) {
            console.error(`Geocoding hatası ${eq.event_id}:`, error);
            earthquakesWithLocation[index] = { ...eq, detailed_location: eq.location_text };
          }
        })
      ).then(() => {
        // Güncellenmiş verileri set et
        setEarthquakeData({
          ...earthquakes,
          data: earthquakesWithLocation
        });
      });

      setBValueData(bValue);
      setTrendData(trend);
      setEarthquakeData(earthquakes); // İlk önce mevcut veriyi göster
      setLastUpdate(new Date());
    } catch (err: any) {
      setError(err.message || 'Veri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Load data when filters change
  useEffect(() => {
    if (apiConnected) {
      loadData();
    }
  }, [filters, apiConnected]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!apiConnected) return;

    const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 dakika
    const intervalId = setInterval(() => {
      console.log('🔄 Otomatik veri yenileme...');
      loadData();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [apiConnected, filters]);

  // Handle Region Preset Selection
  const handleRegionSelect = (preset: RegionPreset) => {
    setFilters({
      latRange: [preset.bounds.minLat, preset.bounds.maxLat],
      lonRange: [preset.bounds.minLon, preset.bounds.maxLon],
      minMag: preset.minMag,
      maxMag: 9.9,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        filters={filters}
        onFilterChange={setFilters}
        onRegionSelect={handleRegionSelect}
      />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto scrollbar-custom">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Sismik Analiz Dashboard
              </h1>
              <p className="text-gray-600">
                Gerçek zamanlı deprem verisi ve stres analizi
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {lastUpdate && (
                <div className="text-sm text-gray-600">
                  Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
                </div>
              )}
              <button
                onClick={() => loadData()}
                disabled={loading}
                className="p-2 rounded-lg bg-white hover:bg-primary-50 transition-colors disabled:opacity-50"
                title="Verileri Yenile"
              >
                <RefreshCw className={`w-5 h-5 text-primary-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Badge variant={apiConnected ? 'success' : 'danger'}>
                {apiConnected ? <Wifi className="w-4 h-4 mr-1" /> : <WifiOff className="w-4 h-4 mr-1" />}
                {apiConnected ? 'API Bağlı' : 'API Bağlantısı Yok'}
              </Badge>
            </div>
          </div>

          {/* Region Info */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapIcon className="w-4 h-4 text-primary-600" />
              <span className="font-semibold">Seçili Bölge:</span>
              <span>
                Enlem: {filters.latRange[0].toFixed(1)}° - {filters.latRange[1].toFixed(1)}° |
                Boylam: {filters.lonRange[0].toFixed(1)}° - {filters.lonRange[1].toFixed(1)}°
              </span>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Hata</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setActiveTab('instant')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'instant'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-primary-50'
            }`}
          >
            <Activity className="w-5 h-5 inline mr-2" />
            Anlık Analiz
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'trend'
                ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-secondary-50'
            }`}
          >
            <TrendingUp className="w-5 h-5 inline mr-2" />
            Zamansal Trend
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'table'
                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-accent-50'
            }`}
          >
            <Table className="w-5 h-5 inline mr-2" />
            Deprem Tablosu
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Veriler yükleniyor...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <AnimatePresence mode="wait">
            {activeTab === 'instant' && (
              <motion.div
                key="instant"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* b-Value Analysis */}
                {bValueData && bValueData.status === 'success' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Anlık Stres Analizi (b-Değeri)</CardTitle>
                      <CardDescription>
                        Gutenberg-Richter yasasına göre hesaplanan bölgesel stres göstergesi
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                          <GaugeChart
                            value={bValueData.b_value}
                            title="b-Değeri (Stres Katsayısı)"
                            subtitle={`Mc = ${filters.minMag.toFixed(1)}`}
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="glass-card p-6">
                            <div className="text-sm text-gray-600 mb-1">Analize Giren Deprem</div>
                            <div className="text-3xl font-bold text-primary-600">
                              {bValueData.analiz_parametreleri.analize_giren_deprem_sayisi_N}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              M ≥ {filters.minMag.toFixed(1)}
                            </div>
                          </div>
                          <div className="glass-card p-6">
                            <div className="text-sm text-gray-600 mb-1">Toplam Deprem</div>
                            <div className="text-3xl font-bold text-secondary-600">
                              {bValueData.analiz_parametreleri.bolgedeki_toplam_deprem}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Son 1 yıl
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Earthquake Map */}
                {earthquakeData && earthquakeData.status === 'success' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Sismik Aktivite Haritası</CardTitle>
                      <CardDescription>
                        {earthquakeData.data.length} deprem gösteriliyor (M ≤ {filters.maxMag.toFixed(1)})
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EarthquakeMap
                        earthquakes={earthquakeData.data}
                        bounds={{
                          minLat: filters.latRange[0],
                          maxLat: filters.latRange[1],
                          minLon: filters.lonRange[0],
                          maxLon: filters.lonRange[1],
                        }}
                      />
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {activeTab === 'trend' && (
              <motion.div
                key="trend"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {trendData && trendData.status === 'success' && trendData.data.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Zamansal Stres Trendi (b-Değeri)</CardTitle>
                      <CardDescription>
                        Son 1 yıldaki 3 aylık periyotlar halinde b-değeri değişimi (Mc = {filters.minMag.toFixed(1)})
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TrendChart data={trendData.data} />
                      
                      {/* Trend Statistics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="glass-card p-6 text-center">
                          <div className="text-sm text-gray-600 mb-2">Ortalama b-Değeri</div>
                          <div className="text-3xl font-bold text-primary-600">
                            {formatNumber(
                              trendData.data.reduce((sum, d) => sum + d.b_value, 0) / trendData.data.length,
                              3
                            )}
                          </div>
                        </div>
                        <div className="glass-card p-6 text-center">
                          <div className="text-sm text-gray-600 mb-2">Minimum b-Değeri</div>
                          <div className="text-3xl font-bold text-red-600">
                            {formatNumber(Math.min(...trendData.data.map(d => d.b_value)), 3)}
                          </div>
                        </div>
                        <div className="glass-card p-6 text-center">
                          <div className="text-sm text-gray-600 mb-2">Maksimum b-Değeri</div>
                          <div className="text-3xl font-bold text-green-600">
                            {formatNumber(Math.max(...trendData.data.map(d => d.b_value)), 3)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {trendData && trendData.data.length === 0 && (
                  <Card>
                    <CardContent className="py-20 text-center">
                      <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Trend Verisi Bulunamadı
                      </h3>
                      <p className="text-gray-600">
                        Seçilen bölge için yeterli zamansal veri bulunmuyor. Lütfen bölgeyi genişletin.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {activeTab === 'table' && (
              <motion.div
                key="table"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {earthquakeData && earthquakeData.status === 'success' && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Deprem Kayıtları Tablosu</CardTitle>
                          <CardDescription>
                            {earthquakeData.data.length} deprem kaydı (M ≤ {filters.maxMag.toFixed(1)}) - Son 1000 kayıt
                          </CardDescription>
                        </div>
                        <button
                          onClick={() => generatePDFReport({
                            earthquakes: earthquakeData.data,
                            bValueData,
                            filters: {
                              latRange: filters.latRange,
                              lonRange: filters.lonRange,
                              minMag: filters.minMag,
                              maxMag: filters.maxMag,
                              startDate: filters.startDate,
                              endDate: filters.endDate
                            }
                          })}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg hover:shadow-xl"
                        >
                          <FileDown className="w-5 h-5" />
                          PDF Rapor İndir
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto scrollbar-custom">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b-2 border-primary-200 bg-gradient-to-r from-primary-50 to-secondary-50">
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tarih & Saat</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Konum</th>
                              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Enlem</th>
                              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Boylam</th>
                              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Derinlik (km)</th>
                              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Büyüklük</th>
                            </tr>
                          </thead>
                          <tbody>
                            {earthquakeData.data.map((eq, index) => (
                              <tr 
                                key={eq.event_id} 
                                className={`border-b border-gray-100 hover:bg-primary-50 transition-colors ${
                                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                }`}
                              >
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  {new Date(eq.timestamp).toLocaleString('tr-TR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                                  <div className="font-medium text-gray-800 truncate">
                                    {eq.detailed_location || eq.location_text || 'Konum alınıyor...'}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {eq.latitude.toFixed(3)}°, {eq.longitude.toFixed(3)}°
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-center text-gray-700">
                                  {eq.latitude.toFixed(4)}°
                                </td>
                                <td className="px-4 py-3 text-sm text-center text-gray-700">
                                  {eq.longitude.toFixed(4)}°
                                </td>
                                <td className="px-4 py-3 text-sm text-center text-gray-700">
                                  {eq.depth.toFixed(1)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span 
                                    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold ${
                                      eq.magnitude >= 5.0 
                                        ? 'bg-red-100 text-red-700'
                                        : eq.magnitude >= 4.0
                                        ? 'bg-orange-100 text-orange-700'
                                        : eq.magnitude >= 3.0
                                        ? 'bg-amber-100 text-amber-700'
                                        : eq.magnitude >= 2.0
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-primary-100 text-primary-700'
                                    }`}
                                  >
                                    {eq.magnitude.toFixed(1)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {earthquakeData.data.length === 0 && (
                        <div className="py-20 text-center">
                          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Deprem Bulunamadı
                          </h3>
                          <p className="text-gray-600">
                            Seçilen bölge ve filtreler için deprem kaydı bulunamadı.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default App;
