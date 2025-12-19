
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../src/lib/firebase';
import { doc, onSnapshot, setDoc, increment } from 'firebase/firestore';
import { Calendar, CheckCircle, Clock, MapPin, MessageSquare, ArrowRight, Zap, Star, Play, Sparkles } from 'lucide-react';
import BookingCalendar from './BookingCalendar';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';

// Skeleton Component
const PageSkeleton = () => (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 space-y-12 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 space-y-4">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                <div className="h-12 bg-slate-300 dark:bg-slate-700 rounded w-40 mt-6"></div>
            </div>
            <div className="w-full md:w-1/2 h-96 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            ))}
        </div>
    </div>
);

const FreeGrowthCall = () => {
    const { currentLang } = useLocalizedPath();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Track View
        const trackView = async () => {
            try {
                const analyticsRef = doc(db, 'analytics', 'free-growth-call');
                // Use setDoc with merge to ensure document exists, then update
                await setDoc(analyticsRef, {
                    views: increment(1),
                    lastUpdated: new Date()
                }, { merge: true });
            } catch (err) {
                console.error("Error tracking view:", err);
            }
        };
        trackView();

        const unsub = onSnapshot(doc(db, 'pages', 'free-growth-call'), (doc) => {
            if (doc.exists()) {
                setData(doc.data());
            } else {
                // Default / Fallback static data if not set in Admin
                setData({
                    hero: {
                        title: { en: 'Schedule a free growth call' },
                        description: { en: 'Talk with a Webflow expert and get feedback on your website’s performance, goals, and timeline—based on experience from 400+ successfully delivered projects.' }, // Using Flowout inspired copy as fallback
                        ctaText: { en: 'Book your free call' }
                    },
                    testimonial: {
                        quote: { en: 'GrowBrandi transformed our lead gen pipeline completely.' },
                        author: { en: 'Sarah Jenkins' },
                        role: { en: 'CMO, TechStart' }
                    }
                });
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) return <div className="pt-20"><PageSkeleton /></div>;

    const t = (obj: any) => obj?.[currentLang] || obj?.['en'] || '';

    return (
        <div className="min-h-screen bg-white dark:bg-[#09090b] font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative overflow-visible pt-24 lg:pt-36 pb-20 lg:pb-32">
                {/* Background Gradients & Noise - Matches Hero.tsx */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay brightness-100 contrast-150" />
                    <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-green-500/10 dark:bg-green-500/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full lg:w-1/2 flex flex-col justify-start space-y-8 lg:pt-12"
                        >
                            {/* Trust Pill */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-flex items-center self-start gap-3 p-1.5 pr-4 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm"
                            >
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex text-amber-400 text-[10px]">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Trusted by 500+ teams</span>
                                </div>
                            </motion.div>

                            <div className="space-y-6">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl/tight font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    {t(data?.hero?.title) || "Schedule a free growth call"}
                                </h1>
                                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                                    {t(data?.hero?.description) || "Talk with a growth expert and get a tailored roadmap."}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <a
                                    href="#booking-calendar"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-600/30 ring-4 ring-transparent hover:ring-blue-100 dark:hover:ring-blue-900/30"
                                >
                                    {t(data?.hero?.ctaText) || "Book your free call"}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </a>
                            </div>

                            {/* Author Quote */}
                            <div className="pt-8 border-t border-slate-200 dark:border-slate-800/60">
                                <div className="flex gap-4">
                                    <div className="shrink-0 pt-1">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                                            <MessageSquare size={20} className="text-white/80" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-slate-700 dark:text-slate-300 font-medium italic mb-2 leading-relaxed">"{t(data?.testimonial?.quote)}"</p>
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-slate-900 dark:text-white text-sm">{t(data?.testimonial?.author)}</div>
                                            <span className="text-slate-300 dark:text-slate-600">•</span>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">{t(data?.testimonial?.role)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Content - Calendar Embed */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            id="booking-calendar"
                            className="w-full lg:w-1/2 relative lg:pt-12"
                        >
                            {/* Decorative Elements behind calendar */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2.5rem] opacity-20 blur-lg" />
                            <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full -z-10" />

                            <div className="bg-white/5 backdrop-blur-sm p-1 rounded-[2.5rem] relative z-10 border border-white/10">
                                <BookingCalendar />
                            </div>

                            <div className="text-center mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span>Real-time availability</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trusted By Strip */}
            <section className="py-12 border-y border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/30">
                <div className="container mx-auto px-4">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">
                        Forward-thinking teams choose GrowBrandi
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 hover:opacity-100 transition-opacity duration-500">
                        {data?.trustedLogos && data.trustedLogos.length > 0 ? (
                            data.trustedLogos.map((url: string, idx: number) => (
                                <img key={idx} src={url} alt="Brand" className="h-6 md:h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                            ))
                        ) : (
                            <div className="flex gap-8 opacity-30">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-6 w-24 bg-slate-400 rounded-sm" />)}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* What To Expect */}
            <section className="py-24 bg-slate-50/50 dark:bg-[#0B1120]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
                        <div className="w-full md:w-1/3">
                            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-xs mb-2 block">Transparency</span>
                            <h2 className="text-3xl md:text-4xl/tight font-bold font-heading text-slate-900 dark:text-white mb-6">
                                What happens on the call?
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                No hard selling. This is a strategy session designed to uncover gaps in your current process and identify high-leverage opportunities.
                            </p>
                            <a href="#booking-calendar" className="text-blue-600 dark:text-blue-400 font-semibold flex items-center group">
                                Book your slot <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        <div className="w-full md:w-2/3 grid sm:grid-cols-2 gap-6">
                            {(data?.whatToExpect || [
                                { title: { en: 'Project Overview' }, description: { en: 'We analyze your current setup.' }, icon: Clock },
                                { title: { en: 'Expert Feedback' }, description: { en: 'Get actionable advice.' }, icon: MessageSquare },
                                // { title: { en: 'Actionable Roadmap' }, description: { en: 'Leave with a clear plan.' }, icon: CheckCircle } 
                                // Reduced default to 2 for design balance if needed, but keeping dynamic
                            ]).map((item: any, idx: number) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center mb-6">
                                        <CheckCircle size={24} strokeWidth={2} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{t(item.title)}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {t(item.description)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Clients Love GrowBrandi (Video Feature) */}
            <section className="py-24 bg-white dark:bg-[#0B1120] relative overflow-hidden">
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-16 text-center tracking-tight">Why founders trust us</h2>
                    <div className="max-w-6xl mx-auto bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden text-white">
                        <div className="grid md:grid-cols-2">
                            <div className="relative aspect-video md:aspect-auto bg-slate-800 group cursor-pointer overflow-hidden">
                                {data?.videoTestimonial?.thumbnailUrl ? (
                                    <img
                                        src={data.videoTestimonial.thumbnailUrl}
                                        alt="Video Thumbnail"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                        <Play size={64} className="text-slate-600" />
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transition-transform duration-300 group-hover:scale-110">
                                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg pl-1">
                                            <Play size={24} className="text-slate-900 fill-slate-900" />
                                        </div>
                                    </div>
                                </div>
                                {data?.videoTestimonial?.videoUrl && (
                                    <a href={data.videoTestimonial.videoUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" aria-label="Play Video"></a>
                                )}
                            </div>
                            <div className="p-10 md:p-16 flex flex-col justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                                <div className="flex gap-1.5 text-yellow-500 mb-8">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
                                </div>
                                <blockquote className="text-2xl md:text-4xl/snug font-medium mb-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                    "{t(data?.videoTestimonial?.quote) || "We saw a 200% increase in conversions within the first month."}"
                                </blockquote>
                                <div className="flex items-center gap-5 mt-auto">
                                    <div className="flex flex-col">
                                        <div className="font-bold text-lg text-white">{t(data?.videoTestimonial?.author) || 'Alex Rivera'}</div>
                                        <div className="text-slate-400">{t(data?.videoTestimonial?.role) || 'CEO, FinTech'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Steps */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/20 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto mb-16 text-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-xs mb-3 block">Simple Process</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                            From chaos to clarity in 4 steps
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {(data?.process || [
                            { step: { en: 'Step 1' }, title: { en: 'Deep Dive' }, description: { en: 'We audit your current strategy.' } },
                            { step: { en: 'Step 2' }, title: { en: 'Roadmap' }, description: { en: 'We build a custom action plan.' } },
                            { step: { en: 'Step 3' }, title: { en: 'Growth' }, description: { en: 'We launch and optimize.' } },
                            { step: { en: 'Step 4' }, title: { en: 'Scale' }, description: { en: 'We automate and expand.' } }
                        ]).map((step: any, idx: number) => (
                            <div key={idx} className="group bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                                        {t(step.step) || `Step ${idx + 1}`}
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-colors">
                                        <ArrowRight size={16} className="-rotate-45" />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t(step.title)}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{t(step.description)}</p>
                                    </div>

                                    {/* Optional Image per step if supported */}
                                    {step.image && (
                                        <div className="w-24 h-24 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden self-end md:self-auto">
                                            <img src={step.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <a href="#booking-calendar" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl">
                            Start your growth journey
                        </a>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white dark:bg-[#0B1120]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-10 text-center tracking-tight">
                        Common questions
                    </h2>
                    <div className="space-y-4">
                        {(data?.faq || []).map((faq: any, idx: number) => (
                            <details key={idx} className="group border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 open:shadow-lg open:border-blue-100 dark:open:border-blue-900/50">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-lg text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    {t(faq.question)}
                                    <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
                                        <ArrowRight size={20} className="rotate-90 group-open:rotate-[270deg]" />
                                    </span>
                                </summary>
                                <div>
                                    <div className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl animate-[fadeIn_0.3s_ease-out]">
                                        {t(faq.answer)}
                                    </div>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Trust Strip */}
            <div className="py-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6 text-center">
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Rated 4.9/5 by 100+ founders on</span>
                    <div className="flex items-center gap-8 opacity-90">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-white"><Star size={18} className="fill-green-500 text-green-500" /> Trustpilot</div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-white"><Star size={18} className="fill-blue-500 text-blue-500" /> G2</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreeGrowthCall;
