import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Processing...",
  submessage,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-3", className)}>
      <div className="p-3 bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl shadow-xs">
        <Loader2 className="w-6 h-6 text-[#D97706] animate-spin" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#26231E]">{message}</p>
        {submessage && (
          <p className="text-xs text-[#706655] mt-1">{submessage}</p>
        )}
      </div>
    </div>
  );
};
