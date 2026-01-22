import { useNavigate } from 'react-router-dom';
import { OwnerDashboardEnhanced as OwnerDashboardComponent } from '@/features/property-management/owner-dashboard-enhanced';

export function OwnerDashboardEnhanced() {
  const navigate = useNavigate();

  const handleNavigate = (route: string, id?: string) => {
    if (id) {
      navigate(`/${route}/${id}`);
    } else {
      navigate(`/${route}`);
    }
  };

  return <OwnerDashboardComponent onNavigate={handleNavigate} />;
}
