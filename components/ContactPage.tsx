import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FaMagic, FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaGithub, FaDribbble, FaInstagram, FaCheckCircle, FaRobot, FaWhatsapp, FaArrowRight, FaPhone } from 'react-icons/fa';
import { generateProjectBrief } from '../services/geminiService';
import { sendEmailData } from '../services/emailService';
import LoadingSpinner from './LoadingSpinner';
import ContactAssistant from './ContactAssistant';
import { CONTACT_INFO, SERVICES } from '../constants';
import { BackgroundEffects } from './ui/BackgroundEffects';
import { GlassCard } from './ui/GlassCard';
import { SectionHeading } from './ui/SectionHeading';

// --- ContactPage Component ---
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const ContactPage: React.FC = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        service: '',
        message: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState('');
    const [formStatus, setFormStatus] = useState<FormStatus>('idle');
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [aiContext, setAiContext] = useState<string | null>(null);
    const hasSentRef = useRef(false);

    // EmailJS Configuration
    const EMAILJS_SERVICE_ID = 'service_s9nqo1u';
    const EMAILJS_TEMPLATE_ID = 'template_wctqujg';
    const EMAILJS_PUBLIC_KEY = 'DETrhGT8sUUowOqIR';

    const serviceOptions = SERVICES.map(s => s.title);

    useEffect(() => {
        if (location.state && location.state.data) {
            const { source, data, userInfo, autoSend } = location.state;
            let formattedMessage = '';
            let subject = '';

            if (source === 'estimator') {
                subject = 'Project Estimation Inquiry';
                formattedMessage = `I used your AI Project Estimator.
Estimated Cost: ${data.estimatedCost}
Timeline: ${data.estimatedTimeline}
Recommendations: ${data.recommendations?.join(', ')}

I would like to discuss this estimation.`;
            } else if (source === 'recommender') {
                subject = 'Service Recommendation Inquiry';
                formattedMessage = `I used your AI Service Recommender.
Priority Services: ${data.priorityServices?.map((s: any) => s.service).join(', ')}

I'm interested in getting started with these services.`;
            } else if (source === 'analyzer') {
                subject = 'Growth Strategy Discussion';
                formattedMessage = `I used your Business Growth Analyzer.
Growth Potential: ${data.growthPotential}
Predictions: 1 Year - ${data.predictions?.oneYear}

I'd like to discuss a strategy to achieve these results.`;
            } else if (source === 'planner') {
                subject = 'Consultation Booking';
                formattedMessage = `I used your Consultation Planner.
Recommended Session: ${data.consultationType} (${data.recommendedDuration})
Topics: ${data.keyTopics?.join(', ')}

I would like to book this consultation.`;
            }

            if (formattedMessage) {
                const newFormData = {
                    name: userInfo?.name || '',
                    email: userInfo?.email || '',
                    subject: subject,
                    service: 'Brand Growth',
                    message: formattedMessage
                };

                setFormData(newFormData);
                setAiContext('We have pre-filled your message with the AI results.');

                if (autoSend && userInfo?.name && userInfo?.email && !hasSentRef.current) {
                    hasSentRef.current = true;
                    handleAutoSend(newFormData);
                }
            }
        }
    }, [location.state]);

    const handleAutoSend = async (data: any) => {
        setFormStatus('submitting');
        try {
            await sendEmailData(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                data,
                EMAILJS_PUBLIC_KEY
            );
            setFormStatus('success');
            setAiContext(null);
            // Reset success status after 8 seconds
            setTimeout(() => setFormStatus('idle'), 8000);
        } catch (error) {
            console.error("Auto-submission failed:", error);
            setFormStatus('error');
        }
    };

    const generateBrief = async () => {
        if (!formData.service || !formData.subject) {
            setAiError("Please select a Service and enter a Subject first.");
            return;
        }

        setIsGenerating(true);
        setAiError('');

        try {
            const result = await generateProjectBrief({
                service: formData.service,
                subject: formData.subject
            });

            if (result && result.brief) {
                setFormData(prev => ({ ...prev, message: result.brief }));
            } else {
                throw new Error("No brief generated");
            }
        } catch (err) {
            console.error(err);
            setAiError("Failed to generate brief. Please write your message manually.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');

        try {
            await sendEmailData(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                formData,
                EMAILJS_PUBLIC_KEY
            );

            setFormStatus('success');
            setFormData({ name: '', email: '', subject: '', service: '', message: '' });
            setAiContext(null);

            // Reset success status after 8 seconds to allow sending another message
            setTimeout(() => setFormStatus('idle'), 8000);
        } catch (error) {
            console.error("Submission failed:", error);
            setFormStatus('error');
        }
    }

    const inputClasses = (fieldName: string) => `
        w-full p-4 rounded-xl bg-white/50 dark:bg-zinc-900/50 border 
        ${focusedField === fieldName ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-white/10'} 
        focus:outline-none text-slate-900 dark:text-white transition-all duration-300 placeholder-slate-400 dark:placeholder-zinc-500 backdrop-blur-sm
    `;

    // Social Icon Mapping
    const getSocialIcon = (platform: string) => {
        switch (platform) {
            case 'linkedin': return FaLinkedin;
            case 'twitter': return FaTwitter;
            case 'instagram': return FaInstagram;
            case 'dribbble': return FaDribbble;
            case 'whatsapp': return FaWhatsapp;
            default: return FaGithub;
        }
    };

    return (
        <section id="contact" className="min-h-screen py-24 px-4 bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-white relative overflow-hidden flex flex-col justify-center transition-colors duration-300">
            <BackgroundEffects />

            <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">

                {/* Left Column: Info & Context */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col justify-center"
                >
                    <SectionHeading
                        badge="Get in Touch"
                        title="Let's Build"
                        highlight="Something Epic"
                        description="Ready to transform your digital presence? We're here to help you scale, innovate, and dominate your market with AI-driven solutions."
                        align="left"
                    />

                    <div className="mb-12">
                        <button
                            onClick={() => setIsAssistantOpen(true)}
                            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 hover:from-blue-600/20 hover:to-cyan-600/20 border border-blue-500/30 rounded-xl transition-all duration-300 backdrop-blur-md"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                <FaMagic className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm text-blue-500 dark:text-blue-400 font-bold uppercase tracking-wider">Not sure where to start?</p>
                                <p className="text-slate-900 dark:text-white font-semibold">Try our AI Project Assistant</p>
                            </div>
                        </button>
                    </div>

                    <div className="space-y-8 mb-12">
                        <GlassCard className="flex items-start space-x-4 p-4" hoverEffect={true}>
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                <FaEnvelope className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Email Us</h3>
                                <p className="text-slate-600 dark:text-zinc-400">{CONTACT_INFO.email}</p>
                                <p className="text-slate-400 dark:text-zinc-500 text-sm">Response within 24 hours</p>
                            </div>
                        </GlassCard>

                        <GlassCard className="flex items-start space-x-4 p-4" hoverEffect={true}>
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                                <FaPhone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Phone & WhatsApp</h3>
                                <p className="text-slate-600 dark:text-zinc-400">{CONTACT_INFO.phone}</p>
                                <a
                                    href={`https://wa.me/${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 dark:text-green-400 text-sm font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors inline-flex items-center gap-1 mt-1"
                                >
                                    Chat on WhatsApp <FaArrowRight className="w-3 h-3" />
                                </a>
                            </div>
                        </GlassCard>

                        <GlassCard className="flex items-start space-x-4 p-4" hoverEffect={true}>
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                                <FaMapMarkerAlt className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Global HQ</h3>
                                <p className="text-slate-600 dark:text-zinc-400">{CONTACT_INFO.address}</p>
                                <p className="text-slate-400 dark:text-zinc-500 text-sm">Digital-first agency</p>
                            </div>
                        </GlassCard>
                    </div>

                    <div className="flex space-x-4">
                        {Object.entries(CONTACT_INFO.social).map(([platform, url], idx) => {
                            const Icon = getSocialIcon(platform);
                            return (
                                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800/50 flex items-center justify-center border border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all duration-300 shadow-sm dark:shadow-none">
                                    <Icon className="w-4 h-4" />
                                </a>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Right Column: Interactive Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    <GlassCard className="p-6 md:p-10 relative overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                        <AnimatePresence mode='wait'>
                            {formStatus === 'success' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center justify-center h-full py-12 text-center"
                                >
                                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                                        <FaCheckCircle className="w-12 h-12 text-green-500" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-heading">Message Sent!</h3>
                                    <p className="text-slate-600 dark:text-zinc-400 max-w-md mx-auto mb-8">
                                        Thank you for reaching out. We have received your request and a confirmation email has been sent to your inbox. Our team will review your details and get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setFormStatus('idle')}
                                        className="px-8 py-3 bg-slate-900 dark:bg-zinc-800 hover:bg-slate-800 dark:hover:bg-zinc-700 text-white rounded-xl transition-colors border border-white/10"
                                    >
                                        Send Another Message
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-6 relative z-10"
                                >
                                    {aiContext && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3"
                                        >
                                            <FaRobot className="w-5 h-5 text-blue-400 mt-0.5" />
                                            <p className="text-sm text-blue-600 dark:text-blue-200">{aiContext}</p>
                                        </motion.div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                className={inputClasses('name')}
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                className={inputClasses('email')}
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="service" className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Service Interest</label>
                                            <select
                                                id="service"
                                                name="service"
                                                value={formData.service}
                                                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                                onFocus={() => setFocusedField('service')}
                                                onBlur={() => setFocusedField(null)}
                                                className={inputClasses('service')}
                                                required
                                            >
                                                <option value="" disabled>Select a service</option>
                                                {serviceOptions.map(s => <option key={s} value={s} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">Subject</label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                onFocus={() => setFocusedField('subject')}
                                                onBlur={() => setFocusedField(null)}
                                                className={inputClasses('subject')}
                                                placeholder="Project Inquiry"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label htmlFor="message" className="block text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Message</label>
                                            <motion.button
                                                type="button"
                                                onClick={generateBrief}
                                                disabled={isGenerating}
                                                className="text-xs flex items-center gap-1 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors disabled:opacity-50 font-medium"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FaMagic className="w-3 h-3" />
                                                {isGenerating ? 'Generating...' : 'Auto-Generate Brief'}
                                            </motion.button>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                onFocus={() => setFocusedField('message')}
                                                onBlur={() => setFocusedField(null)}
                                                className={inputClasses('message')}
                                                placeholder="Tell us about your project goals, timeline, and budget..."
                                                required
                                            ></textarea>
                                            {isGenerating && (
                                                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-20">
                                                    <LoadingSpinner />
                                                </div>
                                            )}
                                        </div>
                                        {aiError && <p className="text-red-500 dark:text-red-400 text-xs mt-2">{aiError}</p>}
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={formStatus === 'submitting'}
                                        className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {formStatus === 'submitting' ? (
                                            <LoadingSpinner />
                                        ) : (
                                            <>Send Message <FaPaperPlane /></>
                                        )}
                                    </motion.button>

                                    <AnimatePresence>
                                        {formStatus === 'error' && (
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-red-500 dark:text-red-400 text-center text-sm font-medium bg-red-100 dark:bg-red-500/10 py-2 rounded-lg border border-red-200 dark:border-red-500/20"
                                            >
                                                Something went wrong. Please check your connection or try again later.
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </GlassCard>
                </motion.div>
            </div>
            <ContactAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
        </section>
    );
};