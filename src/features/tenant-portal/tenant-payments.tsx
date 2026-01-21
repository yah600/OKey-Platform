import { PlaceholderPage } from '@/components/placeholder';

export function TenantPayments({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Payments"
      description="View payment history and make rent payments"
      onNavigate={onNavigate}
    />
  );
}
