import { PlaceholderPage } from '@/components/placeholder';

export function TenantMaintenance({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Maintenance Requests"
      description="Submit and track maintenance requests"
      onNavigate={onNavigate}
    />
  );
}
