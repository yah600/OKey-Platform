import { PlaceholderPage } from '@/components/placeholder';

export function MarketplaceHome({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Marketplace Home"
      description="Browse and discover properties, start your bidding journey"
      onNavigate={onNavigate}
    />
  );
}
