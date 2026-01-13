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
    redirectUrl?: string;
}

const PromoSection: React.FC<{ slotId?: string }> = ({ slotId }) => {
    const [promo, setPromo] = useState<Promotion | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const q = query(
            collection(db, 'promotions'),
            where('isActive', '==', true),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
            const active = fetched.find((p: any) =>
                (p.positions || []).includes('in_between_sections')
            );
            setPromo(active || null);
        });

        return () => unsubscribe();
    }, []);

    if (!promo) return null;

    const theme = {
        luxury: "bg-slate-900 border-indigo-500/20 text-white",
        amber: "bg-amber-600 border-amber-400 text-white",
        blue: "bg-blue-600 border-blue-400 text-white"
    }[promo.style || 'luxury'];

    const accent = {
        luxury: "text-indigo-400",
        amber: "text-amber-200",
        blue: "text-blue-100"
    }[promo.style || 'luxury'];

    return (
        <section className="py-24 px-6">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`max-w-7xl mx-auto rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border relative group ${theme}`}
            >
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="flex flex-col lg:flex-row items-center relative z-10">
                    {/* Left: Content */}
                    <div className="flex-1 p-12 lg:p-24">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                                Exclusive Offer
                            </span>
                            <div className="flex h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                        </div>

                        <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
                            {promo.title}
                        </h2>
                        <p className={`text-xl lg:text-2xl mb-12 font-medium opacity-90 max-w-xl ${accent}`}>
                            {promo.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xl hover:scale-105 transition-transform flex items-center justify-center gap-3 shadow-2xl"
                            >
                                {promo.buttonText}
                                <ArrowRight size={24} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800" />
                                    ))}
                                </div>
                                <p className="text-xs font-bold opacity-70">Joined by 1.2k+ owners</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 pt-12 border-t border-white/10">
                            {[
                                { icon: <Shield size={18} />, text: "Verified Growth" },
                                { icon: <Clock size={18} />, text: "48h Expiration" },
                                { icon: <Zap size={18} />, text: "Instant VIP Status" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                    {item.icon}
                                    <span className="text-xs font-bold uppercase tracking-widest">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Media Hook */}
                    <div className="lg:w-1/3 w-full bg-black/20 self-stretch flex items-center justify-center p-12 lg:border-l border-white/10 relative overflow-hidden">
                        {promo.imageUrl ? (
                            <img
                                src={promo.imageUrl}
                                alt="Offer"
                                className="w-full h-full object-cover absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-1000"
                            />
                        ) : (
                            <div className="text-white/10 absolute inset-0 flex items-center justify-center rotate-12 scale-150">
                                <Zap size={400} />
                            </div>
                        )}

                        <div className="relative text-center">
                            <div className="bg-white/10 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/20 shadow-2xl">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">Unlock Code</p>
                                <p className="text-4xl font-mono font-black tracking-[0.3em] mb-2">{promo.discountCode}</p>
                                <div className="h-1 w-full bg-slate-100/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: "100%" }}
                                        animate={{ width: "10%" }}
                                        transition={{ duration: 60, repeat: Infinity }}
                                        className="h-full bg-white"
                                    />
                                </div>
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
                    style={promo.style}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </motion.div>
        </section>
    );
};

export default PromoSection;
