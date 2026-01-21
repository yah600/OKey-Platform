import { PlaceholderPage } from '@/components/placeholder';

export function FinancesPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Finances"
      description="Track income, expenses, and financial reports"
      onNavigate={onNavigate}
    />
  );
}
