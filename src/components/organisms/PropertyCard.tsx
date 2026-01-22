import { forwardRef, HTMLAttributes } from 'react';
import { MapPin, Bed, Bath, Maximize, TrendingUp, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import Badge from '../ui/Badge';

export interface PropertyCardProps extends HTMLAttributes<HTMLDivElement> {
  property: {
    id: string;
    name: string;
    address: string;
    image: string;
    type: string;
    totalUnits: number;
    occupiedUnits: number;
    monthlyRevenue: number;
    beds?: number;
    baths?: number;
    sqft?: number;
  };
  variant?: 'default' | 'compact';
  showStats?: boolean;
  onView?: (id: string) => void;
}

const PropertyCard = forwardRef<HTMLDivElement, PropertyCardProps>(
  ({ className, property, variant = 'default', showStats = true, onView, onClick, ...props }, ref) => {
    const occupancyRate = Math.round((property.occupiedUnits / property.totalUnits) * 100);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      onView?.(property.id);
    };

    if (variant === 'compact') {
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
          <div className="flex gap-4 p-4">
            <div className="w-24 h-24 bg-neutral-200 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 truncate">{property.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-neutral-600 mt-0.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs ml-2">
                  {property.type}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <span>{property.totalUnits} units</span>
                <span>{occupancyRate}% occupied</span>
                <span className="font-medium text-neutral-900">${property.monthlyRevenue.toLocaleString()}/mo</span>
              </div>
            </div>
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
        <div className="aspect-video bg-neutral-200 overflow-hidden">
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 mb-1">{property.name}</h3>
              <div className="flex items-center gap-1 text-sm text-neutral-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{property.address}</span>
              </div>
            </div>
            <Badge variant="secondary">
              {property.type}
            </Badge>
          </div>

          {property.beds !== undefined && (
            <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
              {property.beds !== undefined && (
                <span className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  {property.beds} bed
                </span>
              )}
              {property.baths !== undefined && (
                <span className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  {property.baths} bath
                </span>
              )}
              {property.sqft !== undefined && (
                <span className="flex items-center gap-1">
                  <Maximize className="w-4 h-4" />
                  {property.sqft} sqft
                </span>
              )}
            </div>
          )}

          {showStats && (
            <>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-neutral-600">
                    <Users className="w-4 h-4" />
                    <span>{property.occupiedUnits}/{property.totalUnits}</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>{occupancyRate}%</span>
                  </div>
                </div>
                <div className="text-lg font-semibold text-neutral-900">
                  ${property.monthlyRevenue.toLocaleString()}<span className="text-xs text-neutral-600 font-normal">/mo</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
