import { PlaceholderPage } from '@/components/placeholder';

export function MyBids({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="My Bids"
      description="Track all your active and past bids"
      onNavigate={onNavigate}
    />
  );
}
