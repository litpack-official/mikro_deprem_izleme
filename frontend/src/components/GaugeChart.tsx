import React from 'react';
import { motion } from 'framer-motion';
import { getStressColor, formatNumber } from '@/lib/utils';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface GaugeChartProps {
  value: number;
  title: string;
  subtitle?: string;
}

export function GaugeChart({ value, title, subtitle }: GaugeChartProps) {
  const { color, bgColor, textColor, label, description } = getStressColor(value);
  
  // Calculate gauge rotation (-90deg to +90deg)
  const rotation = ((value - 0.5) / 1.0) * 180;
  const clampedRotation = Math.max(-90, Math.min(90, rotation));
  
  const getIcon = () => {
    if (value < 0.8) return <AlertTriangle className="w-8 h-8" />;
    if (value < 1.0) return <AlertCircle className="w-8 h-8" />;
    return <CheckCircle className="w-8 h-8" />;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Gauge Container */}
      <div className="relative w-64 h-32">
        {/* Background Arc */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* Red Zone */}
          <path
            d="M 20 90 A 80 80 0 0 1 60 25"
            fill="none"
            stroke="#FEE2E2"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Yellow Zone */}
          <path
            d="M 60 25 A 80 80 0 0 1 100 10"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Green Zone */}
          <path
            d="M 100 10 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#D1FAE5"
            strokeWidth="20"
            strokeLinecap="round"
          />
          
          {/* Active Arc */}
          <motion.path
            d={`M 20 90 A 80 80 0 0 1 ${100 + Math.sin((clampedRotation * Math.PI) / 180) * 80} ${90 - Math.cos((clampedRotation * Math.PI) / 180) * 80}`}
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          
          {/* Needle (Arrow) */}
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: clampedRotation }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ transformOrigin: '100px 90px' }}
          >
            {/* Needle shaft */}
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="25"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Arrow head */}
            <polygon
              points="100,20 95,30 105,30"
              fill={color}
            />
            {/* Needle base circle */}
            <circle cx="100" cy="90" r="6" fill={color} />
            <circle cx="100" cy="90" r="3" fill="white" />
          </motion.g>
        </svg>
        
        {/* Value Display */}
        <div className="absolute inset-0 flex items-center justify-center pt-16">
          <motion.div
            className="text-5xl font-bold drop-shadow-lg"
            style={{ color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {formatNumber(value, 3)}
          </motion.div>
        </div>
      </div>

      {/* Title and Description */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>

      {/* Status Badge */}
      <motion.div
        className={`flex items-center gap-3 px-6 py-3 rounded-xl ${bgColor} ${textColor}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {getIcon()}
        <div className="text-left">
          <div className="font-bold text-lg">{label}</div>
          <div className="text-sm opacity-90">{description}</div>
        </div>
      </motion.div>
    </div>
  );
}
