import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { FaMagic } from 'react-icons/fa';
import { generateProjectBrief } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

// --- ContactPage Component ---
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState('');
    const [formStatus, setFormStatus] = useState<FormStatus>('idle');

    const generateBrief = async () => {
        setIsGenerating(true);
        setAiError('');

        try {
            const result = await generateProjectBrief();
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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');
        // Simulate form submission
        setTimeout(() => {
            // Randomly succeed or fail for demo purposes
            if (Math.random() > 0.2) {
                setFormStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setFormStatus('error');
            }
        }, 1500);
    }

    return (
        <>
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-3xl">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">
                                Contact GrowBrandi for expert <span className="text-gradient">digital solutions</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 mt-6 leading-relaxed max-w-3xl mx-auto">
                                Let's bring your vision to life! Have a project in mind? We'd love to hear about it. Fill out the form below or let our AI assistant help you draft the perfect message.
                            </p>
                        </motion.div>
                    </div>
                    <div className="glass-effect rounded-2xl shadow-2xl p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                                    <input type="text" id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                    <input type="email" id="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                                <input type="text" id="subject" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-300">Message</label>
                                    <button type="button" onClick={generateBrief} disabled={isGenerating} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                                        {isGenerating ? <LoadingSpinner /> : 'Auto-draft with AI'}
                                        {!isGenerating && <FaMagic className="h-4 w-4" />}
                                    </button>
                                </div>
                                <textarea id="message" rows={6} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
                                {aiError && <p className="text-red-400 text-sm mt-2">{aiError}</p>}
                            </div>
                            <div>
                                <motion.button
                                    type="submit"
                                    disabled={formStatus === 'submitting'}
                                    className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-cyan-500/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                    whileHover={{ scale: formStatus === 'idle' ? 1.03 : 1 }}
                                    whileTap={{ scale: formStatus === 'idle' ? 0.97 : 1 }}
                                >
                                    {formStatus === 'submitting' && <LoadingSpinner />}
                                    {formStatus === 'idle' && 'Send Message'}
                                    {formStatus === 'success' && 'Message Sent!'}
                                    {formStatus === 'error' && 'Try Again'}
                                </motion.button>
                                {formStatus === 'success' && <p className="text-green-400 text-center mt-4">Thank you! We've received your message and will get back to you shortly.</p>}
                                {formStatus === 'error' && <p className="text-red-400 text-center mt-4">Something went wrong. Please check your connection and try again.</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};