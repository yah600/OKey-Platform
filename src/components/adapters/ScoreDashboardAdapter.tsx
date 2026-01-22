import { useNavigate } from 'react-router-dom';
import { ScoreDashboard as ScoreDashboardComponent } from '@/features/marketplace/score-dashboard';

export function ScoreDashboard() {
  const navigate = useNavigate();

  const handleNavigate = (route: string, id?: string) => {
    if (id) {
      navigate(`/${route}/${id}`);
    } else {
      navigate(`/${route}`);
    }
  };

  return <ScoreDashboardComponent onNavigate={handleNavigate} />;
}
