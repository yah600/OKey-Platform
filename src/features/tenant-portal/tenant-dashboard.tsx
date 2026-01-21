import { PlaceholderPage } from '@/components/placeholder';

export function TenantDashboard({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Tenant Dashboard"
      description="Your rental overview, payments, and requests"
      onNavigate={onNavigate}
    />
  );
}
