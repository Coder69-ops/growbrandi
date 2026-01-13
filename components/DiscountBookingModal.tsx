import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock, Zap, Star, ArrowRight, Calendar, Gift, Ticket } from 'lucide-react';
import { db } from '../src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface DiscountBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    offerTitle?: string;
    offerDescription?: string;
    discountCode?: string;
    buttonText?: string;
    offerImage?: string;
    redirectUrl?: string;
}

const DiscountBookingModal: React.FC<DiscountBookingModalProps> = ({
    isOpen,
    onClose,
    offerTitle = "Claim Your 50% Discount",
    offerDescription = "Lock in this exclusive rate for your comprehensive strategy session before spots fill up.",
    discountCode = "LAUNCH50",
    buttonText = "Claim Offer & Book Now",
    offerImage,
    redirectUrl = "/free-growth-call"
}) => {
    const [step, setStep] = useState<'details' | 'success'>('details');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [spotsLeft, setSpotsLeft] = useState(3);

    // Simulate spots decreasing effect on mount
    useEffect(() => {
        if (isOpen && spotsLeft > 1) {
            const timer = setTimeout(() => {
                if (Math.random() > 0.5) setSpotsLeft(prev => prev - 1);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, spotsLeft]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'leads'), {
                ...formData,
                source: 'Dynamic Promo Modal',
                offer: offerTitle,
                discountCode: discountCode,
                createdAt: serverTimestamp(),
                status: 'new'
            });

            setStep('success');

            setTimeout(() => {
                onClose();
                setStep('details');
                setFormData({ name: '', email: '', phone: '' });
                window.location.href = redirectUrl;
            }, 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-white/20 dark:border-white/10"
                    >
                        {/* Decorative background elements */}
                        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-blue-600 to-indigo-700" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-all z-20 backdrop-blur-sm group"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform" />
                        </button>

                        <div className="relative z-10 p-8">
                            {step === 'details' ? (
                                <>
                                    <div className="flex justify-center mb-6">
                                        <motion.div
                                            initial={{ rotate: -5, scale: 0.8 }}
                                            animate={{ rotate: 0, scale: 1 }}
                                            transition={{ type: "spring", delay: 0.1 }}
                                            className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white/20 dark:border-white/5 overflow-hidden ring-4 ring-black/5"
                                        >
                                            {offerImage ? (
                                                <img src={offerImage} alt="Offer" className="w-full h-full object-cover" />
                                            ) : (
                                                <Gift size={36} className="text-blue-600 dark:text-blue-400" />
                                            )}
                                        </motion.div>
                                    </div>

                                    <div className="text-center mb-8">
                                        <motion.div
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500 text-white text-[11px] font-bold uppercase tracking-wider mb-4 shadow-lg shadow-red-500/30"
                                        >
                                            <Clock size={12} className="animate-pulse" />
                                            Only {spotsLeft} spots left
                                        </motion.div>

                                        <motion.h2
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-3xl font-black text-slate-900 dark:text-white mb-3 leading-tight tracking-tight"
                                        >
                                            {offerTitle}
                                        </motion.h2>
                                        <motion.p
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto"
                                        >
                                            {offerDescription}
                                        </motion.p>
                                    </div>

                                    <motion.form
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="group">
                                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider mb-1 block">Your Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-slate-900 dark:text-white placeholder:text-slate-400/50"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            <div className="group">
                                                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider mb-1 block">Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-slate-900 dark:text-white placeholder:text-slate-400/50"
                                                    placeholder="Enter your work email"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-600/20 transform hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                            {loading ? 'Processing...' : (
                                                <>
                                                    {buttonText}
                                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>

                                        <p className="text-center text-[10px] text-slate-400 font-medium">
                                            <Zap size={10} className="inline mr-1 text-yellow-500 fill-current" />
                                            Fast-action bonus included for next 3 signups
                                        </p>
                                    </motion.form>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30"
                                    >
                                        <CheckCircle size={48} className="text-white" />
                                    </motion.div>

                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">You're In!</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                                        Your {offerTitle} is secured.
                                    </p>

                                    {/* Success Ticket */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 p-0 relative overflow-hidden shadow-2xl mx-auto max-w-xs rotate-[-2deg] hover:rotate-0 transition-transform duration-500"
                                    >
                                        {/* Ticket Header */}
                                        <div className="bg-slate-900 p-4 text-white text-center pb-8 border-b-2 border-dashed border-slate-700 relative">
                                            <div className="absolute -left-3 bottom-[-10px] w-6 h-6 bg-white dark:bg-slate-900 rounded-full" />
                                            <div className="absolute -right-3 bottom-[-10px] w-6 h-6 bg-white dark:bg-slate-900 rounded-full" />

                                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Pass Code</p>
                                            <p className="text-2xl font-mono font-bold text-yellow-400 tracking-wider">{discountCode}</p>
                                        </div>

                                        {/* Ticket Body */}
                                        <div className="p-4 pt-6 bg-slate-50 dark:bg-slate-800/50">
                                            <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                <span>Holder</span>
                                                <span>Valid Until</span>
                                            </div>
                                            <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                                                <span>{formData.name.split(' ')[0]}</span>
                                                <span>48 Hours</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500 animate-pulse">
                                        <Clock size={16} />
                                        <span>Redirecting to calendar...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DiscountBookingModal;
