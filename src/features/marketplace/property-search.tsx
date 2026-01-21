import { PlaceholderPage } from '@/components/placeholder';

export function PropertySearch({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Property Search"
      description="Advanced search and filtering for properties"
      onNavigate={onNavigate}
    />
  );
}
