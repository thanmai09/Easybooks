import React from 'react';
import logoImg from '../../assets/logo/logo.png';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
}) => {
  const sizes = {
    sm: variant === 'icon' ? 'w-8 h-8' : 'h-8',
    md: variant === 'icon' ? 'w-10 h-10' : 'h-10',
    lg: variant === 'icon' ? 'w-16 h-16' : 'h-16',
    xl: variant === 'icon' ? 'w-24 h-24' : 'h-24',
  };

  if (variant === 'icon') {
    return (
      <div className={`overflow-hidden flex items-center justify-center rounded-xl bg-white shadow-xs border border-slate-100 ${sizes[size]} ${className}`}>
        {/* Crop top-center part where the book graphics is, leaving out the text */}
        <img
          src={logoImg}
          alt="Apna Books Icon"
          className="w-[140%] h-[140%] min-w-[140%] min-h-[140%] object-cover object-top scale-110 -translate-y-[8%]"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-start ${className}`}>
      <img
        src={logoImg}
        alt="Apna Books Logo"
        className={`${sizes[size]} object-contain`}
        draggable={false}
      />
    </div>
  );
};
