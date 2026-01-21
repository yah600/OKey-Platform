import { PlaceholderPage } from '@/components/placeholder';

export function MaintenancePage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Maintenance"
      description="Track and manage maintenance requests"
      onNavigate={onNavigate}
    />
  );
}
