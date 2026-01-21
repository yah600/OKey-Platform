import { PlaceholderPage } from '@/components/placeholder';

export function PropertyDetail({ propertyId, onNavigate }: { propertyId: string; onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title={`Property Details: ${propertyId}`}
      description="View property information, available units, and building details"
      onNavigate={onNavigate}
    />
  );
}
