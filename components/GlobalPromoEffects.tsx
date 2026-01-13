
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, X } from 'lucide-react';
import { db } from '../src/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import DiscountBookingModal from './DiscountBookingModal';

interface Promotion {
    id: string;
    title: string;
    description: string;
    footerText: string;
    discountCode: string;
    buttonText: string;
    isActive: boolean;
    position: 'hero' | 'popup' | 'banner' | 'floating_corner';
    style: 'amber' | 'blue' | 'luxury';
    imageUrl?: string;
}

const GlobalPromoEffects: React.FC = () => {
    const [activePromo, setActivePromo] = useState<Promotion | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showFloatingWidget, setShowFloatingWidget] = useState(false);
    const [hasSeenPromo, setHasSeenPromo] = useState(false);

    useEffect(() => {
        // Query for active promotions that are NOT 'hero' (hero handled by slider)
        // We prioritize 'popup' or 'floating_corner'
        const q = query(
            collection(db, 'promotions'),
            where('isActive', '==', true),
            // We can't query multiple positions easily with simple index, so we fetch all active and filter client side or just one
            // Let's just fetch active ones
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const promos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));

            // Find the highest priority global promo
            const globalPromo = promos.find(p => p.position === 'popup' || p.position === 'floating_corner');

            if (globalPromo) {
                setActivePromo(globalPromo);

                // Check local storage
                const seen = localStorage.getItem(`seen_promo_${globalPromo.id}`);
                if (!seen) {
                    if (globalPromo.position === 'popup') {
                        // Delay popup slightly
                        setTimeout(() => setIsModalOpen(true), 3000);
                    } else if (globalPromo.position === 'floating_corner') {
                        setShowFloatingWidget(true);
                    }
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleClose = () => {
        setIsModalOpen(false);
        setShowFloatingWidget(false);
        if (activePromo) {
            localStorage.setItem(`seen_promo_${activePromo.id}`, 'true');
            setHasSeenPromo(true);
        }
    };

    const handleWidgetClick = () => {
        setIsModalOpen(true);
        setShowFloatingWidget(false);
    };

    if (!activePromo) return null;

    return (
        <>
            {/* The Main Conversion Modal */}
            <DiscountBookingModal
                isOpen={isModalOpen}
                onClose={handleClose}
                offerTitle={activePromo.title}
                offerDescription={activePromo.description}
                discountCode={activePromo.discountCode}
                buttonText={activePromo.buttonText}
                offerImage={activePromo.imageUrl}
            />

            {/* Floating Corner Widget */}
            <AnimatePresence>
                {showFloatingWidget && activePromo.position === 'floating_corner' && !isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-6 right-6 z-50 max-w-sm w-full md:w-auto cursor-pointer group"
                        onClick={handleWidgetClick}
                    >
                        <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-2xl border border-blue-500/30 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleClose(); }}
                                className="absolute -top-2 -right-2 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>

                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse-slow">
                                <Zap size={24} fill="currentColor" />
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">Limited Time Offer</p>
                                <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{activePromo.title}</h4>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GlobalPromoEffects;
