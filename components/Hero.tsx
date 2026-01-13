import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Star, TrendingUp, Code, Zap, BarChart3, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import { Logos3 } from './blocks/logos3';
import ServicesPreview from './ServicesPreview';
import SloganGenerator from './SloganGenerator';
import AIUseCases from './AIUseCases';
import ProjectsPreview from './ProjectsPreview';
import TestimonialsSlider from './TestimonialsSlider';
import TeamSection from './TeamSection';
import FAQ from './FAQ';
import LazySection from './LazySection';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSiteContentData, useContactSettings } from '../src/hooks/useSiteContent';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';
import { useSiteSettings } from '../src/hooks/useSiteSettings';
import { createOrganizationSchema } from '../src/utils/schemas';
import { db } from '../src/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
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
}

const HeroSection: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { content, getText } = useSiteContentData();
    const { content: contactContent } = useContactSettings();
    const navigate = useNavigate();
    const { getLocalizedPath } = useLocalizedPath();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const [heroPromo, setHeroPromo] = useState<Promotion | null>(null);
    const [isPromoOpen, setIsPromoOpen] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'promotions'), where('isActive', '==', true));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => {
                const data = doc.data();
                const positions = Array.isArray(data.positions) ? data.positions : [];
                return { id: doc.id, ...data, positions } as Promotion;
            });
            const activeHero = fetched.find(p => {
                const isClaimed = localStorage.getItem(`claimed_promo_${p.id}`);
                return p.positions.includes('hero') && !isClaimed;
            });
            setHeroPromo(activeHero || null);
        });
        return () => unsubscribe();
    }, []);

    // Helper to get text with fallback to i18next
    const getHeroText = (field: string) => {
        const firestoreText = getText(`hero.${field}`, i18n.language as any);
        return firestoreText || t(`hero.${field}`);
    };

    // Enhanced Organization schema with Firebase data
    const organizationSchema = createOrganizationSchema({
        email: contactContent?.contact_info?.email,
        phone: contactContent?.contact_info?.phone,
        address: contactContent?.contact_info?.address,
        socialLinks: contactContent?.social_links
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.2, 0.65, 0.3, 0.9]
            }
        }
    };

    const floatVariants = {
        animate: {
            y: [0, -20, 0],
            rotate: [-12, -10, -12],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const floatVariantsReverse = {
        animate: {
            y: [0, 20, 0],
            rotate: [0, -1, 0],
            transition: {
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
            }
        }
    };

    return (
        <>
            <Helmet>
                <script type="application/ld+json">
                    {organizationSchema}
                </script>
            </Helmet>
            <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-white pt-24 lg:pt-32 pb-12 transition-colors duration-300">
                {/* Background Effects */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                    style={{
                        backgroundImage: content?.hero?.bg_image ? `url(${content.hero.bg_image})` : undefined,
                        opacity: content?.hero?.bg_image ? 1 : 0
                    }}
                />

                {/* Overlay for text readability when using background image */}
                <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 ${content?.hero?.bg_image ? 'bg-white/80 dark:bg-black/80 backdrop-blur-sm' : ''}`} />

                <div className="absolute inset-0 z-0 pointer-events-none">
                    {/* Noise Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay brightness-100 contrast-150" />

                    {/* Cinematic Shadows/Lighting - Only show if no bg image or if overlay is strong */}
                    <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-green-500/5 dark:bg-green-500/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen" />
                    <div className="absolute top-[40%] left-[40%] w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
                    >
                        {/* 1. Left Side: The Promise (Span 6) */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left relative z-20"
                        >
                            <AnimatePresence>
                                {heroPromo && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        onClick={() => setIsPromoOpen(true)}
                                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-500/20 dark:border-blue-400/30 w-fit mx-auto lg:mx-0 mb-8 backdrop-blur-xl cursor-pointer group hover:scale-105 transition-all shadow-xl shadow-blue-500/5 group"
                                    >
                                        <div className="relative">
                                            <Sparkles size={18} className="text-blue-600 dark:text-blue-400 animate-pulse" />
                                            <div className="absolute inset-0 bg-blue-400 blur-lg opacity-40 animate-pulse" />
                                        </div>
                                        <div className="flex flex-col items-start leading-none">
                                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-1">Featured Offer</span>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{heroPromo.title}</span>
                                        </div>
                                        <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 w-fit mx-auto lg:mx-0 mb-6 backdrop-blur-md"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 tracking-wide uppercase">{getHeroText('badge')}</span>
                            </motion.div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 font-['Outfit']">
                                {getHeroText('title_prefix')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400">
                                    {getHeroText('title_highlight')}
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10 font-light">
                                {getHeroText('description')}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(getLocalizedPath('/free-growth-call'))}
                                    className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-2"
                                >
                                    <Zap className="w-5 h-5 fill-white dark:fill-black" />
                                    {getHeroText('cta_consultation')}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(128, 128, 128, 0.1)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(getLocalizedPath('/portfolio'))}
                                    className="w-full sm:w-auto px-8 py-4 rounded-full font-medium text-lg text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <Play className="w-4 h-4 fill-slate-900 dark:fill-white" />
                                    {getHeroText('cta_showreel')}
                                </motion.button>
                            </div>

                            {/* Rating / Trust Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-4 justify-center lg:justify-start mb-12"
                            >
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-50 dark:border-[#09090b] overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Client" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-slate-50 dark:border-[#09090b] bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                                        40+
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex text-yellow-500">
                                            {[1, 2, 3, 4, 5].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">5.0</span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-80">
                                        <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400">{getHeroText('trustpilot_on')}</span>
                                        <img src={content?.hero?.trustpilot_logo || "/logos/trustpilot--logo.png"} alt="Trustpilot" className="h-5 w-auto object-contain" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Trust / Social Proof */}
                            <div className="border-t border-slate-200 dark:border-white/10 pt-8">
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium uppercase tracking-wider">{getHeroText('trusted_by')}</p>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                                    {(Object.values(content?.hero?.partners || {}).length > 0
                                        ? Object.values(content?.hero?.partners || {})
                                        : [
                                            "/logos/amazon.svg",
                                            "/logos/google.svg",
                                            "/logos/netflix.svg",
                                            "/logos/spotify.svg",
                                            "/logos/shopify.svg"
                                        ]
                                    ).map((logo: any, index) => (
                                        <img key={index} src={logo} alt={`Partner ${index + 1}`} className="h-6 w-auto object-contain" />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Right Side: The visual content */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-6 relative h-[600px] w-full perspective-1000"
                        >
                            {/* 3D Tilted Container */}
                            <motion.div
                                style={{ y: y1 }}
                                className="relative w-full h-full transform-style-3d rotate-y-[-12deg] rotate-x-[5deg] scale-90 lg:scale-100"
                            >

                                {/* Card 2: AI Code Editor */}
                                <motion.div
                                    variants={floatVariantsReverse}
                                    animate="animate"
                                    className="absolute top-[15%] right-[-5%] w-[420px] h-[280px] bg-white/90 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-2xl z-10 overflow-hidden"
                                >
                                    {/* Window Header */}
                                    <div className="h-8 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 flex items-center px-4 gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                        </div>
                                        <div className="ml-4 text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                                            <Code className="w-3 h-3" />
                                            AI_Growth_Engine.tsx
                                        </div>
                                    </div>

                                    {/* Code Content - Technical terms kept in English usually, but could be localized if needed. Leaving as is for authenticity of code. */}
                                    <div className="p-4 font-mono text-sm leading-relaxed">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col text-slate-300 select-none text-right">
                                                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="text-purple-600 dark:text-purple-400">import <span className="text-slate-900 dark:text-white">{'{'} Success {'}'}</span> from <span className="text-green-600 dark:text-green-400">'@growbrandi/ai'</span>;</div>
                                                <div className="h-4" />
                                                <div className="text-blue-600 dark:text-blue-400">async function <span className="text-yellow-600 dark:text-yellow-400">scaleBrand</span>() {'{'}</div>
                                                <div className="pl-4">
                                                    <span className="text-purple-600 dark:text-purple-400">const</span> strategy = <span className="text-purple-600 dark:text-purple-400">await</span> AI.<span className="text-blue-600 dark:text-blue-400">analyze</span>();
                                                </div>
                                                <div className="pl-4">
                                                    <span className="text-purple-600 dark:text-purple-400">return</span> strategy.<span className="text-blue-600 dark:text-blue-400">optimize</span>({'{'}
                                                </div>
                                                <div className="pl-8">
                                                    roi: <span className="text-green-600 dark:text-green-400">"300%"</span>,
                                                </div>
                                                <div className="pl-8">
                                                    growth: <span className="text-green-600 dark:text-green-400">"exponential"</span>
                                                </div>
                                                <div className="pl-4">{'}'});</div>
                                                <div>{'}'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Card 1: Social Media */}
                                <motion.div
                                    variants={floatVariants}
                                    animate="animate"
                                    className="absolute top-[-5%] left-[10%] w-[260px] h-[550px] bg-slate-900 rounded-[45px] border-[8px] border-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] z-20 overflow-hidden"
                                >
                                    {/* Screen Container */}
                                    <div className="relative h-full w-full bg-slate-100 dark:bg-slate-950 rounded-[38px] overflow-hidden">

                                        {/* Dynamic Island / Notch */}
                                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-40 flex items-center justify-center gap-2 px-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800/50" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        </div>

                                        {/* Content Area */}
                                        <div className="relative h-[65%] w-full overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10" />
                                            <img
                                                src={content?.hero?.phone_screen_image || "/foriphonecard.jpg"}
                                                alt="Viral Content"
                                                className="w-full h-full object-cover"
                                                loading="eager"
                                                width="260"
                                                height="550"
                                                // @ts-ignore - fetchpriority is standard but missing in some React types
                                                fetchpriority="high"
                                            />

                                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                                    <Play className="w-5 h-5 fill-white text-white ml-1" />
                                                </div>
                                            </div>

                                            {/* Floating Social Icons */}
                                            <motion.div
                                                animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute top-20 left-3 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg p-2 z-30"
                                            >
                                                <img src="/logos/tiktok.svg" alt="TikTok" className="w-full h-full object-contain drop-shadow-md" />
                                            </motion.div>
                                            <motion.div
                                                animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
                                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                                className="absolute top-32 right-3 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg p-2 z-30"
                                            >
                                                <img src="/logos/instagram.svg" alt="Instagram" className="w-full h-full object-contain drop-shadow-md" />
                                            </motion.div>
                                            <motion.div
                                                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                                className="absolute bottom-10 left-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg p-1.5 z-30"
                                            >
                                                <img src="/logos/youtube.svg" alt="YouTube" className="w-full h-full object-contain drop-shadow-md" />
                                            </motion.div>
                                            <motion.div
                                                animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                                                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                                                className="absolute bottom-16 right-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg p-1.5 z-30"
                                            >
                                                <img src="/logos/facebook.svg" alt="Facebook" className="w-full h-full object-contain drop-shadow-md" />
                                            </motion.div>
                                        </div>

                                        {/* Bottom Stats Area - Localized */}
                                        <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-white dark:bg-slate-900/95 backdrop-blur-xl p-5 flex flex-col justify-between z-20">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
                                                    <img src={content?.hero?.phone_profile_image || "/team/sabrina-jui.jpg"} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-900 dark:text-white">{getHeroText('mock_viral_campaign')}</div>
                                                    <div className="text-[10px] text-slate-500 dark:text-slate-400">@growbrandi</div>
                                                </div>
                                                <button className="ml-auto px-2.5 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-full">
                                                    {getHeroText('mock_follow')}
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-3 gap-1.5 mt-1">
                                                <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                                    <span className="font-bold text-base text-slate-900 dark:text-white">2.4M</span>
                                                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">{getHeroText('mock_views')}</span>
                                                </div>
                                                <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                                    <span className="font-bold text-base text-slate-900 dark:text-white">145K</span>
                                                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">{getHeroText('mock_likes')}</span>
                                                </div>
                                                <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                                    <span className="font-bold text-base text-green-500">+12%</span>
                                                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">{getHeroText('mock_ctr')}</span>
                                                </div>
                                            </div>

                                            <div className="w-28 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3" />
                                        </div>
                                    </div>
                                </motion.div>

                            </motion.div>
                        </motion.div>

                        {/* 3. Tech Stack Carousel */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-12 mt-12 lg:mt-0 pt-24 border-t border-slate-200 dark:border-white/5"
                        >
                            <Logos3
                                heading={getHeroText('tech_stack')}
                                logos={[
                                    { id: "logo-1", description: "React", image: "/logos/react.svg", className: "h-10 w-auto" },
                                    { id: "logo-2", description: "Next.js", image: "/logos/nextdotjs.svg", className: "h-10 w-auto" },
                                    { id: "logo-3", description: "TypeScript", image: "/logos/typescript.svg", className: "h-10 w-auto" },
                                    { id: "logo-4", description: "Tailwind CSS", image: "/logos/tailwindcss.svg", className: "h-8 w-auto" },
                                    { id: "logo-5", description: "OpenAI", image: "/logos/openai.svg", className: "h-10 w-auto" },
                                    { id: "logo-6", description: "Node.js", image: "/logos/nodedotjs.svg", className: "h-10 w-auto" },
                                    { id: "logo-7", description: "Supabase", image: "/logos/supabase.svg", className: "h-10 w-auto" },
                                    { id: "logo-8", description: "Vercel", image: "/logos/vercel.svg", className: "h-8 w-auto" },
                                    { id: "logo-9", description: "Figma", image: "/logos/figma.svg", className: "h-10 w-auto" },
                                    { id: "logo-10", description: "Stripe", image: "/logos/stripe.svg", className: "h-10 w-auto" },
                                    { id: "logo-11", description: "Python", image: "/logos/python.svg", className: "h-10 w-auto" },
                                    { id: "logo-12", description: "Google Cloud", image: "/logos/googlecloud.svg", className: "h-10 w-auto" },
                                    { id: "logo-13", description: "Shopify", image: "/logos/shopify.svg", className: "h-10 w-auto" },
                                    { id: "logo-14", description: "HubSpot", image: "/logos/hubspot.svg", className: "h-10 w-auto" },
                                    { id: "logo-15", description: "Amazon", image: "/logos/amazon.svg", className: "h-8 w-auto" },
                                    { id: "logo-16", description: "Docker", image: "/logos/docker.svg", className: "h-10 w-auto" },
                                    { id: "logo-17", description: "Microsoft", image: "/logos/microsoft.svg", className: "h-10 w-auto" },
                                    { id: "logo-18", description: "Salesforce", image: "/logos/salesforce.svg", className: "h-10 w-auto" },
                                    { id: "logo-19", description: "Google", image: "/logos/google.svg", className: "h-10 w-auto" },
                                    { id: "logo-20", description: "TikTok", image: "/logos/tiktok.svg", className: "h-8 w-auto" },
                                    { id: "logo-21", description: "Meta", image: "/logos/meta.svg", className: "h-10 w-auto" },
                                    { id: "logo-22", description: "Instagram", image: "/logos/instagram.svg", className: "h-10 w-auto" },
                                    { id: "logo-23", description: "WordPress", image: "/logos/wordpress.svg", className: "h-10 w-auto" },
                                    { id: "logo-24", description: "Google Cloud", image: "/logos/googlecloud.svg", className: "h-10 w-auto" },
                                    { id: "logo-25", description: "Cloudflare", image: "/logos/cloudflare.svg", className: "h-8 w-auto" },
                                    { id: "logo-26", description: "Firebase", image: "/logos/firebase.svg", className: "h-10 w-auto" },
                                    { id: "logo-27", description: "NestJS", image: "/logos/nestjs.svg", className: "h-10 w-auto" },
                                    { id: "logo-28", description: "Nuxt.js", image: "/logos/nuxt.svg", className: "h-10 w-auto" },
                                    { id: "logo-29", description: "Vue.js", image: "/logos/vue.svg", className: "h-9 w-auto" },
                                    { id: "logo-30", description: "Google Ads", image: "/logos/google-ads.svg", className: "h-9 w-auto" },
                                    { id: "logo-31", description: "Facebook", image: "/logos/facebook.svg", className: "h-9 w-auto" },
                                    { id: "logo-32", description: "YouTube", image: "/logos/youtube.svg", className: "h-9 w-auto" },
                                ]}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {heroPromo && (
                <DiscountBookingModal
                    isOpen={isPromoOpen}
                    onClose={() => setIsPromoOpen(false)}
                    offerTitle={heroPromo.title}
                    offerDescription={heroPromo.description}
                    discountCode={heroPromo.discountCode}
                    buttonText={heroPromo.buttonText}
                    offerImage={heroPromo.imageUrl}
                    style={heroPromo.style}
                    onSuccess={() => {
                        localStorage.setItem(`claimed_promo_${heroPromo.id}`, Date.now().toString());
                    }}
                />
            )}
        </>
    );
};

export const HomePage: React.FC = () => {
    const { settings, loading } = useSiteSettings();
    const sections = settings?.sections || {};

    // Helper to check if a section should be shown (default to true)
    const isVisible = (id: string) => sections[id as keyof typeof sections] !== false;

    if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-[#09090b]" />;

    return (
        <div className="bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
            <HeroSection />

            {isVisible('services_preview') && (
                <LazySection fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#09090b]" />}>
                    <ServicesPreview />
                </LazySection>
            )}

            {isVisible('slogan_generator') && (
                <LazySection fallback={<div className="min-h-[400px] bg-slate-50 dark:bg-[#09090b]" />}>
                    <SloganGenerator />
                </LazySection>
            )}

            {isVisible('ai_use_cases') && (
                <LazySection fallback={<div className="min-h-[600px] bg-slate-50 dark:bg-[#09090b]" />}>
                    <AIUseCases />
                </LazySection>
            )}

            {isVisible('projects_preview') && (
                <LazySection fallback={<div className="min-h-[500px] bg-slate-50 dark:bg-[#09090b]" />}>
                    <ProjectsPreview />
                </LazySection>
            )}

            {isVisible('testimonials') && (
                <LazySection fallback={<div className="min-h-[400px] bg-slate-50 dark:bg-[#09090b]" />}>
                    <TestimonialsSlider />
                </LazySection>
            )}

            {isVisible('team') && <TeamSection />}

            {isVisible('faq') && (
                <LazySection fallback={<div className="min-h-[400px] bg-slate-50 dark:bg-[#09090b]" />}>
                    <FAQ />
                </LazySection>
            )}
        </div>
    );
};
