import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock, Zap, Star, ArrowRight, Calendar, Gift, Ticket, Shield, Lock, Users } from 'lucide-react';
import { db } from '../src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface DiscountBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    offerTitle?: string;
    offerDescription?: string;
    discountCode?: string;
    buttonText?: string;
    offerImage?: string;
    modalImageUrl?: string;
    imageFit?: 'cover' | 'contain';
    hideTextOverlay?: boolean;
    redirectUrl?: string;
    onSuccess?: () => void;
    style?: 'luxury' | 'amber' | 'blue';
}

const ConfettiEffect = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: "50%",
                        y: "50%",
                        scale: 0,
                        rotate: 0,
                        opacity: 1
                    }}
                    animate={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        scale: Math.random() * 1.5 + 0.5,
                        rotate: Math.random() * 360,
                        opacity: 0
                    }}
                    transition={{
                        duration: Math.random() * 2 + 1,
                        ease: "easeOut",
                    }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 6)]
                    }}
                />
            ))}
        </div>
    );
};

const DiscountBookingModal: React.FC<DiscountBookingModalProps> = ({
    isOpen,
    onClose,
    offerTitle = "Claim Your 50% Discount",
    offerDescription = "Lock in this exclusive rate for your comprehensive strategy session before spots fill up.",
    discountCode = "LAUNCH50",
    buttonText = "Claim Offer & Book Now",
    offerImage,
    modalImageUrl,
    redirectUrl = "/free-growth-call",
    onSuccess,
    style = 'luxury',
    imageFit = 'cover',
    hideTextOverlay = false
}) => {
    const themeStyles = {
        luxury: {
            gradient: "from-slate-950 via-indigo-950 to-slate-900",
            accent: "text-indigo-400",
            button: "bg-gradient-to-r from-indigo-500 to-violet-600 shadow-indigo-500/25",
            badge: "bg-indigo-500",
            mesh: "rgba(99, 102, 241, 0.15)",
            border: "border-indigo-500/30",
            glow: "bg-indigo-500/20"
        },
        amber: {
            gradient: "from-amber-700 via-orange-700 to-amber-800",
            accent: "text-amber-400",
            button: "bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/25",
            badge: "bg-amber-500",
            mesh: "rgba(245, 158, 11, 0.2)",
            border: "border-amber-500/40",
            glow: "bg-amber-500/30"
        },
        blue: {
            gradient: "from-blue-700 via-indigo-800 to-blue-900",
            accent: "text-blue-400",
            button: "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-500/25",
            badge: "bg-blue-500",
            mesh: "rgba(59, 130, 246, 0.2)",
            border: "border-blue-500/40",
            glow: "bg-blue-500/30"
        }
    };

    const s = themeStyles[style];

    const [step, setStep] = useState<'details' | 'success'>('details');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [spotsLeft, setSpotsLeft] = useState(3);
    const [claimedCount, setClaimedCount] = useState(48);

    // Simulate spots decreasing & claimed count increasing
    useEffect(() => {
        if (isOpen && spotsLeft > 1) {
            const timer = setTimeout(() => {
                if (Math.random() > 0.6) setSpotsLeft(prev => prev - 1);
                if (Math.random() > 0.3) setClaimedCount(prev => prev + 1);
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
                source: 'Promotion System',
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
            }, 5000);
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
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-5xl overflow-hidden bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/10 flex flex-col lg:flex-row min-h-[600px]"
                    >
                        {step === 'success' && <ConfettiEffect />}

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-all z-[60] backdrop-blur-md group border border-white/20"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform" />
                        </button>

                        {/* --- LEFT COLUMN: MASSIVE IMAGE/OFFER --- */}
                        <div className="relative lg:w-5/12 h-64 lg:h-auto overflow-hidden bg-slate-900 flex items-center justify-center">
                            {/* 1. Base Image Layer (Full Opacity) */}
                            {(modalImageUrl || offerImage) ? (
                                <motion.img
                                    initial={{ scale: 1.1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={modalImageUrl || offerImage}
                                    alt="Offer"
                                    className={`absolute inset-0 w-full h-full ${imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                                />
                            ) : (
                                <Zap size={140} className="text-white opacity-20 fill-current animate-pulse" />
                            )}

                            {/* 2. Gradient Overlay for Branding & Legibility (Dynamic Opacity) */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} ${hideTextOverlay ? 'opacity-20' : (modalImageUrl || offerImage ? 'opacity-60' : 'opacity-90')} transition-all duration-700`} />

                            {/* Animated Glows */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className={`absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none ${s.glow}`}
                            />

                            {!hideTextOverlay && (
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
                                            <span className="text-lg font-bold">VIP Growth Pack</span>
                                        </div>
                                    </motion.div>

                                    <motion.h2
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-4xl lg:text-5xl font-black mb-8 leading-[1.1] tracking-tight font-['Outfit'] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                                    >
                                        {offerTitle}
                                    </motion.h2>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                                            <Users size={16} className="text-blue-400" />
                                            <span>Claimed by {claimedCount} owners today</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {["Premium", "Limited", "Verified"].map((tag) => (
                                                <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* --- RIGHT COLUMN: CONVERSION FORM --- */}
                        <div className="lg:w-7/12 bg-white dark:bg-slate-950 p-8 lg:p-16 flex flex-col justify-center relative">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

                            {step === 'details' ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="relative z-10"
                                >
                                    <div className="flex justify-between items-center mb-10">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-black text-xs uppercase tracking-widest animate-pulse">
                                                <div className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500" />
                                                Hurry! {spotsLeft} Slots Remaining
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Valid for next 15 minutes only</p>
                                        </div>
                                        <div className={`px-5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/[0.03] border-2 ${s.border} border-dashed flex flex-col items-center shadow-inner`}>
                                            <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Code</span>
                                            <span className={`text-sm font-mono font-black ${s.accent}`}>{discountCode}</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-700 dark:text-slate-200 text-xl leading-relaxed font-semibold mb-10">
                                        {offerDescription}
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-6 py-4 rounded-2xl bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1">Business Email</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-6 py-4 rounded-2xl bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white"
                                                    placeholder="your@company.com"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full py-5 ${s.button} text-white rounded-2xl font-black text-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 active:scale-95 transition-all flex items-center justify-center gap-4 group relative overflow-hidden`}
                                        >
                                            <div className="absolute inset-x-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                                            {loading ? 'Processing...' : (
                                                <>
                                                    {buttonText}
                                                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                                                </>
                                            )}
                                        </button>

                                        <div className="flex items-center justify-center gap-6 pt-4 opacity-70">
                                            {[
                                                { icon: <Lock size={12} />, text: "SSL Encrypted" },
                                                { icon: <Shield size={12} />, text: "No Spam Policy" },
                                                { icon: <CheckCircle size={12} />, text: "Verified Agency" }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                                    {item.icon}
                                                    <span>{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center py-10"
                                >
                                    <div className={`w-24 h-24 ${s.button} rounded-full flex items-center justify-center mb-8 shadow-2xl relative`}>
                                        <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping" />
                                        <CheckCircle size={48} className="text-white relative z-10" />
                                    </div>

                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight font-['Outfit']">Success, {formData.name.split(' ')[0]}!</h3>
                                    <p className="text-slate-700 dark:text-slate-300 mb-12 font-bold text-lg max-w-sm">
                                        Your exclusive discount is now active. We're redirecting you to your strategy session.
                                    </p>

                                    {/* Stylized Ticket */}
                                    <motion.div
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-full max-w-md bg-white dark:bg-white/[0.03] rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-2 shadow-2xl overflow-hidden"
                                    >
                                        <div className={`${s.gradient} p-10 rounded-[2rem] text-white relative border-b-2 border-dashed border-white/20 shadow-inner`}>
                                            <div className="absolute -left-6 bottom-[-14px] w-8 h-8 bg-white dark:bg-slate-950 rounded-full" />
                                            <div className="absolute -right-6 bottom-[-14px] w-8 h-8 bg-white dark:bg-slate-950 rounded-full" />
                                            <p className="text-[10px] text-white/70 font-black uppercase tracking-[0.3em] mb-3">Redemption Token</p>
                                            <p className="text-5xl font-mono font-black tracking-widest drop-shadow-md">{discountCode}</p>
                                        </div>
                                        <div className="p-10 flex justify-between items-center bg-transparent">
                                            <div className="text-left">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                                <p className="text-green-600 dark:text-green-500 font-black text-lg flex items-center gap-2">
                                                    <Shield size={18} /> ACTIVATED
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end opacity-80">
                                                <QRCodeIcon size={40} className="text-slate-300 dark:text-slate-600" />
                                            </div>
                                        </div>
                                    </motion.div>

                                    <div className="mt-12 flex items-center gap-3 text-sm font-black text-blue-600 dark:text-blue-400 animate-pulse">
                                        <Calendar size={18} />
                                        <span>Syncing with scheduler in 5s...</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const QRCodeIcon = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M3 3H9V9H3V3ZM5 5V7H7V5H5ZM3 15H9V21H3V15ZM5 17V19H7V17H5ZM15 3H21V9H15V3ZM17 5V7H19V5H17ZM15 15H17V17H15V15ZM17 17H19V19H17V17ZM19 15H21V17H19V15ZM15 19H17V21H15V19ZM19 19H21V21H19V19Z" fill="currentColor" />
    </svg>
);

export default DiscountBookingModal;
