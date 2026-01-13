import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock, Zap, Star, ArrowRight, Calendar, Gift, Ticket, Shield, Lock, Users } from 'lucide-react';
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
    onSuccess?: () => void;
    style?: 'luxury' | 'amber' | 'blue';
}

const DiscountBookingModal: React.FC<DiscountBookingModalProps> = ({
    isOpen,
    onClose,
    offerTitle = "Claim Your 50% Discount",
    offerDescription = "Lock in this exclusive rate for your comprehensive strategy session before spots fill up.",
    discountCode = "LAUNCH50",
    buttonText = "Claim Offer & Book Now",
    offerImage,
    redirectUrl = "/free-growth-call",
    onSuccess,
    style
}) => {
    const themeStyles = {
        luxury: {
            gradient: "from-slate-900 via-indigo-950 to-slate-900",
            accent: "text-indigo-400",
            button: "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-500/25",
            badge: "bg-indigo-500",
            mesh: "rgba(99, 102, 241, 0.15)"
        },
        amber: {
            gradient: "from-amber-600 via-orange-600 to-amber-700",
            accent: "text-amber-500",
            button: "bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/25",
            badge: "bg-amber-500",
            mesh: "rgba(245, 158, 11, 0.2)"
        },
        blue: {
            gradient: "from-blue-600 via-cyan-600 to-blue-700",
            accent: "text-blue-400",
            button: "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-500/25",
            badge: "bg-blue-500",
            mesh: "rgba(59, 130, 246, 0.2)"
        }
    };

    const s = themeStyles[style || 'luxury'];

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
            if (onSuccess) onSuccess();

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
                        {/* Premium Mesh Background */}
                        <div className={`absolute inset-x-0 top-0 h-48 bg-gradient-to-br ${s.gradient} transition-all duration-700`} />
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 90, 180, 270, 360],
                                x: [0, 20, -20, 0],
                                y: [0, -20, 20, 0]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[80px] pointer-events-none opacity-50"
                            style={{ background: s.mesh }}
                        />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

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
                                            className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 overflow-hidden ring-1 ring-white/10 group-hover:scale-105 transition-transform"
                                        >
                                            {offerImage ? (
                                                <img src={offerImage} alt="Offer" className="w-full h-full object-cover" />
                                            ) : (
                                                <Zap size={40} className="text-white fill-current animate-pulse" />
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
                                            className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto font-medium"
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
                                            className={`w-full py-4 ${s.button} text-white rounded-2xl font-black text-xl shadow-2xl transform hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 group relative overflow-hidden`}
                                        >
                                            <div className="absolute inset-x-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                                            {loading ? 'Processing...' : (
                                                <>
                                                    {buttonText}
                                                    <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                                                </>
                                            )}
                                        </button>

                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <Lock size={10} className="text-green-500" />
                                                <span>SSL Secure & Encrypted</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Shield size={10} className="text-blue-500" />
                                                <span>Verified Offer</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users size={10} className="text-purple-500" />
                                                <span>500+ Claimed</span>
                                            </div>
                                        </div>
                                    </motion.form>
                                </>
                            ) : (
                                <div className="text-center py-8 relative">
                                    {/* Confetti Explosion Simulation */}
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                            animate={{
                                                scale: [0, 1, 0.5],
                                                x: (Math.random() - 0.5) * 400,
                                                y: (Math.random() - 0.5) * 400 - 100,
                                                rotate: Math.random() * 360,
                                                opacity: [1, 1, 0]
                                            }}
                                            transition={{ duration: 2, ease: "easeOut" }}
                                            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-sm z-50"
                                            style={{ background: i % 2 === 0 ? s.mesh : '#fff' }}
                                        />
                                    ))}

                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                                        transition={{ type: "spring", damping: 10 }}
                                        className={`w-24 h-24 ${s.button} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl relative z-10`}
                                    >
                                        <CheckCircle size={48} className="text-white" />
                                    </motion.div>

                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">You're In!</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-bold text-lg">
                                        Your {offerTitle} is secured.
                                    </p>

                                    {/* Success Ticket */}
                                    <motion.div
                                        initial={{ y: 50, opacity: 0, rotate: 5 }}
                                        animate={{ y: 0, opacity: 1, rotate: -3 }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                        className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-white/10 p-0 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] mx-auto max-w-xs transition-transform duration-500 group cursor-pointer hover:rotate-0"
                                    >
                                        {/* Ticket Header */}
                                        <div className={`${s.gradient} p-6 text-white text-center pb-10 border-b-2 border-dashed border-white/20 relative`}>
                                            <div className="absolute -left-4 bottom-[-16px] w-8 h-8 bg-white dark:bg-slate-900 rounded-full" />
                                            <div className="absolute -right-4 bottom-[-16px] w-8 h-8 bg-white dark:bg-slate-900 rounded-full" />

                                            <p className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-black mb-1">Redemption Code</p>
                                            <p className="text-3xl font-mono font-black text-white tracking-widest drop-shadow-md">{discountCode}</p>
                                        </div>

                                        {/* Ticket Body */}
                                        <div className="p-6 pt-8 bg-white dark:bg-slate-800/80 backdrop-blur-md">
                                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                <span>Verified Holder</span>
                                                <span>Vault Status</span>
                                            </div>
                                            <div className="flex justify-between items-center font-black text-slate-900 dark:text-white">
                                                <span className="text-lg">{formData.name.split(' ')[0]}</span>
                                                <span className="flex items-center gap-1.5 text-green-500 shrink-0">
                                                    <Shield size={14} /> Locked
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <div className="mt-12 flex items-center justify-center gap-3 text-sm font-bold text-slate-400 animate-pulse">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span>Redirecting to your growth strategy...</span>
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
