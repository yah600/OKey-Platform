import { forwardRef, ImgHTMLAttributes, useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  shape?: 'circle' | 'square';
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', status, shape = 'circle', ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl',
    };

    const statusSizeClasses = {
      xs: 'w-1.5 h-1.5 border',
      sm: 'w-2 h-2 border',
      md: 'w-2.5 h-2.5 border-2',
      lg: 'w-3 h-3 border-2',
      xl: 'w-4 h-4 border-2',
      '2xl': 'w-5 h-5 border-2',
    };

    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-neutral-400',
      busy: 'bg-red-500',
      away: 'bg-amber-500',
    };

    const getInitials = (name: string) => {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    const showImage = src && !imageError;
    const initials = name ? getInitials(name) : null;

    return (
      <div className="relative inline-block">
        <div
          className={cn(
            'relative flex items-center justify-center overflow-hidden bg-neutral-100 text-neutral-600 font-medium',
            shape === 'circle' ? 'rounded-full' : 'rounded-lg',
            sizeClasses[size],
            className
          )}
        >
          {showImage ? (
            <img
              ref={ref}
              src={src}
              alt={alt || name || 'Avatar'}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
              {...props}
            />
          ) : initials ? (
            <span>{initials}</span>
          ) : (
            <User className="w-1/2 h-1/2" />
          )}
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-white',
              statusSizeClasses[size],
              statusColors[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
