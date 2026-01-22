import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-ios-blue text-white shadow-ios hover:shadow-ios-lg hover:bg-ios-blue/90',
      secondary: 'bg-white/50 backdrop-blur-md text-neutral-900 border border-white/30 hover:bg-white/70',
      ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100',
      danger: 'bg-ios-red text-white shadow-ios hover:shadow-ios-lg hover:bg-ios-red/90',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-ios',
      md: 'px-6 py-3 text-base rounded-button',
      lg: 'px-8 py-4 text-lg rounded-button',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
