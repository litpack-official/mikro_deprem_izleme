import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { BValueTrendPoint } from '@/types';
import { formatNumber } from '@/lib/utils';

interface TrendChartProps {
  data: BValueTrendPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
  const formattedData = data.map(point => ({
    ...point,
    date: new Date(point.timestamp).toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'short' 
    }),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4 shadow-lg">
          <p className="font-semibold text-primary-700 mb-2">{data.date}</p>
          <p className="text-sm">
            <span className="font-medium">b-Değeri:</span>{' '}
            <span className="font-bold text-lg">{formatNumber(data.b_value, 3)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Deprem Sayısı: {data.deprem_sayisi_N}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorBValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
            domain={[0.5, 1.5]}
            ticks={[0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5]}
            label={{ 
              value: 'b-Değeri', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: '14px', fontWeight: 600, fill: '#374151' }
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Reference lines for stress levels */}
          <ReferenceLine 
            y={0.8} 
            stroke="#EF4444" 
            strokeDasharray="5 5" 
            strokeWidth={2}
            label={{ 
              value: 'Yüksek Stres (< 0.8)', 
              position: 'right',
              fill: '#EF4444',
              fontSize: 12,
              fontWeight: 600
            }}
          />
          <ReferenceLine 
            y={1.0} 
            stroke="#10B981" 
            strokeDasharray="5 5" 
            strokeWidth={2}
            label={{ 
              value: 'Normal (1.0)', 
              position: 'right',
              fill: '#10B981',
              fontSize: 12,
              fontWeight: 600
            }}
          />
          
          <Line
            type="monotone"
            dataKey="b_value"
            stroke="url(#colorBValue)"
            strokeWidth={4}
            dot={{ 
              fill: '#06B6D4', 
              strokeWidth: 2, 
              r: 6,
              stroke: '#FFFFFF'
            }}
            activeDot={{ 
              r: 8, 
              fill: '#0EA5E9',
              stroke: '#FFFFFF',
              strokeWidth: 3
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
