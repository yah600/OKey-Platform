import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useMessagesStore } from '../../store/messagesStore';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { toast } from 'sonner';

const composeMessageSchema = z.object({
  recipient: z.string().min(1, 'Please select a recipient'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(100, 'Subject too long'),
  body: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
});

type ComposeMessageFormData = z.infer<typeof composeMessageSchema>;

interface ComposeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComposeMessageModal({ isOpen, onClose }: ComposeMessageModalProps) {
  const { user } = useAuthStore();
  const { sendMessage } = useMessagesStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<ComposeMessageFormData>({
    resolver: zodResolver(composeMessageSchema),
    defaultValues: {
      recipient: 'property-manager',
    },
  });

  const bodyLength = watch('body')?.length || 0;

  const onSubmit = async (data: ComposeMessageFormData) => {
    if (!user) return;

    try {
      // Simulate sending delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get recipient info based on selection
      const recipientMap: Record<string, { id: string; name: string; role: 'owner' | 'manager' }> = {
        'property-manager': { id: 'owner-1', name: 'Property Manager', role: 'manager' },
        'building-manager': { id: 'manager-1', name: 'Building Manager', role: 'manager' },
        'maintenance': { id: 'maint-1', name: 'Maintenance Team', role: 'manager' },
      };

      const recipient = recipientMap[data.recipient];

      sendMessage({
        conversationId: `conv-${Date.now()}`,
        senderId: user.id,
        senderName: user.name,
        senderRole: 'tenant',
        recipientId: recipient.id,
        recipientName: recipient.name,
        subject: data.subject,
        body: data.body,
        propertyId: 'prop-1',
        unitId: 'unit-1',
      });

      setShowSuccess(true);

      toast.success('Message Sent!', {
        description: `Your message to ${recipient.name} has been sent.`,
      });

      setTimeout(() => {
        setShowSuccess(false);
        reset();
        onClose();
      }, 2000);
    } catch (error) {
      toast.error('Send Failed', {
        description: 'Please try again or contact support.',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="glass-card relative">
          {showSuccess ? (
            // Success State
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Message Sent!</h2>
              <p className="text-sm text-neutral-600">
                Your message has been delivered successfully.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 mb-1">
                    New Message
                  </h2>
                  <p className="text-sm text-neutral-600">
                    Send a message to your property team
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Recipient */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    To <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('recipient')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.recipient
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                    } focus:outline-none focus:ring-2 transition-colors`}
                  >
                    <option value="property-manager">Property Manager</option>
                    <option value="building-manager">Building Manager</option>
                    <option value="maintenance">Maintenance Team</option>
                  </select>
                  {errors.recipient && (
                    <p className="mt-1 text-sm text-red-600">{errors.recipient.message}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('subject')}
                    type="text"
                    placeholder="e.g., Question about parking"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.subject
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                    } focus:outline-none focus:ring-2 transition-colors`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('body')}
                    rows={8}
                    placeholder="Type your message here..."
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.body
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-neutral-200 focus:border-primary-500 focus:ring-primary-500/20'
                    } focus:outline-none focus:ring-2 transition-colors resize-none`}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <div>
                      {errors.body && (
                        <p className="text-sm text-red-600">{errors.body.message}</p>
                      )}
                    </div>
                    <p className={`text-xs ${bodyLength > 2000 ? 'text-red-600' : 'text-neutral-500'}`}>
                      {bodyLength} / 2000 characters
                    </p>
                  </div>
                </div>

                {/* Quick Message Templates */}
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-xs font-medium text-neutral-700 mb-2">Quick Templates:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const templates = {
                          subject: 'Maintenance Request Follow-up',
                          body: 'I wanted to follow up on my maintenance request submitted on [date]. Could you provide an update on the status?',
                        };
                        // Would use setValue from react-hook-form in production
                      }}
                    >
                      Maintenance Follow-up
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Template for parking inquiry
                      }}
                    >
                      Parking Inquiry
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Template for lease question
                      }}
                    >
                      Lease Question
                    </Button>
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900">
                    <strong>Note:</strong> Messages are typically responded to within 24-48 hours during
                    business days. For urgent maintenance issues, please call the emergency line.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-neutral-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    loading={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
