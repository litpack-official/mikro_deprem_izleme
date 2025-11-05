import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS class merger utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to Turkish locale
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Format number with Turkish locale
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Get stress level color based on b-value
 */
export function getStressColor(bValue: number): {
  color: string;
  bgColor: string;
  textColor: string;
  label: string;
  description: string;
} {
  if (bValue < 0.8) {
    return {
      color: '#EF4444',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      label: 'YÜKSEK STRES',
      description: 'Enerji birikimi olasılığı yüksek. Dikkatli izleme gerekiyor.',
    };
  } else if (bValue < 1.0) {
    return {
      color: '#F59E0B',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700',
      label: 'DİKKAT',
      description: 'Stres seviyesi normalin üzerinde. İzleme önerilir.',
    };
  } else {
    return {
      color: '#10B981',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-700',
      label: 'NORMAL',
      description: 'Stres seviyesi normal aralıkta.',
    };
  }
}

/**
 * Get magnitude color for visualization
 */
export function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 5.0) return '#DC2626'; // Red
  if (magnitude >= 4.0) return '#EA580C'; // Orange
  if (magnitude >= 3.0) return '#F59E0B'; // Amber
  if (magnitude >= 2.0) return '#10B981'; // Emerald
  return '#06B6D4'; // Cyan
}

/**
 * Calculate marker size based on magnitude
 */
export function getMagnitudeSize(magnitude: number): number {
  return Math.max(4, Math.min(20, magnitude * 3));
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format coordinate to display format
 */
export function formatCoordinate(coord: number, type: 'lat' | 'lon'): string {
  const direction = type === 'lat' 
    ? (coord >= 0 ? 'K' : 'G')
    : (coord >= 0 ? 'D' : 'B');
  return `${Math.abs(coord).toFixed(4)}° ${direction}`;
}
