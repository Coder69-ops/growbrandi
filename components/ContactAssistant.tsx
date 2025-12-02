import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck, FaPaperPlane } from 'react-icons/fa';
import {
  recommendServices,
  generateConsultationPlan
} from '../services/geminiService';
import { sendEmailData } from '../services/emailService';
import { jsPDF } from 'jspdf';
import { SERVICES } from '../constants';

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

  // Load state from session storage on mount
  useEffect(() => {
    const savedState = sessionStorage.getItem('GROWBRANDI_CONTACT_STATE');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        if (parsedState) {
          if (parsedState.step) setStep(parsedState.step);
          if (parsedState.formData) setFormData(parsedState.formData);
          if (parsedState.aiInsights) setAiInsights(parsedState.aiInsights);
          if (parsedState.showThankYou !== undefined) setShowThankYou(parsedState.showThankYou);
        }
      } catch (e) {
        console.error("Failed to parse contact assistant state:", e);
      }
    }
  }, []);

  // Save state to session storage whenever it changes
  useEffect(() => {
    const stateToSave = {
      step,
      formData,
      aiInsights,
      showThankYou
    };
    sessionStorage.setItem('GROWBRANDI_CONTACT_STATE', JSON.stringify(stateToSave));
  }, [step, formData, aiInsights, showThankYou]);

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

  const generatePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = 20;

    // --- Header ---
    try {
      const logoUrl = '/growbrandi-logo.png';
      const img = new Image();
      img.src = logoUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      // Assuming logo is roughly 4:1 aspect ratio, adjust as needed
      doc.addImage(img, 'PNG', margin, yPos, 40, 10);
    } catch (e) {
      doc.setFontSize(20);
      doc.setTextColor(0, 102, 204);
      doc.setFont('helvetica', 'bold');
      doc.text('GrowBrandi', margin, yPos + 8);
    }

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    const dateStr = new Date().toLocaleDateString();
    doc.text('AI Consultation Summary', pageWidth - margin - 45, yPos + 4);
    doc.text(dateStr, pageWidth - margin - doc.getTextWidth(dateStr), yPos + 9);

    yPos += 20;

    // --- Line Separator ---
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // --- 2-Column Layout: Client & Project ---
    const colWidth = (pageWidth - (margin * 2) - 10) / 2;
    const leftColX = margin;
    const rightColX = margin + colWidth + 10;
    const startY = yPos;

    // Left Column: Client Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Client Details', leftColX, yPos);
    yPos += 6;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${formData.name}`, leftColX, yPos); yPos += 5;
    doc.text(`Email: ${formData.email}`, leftColX, yPos); yPos += 5;
    doc.text(`Company: ${formData.company || 'N/A'}`, leftColX, yPos); yPos += 5;
    doc.text(`Industry: ${formData.industry}`, leftColX, yPos);

    // Right Column: Project Overview
    let rightY = startY;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Project Overview', rightColX, rightY);
    rightY += 6;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`Type: ${formData.projectType}`, rightColX, rightY); rightY += 5;
    doc.text(`Budget: ${formData.budget}`, rightColX, rightY); rightY += 5;
    doc.text(`Timeline: ${formData.timeline}`, rightColX, rightY);

    yPos = Math.max(yPos, rightY) + 10;

    // --- Goals & Challenges (Compact) ---
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 2, 2, 'F');

    let boxY = yPos + 6;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Goals:', margin + 5, boxY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(formData.goals.join(', '), margin + 20, boxY);

    boxY += 8;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Challenges:', margin + 5, boxY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    // Handle wrapping for challenges if long
    const challengesText = formData.challenges.join(', ');
    const splitChallenges = doc.splitTextToSize(challengesText, pageWidth - (margin * 2) - 30);
    doc.text(splitChallenges, margin + 28, boxY);

    yPos += 35;

    // --- AI Strategic Recommendations ---
    if (aiInsights) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Strategic Recommendations', margin, yPos);
      yPos += 8;

      // Recommended Services
      if (aiInsights.services?.priorityServices) {
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text('Recommended Services', margin, yPos);
        yPos += 6;

        aiInsights.services.priorityServices.slice(0, 3).forEach((service: any) => {
          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.text(`• ${service.service}`, margin + 5, yPos);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 100, 100);
          const reasonText = ` - ${service.reason}`;
          const reasonLines = doc.splitTextToSize(reasonText, pageWidth - (margin * 2) - 50);
          doc.text(reasonLines, margin + 5 + doc.getTextWidth(`• ${service.service}`), yPos);

          yPos += (reasonLines.length * 4) + 2;
        });
      }
      yPos += 5;

      // Action Plan
      if (aiInsights.consultation) {
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Strategic Action Plan', margin, yPos);
        yPos += 6;

        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'italic');
        const summaryLines = doc.splitTextToSize(`"${aiInsights.consultation.summary}"`, pageWidth - (margin * 2));
        doc.text(summaryLines, margin, yPos);
        yPos += (summaryLines.length * 4) + 4;

        if (aiInsights.consultation.keyPoints) {
          doc.setFont('helvetica', 'normal');
          aiInsights.consultation.keyPoints.slice(0, 4).forEach((point: string) => {
            const pointLines = doc.splitTextToSize(`• ${point}`, pageWidth - (margin * 2) - 5);
            doc.text(pointLines, margin + 5, yPos);
            yPos += (pointLines.length * 4) + 1;
          });
        }
      }
    }

    // --- CTA Section ---
    const ctaY = pageHeight - 40;
    doc.setFillColor(240, 248, 255); // Light blue
    doc.rect(margin, ctaY, pageWidth - (margin * 2), 15, 'F');

    doc.setFontSize(10);
    doc.setTextColor(0, 102, 204);
    doc.setFont('helvetica', 'bold');
    doc.text('Ready to execute this plan?', margin + 5, ctaY + 6);

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text('Contact us for a detailed actionable plan tailored to your business.', margin + 5, ctaY + 11);

    // --- Footer ---
    const footerY = pageHeight - 15;
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by GrowBrandi AI Assistant', margin, footerY);
    doc.text('www.growbrandi.com', pageWidth - margin - doc.getTextWidth('www.growbrandi.com'), footerY);

    doc.save(`growbrandi-consultation-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleSubmit = async () => {
    // EmailJS Configuration
    const EMAILJS_SERVICE_ID = 'service_s9nqo1u';
    const EMAILJS_TEMPLATE_ID = 'template_wctqujg';
    const EMAILJS_PUBLIC_KEY = 'DETrhGT8sUUowOqIR';

    try {
      // Prepare data for EmailJS
      const emailData = {
        from_name: formData.name,
        from_email: formData.email,
        subject: `AI Consultation: ${formData.projectType} for ${formData.company || 'New Client'}`,
        message: `
            New AI Consultation Request
            
            User Details:
            - Name: ${formData.name}
            - Email: ${formData.email}
            - Company: ${formData.company}
            - Industry: ${formData.industry}
            
            Project Info:
            - Type: ${formData.projectType}
            - Budget: ${formData.budget}
            - Timeline: ${formData.timeline}
            
            Goals: ${formData.goals.join(', ')}
            Challenges: ${formData.challenges.join(', ')}
            
            Additional Message:
            ${formData.message}
            
            AI Recommendations:
            ${JSON.stringify(aiInsights, null, 2)}
          `
      };

      await sendEmailData(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailData, EMAILJS_PUBLIC_KEY);

      console.log('✅ Email sent successfully via EmailJS');
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      // Continue to show success screen even if email fails (fallback)
    }

    // Generate and download PDF
    try {
      await generatePDF();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }

    setShowThankYou(true);

    // Auto close after 5 seconds
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
    }, 5000);
  };

  const getProgressPercentage = () => {
    return Math.min((step / 5) * 100, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-700 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-white">AI-Powered Contact Assistant</h3>
            <p className="text-zinc-400 text-sm">Get personalized recommendations as you go</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4 flex-shrink-0">
          <div className="w-full bg-zinc-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-zinc-400 mt-2">Step {Math.min(step, 5)} of 5</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {showThankYou ? (
              <motion.div
                key="thank-you"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheck className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
                <p className="text-zinc-300 mb-6 max-w-md mx-auto">
                  We've captured your project details and AI insights. A GrowBrandi expert will review them and contact you shortly.
                </p>
                <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 max-w-sm mx-auto">
                  <p className="text-sm text-zinc-400 mb-2">A summary of your consultation has been downloaded automatically.</p>
                  <p className="text-xs text-zinc-500">Check your downloads folder for the PDF file.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Let's get to know you</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Industry *</label>
                      <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Healthcare, E-commerce, SaaS"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Project Details */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Tell us about your project</h4>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Project Type *</label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                        className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select project type</option>
                        {SERVICES.map((service) => (
                          <option key={service.title} value={service.title}>
                            {service.title}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Budget Range *</label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select budget</option>
                          <option value="Starter ($299 - $999)">Starter ($299 - $999)</option>
                          <option value="Professional ($1,000 - $5,000)">Professional ($1,000 - $5,000)</option>
                          <option value="Enterprise ($5,000+)">Enterprise ($5,000+)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Timeline *</label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
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
                  </div>
                )}

                {/* Step 3: Goals */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white mb-4">What are your goals?</h4>
                    <p className="text-zinc-400 text-sm mb-4">Select all that apply</p>
                    <div className="grid grid-cols-2 gap-3">
                      {goalOptions.map(goal => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => toggleMultiSelect(goal, 'goals')}
                          className={`p-3 rounded-lg text-sm transition-all ${formData.goals.includes(goal)
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                            }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Challenges */}
                {step === 4 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white mb-4">What challenges are you facing?</h4>
                    <p className="text-zinc-400 text-sm mb-4">Select all that apply</p>
                    <div className="grid grid-cols-2 gap-3">
                      {challengeOptions.map(challenge => (
                        <button
                          key={challenge}
                          type="button"
                          onClick={() => toggleMultiSelect(challenge, 'challenges')}
                          className={`p-3 rounded-lg text-sm transition-all ${formData.challenges.includes(challenge)
                            ? 'bg-red-600 text-white'
                            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                            }`}
                        >
                          {challenge}
                        </button>
                      ))}
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Additional Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                        placeholder="Tell us more about your project..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: AI Insights */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-white mb-4">AI-Powered Recommendations</h4>
                    {isAnalyzing ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-zinc-300">Analyzing your requirements...</p>
                      </div>
                    ) : aiInsights ? (
                      <div className="space-y-6">
                        {/* Service Recommendations */}
                        {aiInsights.services?.priorityServices && (
                          <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
                            <h5 className="text-white font-semibold mb-4 flex items-center gap-2">
                              <span className="text-blue-400">★</span> Recommended Services
                            </h5>
                            <div className="space-y-3">
                              {aiInsights.services.priorityServices.slice(0, 3).map((service: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-zinc-700/30 rounded-lg border border-zinc-600/50">
                                  <div>
                                    <p className="text-white font-medium">{service.service}</p>
                                    <p className="text-zinc-400 text-xs mt-1">{service.reason}</p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${service.priority === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                    service.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    }`}>
                                    {service.priority}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Consultation Plan */}
                        {aiInsights.consultation && (
                          <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
                            <h5 className="text-white font-semibold mb-4 flex items-center gap-2">
                              <span className="text-green-400">📋</span> Action Plan
                            </h5>
                            <div className="space-y-3">
                              <p className="text-zinc-300 text-sm leading-relaxed italic">"{aiInsights.consultation.summary}"</p>
                              {aiInsights.consultation.keyPoints && (
                                <div className="mt-4 pt-4 border-t border-zinc-700">
                                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Key Focus Areas</p>
                                  <ul className="grid grid-cols-1 gap-2">
                                    {aiInsights.consultation.keyPoints.map((point: string, idx: number) => (
                                      <li key={idx} className="text-zinc-400 text-sm flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">•</span>
                                        {point}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!showThankYou && (
          <div className="p-6 border-t border-zinc-700 flex justify-between flex-shrink-0">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-2 text-zinc-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                {step === 4 ? 'Get AI Insights' : 'Next'}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-green-500/20 flex items-center gap-2"
              >
                <span>Submit Request</span>
                <FaPaperPlane className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContactAssistant;