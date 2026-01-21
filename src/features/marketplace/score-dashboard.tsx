import { PlaceholderPage } from '@/components/placeholder';

export function ScoreDashboard({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="O'Key Score Dashboard"
      description="View and improve your O'Key score"
      onNavigate={onNavigate}
    />
  );
}
