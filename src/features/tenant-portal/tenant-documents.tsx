import { PlaceholderPage } from '@/components/placeholder';

export function TenantDocuments({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Documents"
      description="Access your lease and other documents"
      onNavigate={onNavigate}
    />
  );
}
