import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variantStyles = {
    primary: "bg-[#26231E] text-[#FEF9EB] hover:bg-[#3A352F] focus:ring-[#26231E] shadow-xs",
    secondary: "bg-[#EFE8D6] text-[#26231E] hover:bg-[#E4DAC4] focus:ring-[#8C7A5D]",
    outline: "border border-[#D8CEB9] text-[#26231E] bg-[#FAF5E6] hover:bg-[#EFE8D6] focus:ring-[#8C7A5D]",
    ghost: "text-[#3D372E] hover:bg-[#EFE8D6] focus:ring-[#8C7A5D]",
    danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C] focus:ring-[#DC2626]",
    accent: "bg-[#D97706] text-white hover:bg-[#B45309] focus:ring-[#D97706] shadow-xs"
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};
