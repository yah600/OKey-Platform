import { PlaceholderPage } from '@/components/placeholder';

export function AnalyticsPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Analytics"
      description="Property performance insights and benchmarking"
      onNavigate={onNavigate}
    />
  );
}
