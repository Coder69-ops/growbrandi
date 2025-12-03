import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaPlay, FaStar, FaRocket, FaChartLine, FaCode, FaLayerGroup, FaBolt, FaWhatsapp } from 'react-icons/fa';

// Import other Home Page sections
// Lazy load other Home Page sections
const ServicesPreview = React.lazy(() => import('./ServicesPreview'));
const ProjectsPreview = React.lazy(() => import('./ProjectsPreview'));
const AIUseCases = React.lazy(() => import('./AIUseCases'));
const SloganGenerator = React.lazy(() => import('./SloganGenerator'));
const TestimonialsSlider = React.lazy(() => import('./TestimonialsSlider'));
const TeamSection = React.lazy(() => import('./TeamSection'));
const FAQ = React.lazy(() => import('./FAQ'));
import { Logos3 } from './blocks/logos3';
import { CONTACT_INFO } from '../constants';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    // Animation variants
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
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const floatVariants = {
        animate: {
            y: [0, -15, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-white pt-12 lg:pt-20 transition-colors duration-300">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Architectural Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                {/* Dynamic Mesh Gradients - Optimized for Mobile */}
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse hidden md:block" />
                <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen hidden md:block" />
                <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen hidden md:block" />

                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 h-full items-center"
                >
                    {/* 1. Main Headline Area (Span 7) */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-7 flex flex-col justify-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/[0.03] dark:bg-white/[0.03] border border-slate-900/[0.08] dark:border-white/[0.08] w-fit mb-8 backdrop-blur-md hover:bg-slate-900/[0.05] dark:hover:bg-white/[0.05] transition-colors cursor-default"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Accepting New Clients for Q1</span>
                        </motion.div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] mb-8 font-['Outfit']">
                            We Build <br />
                            <span className="relative inline-block">
                                <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-xl"></span>
                                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 animate-text-shimmer bg-[length:200%_auto]">
                                    Digital Empires
                                </span>
                            </span> <br />
                            Growth, Content, & Tech.
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-10 font-light border-l-2 border-slate-900/10 dark:border-white/10 pl-6">
                            From high-ROI ad campaigns and viral content to custom web development and expert virtual assistants, we provide the full-stack growth engine your business needs.
                        </p>

                        <div className="flex flex-wrap items-center gap-5">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/contact')}
                                className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="relative z-10 flex items-center gap-2">
                                    <FaRocket className="w-5 h-5" />
                                    Get Your Free Growth Audit
                                </span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/portfolio')}
                                className="px-8 py-4 rounded-full font-medium text-lg text-slate-900 dark:text-white border border-slate-900/10 dark:border-white/10 hover:border-slate-900/30 dark:hover:border-white/30 backdrop-blur-sm transition-all flex items-center gap-3 group"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-900/5 dark:bg-white/10 flex items-center justify-center group-hover:bg-slate-900/10 dark:group-hover:bg-white/20 transition-colors">
                                    <FaPlay className="w-3 h-3 ml-0.5" />
                                </div>
                                View Showreel
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* 2. Enhanced Visual / Floating Interface (Span 5) */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-5 relative h-[500px] lg:h-[600px] perspective-1000 w-full max-w-[500px] lg:max-w-none mx-auto lg:mx-0"
                    >
                        {/* Stacked Card Effect */}
                        <motion.div
                            variants={floatVariants}
                            animate="animate"
                            className="absolute top-[45%] lg:top-[38%] left-[35%] lg:left-[25%] -translate-x-1/2 -translate-y-1/2 w-[80%] sm:w-[400px] h-[380px] sm:h-[500px] bg-gradient-to-br from-white/[0.03] to-white/[0.01] rounded-3xl border border-white/5 backdrop-blur-sm shadow-xl z-10 scale-95 -rotate-12 overflow-hidden"
                        >
                            {/* Secondary Card Header */}
                            <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2 opacity-50">
                                <div className="w-3 h-3 rounded-full bg-zinc-500/50" />
                                <div className="w-3 h-3 rounded-full bg-zinc-500/50" />
                                <div className="w-3 h-3 rounded-full bg-zinc-500/50" />
                            </div>

                            {/* Secondary Card Content */}
                            <div className="p-6 space-y-6 opacity-40 grayscale">
                                <div className="flex items-center justify-between">
                                    <div className="h-8 w-24 bg-white/10 rounded-lg" />
                                    <div className="h-8 w-8 bg-white/10 rounded-lg" />
                                </div>
                                <div className="h-32 sm:h-40 w-full bg-white/5 rounded-xl border border-white/5 relative overflow-hidden">
                                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2 h-20">
                                        {[40, 70, 50, 90, 60, 80].map((h, i) => (
                                            <div key={i} className="w-full bg-white/20 rounded-t-sm" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-20 sm:h-24 bg-white/5 rounded-xl border border-white/5 p-4">
                                        <div className="h-8 w-8 bg-white/10 rounded-full mb-2" />
                                        <div className="h-2 w-16 bg-white/20 rounded" />
                                    </div>
                                    <div className="h-20 sm:h-24 bg-white/5 rounded-xl border border-white/5 p-4">
                                        <div className="h-8 w-8 bg-white/10 rounded-full mb-2" />
                                        <div className="h-2 w-16 bg-white/20 rounded" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Glass Card */}
                        <motion.div
                            variants={floatVariants}
                            animate="animate"
                            className="absolute top-[42%] lg:top-[35%] left-[50%] lg:left-[40%] -translate-x-1/2 -translate-y-1/2 w-[80%] sm:w-[400px] h-[380px] sm:h-[500px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden z-20"
                        >
                            {/* Card Header */}
                            <div className="h-12 border-b border-white/10 flex items-center px-6 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>

                            {/* Card Content - Abstract Dashboard */}
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse" />
                                    <div className="h-8 w-8 bg-blue-500 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                </div>
                                <div className="h-32 sm:h-40 w-full bg-gradient-to-b from-white/5 to-transparent rounded-xl border border-white/5 relative overflow-hidden">
                                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-500/20 to-transparent" />
                                    <svg className="absolute bottom-0 left-0 right-0 w-full h-24 stroke-blue-500 fill-none stroke-2" viewBox="0 0 100 20" preserveAspectRatio="none">
                                        <path d="M0 20 Q 25 5 50 15 T 100 0" />
                                    </svg>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-20 sm:h-24 bg-white/5 rounded-xl border border-white/5 p-4">
                                        <FaBolt className="text-yellow-400 mb-2" />
                                        <div className="h-2 w-12 bg-white/20 rounded mb-1" />
                                        <div className="h-4 w-8 bg-white/40 rounded" />
                                    </div>
                                    <div className="h-20 sm:h-24 bg-white/5 rounded-xl border border-white/5 p-4">
                                        <FaCode className="text-purple-400 mb-2" />
                                        <div className="h-2 w-12 bg-white/20 rounded mb-1" />
                                        <div className="h-4 w-8 bg-white/40 rounded" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Elements Behind */}
                        <motion.div
                            animate={{
                                y: [0, 20, 0],
                                rotate: [0, 5, 0]
                            }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute top-[10%] right-[5%] w-48 h-48 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-2xl blur-xl z-10"
                        />

                        {/* Floating Badge 1 */}
                        <motion.div
                            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute top-[5%] left-[5%] lg:left-[-5%] bg-[#09090b]/90 p-4 rounded-2xl border border-white/10 shadow-xl z-30 backdrop-blur-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                    <FaChartLine />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400">Growth</div>
                                    <div className="text-sm font-bold text-white">+450% ROI</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Badge 2 */}
                        <motion.div
                            animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                            className="absolute bottom-[5%] right-[5%] lg:right-[-5%] bg-[#09090b]/90 p-4 rounded-2xl border border-white/10 shadow-xl z-30 backdrop-blur-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                    <FaLayerGroup />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400">Stack</div>
                                    <div className="text-sm font-bold text-white">Modern</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* 3. Logos Section (Span 12) */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-12 mt-24 lg:mt-12 pt-12"
                    >
                        <Logos3
                            heading="Our Tech Stack & Integrations"
                            logos={[
                                {
                                    id: "logo-1",
                                    description: "React",
                                    image: "/logos/react.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-2",
                                    description: "Next.js",
                                    image: "/logos/nextdotjs.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-3",
                                    description: "TypeScript",
                                    image: "/logos/typescript.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-4",
                                    description: "Tailwind CSS",
                                    image: "/logos/tailwindcss.svg",
                                    className: "h-8 w-auto",
                                },
                                {
                                    id: "logo-5",
                                    description: "OpenAI",
                                    image: "/logos/openai.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-6",
                                    description: "Node.js",
                                    image: "/logos/nodedotjs.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-7",
                                    description: "Supabase",
                                    image: "/logos/supabase.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-8",
                                    description: "Vercel",
                                    image: "/logos/vercel.svg",
                                    className: "h-8 w-auto",
                                },
                                {
                                    id: "logo-9",
                                    description: "Figma",
                                    image: "/logos/figma.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-10",
                                    description: "Stripe",
                                    image: "/logos/stripe.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-11",
                                    description: "Python",
                                    image: "/logos/python.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-12",
                                    description: "Google Cloud",
                                    image: "/logos/googlecloud.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-13",
                                    description: "Shopify",
                                    image: "/logos/shopify.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-14",
                                    description: "HubSpot",
                                    image: "/logos/hubspot.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-15",
                                    description: "Amazon",
                                    image: "/logos/amazon.svg",
                                    className: "h-8 w-auto",
                                },
                                {
                                    id: "logo-16",
                                    description: "Docker",
                                    image: "/logos/docker.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-17",
                                    description: "Microsoft",
                                    image: "/logos/microsoft.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-18",
                                    description: "Salesforce",
                                    image: "/logos/salesforce.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-19",
                                    description: "Google",
                                    image: "/logos/google.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-20",
                                    description: "TikTok",
                                    image: "/logos/tiktok.svg",
                                    className: "h-8 w-auto",
                                },
                                {
                                    id: "logo-21",
                                    description: "Meta",
                                    image: "/logos/meta.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-22",
                                    description: "Instagram",
                                    image: "/logos/instagram.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-23",
                                    description: "WordPress",
                                    image: "/logos/wordpress.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-24",
                                    description: "Google Cloud",
                                    image: "/logos/googlecloud.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-25",
                                    description: "Cloudflare",
                                    image: "/logos/cloudflare.svg",
                                    className: "h-8 w-auto",
                                },
                                {
                                    id: "logo-26",
                                    description: "Firebase",
                                    image: "/logos/firebase.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-27",
                                    description: "NestJS",
                                    image: "/logos/nestjs.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-28",
                                    description: "Nuxt.js",
                                    image: "/logos/nuxt.svg",
                                    className: "h-10 w-auto",
                                },
                                {
                                    id: "logo-29",
                                    description: "Vue.js",
                                    image: "/logos/vue.svg",
                                    className: "h-9 w-auto",
                                },
                            ]}
                        />
                    </motion.div>
                </motion.div>


            </div>
        </div>
    );
};

import LazySection from './LazySection';

export const HomePage: React.FC = () => {
    return (
        <div className="bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
            <HeroSection />

            <LazySection fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#09090b]" />}>
                <ServicesPreview />
            </LazySection>

            <LazySection fallback={<div className="min-h-[400px] bg-slate-50 dark:bg-[#09090b]" />}>
                <SloganGenerator />
            </LazySection>

            <LazySection fallback={<div className="min-h-[600px] bg-slate-50 dark:bg-[#09090b]" />}>
                <AIUseCases />
            </LazySection>

            <LazySection fallback={<div className="min-h-[500px] bg-slate-50 dark:bg-[#09090b]" />}>
                <ProjectsPreview />
            </LazySection>

            <LazySection fallback={<div className="min-h-[400px] bg-slate-50 dark:bg-[#09090b]" />}>
                <TestimonialsSlider />
            </LazySection>

            <LazySection fallback={<div className="min-h-[600px] bg-slate-50 dark:bg-[#09090b]" />}>
                <TeamSection />
            </LazySection>

            <LazySection fallback={<div className="min-h-[400px] bg-slate-50 dark:bg-[#09090b]" />}>
                <FAQ />
            </LazySection>
        </div>
    );
};
