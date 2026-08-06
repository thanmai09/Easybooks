import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  variant?: 'white' | 'glass' | 'dark' | 'outline';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
  variant = 'white',
}) => {
  const baseStyle = 'rounded-2xl p-6 transition-all duration-200 border';
  
  const variants = {
    white: 'bg-white border-slate-100 shadow-xs',
    glass: 'glass border-white/40 shadow-xs',
    dark: 'bg-slate-900 border-slate-800 text-white shadow-md',
    outline: 'bg-transparent border-slate-200 border-dashed',
  };

  const hoverStyle = hoverEffect 
    ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer hover:border-slate-200/80' 
    : '';

  const clickableStyle = onClick ? 'cursor-pointer active:scale-[0.99]' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${hoverStyle} ${clickableStyle} ${className}`}
    >
      {children}
    </div>
  );
};
