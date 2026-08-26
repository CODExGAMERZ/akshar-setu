import React from 'react';
import { cn } from '../../lib/utils';

export interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  id?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  description,
  id
}) => {
  const switchId = id || `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex items-center justify-between gap-3" id={`container-${switchId}`}>
      <div className="flex flex-col">
        <label htmlFor={switchId} className="text-xs font-semibold text-[#26231E] cursor-pointer">
          {label}
        </label>
        {description && (
          <span className="text-[11px] text-[#706655]">{description}</span>
        )}
      </div>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D97706]/40",
          checked ? "bg-[#D97706]" : "bg-[#D5CAA6]"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
};
