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
            mesh: "rgba(99, 102, 241, 0.15)",
            border: "border-indigo-500/30"
        },
        amber: {
            gradient: "from-amber-600 via-orange-600 to-amber-700",
            accent: "text-amber-500",
            button: "bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/25",
            badge: "bg-amber-500",
            mesh: "rgba(245, 158, 11, 0.2)",
            border: "border-amber-500/30"
        },
        blue: {
            gradient: "from-blue-600 via-cyan-600 to-blue-700",
            accent: "text-blue-400",
            button: "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-500/25",
            badge: "bg-blue-500",
            mesh: "rgba(59, 130, 246, 0.2)",
            border: "border-blue-500/30"
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
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-5xl overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-all z-[60] backdrop-blur-md group border border-white/20"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform" />
                        </button>

                        <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
                            {/* --- LEFT COLUMN: MASSIVE IMAGE/OFFER --- */}
                            <div className="relative lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-90 transition-all duration-700`} />

                                {/* Image or Zap Icon */}
                                {offerImage ? (
                                    <motion.img
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        src={offerImage}
                                        alt="Offer"
                                        className="w-full h-full object-cover mix-blend-overlay"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Zap size={140} className="text-white opacity-20 fill-current animate-pulse" />
                                    </div>
                                )}

                                {/* Animated Mesh Overlays */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 90, 180, 270, 360],
                                        x: [0, 20, -20, 0],
                                        y: [0, -20, 20, 0]
                                    }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-40"
                                    style={{ background: s.mesh }}
                                />

                                {/* Glass Content Overlay */}
                                <div className="absolute inset-0 p-12 flex flex-col justify-end text-white relative z-10">
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex items-center gap-3 mb-6"
                                    >
                                        <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl border border-white/30">
                                            <Gift size={32} className="text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Exclusive Benefit</span>
                                            <span className="text-lg font-bold">Limited Time Release</span>
                                        </div>
                                    </motion.div>

                                    <motion.h2
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-4xl lg:text-5xl font-black mb-6 leading-[1.1] tracking-tight font-['Outfit']"
                                    >
                                        {offerTitle}
                                    </motion.h2>

                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {[
                                            { icon: <Star size={14} />, label: "Premium Access" },
                                            { icon: <Zap size={14} />, label: "Instant Activation" },
                                            { icon: <Users size={14} />, label: "Trusted by 500+" }
                                        ].map((badge, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.4 + (i * 0.1) }}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] font-bold uppercase tracking-wider"
                                            >
                                                {badge.icon}
                                                {badge.label}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* --- RIGHT COLUMN: CONVERSION FORM --- */}
                            <div className="lg:w-1/2 bg-white dark:bg-slate-900 overflow-y-auto relative p-8 lg:p-14">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

                                {step === 'details' ? (
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-12">
                                            <motion.div
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="flex flex-col gap-1"
                                            >
                                                <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-widest animate-pulse">
                                                    <Clock size={14} />
                                                    CRITICAL: {spotsLeft} Spots Available
                                                </div>
                                                <p className="text-slate-400 text-sm font-medium">Join our next growth batch today</p>
                                            </motion.div>

                                            <div className={`px-4 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 border-2 ${s.border} border-dashed flex flex-col items-center`}>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Code</span>
                                                <span className={`text-sm font-mono font-black ${s.accent}`}>{discountCode}</span>
                                            </div>
                                        </div>

                                        <div className="mb-10">
                                            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium mb-8">
                                                {offerDescription}
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="relative group">
                                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-widest mb-1.5 block">Full Name</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-lg"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-1 uppercase tracking-widest mb-1.5 block">Business Email</label>
                                                    <input
                                                        required
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-lg"
                                                        placeholder="john@company.com"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`w-full py-5 ${s.button} text-white rounded-2xl font-black text-xl shadow-2xl transform hover:-translate-y-1.5 active:scale-95 transition-all flex items-center justify-center gap-4 group relative overflow-hidden`}
                                            >
                                                <div className="absolute inset-x-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                                                {loading ? 'Securing Spot...' : (
                                                    <>
                                                        {buttonText}
                                                        <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                                                    </>
                                                )}
                                            </button>

                                            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 opacity-60">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                    <Lock size={12} className="text-green-500" />
                                                    <span>AES-256 SECURED</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                                    <Shield size={12} className="text-blue-500" />
                                                    <span>IDENTITY VERIFIED</span>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center relative z-10 py-10">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                                            className={`w-24 h-24 ${s.button} rounded-full flex items-center justify-center mb-8 shadow-2xl`}
                                        >
                                            <CheckCircle size={48} className="text-white" />
                                        </motion.div>

                                        <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Access Granted!</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-10 font-bold text-lg max-w-xs">
                                            Your exclusive growth rate has been applied to your session.
                                        </p>

                                        {/* Premium Ticket UI */}
                                        <motion.div
                                            initial={{ y: 50, opacity: 0, rotate: 5 }}
                                            animate={{ y: 0, opacity: 1, rotate: -2 }}
                                            className="w-full max-w-sm bg-slate-50 dark:bg-white/[0.03] rounded-[2rem] border border-slate-200 dark:border-white/10 p-1 shadow-2xl"
                                        >
                                            <div className={`${s.gradient} p-8 rounded-[1.8rem] text-white text-center border-b-2 border-dashed border-white/20 relative`}>
                                                <div className="absolute -left-6 bottom-[-14px] w-8 h-8 bg-white dark:bg-slate-900 rounded-full" />
                                                <div className="absolute -right-6 bottom-[-14px] w-8 h-8 bg-white dark:bg-slate-900 rounded-full" />
                                                <p className="text-[10px] text-white/60 uppercase tracking-[0.3em] font-black mb-2">Internal Code</p>
                                                <p className="text-4xl font-mono font-black tracking-widest">{discountCode}</p>
                                            </div>
                                            <div className="p-8 pb-10">
                                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                                    <span>Verified Profile</span>
                                                    <span>Status</span>
                                                </div>
                                                <div className="flex justify-between items-center font-black">
                                                    <span className="text-xl dark:text-white">{formData.name.split(' ')[0]}</span>
                                                    <span className="flex items-center gap-1.5 text-green-500 text-sm">
                                                        <Shield size={16} /> VALIDATED
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <div className="mt-12 flex items-center gap-3 text-sm font-bold text-blue-500 animate-pulse">
                                            <Calendar size={18} />
                                            <span>Redirecting to scheduler in 3s...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DiscountBookingModal;
