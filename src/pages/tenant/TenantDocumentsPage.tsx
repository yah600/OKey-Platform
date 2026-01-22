export function TenantDocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Documents</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📄</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Documents Coming Soon</h2>
          <p className="text-gray-600">
            This feature will allow you to view and manage your lease documents and receipts.
          </p>
        </div>
      </div>
    </div>
  );
}
