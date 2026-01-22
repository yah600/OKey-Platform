import { useNavigate } from 'react-router-dom';
import { MarketplaceHome as MarketplaceHomeComponent } from '@/features/marketplace/marketplace-home';

export function MarketplaceHome() {
  const navigate = useNavigate();

  const handleNavigate = (route: string, id?: string) => {
    if (id) {
      navigate(`/${route}/${id}`);
    } else {
      navigate(`/${route}`);
    }
  };

  return <MarketplaceHomeComponent onNavigate={handleNavigate} />;
}
