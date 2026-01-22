import { useNavigate } from 'react-router-dom';
import { PropertySearch as PropertySearchComponent } from '@/features/marketplace/property-search';

export function PropertySearch() {
  const navigate = useNavigate();

  const handleNavigate = (route: string, id?: string) => {
    if (id) {
      navigate(`/${route}/${id}`);
    } else {
      navigate(`/${route}`);
    }
  };

  return <PropertySearchComponent onNavigate={handleNavigate} />;
}
