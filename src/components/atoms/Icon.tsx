import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'white';

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  color?: IconColor;
  className?: string;
  spin?: boolean;
}

const sizeMap: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const colorMap: Record<IconColor, string> = {
  primary: 'text-primary-600',
  secondary: 'text-neutral-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  neutral: 'text-neutral-500',
  white: 'text-white',
};

/**
 * Icon wrapper component for Lucide React icons
 * Provides consistent sizing, color theming, and optional spin animation
 *
 * @example
 * <Icon icon={Home} size="md" color="primary" />
 * <Icon icon={Loader2} size="lg" spin />
 */
export function Icon({
  icon: LucideIcon,
  size = 'md',
  color = 'neutral',
  className,
  spin = false,
}: IconProps) {
  return (
    <LucideIcon
      className={cn(
        sizeMap[size],
        colorMap[color],
        spin && 'animate-spin',
        className
      )}
    />
  );
}
