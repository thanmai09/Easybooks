import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-sm hover:shadow focus:ring-brand-500 border border-transparent active:scale-[0.98]',
    secondary: 'bg-brand-50 text-brand-600 hover:bg-brand-100 focus:ring-brand-500 border border-transparent active:scale-[0.98]',
    outline: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-brand-500 active:scale-[0.98]',
    danger: 'bg-gradient-to-r from-accent-rose to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm hover:shadow focus:ring-red-500 active:scale-[0.98]',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4.5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="mr-2 inline-flex">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2 inline-flex">{icon}</span>}
    </button>
  );
};
