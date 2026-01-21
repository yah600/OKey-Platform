import { PlaceholderPage } from '@/components/placeholder';

export function UnitDetail({ unitId, onNavigate }: { unitId: string; onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title={`Unit Details: ${unitId}`}
      description="View unit details and place your bid"
      onNavigate={onNavigate}
    />
  );
}
