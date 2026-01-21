import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Image as ImageIcon, AlertCircle, CheckCircle, Wrench, Home, Droplet, Zap, Wind, ThermometerSun } from 'lucide-react';

interface MaintenanceRequestFormProps {
  onClose: () => void;
  onSubmit: (data: MaintenanceRequest) => void;
  propertyInfo: {
    name: string;
    unit: string;
  };
}

interface MaintenanceRequest {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  title: string;
  description: string;
  preferredTime: string;
  allowEntry: boolean;
  images: File[];
}

const categories = [
  { id: 'plumbing', label: 'Plumbing', icon: Droplet, color: 'blue' },
  { id: 'electrical', label: 'Electrical', icon: Zap, color: 'amber' },
  { id: 'hvac', label: 'HVAC', icon: Wind, color: 'cyan' },
  { id: 'appliance', label: 'Appliance', icon: ThermometerSun, color: 'orange' },
  { id: 'structural', label: 'Structural', icon: Home, color: 'slate' },
  { id: 'other', label: 'Other', icon: Wrench, color: 'neutral' },
];

const priorities = [
  { id: 'low', label: 'Low Priority', description: 'Can wait a few days', color: 'bg-neutral-100 text-neutral-700 border-neutral-300' },
  { id: 'medium', label: 'Medium Priority', description: 'Should be addressed soon', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { id: 'high', label: 'High Priority', description: 'Needs attention quickly', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { id: 'emergency', label: 'Emergency', description: 'Immediate attention required', color: 'bg-red-100 text-red-700 border-red-300' },
];

export function MaintenanceRequestForm({ onClose, onSubmit, propertyInfo }: MaintenanceRequestFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<MaintenanceRequest>({
    category: '',
    priority: 'medium',
    title: '',
    description: '',
    preferredTime: '',
    allowEntry: false,
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: [...formData.images, ...files] });

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const canProceedToStep2 = formData.category && formData.priority;
  const canProceedToStep3 = formData.title && formData.description;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">New Maintenance Request</h2>
              <p className="text-neutral-600 mt-1">{propertyInfo.name} - Unit {propertyInfo.unit}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-neutral-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                  s < step ? 'bg-blue-600' :
                  s === step ? 'bg-blue-400' :
                  'bg-neutral-200'
                }`} />
                {s < 3 && <div className="w-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">What type of issue are you experiencing?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = formData.category === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setFormData({ ...formData, category: category.id })}
                        className={`p-4 border-2 rounded-xl transition-all text-left ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-blue-600' : 'text-neutral-400'}`} />
                        <div className={`font-medium ${isSelected ? 'text-blue-900' : 'text-neutral-900'}`}>
                          {category.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">How urgent is this issue?</h3>
                <div className="space-y-3">
                  {priorities.map((priority) => {
                    const isSelected = formData.priority === priority.id;
                    return (
                      <button
                        key={priority.id}
                        onClick={() => setFormData({ ...formData, priority: priority.id as any })}
                        className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                          isSelected ? priority.color + ' border-current' : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold mb-1">{priority.label}</div>
                            <div className="text-sm opacity-75">{priority.description}</div>
                          </div>
                          {isSelected && <CheckCircle className="w-5 h-5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Request Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Leaky faucet in kitchen sink"
                  className="input-premium w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Please provide as much detail as possible about the issue, including when it started and any relevant information..."
                  rows={6}
                  className="input-premium w-full resize-none"
                />
                <div className="mt-2 text-sm text-neutral-500">
                  {formData.description.length} / 1000 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Upload Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                      <ImageIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium text-neutral-900 mb-1">
                      Click to upload images
                    </div>
                    <div className="text-xs text-neutral-500">
                      PNG, JPG up to 10MB each
                    </div>
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Preferred Time for Repair
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="input-premium w-full"
                >
                  <option value="">No preference</option>
                  <option value="morning">Morning (8 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 8 PM)</option>
                  <option value="weekend">Weekend</option>
                </select>
              </div>

              <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowEntry}
                    onChange={(e) => setFormData({ ...formData, allowEntry: e.target.checked })}
                    className="mt-1 w-5 h-5 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-semibold text-neutral-900 mb-1">
                      Permission to Enter
                    </div>
                    <div className="text-sm text-neutral-600">
                      I authorize maintenance staff to enter my unit if I'm not home
                    </div>
                  </div>
                </label>
              </div>

              <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-3">Request Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Category:</span>
                    <span className="font-medium text-blue-900 capitalize">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Priority:</span>
                    <span className="font-medium text-blue-900 capitalize">{formData.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Title:</span>
                    <span className="font-medium text-blue-900">{formData.title}</span>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-700">Photos:</span>
                      <span className="font-medium text-blue-900">{formData.images.length} attached</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <div className="font-semibold mb-1">Emergency Situations</div>
                  <div>
                    For immediate emergencies (gas leaks, flooding, no heat in winter), please call our 24/7 emergency line: <span className="font-bold">(514) 555-HELP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t bg-neutral-50 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 text-neutral-700 hover:bg-neutral-100 rounded-xl font-medium transition-colors"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !canProceedToStep2 : !canProceedToStep3}
                className="px-6 py-2.5 gradient-primary text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 gradient-success text-white rounded-xl font-semibold hover:shadow-xl transition-all"
              >
                Submit Request
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
