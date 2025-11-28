import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Slider } from './ui/Slider';
import { REGION_PRESETS, type FilterState, type RegionPreset } from '@/types';
import { Map, Settings, Info, Calendar } from 'lucide-react';

interface SidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onRegionSelect: (preset: RegionPreset) => void;
}

export function Sidebar({ filters, onFilterChange, onRegionSelect }: SidebarProps) {
  return (
    <motion.div
      className="w-80 h-full glass-card p-6 overflow-y-auto scrollbar-custom"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Logo */}
      <div className="mb-8">
        <div className="flex flex-col items-center text-center mb-4">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
            <img 
              src="/logo.png" 
              alt="Litpack Logo" 
              className="relative w-24 h-24 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-1">LİTPACK</h2>
            <p className="text-sm font-medium text-primary-600">Sismik Analiz Sistemi</p>
            <p className="text-xs text-gray-500 mt-1">Profesyonel Deprem İzleme v3.0</p>
          </div>
        </div>
      </div>

      {/* Region Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Map className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-800">Bölge Seçimi</h3>
        </div>
        
        <div className="space-y-2">
          {Object.values(REGION_PRESETS).map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => onRegionSelect(preset)}
            >
              <span className="truncate">{preset.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Filters */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-800">Özel Filtreler</h3>
        </div>

        <div className="space-y-6">
          <Slider
            label="Enlem Aralığı (K-G)"
            min={36.0}
            max={42.0}
            step={0.1}
            value={filters.latRange}
            onChange={(value) => onFilterChange({ ...filters, latRange: value })}
            formatValue={(v) => `${v.toFixed(1)}°`}
          />

          <Slider
            label="Boylam Aralığı (B-D)"
            min={26.0}
            max={45.0}
            step={0.1}
            value={filters.lonRange}
            onChange={(value) => onFilterChange({ ...filters, lonRange: value })}
            formatValue={(v) => `${v.toFixed(1)}°`}
          />

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
              <span>Minimum Büyüklük (Mc)</span>
              <span className="text-primary-600">{filters.minMag.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min={0.1}
              max={4.0}
              step={0.1}
              value={filters.minMag}
              onChange={(e) => onFilterChange({ ...filters, minMag: parseFloat(e.target.value) })}
              className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <p className="text-xs text-gray-500">Stres analizi için minimum deprem büyüklüğü</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
              <span>Maksimum Büyüklük (Harita)</span>
              <span className="text-secondary-600">{filters.maxMag.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min={1.0}
              max={9.9}
              step={0.1}
              value={filters.maxMag}
              onChange={(e) => onFilterChange({ ...filters, maxMag: parseFloat(e.target.value) })}
              className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-secondary-500"
            />
            <p className="text-xs text-gray-500">Haritada gösterilecek maksimum büyüklük</p>
          </div>
        </div>
      </div>

      {/* Tarih Filtreleri */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-800">Zaman Aralığı</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          {(filters.startDate || filters.endDate) && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onFilterChange({ ...filters, startDate: undefined, endDate: undefined })}
            >
              Tarih Filtresini Temizle
            </Button>
          )}

          <p className="text-xs text-gray-500">
            Tarih seçilmezse tüm depremler gösterilir
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-700">
            <p className="font-semibold mb-1">b-Değeri Nedir?</p>
            <p className="leading-relaxed">
              Gutenberg-Richter yasasına göre hesaplanan stres göstergesi. 
              Düşük değerler (&lt;0.8) yüksek stres ve enerji birikimini işaret eder.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
