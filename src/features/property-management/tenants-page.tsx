import { PlaceholderPage } from '@/components/placeholder';

export function TenantsPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Tenants"
      description="Manage tenants, leases, and screening"
      onNavigate={onNavigate}
    />
  );
}
