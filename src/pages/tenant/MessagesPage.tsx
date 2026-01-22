import { useState, useEffect } from 'react';
import { Mail, Send } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';

export default function MessagesPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const messages = [
    { id: 1, from: 'Property Manager', subject: 'Lease Renewal Reminder', preview: 'Your lease is set to expire on Dec 31, 2026...', date: '2026-01-20', unread: true },
    { id: 2, from: 'Property Manager', subject: 'Maintenance Update', preview: 'The kitchen faucet repair has been scheduled...', date: '2026-01-18', unread: false },
    { id: 3, from: 'Building Manager', subject: 'Monthly Newsletter', preview: 'Check out what is happening this month...', date: '2026-01-15', unread: false },
  ];

  if (isLoading) {
    return <div className="p-6"><Loading /></div>;
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Messages</h1>
          <p className="text-sm text-neutral-600">Communicate with your property manager</p>
        </div>
        <Button variant="primary">
          <Send className="w-4 h-4" />
          New Message
        </Button>
      </div>

      <div className="space-y-3">
        {messages.map((message) => (
          <Card key={message.id} className={message.unread ? 'border-l-4 border-l-blue-500' : ''}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-neutral-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={message.unread ? 'text-sm font-semibold text-neutral-900' : 'text-sm font-medium text-neutral-900'}>
                      {message.from}
                    </h3>
                    {message.unread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className={message.unread ? 'text-sm font-medium text-neutral-900 mb-1' : 'text-sm text-neutral-900 mb-1'}>
                    {message.subject}
                  </p>
                  <p className="text-xs text-neutral-600 line-clamp-1">{message.preview}</p>
                </div>
              </div>
              <p className="text-xs text-neutral-500">{new Date(message.date).toLocaleDateString()}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
