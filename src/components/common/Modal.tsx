import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  id?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  id = 'modal'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  }[maxWidth];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#181512]/60 backdrop-blur-md animate-in fade-in duration-200"
      id={id}
      onClick={onClose}
    >
      <div 
        className={cn(
          "w-full bg-[#FEF9EB] border border-[#E7DFCA] rounded-3xl shadow-2xl shadow-black/25 overflow-hidden flex flex-col max-h-[92vh] text-[#26231E] animate-in zoom-in-95 duration-200 relative ring-1 ring-black/5",
          maxWidthClass
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Amber Gradient Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E7DFCA] bg-[#FAF3E0]/90 backdrop-blur-xs">
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-bold text-[#1E1B18] tracking-tight">{title}</h3>
            {subtitle && (
              <p className="text-xs text-[#706655] font-medium leading-normal">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-[#706655] hover:text-[#1E1B18] hover:bg-[#EFE8D6] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};
