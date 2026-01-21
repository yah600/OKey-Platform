import { PlaceholderPage } from '@/components/placeholder';

export function OwnerDashboard({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Owner Dashboard"
      description="Manage your properties, review bids, and track performance"
      onNavigate={onNavigate}
    />
  );
}
