import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck } from 'react-icons/fa';
import {
  recommendServices,
  generateConsultationPlan,
  estimateProject
} from '../services/geminiService';

interface ContactAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  industry: string;
  projectType: string;
  budget: string;
  timeline: string;
  goals: string[];
  challenges: string[];
  message: string;
}

const ContactAssistant: React.FC<ContactAssistantProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    industry: '',
    projectType: '',
    budget: '',
    timeline: '',
    goals: [],
    challenges: [],
    message: ''
  });
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const goalOptions = [
    'Increase Sales', 'Build Brand Awareness', 'Generate Leads',
    'Improve User Experience', 'Expand Market Reach', 'Launch New Products',
    'Optimize Operations', 'Enhance Customer Support'
  ];

  const challengeOptions = [
    'Low Website Traffic', 'Poor Conversion Rates', 'Weak Brand Identity',
    'Lack of Online Presence', 'Technical Issues', 'Mobile Responsiveness',
    'Slow Loading Speed', 'Ineffective Marketing', 'Budget Constraints'
  ];

  const toggleMultiSelect = (option: string, field: 'goals' | 'challenges') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(option)
        ? prev[field].filter(item => item !== option)
        : [...prev[field], option]
    }));
  };

  const generateAIInsights = async () => {
    setIsAnalyzing(true);
    try {
      // Get service recommendations
      const serviceRecs = await recommendServices({
        industry: formData.industry,
        currentChallenges: formData.challenges,
        goals: formData.goals,
        budget: formData.budget,
        timeline: formData.timeline
      });

      // Get consultation plan
      const consultationPlan = await generateConsultationPlan({
        businessType: formData.industry,
        specificNeeds: formData.goals,
        urgency: formData.timeline.includes('Immediate') ? 'Immediate' :
          formData.timeline.includes('1-2') ? 'High' : 'Medium',
        experience: 'Intermediate' // Default value
      });

      setAiInsights({
        services: serviceRecs,
        consultation: consultationPlan
      });
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      generateAIInsights();
      setStep(5);
    }
  };

  const handleSubmit = async () => {
    // Here you would normally send the form data to your backend
    console.log('Submitting form:', formData);
    setShowThankYou(true);

    // Auto close after 3 seconds
    setTimeout(() => {
      onClose();
      setShowThankYou(false);
      setStep(1);
      setFormData({
        name: '',
        email: '',
        company: '',
        industry: '',
        projectType: '',
        budget: '',
        timeline: '',
        goals: [],
        challenges: [],
        message: ''
      });
    }, 3000);
  };

  const getProgressPercentage = () => {
    return Math.min((step / 5) * 100, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-white">AI-Powered Contact Assistant</h3>
            <p className="text-slate-400 text-sm">Get personalized recommendations as you go</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">Step {Math.min(step, 5)} of 5</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            {showThankYou ? (
              <motion.div
                key="thank-you"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                <p className="text-slate-300">We've received your information and will contact you soon.</p>
              </motion.div>
            ) : (
              <>
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4">Let's get to know you</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
                          placeholder="Your full name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Industry *</label>
                      <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g., Healthcare, E-commerce, SaaS"
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Project Details */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4">Tell us about your project</h4>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Project Type *</label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        <option value="">Select project type</option>
                        <option value="Website Design">Website Design</option>
                        <option value="Web Application">Web Application</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="E-commerce Platform">E-commerce Platform</option>
                        <option value="Brand Identity">Brand Identity</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="SEO Services">SEO Services</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Budget Range *</label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500"
                          required
                        >
                          <option value="">Select budget</option>
                          <option value="$1K-$5K">$1K - $5K</option>
                          <option value="$5K-$15K">$5K - $15K</option>
                          <option value="$15K-$50K">$15K - $50K</option>
                          <option value="$50K+">$50K+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Timeline *</label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500"
                          required
                        >
                          <option value="">Select timeline</option>
                          <option value="Immediate (1-2 weeks)">Immediate (1-2 weeks)</option>
                          <option value="Short-term (1-2 months)">Short-term (1-2 months)</option>
                          <option value="Medium-term (3-6 months)">Medium-term (3-6 months)</option>
                          <option value="Long-term (6+ months)">Long-term (6+ months)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Goals */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4">What are your goals?</h4>
                    <p className="text-slate-400 text-sm mb-4">Select all that apply</p>

                    <div className="grid grid-cols-2 gap-3">
                      {goalOptions.map(goal => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => toggleMultiSelect(goal, 'goals')}
                          className={`p-3 rounded-lg text-sm transition-all ${formData.goals.includes(goal)
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Challenges */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4">What challenges are you facing?</h4>
                    <p className="text-slate-400 text-sm mb-4">Select all that apply</p>

                    <div className="grid grid-cols-2 gap-3">
                      {challengeOptions.map(challenge => (
                        <button
                          key={challenge}
                          type="button"
                          onClick={() => toggleMultiSelect(challenge, 'challenges')}
                          className={`p-3 rounded-lg text-sm transition-all ${formData.challenges.includes(challenge)
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        >
                          {challenge}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Additional Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                        placeholder="Tell us more about your project..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 5: AI Insights */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4">AI-Powered Recommendations</h4>

                    {isAnalyzing ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4"></div>
                        <p className="text-slate-300">Analyzing your requirements...</p>
                      </div>
                    ) : aiInsights ? (
                      <div className="space-y-6">
                        {/* Service Recommendations */}
                        {aiInsights.services?.priorityServices && (
                          <div className="bg-slate-800/50 rounded-xl p-6">
                            <h5 className="text-white font-semibold mb-4">Recommended Services</h5>
                            <div className="space-y-3">
                              {aiInsights.services.priorityServices.slice(0, 3).map((service: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                                  <div>
                                    <p className="text-white font-medium">{service.service}</p>
                                    <p className="text-slate-400 text-sm">{service.reason}</p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${service.priority === 'High' ? 'bg-red-600' :
                                      service.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                                    } text-white`}>
                                    {service.priority}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Consultation Plan */}
                        {aiInsights.consultation && (
                          <div className="bg-slate-800/50 rounded-xl p-6">
                            <h5 className="text-white font-semibold mb-4">Your Consultation Plan</h5>
                            <div className="space-y-3">
                              <div className="p-3 bg-emerald-600/20 border border-emerald-500/30 rounded-lg">
                                <p className="text-emerald-300 font-medium">
                                  {aiInsights.consultation.consultationType} ({aiInsights.consultation.recommendedDuration})
                                </p>
                              </div>
                              {aiInsights.consultation.personalizedMessage && (
                                <p className="text-slate-300 italic">
                                  "{aiInsights.consultation.personalizedMessage}"
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!showThankYou && (
          <div className="p-6 border-t border-slate-700 flex justify-between">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {step < 5 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!formData.name || !formData.email || !formData.industry)) ||
                  (step === 2 && (!formData.projectType || !formData.budget || !formData.timeline)) ||
                  (step === 3 && formData.goals.length === 0) ||
                  (step === 4 && formData.challenges.length === 0)
                }
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 4 ? 'Get AI Insights' : 'Next'}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
              >
                Send Message
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContactAssistant;