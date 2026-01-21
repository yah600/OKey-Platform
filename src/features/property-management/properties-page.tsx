import { PlaceholderPage } from '@/components/placeholder';

export function PropertiesPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Properties"
      description="Manage your property portfolio"
      onNavigate={onNavigate}
    />
  );
}
