import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
}) => {
  const baseStyle = 'inline-flex items-center font-medium rounded-full tracking-wide';
  
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/50',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/50',
    info: 'bg-sky-50 text-sky-700 border border-sky-200/50',
    neutral: 'bg-slate-50 text-slate-700 border border-slate-200/50',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
