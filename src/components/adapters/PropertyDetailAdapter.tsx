import { useNavigate, useParams } from 'react-router-dom';
import { PropertyDetail as PropertyDetailComponent } from '@/features/marketplace/property-detail';

export function PropertyDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleNavigate = (route: string, navId?: string) => {
    if (navId) {
      navigate(`/${route}/${navId}`);
    } else {
      navigate(`/${route}`);
    }
  };

  return <PropertyDetailComponent propertyId={id || ''} onNavigate={handleNavigate} />;
}
