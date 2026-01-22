import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'motion/react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hover = false,
      padding = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-white border border-neutral-200 shadow-card',
      glass: 'bg-white/50 backdrop-blur-md border border-white/30 shadow-glass',
      elevated: 'bg-white shadow-glass-lg border-none',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const Component = hover ? motion.div : 'div';
    const hoverProps = hover
      ? {
          whileHover: { scale: 1.02, y: -4 },
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }
      : {};

    return (
      <Component
        ref={ref}
        className={`rounded-card ${variants[variant]} ${paddings[padding]} transition-all duration-200 ${className}`}
        {...hoverProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export default Card;
