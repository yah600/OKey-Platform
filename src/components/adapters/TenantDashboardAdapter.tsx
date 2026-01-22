import { useNavigate } from 'react-router-dom';
import { TenantDashboardEnhanced as TenantDashboardComponent } from '@/features/tenant-portal/tenant-dashboard-enhanced';

export function TenantDashboardEnhanced() {
  const navigate = useNavigate();

  const handleNavigate = (route: string, id?: string) => {
    if (id) {
      navigate(`/${route}/${id}`);
    } else {
      navigate(`/${route}`);
    }
  };

  return <TenantDashboardComponent onNavigate={handleNavigate} />;
}
