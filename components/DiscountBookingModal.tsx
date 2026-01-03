import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock, Zap, Star, ArrowRight, Calendar, Gift } from 'lucide-react';
import { db } from '../src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface DiscountBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    offerImage?: string;
}

const DiscountBookingModal: React.FC<DiscountBookingModalProps> = ({ isOpen, onClose, offerImage }) => {
    const [step, setStep] = useState<'details' | 'success'>('details');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [spotsLeft, setSpotsLeft] = useState(3);

    // Simulate spots decreasing effect on mount
    React.useEffect(() => {
        if (isOpen && spotsLeft > 1) {
            const timer = setTimeout(() => {
                if (Math.random() > 0.5) setSpotsLeft(prev => prev - 1);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'leads'), {
                ...formData,
                source: 'Discount Popup',
                offer: '50% OFF',
                createdAt: serverTimestamp(),
                status: 'new'
            });
            setStep('success');
            setTimeout(() => {
                onClose();
                setStep('details');
                setFormData({ name: '', email: '', phone: '' });
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
                        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-lg"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-transparent backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-white/10 scrollbar-hide"
                    >
                        {/* Body Background - Starts after Header */}
                        <div className="absolute top-32 left-0 w-full bottom-0 bg-white/90 dark:bg-slate-900/90 z-0" />

                        {/* Premium Header Background - Glassmorphic */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600/60 to-indigo-600/60 z-0" />
                        <div className="absolute top-0 left-0 w-full h-32 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20 backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative z-10 p-8 pt-10">
                            {step === 'details' ? (
                                <>
                                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-6 mx-auto transform rotate-3 overflow-hidden border-2 border-white dark:border-white/10">
                                        {offerImage ? (
                                            <img src={offerImage} alt="Offer" className="w-full h-full object-cover" />
                                        ) : (
                                            <Gift size={32} className="text-blue-600 dark:text-blue-500" />
                                        )}
                                    </div>

                                    <div className="text-center mb-8 relative">
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-black uppercase tracking-wider mb-4 border border-red-500/20 shadow-sm"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            Only {spotsLeft} spots left this week
                                        </motion.div>

                                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight tracking-tight">
                                            Claim Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">50% Discount</span>
                                        </h2>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                                            Lock in this exclusive rate for your comprehensive strategy session before spots fill up.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider">Full Name</label>
                                            <div className="relative group">
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full pl-4 pr-4 py-3.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 group-hover:bg-white dark:group-hover:bg-black/60"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider">Work Email</label>
                                            <div className="relative group">
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full pl-4 pr-4 py-3.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 group-hover:bg-white dark:group-hover:bg-black/60"
                                                    placeholder="john@company.com"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-600/20 transform hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            {loading ? 'Processing...' : <>Claim Offer & Book Now <ArrowRight size={20} /></>}
                                        </button>

                                        <p className="text-center text-[10px] text-slate-400 mt-4">
                                            By claiming, you agree to receive a priority booking link via email.
                                        </p>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                        <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Discount Secured!</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                        Check your email for your priority booking link with the <strong>50% off</strong> applied automatically.
                                    </p>

                                    <div className="mt-8 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-500">
                                        <p>Redirecting to calendar in a moment...</p>
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
