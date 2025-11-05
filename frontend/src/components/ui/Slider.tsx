import React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  className?: string;
}

export function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  formatValue = (v) => v.toFixed(1),
  className,
}: SliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseFloat(e.target.value);
    if (newMin < value[1]) {
      onChange([newMin, value[1]]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseFloat(e.target.value);
    if (newMax > value[0]) {
      onChange([value[0], newMax]);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-sm font-medium text-primary-600">
          {formatValue(value[0])} - {formatValue(value[1])}
        </span>
      </div>
      
      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleMinChange}
          className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={handleMaxChange}
          className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-secondary-500"
        />
      </div>
    </div>
  );
}
