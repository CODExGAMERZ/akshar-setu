import React from 'react';
import { cn } from '../../lib/utils';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  description?: string;
  id?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  description,
  id
}) => {
  const sliderId = id || `slider-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-1.5" id={`container-${sliderId}`}>
      <div className="flex items-center justify-between text-xs text-[#4A4338]">
        <label htmlFor={sliderId} className="font-semibold text-[#26231E]">
          {label}
        </label>
        <span className="font-mono bg-[#EFE8D6] px-2 py-0.5 rounded text-[#26231E] font-medium">
          {value}{unit}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-[#E2D8C3] rounded-lg appearance-none cursor-pointer accent-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#D97706]/30"
      />
      {description && (
        <p className="text-[11px] text-[#706655]">{description}</p>
      )}
    </div>
  );
};
