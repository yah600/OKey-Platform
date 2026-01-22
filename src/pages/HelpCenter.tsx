import { useState } from 'react';
import { Search, BookOpen, Mail, MessageCircle, HelpCircle, FileText, DollarSign, Wrench, Building2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);

  const categories = [
    {
      icon: Building2,
      title: 'Property Management',
      articles: 8,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: DollarSign,
      title: 'Payments & Billing',
      articles: 12,
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: Wrench,
      title: 'Maintenance',
      articles: 6,
      color: 'text-amber-600 bg-amber-100',
    },
    {
      icon: FileText,
      title: 'Documents & Leases',
      articles: 10,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  const popularArticles = [
    { title: 'How to add a new property', category: 'Property Management', views: 1240 },
    { title: 'Setting up automatic rent collection', category: 'Payments & Billing', views: 980 },
    { title: 'Creating and managing maintenance requests', category: 'Maintenance', views: 856 },
    { title: 'Uploading and sharing documents', category: 'Documents & Leases', views: 742 },
    { title: 'Understanding your dashboard metrics', category: 'Property Management', views: 698 },
    { title: 'How to handle late payments', category: 'Payments & Billing', views: 654 },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 mb-2">How can we help?</h1>
          <p className="text-neutral-600">Search our knowledge base or browse categories below</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="hover:border-neutral-300 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={"w-12 h-12 rounded-lg flex items-center justify-center " + category.color}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">{category.title}</h3>
                    <p className="text-sm text-neutral-600">{category.articles} articles</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Popular Articles</h2>
          <Card>
            <div className="divide-y divide-neutral-100">
              {popularArticles.map((article, index) => (
                <button
                  key={index}
                  className="w-full flex items-start justify-between py-4 first:pt-0 last:pb-0 hover:opacity-70 transition-opacity text-left"
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900 mb-1">{article.title}</p>
                      <p className="text-xs text-neutral-500">{article.category}</p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-500">{article.views} views</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card className="bg-neutral-50">
          <div className="text-center">
            <HelpCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Can't find what you're looking for?</h3>
            <p className="text-sm text-neutral-600 mb-6">
              Our support team is here to help. Get in touch and we'll get back to you as soon as possible.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" onClick={() => setShowContactModal(true)}>
                <Mail className="w-4 h-4" />
                Contact Support
              </Button>
              <Button variant="secondary">
                <MessageCircle className="w-4 h-4" />
                Live Chat
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Contact Support</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Subject *</label>
                <input
                  type="text"
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Category *</label>
                <select className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Property Management</option>
                  <option>Payments & Billing</option>
                  <option>Maintenance</option>
                  <option>Documents & Leases</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Message *</label>
                <textarea
                  rows={5}
                  placeholder="Please describe your issue in detail"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowContactModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" className="flex-1">
                Send Message
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
