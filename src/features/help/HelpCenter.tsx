import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Search, FileText, DollarSign, Wrench, Book, Settings, HelpCircle, Mail, Phone, MessageCircle, Send, X } from 'lucide-react';

type Category = 'getting-started' | 'payments' | 'maintenance' | 'documents' | 'account' | 'troubleshooting';

interface Article {
  id: string;
  title: string;
  description: string;
  category: Category;
  icon: React.ReactNode;
}

export function HelpCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({
    issue_type: 'technical',
    subject: '',
    description: '',
    priority: 'normal',
  });

  const popularArticles: Article[] = [
    {
      id: '1',
      title: 'How to make a rent payment',
      description: 'Step-by-step guide to making payments through the platform',
      category: 'payments',
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
    },
    {
      id: '2',
      title: 'Submitting a maintenance request',
      description: 'Learn how to report and track maintenance issues',
      category: 'maintenance',
      icon: <Wrench className="w-6 h-6 text-orange-600" />,
    },
    {
      id: '3',
      title: 'Understanding your lease',
      description: 'Important information about your lease agreement',
      category: 'documents',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
    },
    {
      id: '4',
      title: 'Setting up auto-pay',
      description: 'Automate your rent payments for convenience',
      category: 'payments',
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
    },
    {
      id: '5',
      title: 'Viewing and downloading documents',
      description: 'Access your important documents anytime',
      category: 'documents',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
    },
    {
      id: '6',
      title: 'Contacting your property manager',
      description: 'Different ways to reach your property management team',
      category: 'getting-started',
      icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
    },
  ];

  const categories = [
    {
      id: 'getting-started' as Category,
      name: 'Getting Started',
      description: 'New to the platform? Start here',
      icon: <Book className="w-8 h-8 text-blue-600" />,
    },
    {
      id: 'payments' as Category,
      name: 'Payments & Billing',
      description: 'Manage your payments and billing',
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
    },
    {
      id: 'maintenance' as Category,
      name: 'Maintenance Requests',
      description: 'Submit and track requests',
      icon: <Wrench className="w-8 h-8 text-orange-600" />,
    },
    {
      id: 'documents' as Category,
      name: 'Documents & Leases',
      description: 'Access your documents',
      icon: <FileText className="w-8 h-8 text-purple-600" />,
    },
    {
      id: 'account' as Category,
      name: 'Account Settings',
      description: 'Manage your account',
      icon: <Settings className="w-8 h-8 text-gray-600" />,
    },
    {
      id: 'troubleshooting' as Category,
      name: 'Troubleshooting',
      description: 'Common issues and solutions',
      icon: <HelpCircle className="w-8 h-8 text-red-600" />,
    },
  ];

  const filteredArticles = popularArticles.filter(article => {
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSubmitTicket = () => {
    if (!supportForm.subject || !supportForm.description) {
      alert('Please fill in all required fields');
      return;
    }
    if (supportForm.description.length < 50) {
      alert('Description must be at least 50 characters');
      return;
    }
    alert('Support ticket submitted successfully! We\'ll respond within 24 hours.');
    setShowSupportModal(false);
    setSupportForm({
      issue_type: 'technical',
      subject: '',
      description: '',
      priority: 'normal',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-sm text-blue-100 mb-4">
            <button onClick={() => navigate('/dashboard')} className="hover:text-white flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Help Center</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">How can we help you?</h1>

          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for articles..."
                className="w-full pl-12 pr-4 py-4 rounded-lg shadow-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.slice(0, 6).map(article => (
              <button
                key={article.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{article.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600">{article.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`bg-white rounded-lg shadow hover:shadow-lg transition-all p-6 text-left ${
                  selectedCategory === category.id ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700"
            >
              ← Back to all categories
            </button>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Still need help?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-4">support@okey.com</p>
              <p className="text-xs text-gray-500">Response within 24 hours</p>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-sm text-gray-600 mb-4">1-800-OKEY-HELP</p>
              <p className="text-xs text-gray-500">Mon-Fri 9am-6pm EST</p>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 mb-4">Start Chat</button>
              <p className="text-xs text-gray-500">Available 24/7</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowSupportModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit a Support Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Support Ticket Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Submit Support Ticket</h2>
              <button onClick={() => setShowSupportModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type *</label>
                <select
                  value={supportForm.issue_type}
                  onChange={(e) => setSupportForm({ ...supportForm, issue_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="billing">Billing</option>
                  <option value="technical">Technical</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input
                  type="text"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description * (min 50 characters)
                </label>
                <textarea
                  value={supportForm.description}
                  onChange={(e) => setSupportForm({ ...supportForm, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide as much detail as possible..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {supportForm.description.length} / 50 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <div className="flex gap-4">
                  {[
                    { value: 'low', label: 'Low' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'high', label: 'High' },
                  ].map(priority => (
                    <label key={priority.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={priority.value}
                        checked={supportForm.priority === priority.value}
                        onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{priority.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTicket}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
