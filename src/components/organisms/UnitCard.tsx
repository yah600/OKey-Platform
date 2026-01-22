import { forwardRef, HTMLAttributes } from 'react';
import { Bed, Bath, Maximize, DollarSign, User, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import Badge from '../ui/Badge';

export interface UnitCardProps extends HTMLAttributes<HTMLDivElement> {
  unit: {
    id: string;
    number: string;
    beds: number;
    baths: number;
    sqft: number;
    rent: number;
    status: 'occupied' | 'vacant' | 'maintenance';
    tenant?: string | null;
    image?: string;
    availableDate?: string;
  };
  variant?: 'default' | 'compact';
  showImage?: boolean;
  onView?: (id: string) => void;
}

const UnitCard = forwardRef<HTMLDivElement, UnitCardProps>(
  ({ className, unit, variant = 'default', showImage = false, onView, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      onView?.(unit.id);
    };

    const statusVariant = unit.status === 'occupied' ? 'success' : unit.status === 'vacant' ? 'warning' : 'error';

    if (variant === 'compact') {
      return (
        <div
          ref={ref}
          onClick={handleClick}
          className={cn(
            'bg-white border border-neutral-200 rounded-lg p-4 cursor-pointer transition-all hover:border-neutral-300 hover:shadow-sm',
            className
          )}
          {...props}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-neutral-900">Unit {unit.number}</h4>
            <Badge variant={statusVariant} className="text-xs">
              {unit.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-2">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {unit.beds}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {unit.baths}
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              {unit.sqft} sqft
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <span className="text-lg font-semibold text-neutral-900">
              ${unit.rent}<span className="text-xs text-neutral-600 font-normal">/mo</span>
            </span>
            {unit.tenant && (
              <span className="text-xs text-neutral-600 truncate max-w-[120px]">{unit.tenant}</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        onClick={handleClick}
        className={cn(
          'bg-white border border-neutral-200 rounded-lg overflow-hidden cursor-pointer transition-all hover:border-neutral-300 hover:shadow-md',
          className
        )}
        {...props}
      >
        {/* Image */}
        {showImage && unit.image && (
          <div className="aspect-video bg-neutral-200 overflow-hidden">
            <img
              src={unit.image}
              alt={`Unit ${unit.number}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                Unit {unit.number}
              </h3>
              {unit.tenant && (
                <div className="flex items-center gap-1 text-sm text-neutral-600">
                  <User className="w-4 h-4" />
                  <span>{unit.tenant}</span>
                </div>
              )}
              {!unit.tenant && unit.availableDate && (
                <div className="flex items-center gap-1 text-sm text-neutral-600">
                  <Calendar className="w-4 h-4" />
                  <span>Available {new Date(unit.availableDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            <Badge variant={statusVariant}>
              {unit.status}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {unit.beds} bed
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {unit.baths} bath
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              {unit.sqft} sqft
            </span>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-1 text-neutral-900">
              <DollarSign className="w-5 h-5" />
              <span className="text-xl font-semibold">{unit.rent}</span>
              <span className="text-sm text-neutral-600">/mo</span>
            </div>
            <span className="text-sm text-primary-600 font-medium hover:text-primary-700">
              View Details →
            </span>
          </div>
        </div>
      </div>
    );
  }
);

UnitCard.displayName = 'UnitCard';

export default UnitCard;
