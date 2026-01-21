import { PlaceholderPage } from '@/components/placeholder';

export function DocumentsPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Documents"
      description="Manage leases, contracts, and property documents"
      onNavigate={onNavigate}
    />
  );
}
