import { useNavigate, useParams } from 'react-router-dom';
import { UnitDetail as UnitDetailComponent } from '@/features/marketplace/unit-detail';

export function UnitDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleNavigate = (route: string, navId?: string) => {
    if (navId) {
      navigate(`/${route}/${navId}`);
    } else {
      navigate(`/${route}`);
    }
  };

  return <UnitDetailComponent unitId={id || ''} onNavigate={handleNavigate} />;
}
