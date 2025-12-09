import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaCheck, FaSearch, FaLightbulb, FaRocket, FaChartLine, FaArrowRight, FaLock, FaCheckCircle, FaHeadset, FaStar, FaClipboardList, FaWhatsapp, FaPlay } from 'react-icons/fa';
// import { CONTACT_INFO } from '../constants'; // Removed
import ServiceAIWidget from './ServiceAIWidget';
import { Service } from '../types';
import { BackgroundEffects } from './ui/BackgroundEffects';
import { GlassCard } from './ui/GlassCard';
import { SectionHeading } from './ui/SectionHeading';
import { useContent } from '../src/hooks/useContent';
import { getLocalizedField } from '../src/utils/localization';
import { getIcon } from '../src/utils/icons';
import { Skeleton } from './ui/Skeleton';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

// --- Service Modal Component ---
interface ServiceModalProps {
    service: Service | null;
    isOpen: boolean;
    onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, isOpen, onClose }) => {
    if (!isOpen || !service) return null;

    const { t, i18n } = useTranslation();

    // Helper to get localized text
    const localized = (field: any) => getLocalizedField(field, i18n.language);

    // Dynamically retrieve process steps from translation file based on service ID
    const serviceId = (service as any).serviceId || service.id;
    const serviceRootKey = `services.${serviceId}`;

    // Try to get process steps from translation, fallback to default if not found
    const processStepsData = t(`${serviceRootKey}.process`, { returnObjects: true });

    // Check if processStepsData is an object and has keys (not just the key string returned if missing)
    let steps: any[] = [];

    if (processStepsData && typeof processStepsData === 'object' && !Array.isArray(processStepsData)) {
        steps = Object.values(processStepsData).map((step: any) => ({
            step: step.title,
            description: step.desc,
            duration: step.duration
        }));
    } else {
        // Fallback to default process if specific one not found
        const defaultProcess = t('services.process.default', { returnObjects: true });
        if (defaultProcess && typeof defaultProcess === 'object') {
            steps = Object.values(defaultProcess).map((step: any) => ({
                step: step.title,
                description: step.desc,
                duration: step.duration
            }));
        }
    }

    return (
        <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/80 dark:bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
                className="relative w-[95%] md:w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-2xl"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-200/50 dark:bg-zinc-700/50 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-zinc-600/50 transition-all z-10"
                >
                    <FaTimes className="w-6 h-6" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Service Details */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white shadow-lg`}>
                                {/* Icon handling: If it's a string (URL) render img, else render component */}
                                {getIcon(service.icon, "w-8 h-8") || <FaRocket className="w-8 h-8" />}
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{localized(service.title)}</h2>
                                <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">{localized(service.price)}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-lg">{localized(service.description)}</p>

                        {/* Features */}
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-xl">What's Included</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {service.features?.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                                        <FaCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <span className="text-slate-700 dark:text-zinc-300 font-medium">{localized(feature)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits */}
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-xl">Key Benefits</h3>
                            <div className="space-y-3">
                                {[
                                    'Dedicated project manager',
                                    '24/7 customer support',
                                    'Unlimited revisions',
                                    '30-day money-back guarantee',
                                    'Post-launch support included'
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                                        <span className="text-slate-600 dark:text-zinc-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Process Timeline */}
                    <div className="space-y-6">
                        <h3 className="text-slate-900 dark:text-white font-semibold text-xl">Our Process</h3>
                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <div key={index} className="relative">
                                    {/* Timeline Line */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-400 to-cyan-400" />
                                    )}

                                    <div className="flex items-start gap-4">
                                        {/* Step Number */}
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-white font-bold text-sm relative z-10 shadow-lg`}>
                                            {index + 1}
                                        </div>

                                        {/* Step Content */}
                                        <div className="flex-1 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-slate-900 dark:text-white font-semibold">{step.step}</h4>
                                                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">{step.duration}</span>
                                            </div>
                                            <p className="text-slate-600 dark:text-zinc-300 text-sm">{step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* AI Widget in Modal */}
                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10">
                            <h3 className="text-slate-900 dark:text-white font-semibold text-xl mb-4">Get an Instant Estimate</h3>
                            <ServiceAIWidget serviceTitle={localized(service.title)} compact={true} />
                        </div>

                        {/* Trust Indicators */}
                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl text-center border border-slate-100 dark:border-white/5">
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-slate-900 dark:text-white font-semibold">4.9/5</span>
                            </div>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm">Based on 150+ client reviews</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Enhanced Service Card ---
interface ServiceCardProps {
    service: Service;
    index: number;
    onLearnMore: () => void;
    featured?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, onLearnMore, featured = false }) => {
    const { t, i18n } = useTranslation();
    const localized = (field: any) => getLocalizedField(field, i18n.language);

    // Check service types for specific visuals based on IDs
    // Support both static ID (id) and seeded ID (serviceId)
    const serviceId = (service as any).serviceId || service.id;

    const isSocialMedia = serviceId === 'creative_studio';
    const isBrandGrowth = serviceId === 'performance_marketing';
    const isUIUX = serviceId === 'ui_ux_design_full';
    const isWebDev = serviceId === 'web_shopify_dev';
    const isVA = serviceId === 'ecommerce_management';
    const isSupport = serviceId === 'social_media_management';

    return (
        <GlassCard
            className={`h-full flex flex-col ${featured ? 'ring-2 ring-blue-400/50' : ''}`}
            hoverEffect={true}
            variants={itemVariants}
        >
            {/* Featured Badge */}
            {featured && (
                <div className="absolute top-0 right-0 z-20">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-bl-2xl rounded-tr-2xl shadow-lg text-xs font-bold tracking-wider uppercase">
                        POPULAR
                    </div>
                </div>
            )}

            <div className="p-6 md:p-8 flex-1 relative z-10">
                {/* Service Number */}
                <div className="absolute top-4 right-4 text-6xl font-black text-slate-100 dark:text-white/5 pointer-events-none">
                    {(index + 1).toString().padStart(2, '0')}
                </div>

                {/* Service Icon */}
                <div className="relative mb-6 inline-block">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                    <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-lg`}>
                        {getIcon(service.icon, "w-8 h-8") || <FaRocket className="w-8 h-8" />}
                    </div>
                </div>

                {/* Service Content */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {localized(service.title)}
                </h3>
                <p className="text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed text-sm">
                    {localized(service.description)}
                </p>

                {/* Priority 1: Social Media Visual Artifact */}
                {isSocialMedia && (
                    <div className="mb-6 relative h-40 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 group-hover:border-blue-500/30 transition-colors">
                        {/* Floating 3D Mockups */}
                        <div className="absolute inset-0 flex items-center justify-center perspective-1000">
                            {/* Phone Mockup */}
                            <motion.div
                                animate={{ y: [0, -5, 0], rotate: [-2, 2, -2] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-40 bg-slate-900 rounded-[18px] border-4 border-slate-900 shadow-xl relative z-10 transform rotate-[-5deg]"
                            >
                                <div className="w-full h-full bg-slate-800 rounded-[14px] overflow-hidden relative">
                                    <img src="/foriphonecard.jpg" alt="Content" className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                            <FaPlay className="w-3 h-3 text-white ml-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Logos */}
                            <motion.div
                                animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-4 right-8 w-8 h-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex items-center justify-center p-1.5 z-20"
                            >
                                <img src="/logos/instagram.svg" alt="IG" className="w-full h-full object-contain" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-8 left-8 w-8 h-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex items-center justify-center p-1.5 z-20"
                            >
                                <img src="/logos/tiktok.svg" alt="TikTok" className="w-full h-full object-contain" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -6, 0], x: [0, -3, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-10 left-6 w-7 h-7 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex items-center justify-center p-1.5 z-0"
                            >
                                <img src="/logos/youtube.svg" alt="YT" className="w-full h-full object-contain" />
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Priority 2: Brand Growth Visual Artifact */}
                {isBrandGrowth && (
                    <div className="mb-6 relative h-40 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 group-hover:border-blue-500/30 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Central Chart Element */}
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/30"
                            >
                                <FaChartLine className="w-8 h-8 text-blue-500" />
                            </motion.div>

                            {/* Floating Ad Platform Logos */}
                            <motion.div
                                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-6 right-8 w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-2 border border-slate-100 dark:border-white/5"
                            >
                                <img src="/logos/google-ads.svg" alt="Google Ads" className="w-full h-full object-contain" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-6 left-8 w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-2 border border-slate-100 dark:border-white/5"
                            >
                                <img src="/logos/meta.svg" alt="Meta" className="w-full h-full object-contain" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -8, 0], x: [0, -8, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-8 left-10 w-8 h-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex items-center justify-center p-1.5 border border-slate-100 dark:border-white/5"
                            >
                                <img src="/logos/tiktok.svg" alt="TikTok" className="w-full h-full object-contain" />
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Priority 3: UI/UX Design Visual Artifact */}
                {isUIUX && (
                    <div className="mb-6 relative h-40 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 group-hover:border-blue-500/30 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Abstract UI Elements */}
                            <div className="absolute inset-0 opacity-20 dark:opacity-10">
                                <div className="absolute top-4 left-4 w-24 h-16 bg-blue-500 rounded-lg" />
                                <div className="absolute bottom-4 right-4 w-24 h-24 bg-purple-500 rounded-full" />
                            </div>

                            {/* Floating Design Tool Logos */}
                            <motion.div
                                animate={{ rotate: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center p-3 border border-slate-100 dark:border-white/5 z-10"
                            >
                                <img src="/logos/figma.svg" alt="Figma" className="w-full h-full object-contain" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-6 right-10 w-9 h-9 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-2 border border-slate-100 dark:border-white/5 z-20"
                            >
                                <img src="/logos/react.svg" alt="React" className="w-full h-full object-contain" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-6 left-10 w-9 h-9 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-2 border border-slate-100 dark:border-white/5 z-20"
                            >
                                <img src="/logos/tailwindcss.svg" alt="Tailwind" className="w-full h-full object-contain" />
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Priority 4: Web Development Visual Artifact */}
                {isWebDev && (
                    <div className="mb-6 relative h-40 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 group-hover:border-blue-500/30 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Code Window */}
                            <div className="w-32 h-24 bg-slate-900 rounded-lg shadow-xl border border-slate-700 p-2 relative z-10 transform -rotate-3">
                                <div className="flex gap-1 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                </div>
                                <div className="space-y-1">
                                    <div className="h-1 w-16 bg-slate-700 rounded" />
                                    <div className="h-1 w-12 bg-slate-700 rounded ml-2" />
                                    <div className="h-1 w-20 bg-slate-700 rounded ml-2" />
                                </div>
                            </div>

                            {/* Floating Tech Logos */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-4 right-6 w-9 h-9 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-1.5 border border-slate-100 dark:border-white/5 z-20"
                            >
                                <img src="/logos/nextdotjs.svg" alt="Next.js" className="w-full h-full object-contain" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-4 left-6 w-9 h-9 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-1.5 border border-slate-100 dark:border-white/5 z-20"
                            >
                                <img src="/logos/shopify.svg" alt="Shopify" className="w-full h-full object-contain" />
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-10 left-8 w-8 h-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex items-center justify-center p-1.5 border border-slate-100 dark:border-white/5 z-0"
                            >
                                <img src="/logos/typescript.svg" alt="TS" className="w-full h-full object-contain" />
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Priority 5: Virtual Assistance Visual Artifact */}
                {isVA && (
                    <div className="mb-6 relative h-40 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 group-hover:border-blue-500/30 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Central Task Element */}
                            <motion.div
                                animate={{ rotate: [0, 5, 0, -5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="w-20 h-24 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-white/10 p-3 flex flex-col gap-2 relative z-10"
                            >
                                <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded" />
                                <div className="w-3/4 h-2 bg-slate-100 dark:bg-white/10 rounded" />
                                <div className="flex items-center gap-2 mt-auto">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <FaCheck className="w-3 h-3 text-green-500" />
                                    </div>
                                    <div className="w-8 h-2 bg-slate-100 dark:bg-white/10 rounded" />
                                </div>
                            </motion.div>

                            {/* Floating Tool Logos */}
                            <motion.div
                                animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-6 right-8 w-9 h-9 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-1.5 border border-slate-100 dark:border-white/5 z-20"
                            >
                                <img src="/logos/google.svg" alt="Google" className="w-full h-full object-contain" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-6 left-8 w-9 h-9 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-1.5 border border-slate-100 dark:border-white/5 z-20"
                            >
                                <img src="/logos/microsoft.svg" alt="Microsoft" className="w-full h-full object-contain" />
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-10 left-6 w-8 h-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex items-center justify-center p-1.5 border border-slate-100 dark:border-white/5 z-0"
                            >
                                <img src="/logos/openai.svg" alt="OpenAI" className="w-full h-full object-contain" />
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Priority 6: Customer Support Visual Artifact */}
                {isSupport && (
                    <div className="mb-6 relative h-40 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 group-hover:border-blue-500/30 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Central Support Element */}
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 relative z-10"
                            >
                                <FaHeadset className="w-8 h-8 text-white" />
                            </motion.div>

                            {/* Floating Support Platform Logos */}
                            <motion.div
                                animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-6 right-10 w-9 h-9 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-1.5 border border-slate-100 dark:border-white/5 z-20"
                            >
                                <img src="/logos/salesforce.svg" alt="Salesforce" className="w-full h-full object-contain" />
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 10, 0], x: [0, -8, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-6 left-10 w-9 h-9 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center p-1.5 border border-slate-100 dark:border-white/5 z-20"
                            >
                                <img src="/logos/hubspot.svg" alt="HubSpot" className="w-full h-full object-contain" />
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-10 left-8 w-8 h-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex items-center justify-center p-1.5 border border-slate-100 dark:border-white/5 z-0"
                            >
                                <FaWhatsapp className="w-5 h-5 text-green-500" />
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {Array.isArray(service.features) && service.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full flex-shrink-0" />
                            <span className="truncate">{localized(feature)}</span>
                        </div>
                    ))}
                </div>

                {/* Price */}
                <div className="mb-6 pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className={`text-xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                        {localized(service.price)}
                    </div>
                    <div className="text-slate-400 dark:text-zinc-500 text-xs mt-1">No hidden fees</div>
                </div>

                {/* Buttons */}
                <div className="space-y-3 mt-auto">
                    <motion.button
                        onClick={onLearnMore}
                        className={`w-full bg-gradient-to-r ${service.color} text-white py-3 px-6 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {t('common.learn_more')}
                    </motion.button>
                    <button
                        onClick={() => window.open('https://wa.me/15551234567', '_blank')}
                        className="w-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 py-2.5 px-6 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                    >
                        <FaWhatsapp className="w-4 h-4 text-green-500" />
                        {t('common.chat_whatsapp')}
                    </button>
                </div>
            </div>
        </GlassCard>
    );
};

// ... (imports)

// --- Enhanced Services Preview Section ---
const ServicesPreview: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: services, loading } = useContent<Service>('services', {
        localizedFields: ['title', 'description', 'features']
    });

    const handleLearnMore = (service: Service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    return (
        <>
            <section className="relative py-20 md:py-32 overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
                <BackgroundEffects />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <SectionHeading
                        badge={t('services.preview.badge')}
                        title={t('services.preview.title')}
                        highlight={t('services.preview.highlight')}
                        description={t('services.preview.description')}
                    />

                    {/* Enhanced Services Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-[400px] rounded-3xl bg-white/5 border border-white/10 p-8 space-y-6">
                                    <Skeleton variant="card" className="w-16 h-16" />
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-10 w-full mt-auto" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                        >
                            {services.map((service, index) => (
                                <ServiceCard
                                    key={service.id || index}
                                    service={service}
                                    index={index}
                                    onLearnMore={() => handleLearnMore(service)}
                                    featured={((service as any).serviceId || service.id) === 'ui_ux_design_full'}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* Process Overview */}
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="text-center mb-12">
                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                {t('services.preview.process_title')}
                            </h3>
                            <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
                                {t('services.preview.process_desc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { icon: <FaSearch />, title: t('services.preview.process_steps.discovery.title'), desc: t('services.preview.process_steps.discovery.desc') },
                                { icon: <FaLightbulb />, title: t('services.preview.process_steps.strategy.title'), desc: t('services.preview.process_steps.strategy.desc') },
                                { icon: <FaRocket />, title: t('services.preview.process_steps.execution.title'), desc: t('services.preview.process_steps.execution.desc') },
                                { icon: <FaChartLine />, title: t('services.preview.process_steps.optimization.title'), desc: t('services.preview.process_steps.optimization.desc') }
                            ].map((step, index) => (
                                <GlassCard
                                    key={index}
                                    className="p-6 text-center group"
                                    hoverEffect={true}
                                >
                                    <div className="text-3xl mb-4 text-blue-500 dark:text-blue-400 flex justify-center group-hover:scale-110 transition-transform">
                                        {step.icon}
                                    </div>
                                    <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-2">{step.title}</h4>
                                    <p className="text-slate-500 dark:text-zinc-400 text-sm">{step.desc}</p>
                                </GlassCard>
                            ))}
                        </div>
                    </motion.div>

                    {/* Enhanced Call to Action */}
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <GlassCard className="p-8 md:p-12 max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white/10 dark:to-white/5 border-none text-white">
                            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                                {t('services.preview.cta_title')}
                            </h3>
                            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                                {t('services.preview.cta_desc')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    onClick={() => navigate('/contact')}
                                    className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:scale-105 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaRocket className="w-5 h-5" />
                                    {t('services.preview.cta_button')}
                                    <FaArrowRight className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    onClick={() => window.open('https://wa.me/15551234567', '_blank')}
                                    className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white/20 transition-all border border-white/10"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaWhatsapp className="w-5 h-5" />
                                    {t('common.chat_whatsapp')}
                                </motion.button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-white/10">
                                <div className="flex items-center gap-2">
                                    <FaLock className="w-4 h-4 text-emerald-400" />
                                    <span className="text-slate-300 text-sm font-medium">{t('common.secure_payments')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span className="text-slate-300 text-sm font-medium">{t('common.satisfaction_guarantee')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaHeadset className="w-4 h-4 text-emerald-400" />
                                    <span className="text-slate-300 text-sm font-medium">{t('common.support_team')}</span>
                                </div>
                                <div className="hidden sm:flex items-center gap-2">
                                    <FaStar className="w-4 h-4 text-yellow-400" />
                                    <span className="text-slate-300 text-sm font-medium">{t('common.rated_agency')}</span>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </section>

            {/* Service Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <ServiceModal
                        service={selectedService}
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedService(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default ServicesPreview;


