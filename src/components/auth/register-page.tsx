import { PlaceholderPage } from '@/components/placeholder';

export function RegisterPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <PlaceholderPage
      title="Register"
      description="Create your O'Key account"
      onNavigate={onNavigate}
    />
  );
}
