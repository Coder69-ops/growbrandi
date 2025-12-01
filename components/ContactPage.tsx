import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagic, FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaGithub, FaDribbble, FaInstagram, FaCheckCircle } from 'react-icons/fa';
import { generateProjectBrief } from '../services/geminiService';
import { sendEmail } from '../services/emailService';
import LoadingSpinner from './LoadingSpinner';
import { CONTACT_INFO, SERVICES } from '../constants';

// --- ContactPage Component ---
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const ContactPage: React.FC = () => {
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

    // EmailJS Configuration
    const EMAILJS_SERVICE_ID = 'service_s9nqo1u';
    const EMAILJS_TEMPLATE_ID = 'template_wctqujg';
    const EMAILJS_PUBLIC_KEY = 'DETrhGT8sUUowOqIR';

    const serviceOptions = SERVICES.map(s => s.title);

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
            await sendEmail(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                e.target as HTMLFormElement,
                EMAILJS_PUBLIC_KEY
            );

            setFormStatus('success');
            setFormData({ name: '', email: '', subject: '', service: '', message: '' });

            // Reset success status after 5 seconds to allow sending another message
            setTimeout(() => setFormStatus('idle'), 8000);
        } catch (error) {
            console.error("Submission failed:", error);
            setFormStatus('error');
        }
    }

    const inputClasses = (fieldName: string) => `
        w-full p-4 rounded-xl bg-zinc-900/50 border 
        ${focusedField === fieldName ? 'border-blue-500/50 ring-2 ring-blue-500/20' : 'border-white/10'} 
        focus:outline-none text-white transition-all duration-300 placeholder-zinc-400
    `;

    // Social Icon Mapping
    const getSocialIcon = (platform: string) => {
        switch (platform) {
            case 'linkedin': return FaLinkedin;
            case 'twitter': return FaTwitter;
            case 'instagram': return FaInstagram;
            case 'dribbble': return FaDribbble;
            default: return FaGithub;
        }
    };

    return (
        <section id="contact" className="min-h-screen py-24 px-4 bg-luxury-black text-white relative overflow-hidden flex flex-col justify-center">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-luxury-black to-luxury-black pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">

                {/* Left Column: Info & Context */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col justify-center"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-6 font-heading tracking-tight leading-tight">
                        Let's Build <br />
                        <span className="text-gradient">Something Epic</span>
                    </h1>
                    <p className="text-xl text-zinc-400 mb-12 max-w-lg leading-relaxed">
                        Ready to transform your digital presence? We're here to help you scale, innovate, and dominate your market with AI-driven solutions.
                    </p>

                    <div className="space-y-8 mb-12">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center border border-white/5 text-blue-400 shrink-0">
                                <FaEnvelope className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Email Us</h3>
                                <p className="text-zinc-400">{CONTACT_INFO.email}</p>
                                <p className="text-zinc-400 text-sm">Response within 24 hours</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center border border-white/5 text-blue-400 shrink-0">
                                <FaMapMarkerAlt className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Global HQ</h3>
                                <p className="text-zinc-400">{CONTACT_INFO.address}</p>
                                <p className="text-zinc-400 text-sm">Digital-first agency</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        {Object.entries(CONTACT_INFO.social).map(([platform, url], idx) => {
                            const Icon = getSocialIcon(platform);
                            return (
                                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all duration-300">
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
                    <div className="glass-effect p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
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
                                    <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                                        <FaCheckCircle className="w-12 h-12 text-blue-500" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4 font-heading">Message Sent!</h3>
                                    <p className="text-zinc-400 max-w-xs mx-auto mb-8">
                                        Thank you for reaching out. Our team will analyze your request and get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setFormStatus('idle')}
                                        className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors border border-white/10"
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Name</label>
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
                                            <label htmlFor="email" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Email</label>
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
                                            <label htmlFor="service" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Service Interest</label>
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
                                                {serviceOptions.map(s => <option key={s} value={s} className="bg-zinc-900">{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Subject</label>
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
                                            <label htmlFor="message" className="block text-sm font-bold text-zinc-400 uppercase tracking-wider">Message</label>
                                            <motion.button
                                                type="button"
                                                onClick={generateBrief}
                                                disabled={isGenerating}
                                                className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
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
                                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                                    <LoadingSpinner />
                                                </div>
                                            )}
                                        </div>
                                        {aiError && <p className="text-red-400 text-xs mt-2">{aiError}</p>}
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={formStatus === 'submitting'}
                                        className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
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
                                                className="text-red-400 text-center text-sm font-medium bg-red-500/10 py-2 rounded-lg border border-red-500/20"
                                            >
                                                Something went wrong. Please check your connection or EmailJS config.
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};