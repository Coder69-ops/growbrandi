
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../src/lib/firebase';
import { doc, onSnapshot, setDoc, increment } from 'firebase/firestore';
import { Calendar, CheckCircle, Clock, MapPin, MessageSquare, ArrowRight, Zap, Star, Play, Sparkles, TrendingUp, ChevronDown } from 'lucide-react';
import BookingCalendar from './BookingCalendar';
import TestimonialsSlider from './TestimonialsSlider';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';

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
            <section className="relative overflow-visible pt-24 lg:pt-36 pb-20 lg:pb-32">
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
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full lg:w-1/2 flex flex-col justify-start space-y-10 lg:pt-16"
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

                            <div className="space-y-6">
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.05] font-heading">
                                    {renderTitle(t(data?.hero?.title, 'Schedule a **free growth call**'))}
                                </h1>
                                <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
                                    {t(data?.hero?.description, 'Talk with a growth expert and get a tailored roadmap.')}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <a
                                    href={getLocalizedPath('/free-growth-call#booking-calendar')}
                                    className="inline-flex items-center justify-center px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.25rem] font-bold text-lg transition-all shadow-2xl shadow-blue-600/30 transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                                >
                                    {t(data?.hero?.ctaText, 'Book your free call')}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </a>
                            </div>

                            {/* Stats Section */}
                            {(data?.hero?.stats && data.hero.stats.length > 0) && (
                                <div className="flex flex-wrap gap-8 pt-8 border-t border-slate-200/50 dark:border-white/5 mt-2">
                                    {data.hero.stats.map((stat: any, i: number) => (
                                        <div key={i} className="flex flex-col">
                                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.number}</div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t(stat.label)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Author Quote - Glass Style */}
                            {/* Author Quote - Glass Style */}
                            {data?.testimonials?.[0] && (
                                <div className="pt-10">
                                    <div className="p-6 rounded-3xl bg-blue-500/5 dark:bg-white/5 border border-blue-200/20 dark:border-white/5 backdrop-blur-sm relative">
                                        <Sparkles className="absolute -top-3 -left-3 text-blue-500 dark:text-blue-400 animate-pulse" size={24} />
                                        <p className="text-slate-700 dark:text-slate-300 font-medium italic mb-4 leading-relaxed text-lg">"{t(data.testimonials[0].quote, 'They helped us grow 300% in 3 months.')}"</p>
                                        <div className="flex items-center gap-3">
                                            {data.testimonials[0].clientImage ? (
                                                <img src={data.testimonials[0].clientImage} alt={t(data.testimonials[0].author)} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                                                    {t(data.testimonials[0].author, 'J')?.[0]}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-sm">{t(data.testimonials[0].author, 'Jane Doe')}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-500 font-semibold uppercase tracking-wider">{t(data.testimonials[0].role, 'CEO, TechCorp')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Right Content - Calendar Embed */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            id="booking-calendar"
                            className="w-full lg:w-1/2 relative lg:pt-8"
                        >
                            {/* Decorative Elements behind calendar */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[3rem] opacity-30 blur-3xl -z-10" />
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[80px] -z-10" />

                            <div className="bg-white/40 dark:bg-[#111111]/60 backdrop-blur-xl p-1 rounded-[2.5rem] relative z-10 border border-white/20 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]">
                                <BookingCalendar />
                            </div>

                            <div className="text-center mt-6 flex items-center justify-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span>{t(data?.booking?.statusText, 'Real-time availability • Verified')}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trusted By Strip */}
            {(data?.trustedLogos || []).length > 0 && (
                <section className="py-16 relative">
                    <div className="absolute inset-0 bg-slate-50/50 dark:bg-white/[0.02] border-y border-slate-100 dark:border-white/5 -skew-y-1" />
                    <div className="container mx-auto px-4 relative z-10">
                        <p className="text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-10">
                            {t(data?.logosTitle, 'TRUSTED BY INDUSTRY LEADERS')}
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
                            {data.trustedLogos.map((url: string, i: number) => (
                                <img key={i} src={url} alt="Brand" className="h-6 md:h-8 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* What To Expect */}
            <section className="py-32 relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="w-full lg:w-2/5 text-center lg:text-left">
                            <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
                                {t(data?.expect?.sectionTitle, 'What happens on the call?')}
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                                {t(data?.expect?.sectionDescription, 'No hard selling. This is a strategy session designed to uncover gaps and identify high-leverage opportunities.')}
                            </p>
                            <div className="flex flex-col gap-4">
                                {(data?.expect?.checklist || ['30 min Discovery', 'Strategy Roadmap', 'Expert Insights']).map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 lg:self-start">
                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                            <CheckCircle size={14} />
                                        </div>
                                        {t(item)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full lg:w-3/5 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {(data?.whatToExpect || []).map((item: any, idx: number) => (
                                <div key={idx} className="group bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 backdrop-blur-md">
                                    <div className="w-14 h-14 bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                        {item.icon ? (
                                            <img src={item.icon} alt={t(item.title)} className="w-8 h-8 object-contain" />
                                        ) : (
                                            idx % 2 === 0 ? <Zap size={24} /> : <TrendingUp size={24} />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{t(item.title)}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                        {t(item.description)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Client Success Stories */}
            <TestimonialsSlider />

            {/* Video Testimonial */}
            {data?.videoTestimonial?.videoUrl && (
                <section className="py-24 bg-white dark:bg-[#0B1120] relative overflow-hidden">
                    <div className="container mx-auto px-4 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-16 text-center tracking-tight">
                            {t(data?.videoTestimonial?.sectionTitle, 'Why founders trust us')}
                        </h2>
                        <div className="max-w-6xl mx-auto bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
                            <div className="grid md:grid-cols-2">
                                <div className="relative aspect-video md:aspect-auto bg-slate-800 group cursor-pointer overflow-hidden">
                                    <img src={data.videoTestimonial.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} alt="Video" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-all duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transition-transform duration-300 group-hover:scale-110">
                                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg pl-1">
                                                <Play size={24} className="text-slate-900 fill-slate-900" />
                                            </div>
                                        </div>
                                    </div>
                                    <a href={data.videoTestimonial.videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" aria-label="Play View"></a>
                                </div>
                                <div className="p-10 md:p-16 flex flex-col justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                                    <div className="flex gap-1.5 text-yellow-500 mb-8">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                                    </div>
                                    <blockquote className="text-2xl md:text-4xl/snug font-medium mb-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                        "{t(data.videoTestimonial.quote)}"
                                    </blockquote>
                                    <div>
                                        <div className="font-bold text-lg">{t(data.videoTestimonial.author)}</div>
                                        <div className="text-slate-400">{t(data.videoTestimonial.role)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Process Steps */}
            <section className="py-32 bg-slate-50/50 dark:bg-white/[0.02] relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto mb-20 text-center">
                        <span className="text-blue-600 dark:text-blue-400 font-black tracking-[0.2em] uppercase text-xs mb-4 block">{t(data?.processBadge, 'Execution')}</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight font-heading">
                            {t(data?.processTitle, 'From chaos to growth in 4 steps')}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(data?.process || []).map((step: any, idx: number) => (
                            <div key={idx} className="group bg-white dark:bg-zinc-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-blue-500/20 transition-all duration-300">
                                <span className="text-4xl font-black text-slate-100 dark:text-white/5 mb-6 block group-hover:text-blue-500/10 transition-colors">0{idx + 1}</span>
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
                        className="px-10 py-5 bg-white text-blue-600 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-xl hover:scale-105 active:scale-95"
                    >
                        {t(data?.finalCta?.buttonText, 'Claim your free slot')}
                    </a>
                </div>
            </section>
        </div>
    );
};

export default FreeGrowthCall;
