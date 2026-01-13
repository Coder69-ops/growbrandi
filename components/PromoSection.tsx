import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../src/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Zap, ArrowRight, Shield, Users, Clock } from 'lucide-react';
import DiscountBookingModal from './DiscountBookingModal';

interface Promotion {
    id: string;
    title: string;
    description: string;
    discountCode: string;
    buttonText: string;
    positions: string[];
    style: 'amber' | 'blue' | 'luxury';
    imageUrl?: string;
    modalImageUrl?: string;
    redirectUrl?: string;
}

const PromoSection: React.FC<{ slotId?: string }> = ({ slotId }) => {
    const [promo, setPromo] = useState<Promotion | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Simple query to avoid index requirements
        const q = query(
            collection(db, 'promotions'),
            where('isActive', '==', true)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => {
                const data = doc.data();
                const positions = Array.isArray(data.positions)
                    ? data.positions
                    : data.position
                        ? [data.position]
                        : [];
                return { id: doc.id, ...data, positions } as Promotion;
            });

            // Sort in memory instead of Firestore to stay safe without custom indexes
            const active = fetched
                .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                .find((p: Promotion) => {
                    const isClaimed = localStorage.getItem(`claimed_promo_${p.id}`);
                    return p.positions.includes('in_between_sections') && !isClaimed;
                });
            setPromo(active || null);
        }, (error) => {
            console.error("PromoSection Snapshot Error:", error);
        });

        return () => unsubscribe();
    }, []);

    if (!promo) return null;

    const themes = {
        luxury: {
            bg: "bg-slate-900",
            text: "text-white",
            accent: "text-indigo-400",
            button: "bg-indigo-600 hover:bg-indigo-700",
            glow: "bg-indigo-500/20",
            border: "border-indigo-500/20"
        },
        amber: {
            bg: "bg-amber-700",
            text: "text-white",
            accent: "text-amber-200",
            button: "bg-white text-amber-700 hover:bg-amber-50",
            glow: "bg-amber-400/30",
            border: "border-amber-400/30"
        },
        blue: {
            bg: "bg-blue-800",
            text: "text-white",
            accent: "text-blue-100",
            button: "bg-white text-blue-800 hover:bg-blue-50",
            glow: "bg-blue-400/30",
            border: "border-blue-400/30"
        }
    };

    const s = themes[promo.style || 'luxury'];

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className={`absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]`} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`max-w-7xl mx-auto rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border ${s.border} relative group ${s.bg}`}
            >
                <div className="flex flex-col lg:flex-row min-h-[700px]">
                    {/* LEFT: MASSIVE MEDIA HOOK (Split Screen) */}
                    <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden">
                        {promo.imageUrl ? (
                            <motion.img
                                initial={{ scale: 1.2 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 1.5 }}
                                src={promo.imageUrl}
                                alt="Promotion Visual"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/40">
                                <Zap size={160} className="text-white opacity-10 fill-current animate-pulse" />
                            </div>
                        )}

                        {/* Image Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent lg:hidden" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent hidden lg:block" />

                        {/* Floating Badge on Image */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-12 left-12 bg-white/10 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/20 shadow-2xl max-w-[240px]"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-500 rounded-lg">
                                    <Shield size={20} className="text-white" />
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified Growth</span>
                            </div>
                            <p className="text-white/80 text-xs font-bold leading-relaxed">
                                Join our exclusive network of 1,200+ successful brand owners today.
                            </p>
                        </motion.div>
                    </div>

                    {/* RIGHT: PREMIUM CONTENT */}
                    <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center relative">
                        <div className={`absolute -right-24 -top-24 w-96 h-96 rounded-full blur-[100px] pointer-events-none ${s.glow}`} />

                        <div className="relative z-10">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                className="flex items-center gap-3 mb-8"
                            >
                                <span className="px-4 py-1.5 bg-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.25em] border border-white/20 text-white">
                                    Special Access Opportunity
                                </span>
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            </motion.div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl lg:text-7xl font-black text-white mb-8 leading-[0.95] tracking-tighter font-['Outfit']"
                            >
                                {promo.title}
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className={`text-xl lg:text-2xl mb-12 font-medium leading-relaxed max-w-xl opacity-90 ${s.accent}`}
                            >
                                {promo.description}
                            </motion.p>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center gap-8 mb-16"
                            >
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className={`w-full sm:w-auto px-12 py-6 ${s.button} text-white lg:text-slate-900 lg:bg-white rounded-[2rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] group relative overflow-hidden`}
                                >
                                    <div className="absolute inset-x-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                                    <span className="relative z-10">{promo.buttonText}</span>
                                    <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform relative z-10" />
                                </button>

                                <div className="flex flex-col gap-2">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden ring-1 ring-white/10">
                                                <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[11px] font-black text-white/50 uppercase tracking-widest">Joined by 1.2k+ owners</p>
                                </div>
                            </motion.div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 pt-12 border-t border-white/10">
                                {[
                                    { icon: <Clock size={20} />, text: "Limited Slots", sub: "Expires in 48h" },
                                    { icon: <Zap size={20} />, text: "Instant VIP", sub: "Priority access" },
                                    { icon: <Users size={20} />, text: "Brand Network", sub: "Curated community" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5 }}
                                        className="flex flex-col gap-3 group/item cursor-default"
                                    >
                                        <div className="text-white opacity-40 group-hover/item:opacity-100 transition-opacity">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-widest mb-1">{item.text}</p>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{item.sub}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <DiscountBookingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    offerTitle={promo.title}
                    offerDescription={promo.description}
                    discountCode={promo.discountCode}
                    buttonText={promo.buttonText}
                    offerImage={promo.imageUrl}
                    modalImageUrl={promo.modalImageUrl}
                    style={promo.style}
                    onSuccess={() => {
                        localStorage.setItem(`claimed_promo_${promo.id}`, Date.now().toString());
                    }}
                />
            </motion.div>
        </section>
    );
};

export default PromoSection;
