import React from 'react';
import { ListInput } from 'konsta/react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  type?: string;
  error?: string;
  className?: string;
}

export function Input({ 
  label, 
  type = 'text', 
  error, 
  className,
  placeholder,
  ...props 
}: InputProps) {
  return (
    <div className={cn('w-full', className)}>
      <ListInput
        label={label}
        type={type}
        placeholder={placeholder}
        error={error}
        className="w-full"
        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D7377] focus:border-transparent"
        {...props}
      />
    </div>
  );
}
