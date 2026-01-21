import React from 'react';
import { Button as KonstaButton } from 'konsta/react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'fill' | 'outline' | 'clear' | 'tonal';
  size?: 'small' | 'large';
  rounded?: boolean;
  colors?: {
    fillBg?: string;
    fillText?: string;
  };
  children: React.ReactNode;
}

export function Button({ 
  variant = 'fill', 
  size, 
  rounded = true,
  colors,
  className,
  children,
  ...props 
}: ButtonProps) {
  // Map variant to Konsta styles
  const getVariantClass = () => {
    switch (variant) {
      case 'outline':
        return 'border-2 border-[#0D7377] text-[#0D7377] bg-transparent';
      case 'clear':
        return 'text-[#0D7377] bg-transparent';
      case 'tonal':
        return 'bg-[#0D7377]/10 text-[#0D7377]';
      default:
        return 'bg-[#0D7377] text-white';
    }
  };

  return (
    <KonstaButton
      className={cn(getVariantClass(), className)}
      rounded={rounded}
      large={size === 'large'}
      small={size === 'small'}
      colors={colors}
      {...props}
    >
      {children}
    </KonstaButton>
  );
}
