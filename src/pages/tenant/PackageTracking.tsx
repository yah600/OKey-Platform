import { useState } from 'react';
import { Package, CheckCircle, Clock, MapPin, QrCode } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function PackageTracking() {
  const [packages] = useState([
    {
      id: 'pkg-1',
      carrier: 'FedEx',
      tracking: 'FX12345678901234',
      status: 'delivered',
      deliveredAt: '2026-01-22T14:30:00Z',
      pickedUp: false,
      location: 'Main Office',
      lockerCode: null,
    },
    {
      id: 'pkg-2',
      carrier: 'Amazon',
      tracking: 'TBA567890123',
      status: 'delivered',
      deliveredAt: '2026-01-23T10:15:00Z',
      pickedUp: false,
      location: 'Locker #12',
      lockerCode: '4589',
    },
    {
      id: 'pkg-3',
      carrier: 'UPS',
      tracking: '1Z999AA10123456784',
      status: 'in_transit',
      expectedDelivery: '2026-01-24',
      pickedUp: false,
      location: null,
      lockerCode: null,
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            In Transit
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Package Tracking</h1>
        <p className="text-sm text-neutral-600">Track your deliveries and pick up packages</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">2</p>
              <p className="text-sm text-neutral-600">Ready for Pickup</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">1</p>
              <p className="text-sm text-neutral-600">In Transit</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-neutral-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">15</p>
              <p className="text-sm text-neutral-600">Picked Up (30 days)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Package List */}
      <div className="space-y-4">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-neutral-900">{pkg.carrier}</h3>
                    {getStatusBadge(pkg.status)}
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">Tracking: {pkg.tracking}</p>

                  {pkg.status === 'delivered' && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span>Location: {pkg.location}</span>
                      </div>
                      <p className="text-sm text-neutral-600">
                        Delivered {new Date(pkg.deliveredAt).toLocaleString()}
                      </p>
                      {pkg.lockerCode && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <QrCode className="w-4 h-4 text-yellow-700" />
                            <span className="text-sm font-medium text-yellow-900">Locker Code</span>
                          </div>
                          <p className="text-2xl font-bold text-yellow-700">{pkg.lockerCode}</p>
                        </div>
                      )}
                    </>
                  )}

                  {pkg.status === 'in_transit' && (
                    <p className="text-sm text-neutral-600">
                      Expected delivery: {new Date(pkg.expectedDelivery).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {pkg.status === 'delivered' && !pkg.pickedUp && (
                <Button variant="primary" size="sm">
                  Mark as Picked Up
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
