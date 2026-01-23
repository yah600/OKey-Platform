import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, FileText, AlertTriangle, Send } from 'lucide-react';

const emergencyContacts = [
  { name: 'Property Manager', phone: '(514) 555-0100', role: 'Primary Contact' },
  { name: 'Emergency Maintenance', phone: '(514) 555-0101', role: '24/7 Service' },
  { name: 'Police', phone: '911', role: 'Emergency' },
  { name: 'Fire Department', phone: '911', role: 'Emergency' },
  { name: 'Hospital', phone: '(514) 555-1000', role: 'Medical' },
];

const procedures = [
  { title: 'Fire Emergency', steps: ['Pull fire alarm', 'Evacuate immediately', 'Call 911', 'Meet at assembly point'] },
  { title: 'Flood/Water Leak', steps: ['Shut off water main', 'Move valuables to dry area', 'Call emergency maintenance', 'Document damage'] },
  { title: 'Gas Leak', steps: ['Do not use electrical switches', 'Evacuate building', 'Call gas company', 'Call 911'] },
  { title: 'Power Outage', steps: ['Check circuit breakers', 'Call utility company', 'Use emergency lighting', 'Wait for restoration'] },
];

export function EmergencyProtocols() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/owner/properties')} className="p-2 hover:bg-neutral-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Emergency Protocols</h1>
                <p className="text-sm text-neutral-600">Emergency contacts and procedures</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Broadcast Alert
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Emergency Contacts */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-neutral-900">Emergency Contacts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact) => (
                <div key={contact.name} className="p-4 bg-neutral-50 rounded-lg">
                  <div className="font-semibold text-neutral-900">{contact.name}</div>
                  <div className="text-sm text-neutral-600">{contact.role}</div>
                  <div className="text-lg font-bold text-primary-600 mt-2">{contact.phone}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Procedures */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-neutral-900">Emergency Procedures</h2>
            </div>
            <div className="space-y-4">
              {procedures.map((procedure) => (
                <div key={procedure.title} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-700" />
                    <h3 className="font-semibold text-neutral-900">{procedure.title}</h3>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-neutral-700">
                    {procedure.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyProtocols;
