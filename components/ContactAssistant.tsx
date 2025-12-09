import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck, FaPaperPlane } from 'react-icons/fa';
import {
  recommendServices,
  generateConsultationPlan
} from '../services/geminiService';
import { sendEmailData } from '../services/emailService';
import { jsPDF } from 'jspdf';
import { useContent } from '../src/hooks/useContent';
import { Service } from '../types';
import { getLocalizedField } from '../src/utils/localization';

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
  const { t, i18n } = useTranslation();
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

  // Fetch services for dropdown
  const { data: servicesData } = useContent<Service>('services');

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
    'increase_sales', 'brand_awareness', 'generate_leads',
    'improve_ux', 'expand_market', 'launch_products',
    'optimize_ops', 'enhance_support'
  ];

  const challengeOptions = [
    'low_traffic', 'poor_conversion', 'weak_brand',
    'no_presence', 'tech_issues', 'mobile_response',
    'slow_speed', 'ineffective_marketing', 'budget_constraints'
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
        currentChallenges: formData.challenges.map(c => t(`contact_assistant.options.challenges.${c}`)),
        goals: formData.goals.map(g => t(`contact_assistant.options.goals.${g}`)),
        budget: formData.budget,
        timeline: formData.timeline
      });

      // Get consultation plan
      const consultationPlan = await generateConsultationPlan({
        businessType: formData.industry,
        specificNeeds: formData.goals.map(g => t(`contact_assistant.options.goals.${g}`)),
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
    doc.text(t('contact_assistant.pdf.title'), pageWidth - margin - 45, yPos + 4);
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
    doc.text(t('contact_assistant.pdf.client_details'), leftColX, yPos);
    yPos += 6;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`${t('contact_assistant.form.name')}: ${formData.name}`, leftColX, yPos); yPos += 5;
    doc.text(`${t('contact_assistant.form.email')}: ${formData.email}`, leftColX, yPos); yPos += 5;
    doc.text(`${t('contact_assistant.form.company')}: ${formData.company || 'N/A'}`, leftColX, yPos); yPos += 5;
    doc.text(`${t('contact_assistant.form.industry')}: ${formData.industry}`, leftColX, yPos);

    // Right Column: Project Overview
    let rightY = startY;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(t('contact_assistant.pdf.project_overview'), rightColX, rightY);
    rightY += 6;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`Type: ${formData.projectType}`, rightColX, rightY); rightY += 5;
    doc.text(`${t('contact_assistant.form.budget')}: ${formData.budget}`, rightColX, rightY); rightY += 5;
    doc.text(`${t('contact_assistant.form.timeline')}: ${formData.timeline}`, rightColX, rightY);

    yPos = Math.max(yPos, rightY) + 10;

    // --- Goals & Challenges (Compact) ---
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 2, 2, 'F');

    let boxY = yPos + 6;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`${t('contact_assistant.pdf.goals')}:`, margin + 5, boxY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(formData.goals.map(g => t(`contact_assistant.options.goals.${g}`)).join(', '), margin + 20, boxY);

    boxY += 8;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`${t('contact_assistant.pdf.challenges')}:`, margin + 5, boxY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    // Handle wrapping for challenges if long
    const challengesText = formData.challenges.map(c => t(`contact_assistant.options.challenges.${c}`)).join(', ');
    const splitChallenges = doc.splitTextToSize(challengesText, pageWidth - (margin * 2) - 30);
    doc.text(splitChallenges, margin + 28, boxY);

    yPos += 35;

    // --- AI Strategic Recommendations ---
    if (aiInsights) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.setFont('helvetica', 'bold');
      doc.setFont('helvetica', 'bold');
      doc.text(t('contact_assistant.pdf.recommendations'), margin, yPos);
      yPos += 8;

      // Recommended Services
      if (aiInsights.services?.priorityServices) {
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(t('contact_assistant.pdf.recommended_services'), margin, yPos);
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
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(t('contact_assistant.pdf.action_plan'), margin, yPos);
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
    doc.setTextColor(0, 102, 204);
    doc.setFont('helvetica', 'bold');
    doc.text(t('contact_assistant.pdf.cta_title'), margin + 5, ctaY + 6);

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(t('contact_assistant.pdf.cta_text'), margin + 5, ctaY + 11);

    // --- Footer ---
    const footerY = pageHeight - 15;
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(t('contact_assistant.pdf.generated_by'), margin, footerY);
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
        className="bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-zinc-700 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{t('contact_assistant.title')}</h3>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">{t('contact_assistant.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4 flex-shrink-0">
          <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">{t('contact_assistant.steps.step_x_of_y', { current: Math.min(step, 5), total: 5 })}</p>
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
                  <FaCheck className="w-10 h-10 text-green-600 dark:text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('contact_assistant.success.title')}</h3>
                <p className="text-slate-600 dark:text-zinc-300 mb-6 max-w-md mx-auto">
                  {t('contact_assistant.success.message')}
                </p>
                <div className="p-4 bg-slate-100 dark:bg-zinc-800/50 rounded-lg border border-slate-200 dark:border-zinc-700 max-w-sm mx-auto">
                  <p className="text-sm text-slate-600 dark:text-zinc-400 mb-2">{t('contact_assistant.success.pdf_summary')}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-500">{t('contact_assistant.success.check_downloads')}</p>
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
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t('contact_assistant.steps.1')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">{t('contact_assistant.form.name')} *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-500"
                          placeholder={t('contact_assistant.form.name_placeholder')}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">{t('contact_assistant.form.email')} *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-500"
                          placeholder={t('contact_assistant.form.email_placeholder')}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">{t('contact_assistant.form.company')}</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-500"
                        placeholder={t('contact_assistant.form.company_placeholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">{t('contact_assistant.form.industry')} *</label>
                      <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-500"
                        placeholder={t('contact_assistant.form.industry_placeholder')}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Project Details */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t('contact_assistant.steps.2')}</h4>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">{t('contact_assistant.form.project_type')} *</label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                        className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">{t('contact_assistant.form.select_project_type')}</option>
                        {servicesData.map((service) => (
                          <option key={service.id || getLocalizedField(service.title, 'en')} value={getLocalizedField(service.title, 'en')}>
                            {getLocalizedField(service.title, i18n.language) || 'Service'}
                          </option>
                        ))}
                        <option value="Other">{t('contact_assistant.form.other')}</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">{t('contact_assistant.form.budget')} *</label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">{t('contact_assistant.form.select_budget')}</option>
                          <option value="Starter ($299 - $999)">{t('contact_assistant.options.budget.starter')}</option>
                          <option value="Professional ($1,000 - $5,000)">{t('contact_assistant.options.budget.professional')}</option>
                          <option value="Enterprise ($5,000+)">{t('contact_assistant.options.budget.enterprise')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">{t('contact_assistant.form.timeline')} *</label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                          className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">{t('contact_assistant.form.select_timeline')}</option>
                          <option value="Immediate (1-2 weeks)">{t('contact_assistant.options.timeline.immediate')}</option>
                          <option value="Short-term (1-2 months)">{t('contact_assistant.options.timeline.short_term')}</option>
                          <option value="Medium-term (3-6 months)">{t('contact_assistant.options.timeline.medium_term')}</option>
                          <option value="Long-term (6+ months)">{t('contact_assistant.options.timeline.long_term')}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Goals */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t('contact_assistant.steps.3')}</h4>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm mb-4">{t('contact_assistant.steps.select_all')}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {goalOptions.map(goal => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => toggleMultiSelect(goal, 'goals')}
                          className={`p-3 rounded-lg text-sm transition-all ${formData.goals.includes(goal)
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-600'
                            }`}
                        >
                          {t(`contact_assistant.options.goals.${goal}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Challenges */}
                {step === 4 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t('contact_assistant.steps.4')}</h4>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm mb-4">{t('contact_assistant.steps.select_all')}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {challengeOptions.map(challenge => (
                        <button
                          key={challenge}
                          type="button"
                          onClick={() => toggleMultiSelect(challenge, 'challenges')}
                          className={`p-3 rounded-lg text-sm transition-all ${formData.challenges.includes(challenge)
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-600'
                            }`}
                        >
                          {t(`contact_assistant.options.challenges.${challenge}`)}
                        </button>
                      ))}
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">{t('contact_assistant.steps.additional_message')}</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                        placeholder={t('contact_assistant.form.message_placeholder')}
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: AI Insights */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t('contact_assistant.steps.5')}</h4>
                    {isAnalyzing ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-slate-600 dark:text-zinc-300">{t('contact_assistant.ai.analyzing')}</p>
                      </div>
                    ) : aiInsights ? (
                      <div className="space-y-6">
                        {/* Service Recommendations */}
                        {aiInsights.services?.priorityServices && (
                          <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-slate-200 dark:border-zinc-700">
                            <h5 className="text-slate-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
                              <span className="text-blue-600 dark:text-blue-400">★</span> {t('contact_assistant.ai.recommended_services')}
                            </h5>
                            <div className="space-y-3">
                              {aiInsights.services.priorityServices.slice(0, 3).map((service: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-zinc-700/30 rounded-lg border border-slate-200 dark:border-zinc-600/50">
                                  <div>
                                    <p className="text-slate-900 dark:text-white font-medium">{service.service}</p>
                                    <p className="text-slate-500 dark:text-zinc-400 text-xs mt-1">{service.reason}</p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${service.priority === 'High' ? 'bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/30' :
                                    service.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 border border-yellow-500/30' : 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30'
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
                          <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-slate-200 dark:border-zinc-700">
                            <h5 className="text-slate-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
                              <span className="text-green-600 dark:text-green-400">📋</span> {t('contact_assistant.ai.action_plan')}
                            </h5>
                            <div className="space-y-3">
                              <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed italic">"{aiInsights.consultation.summary}"</p>
                              {aiInsights.consultation.keyPoints && (
                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-700">
                                  <p className="text-xs text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-2">{t('contact_assistant.ai.key_focus_areas')}</p>
                                  <ul className="grid grid-cols-1 gap-2">
                                    {aiInsights.consultation.keyPoints.map((point: string, idx: number) => (
                                      <li key={idx} className="text-slate-600 dark:text-zinc-400 text-sm flex items-start gap-2">
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
          <div className="p-6 border-t border-slate-200 dark:border-zinc-700 flex justify-between flex-shrink-0">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('contact_assistant.buttons.back')}
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
                {step === 4 ? t('contact_assistant.buttons.get_insights') : t('contact_assistant.buttons.next')}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-green-500/20 flex items-center gap-2"
              >
                <span>{t('contact_assistant.buttons.submit')}</span>
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