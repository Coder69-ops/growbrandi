
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { db } from '../src/lib/firebase';
import { doc, onSnapshot, setDoc, increment } from 'firebase/firestore';
import { Calendar, CheckCircle, Clock, MapPin, MessageSquare, ArrowRight, Zap, Star, Play, Sparkles, TrendingUp, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import BookingCalendar from './BookingCalendar';

import HeroSocialSlider from './HeroSocialSlider';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';
import DiscountBookingModal from './DiscountBookingModal';

// Skeleton Component
const PageSkeleton = () => (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 space-y-12 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 space-y-4">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-12 bg-slate-300 dark:bg-slate-700 rounded w-40 mt-6"></div>
            </div>
            <div className="w-full md:w-1/2 h-96 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
    </div>
);

const FreeGrowthCall = () => {
    const { currentLang, getLocalizedPath } = useLocalizedPath();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            videoRef.current.muted = newVolume === 0;
        }
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const newMuted = !isMuted;
            videoRef.current.muted = newMuted;
            setIsMuted(newMuted);
            if (newMuted) {
                setVolume(0);
            } else {
                setVolume(1);
                videoRef.current.volume = 1;
            }
        }
    };

    useEffect(() => {
        // Track View
        const trackView = async () => {
            try {
                const analyticsRef = doc(db, 'analytics', 'free-growth-call');
                await setDoc(analyticsRef, { views: increment(1), lastUpdated: new Date() }, { merge: true });
            } catch (err) { console.error("Error tracking view:", err); }
        };
        trackView();

        const unsub = onSnapshot(doc(db, 'pages', 'free-growth-call'), (doc) => {
            if (doc.exists()) {
                setData(doc.data());
            } else {
                setData({});
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) return <div className="pt-20"><PageSkeleton /></div>;

    const t = (obj: any, fallback: string = '') => {
        if (!obj) return fallback;
        return obj[currentLang] || obj['en'] || fallback;
    };

    // Helper to render title with highlights (supports **highlighted text**)
    const renderTitle = (title: string) => {
        const parts = title.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={i} className="text-blue-600 dark:text-blue-400">{part.slice(2, -2)}</span>;
            }
            return part;
        });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#09090b] font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative overflow-visible pt-4 lg:pt-0 pb-16 lg:pb-24">
                {/* Background Gradients & Noise - Matches Hero.tsx */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay brightness-100 contrast-150" />

                    {/* Top Glow - Blends with Header */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-500/5 dark:bg-blue-500/5 blur-[120px] rounded-full" />

                    {/* Side Blobs - Subtle */}
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-500/5 dark:bg-green-500/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 dark:bg-blue-600/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-start">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full lg:w-1/2 flex flex-col justify-start space-y-8 lg:space-y-10 lg:pt-4"
                        >
                            {/* Trust Pill */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-flex items-center self-start gap-3 p-1.5 pr-4 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm"
                            >
                                <div className="flex -space-x-3 ml-1">
                                    {(data?.hero?.trustAvatars && data.hero.trustAvatars.length > 0) ? (
                                        data.hero.trustAvatars.slice(0, 5).map((url: string, i: number) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-sm">
                                                <img src={url} alt="User" className="w-full h-full object-cover" />
                                            </div>
                                        ))
                                    ) : (
                                        [1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-sm">
                                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex text-amber-400 text-[10px]">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{t(data?.hero?.tagPill, 'Trusted by 500+ teams')}</span>
                                </div>
                            </motion.div>

                            <div className="space-y-4 lg:space-y-6">
                                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] lg:leading-[1.05] font-heading">
                                    {renderTitle(t(data?.hero?.title, 'Schedule a **free growth call**'))}
                                </h1>
                                <p className="text-lg sm:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
                                    {t(data?.hero?.description, 'Talk with a growth expert and get a tailored roadmap.')}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <a
                                    href="#booking-calendar"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowDiscountModal(true);
                                    }}
                                    className="inline-flex items-center justify-center px-8 py-4 lg:px-10 lg:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.25rem] font-bold text-base lg:text-lg transition-all shadow-2xl shadow-blue-600/30 transform hover:-translate-y-1 hover:scale-105 active:scale-95 w-full sm:w-auto ring-1 ring-blue-500/50 cursor-pointer"
                                >
                                    {t(data?.hero?.ctaText, 'Book your free call')}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </a>
                            </div>

                            {/* Stats Section */}
                            {(data?.hero?.stats && data.hero.stats.length > 0) && (
                                <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-slate-200/50 dark:border-white/5 mt-2">
                                    {data.hero.stats.map((stat: any, i: number) => (
                                        <div key={i} className="flex flex-col">
                                            <div className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">{stat.number}</div>
                                            <div className="text-[10px] lg:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t(stat.label)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Hero Social Slider */}
                            <HeroSocialSlider
                                onAction={() => setShowDiscountModal(true)}
                                items={data?.heroSlider?.length > 0 ? data.heroSlider.map((item: any) => ({
                                    type: item.type || 'review',
                                    content: t(item.content, 'Sample Content'),
                                    author: t(item.author, 'Author Name'),
                                    role: t(item.role, 'Role'),
                                    image: item.image,
                                    actionLabel: item.actionLabel,
                                    actionUrl: item.actionUrl
                                })) : [
                                    {
                                        type: 'offer',
                                        content: "Secure your competitive edge. Get 50% OFF your first AI-Growth project.",
                                        author: "LAUNCH OFFER",
                                        role: "New Clients Only",
                                        image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=150&q=80",
                                        actionLabel: "Claim 50% Off",
                                        actionUrl: "#booking-calendar"
                                    },
                                    {
                                        type: 'service',
                                        content: "Automate your entire marketing funnel with our signature AI Growth Engine.",
                                        author: "Growth Engine",
                                        role: "Signature Service",
                                        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&q=80",
                                        actionLabel: "Explore",
                                        actionUrl: "/services"
                                    },
                                    {
                                        type: 'review',
                                        content: "We doubled our leads in 30 days. The AI integration was flawless.",
                                        author: "Sarah Jenkins",
                                        role: "CMO @ TechFlow",
                                        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80"
                                    }
                                ]}
                            />
                        </motion.div>

                        {/* Right Content - Calendar Embed */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            id="booking-calendar"
                            className="w-full lg:w-1/2 relative lg:pt-8"
                        >
                            <BookingCalendar onClaimDiscount={() => setShowDiscountModal(true)} />

                            <div className="text-center mt-6 flex items-center justify-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span>{t(data?.booking?.statusText, 'Real-time availability • Verified')}</span>
                            </div>
                        </motion.div>
                    </div>

                    <DiscountBookingModal isOpen={showDiscountModal} onClose={() => setShowDiscountModal(false)} />
                </div>
            </section>

            {/* Trusted By Strip */}
            {
                (data?.trustedLogos || []).length > 0 && (
                    <section className="py-12 relative">
                        <div className="absolute inset-0 bg-slate-50/50 dark:bg-white/[0.02] border-y border-slate-100 dark:border-white/5 -skew-y-1" />
                        <div className="container mx-auto px-4 relative z-10">
                            <p className="text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8">
                                {t(data?.logosTitle, 'TRUSTED BY INDUSTRY LEADERS')}
                            </p>
                            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                                {data.trustedLogos.map((url: string, i: number) => (
                                    <img key={i} src={url} alt="Brand" className="h-6 md:h-7 w-auto object-contain" />
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* What To Expect */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        <div className="w-full lg:w-2/5 text-center lg:text-left sticky top-24">
                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                                {t(data?.expect?.sectionTitle, 'What happens on the call?')}
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                                {t(data?.expect?.sectionDescription, 'No hard selling. This is a strategy session designed to uncover gaps and identify high-leverage opportunities.')}
                            </p>
                            <div className="flex flex-col gap-3">
                                {(data?.expect?.checklist || ['30 min Discovery', 'Strategy Roadmap', 'Expert Insights']).map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold bg-white/50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 lg:self-start backdrop-blur-sm">
                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                                            <CheckCircle size={14} />
                                        </div>
                                        {t(item)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full lg:w-3/5 grid sm:grid-cols-2 gap-6">
                            {(data?.whatToExpect || []).map((item: any, idx: number) => (
                                <div key={idx} className="group luxury-glass p-8 rounded-[2rem] hover:-translate-y-2 transition-all duration-300">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                        {item.icon ? (
                                            <img src={item.icon} alt={t(item.title)} className="w-7 h-7 object-contain brightness-0 invert" />
                                        ) : (
                                            idx % 2 === 0 ? <Zap size={24} /> : <TrendingUp size={24} />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{t(item.title)}</h3>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                        {t(item.description)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>



            {/* Video Testimonial - Unchanged for brevity, assumed good */}
            {
                data?.videoTestimonial?.videoUrl && (
                    <section className="py-24 bg-white dark:bg-[#0B1120] relative overflow-hidden">
                        {/* ... (Existing Video Section Code) ... */}
                        <div className="container mx-auto px-4 relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-16 text-center tracking-tight">
                                {t(data?.videoTestimonial?.sectionTitle, 'Why founders trust us')}
                            </h2>
                            <div className="max-w-7xl mx-auto">
                                <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-black border border-slate-800 dark:border-white/10 shadow-2xl">
                                    {/* Glass Overlay Effects */}
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

                                    <div className="grid lg:grid-cols-5 min-h-[500px]">
                                        {/* Video Side (3/5 width on desktop) */}
                                        <div className="lg:col-span-3 relative bg-black group overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/0 to-slate-900/50 z-20 pointer-events-none lg:block hidden" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />

                                            <video
                                                ref={videoRef}
                                                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                                src={data.videoTestimonial.videoUrl}
                                                poster={data.videoTestimonial.thumbnailUrl}
                                                autoPlay
                                                playsInline
                                                muted={isMuted}
                                                loop
                                                controls={false}
                                            />

                                            {/* Volume Control */}
                                            <div className="absolute top-4 right-4 z-30 group/volume flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full p-2 border border-white/10 transition-all hover:bg-black/60 hover:pr-4 hover:border-white/20">
                                                <button
                                                    onClick={toggleMute}
                                                    className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
                                                >
                                                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                                </button>

                                                <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 flex items-center">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="1"
                                                        step="0.1"
                                                        value={isMuted ? 0 : volume}
                                                        onChange={handleVolumeChange}
                                                        className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                                    />
                                                </div>
                                            </div>

                                            {/* Corner HUD Element */}
                                            <div className="absolute bottom-6 left-6 z-30 flex items-center gap-3">
                                                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                    Success Story
                                                </div>
                                            </div>
                                        </div>

                                        {/* Text Side (2/5 width) */}
                                        <div className="lg:col-span-2 relative flex flex-col justify-center p-8 md:p-12 lg:p-16 z-30">
                                            {/* Background with noise texture or subtle gradient */}
                                            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl lg:bg-transparent" />

                                            <div className="relative z-10 space-y-8">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <Star key={i} size={20} className="fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                                                    ))}
                                                </div>

                                                <blockquote className="relative">
                                                    {/* Decorative Quote Icon on background */}
                                                    <div className="absolute -top-6 -left-4 text-white/5 pointer-events-none select-none text-8xl font-serif">"</div>

                                                    <p className="text-xl md:text-3xl font-medium leading-relaxed text-slate-100 font-heading tracking-tight">
                                                        {t(data.videoTestimonial.quote).replace(/^"|"$/g, '')}
                                                    </p>
                                                </blockquote>

                                                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                                    {data.videoTestimonial.thumbnailUrl && (
                                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 ring-2 ring-white/5">
                                                            <img src={data.videoTestimonial.thumbnailUrl} alt={t(data.videoTestimonial.author)} className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-white text-lg">{t(data.videoTestimonial.author)}</div>
                                                        <div className="text-blue-400 text-sm font-medium uppercase tracking-wide">{t(data.videoTestimonial.role)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* Process Steps */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-50/50 dark:bg-white/[0.02]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto mb-16 text-center">
                        <span className="text-blue-600 dark:text-blue-400 font-black tracking-[0.2em] uppercase text-xs mb-4 block animate-pulse">{t(data?.processBadge, 'Execution')}</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight font-heading">
                            {t(data?.processTitle, 'From chaos to growth in 4 steps')}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(data?.process || []).map((step: any, idx: number) => (
                            <div key={idx} className="group luxury-glass p-8 rounded-[2rem] hover:border-blue-500/30 transition-all duration-300">
                                <span className="text-5xl font-black text-slate-200 dark:text-white/5 mb-6 block group-hover:text-blue-600/20 transition-colors">0{idx + 1}</span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">{t(step.title)}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t(step.description)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-32 bg-white dark:bg-[#09090b]">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
                            {t(data?.faqTitle, 'Common questions')}
                        </h2>
                    </div>
                    <div className="grid gap-4">
                        {(data?.faq || []).map((faq: any, idx: number) => (
                            <details key={idx} className="group border border-slate-100 dark:border-white/5 rounded-2xl bg-white dark:bg-white/[0.02] overflow-hidden transition-all duration-300">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    {t(faq.question)}
                                    <ChevronDown size={20} className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400" />
                                </summary>
                                <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                                    {t(faq.answer)}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Strip */}
            <section className="py-20 bg-blue-600 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading">{t(data?.finalCta?.title, 'Ready to scale your business?')}</h2>
                    <a
                        href={getLocalizedPath('/free-growth-call#booking-calendar')}
                        onClick={(e) => {
                            e.preventDefault();
                            setShowDiscountModal(true);
                        }}
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        {t(data?.finalCta?.buttonText, 'Get My Strategy Plan')} <ArrowRight className="ml-2 w-5 h-5" />
                    </a>
                </div>
            </section>

            <DiscountBookingModal
                isOpen={showDiscountModal}
                onClose={() => setShowDiscountModal(false)}
                offerImage={
                    (data?.heroSlider?.find((item: any) => item.type === 'offer')?.image) ||
                    "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=150&q=80"
                }
            />
        </div >
    );
};

export default FreeGrowthCall;
