import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-9xl font-bold text-neutral-200">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-semibold text-neutral-900 mb-3">
          Page Not Found
        </h2>
        <p className="text-neutral-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
          Please check the URL or return to the homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-600 mb-3">Need help?</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <button
              onClick={() => navigate('/help')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Visit Help Center
            </button>
            <span className="text-neutral-300">•</span>
            <button
              onClick={() => navigate('/marketplace/search')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse Properties
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
