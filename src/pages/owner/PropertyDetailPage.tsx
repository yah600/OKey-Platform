import { useParams } from 'react-router-dom';

export function PropertyDetailPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Property Detail - {id}</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏢</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Details Coming Soon</h2>
          <p className="text-gray-600">
            This page will show detailed information about your property.
          </p>
        </div>
      </div>
    </div>
  );
}
