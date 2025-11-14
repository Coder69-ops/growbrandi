import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SERVICES, PROJECTS, TESTIMONIALS, COMPANY_STATS } from '../constants';
import FAQ from './FAQ';
import { Project } from '../types';
import { generateSlogan } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

// Team Data
const TEAM_MEMBERS = [
  {
    name: "Sarah Chen",
    role: "CEO & Creative Director",
    description: "10+ years leading digital transformation projects with expertise in brand strategy and user experience design.",
    image: "/api/placeholder/300/400",
    specialties: ["Brand Strategy", "UX Design", "Leadership"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "sarah@growbrandi.com"
    }
  },
  {
    name: "Marcus Johnson",
    role: "Head of Development",
    description: "Full-stack developer with passion for creating scalable, high-performance web applications using modern technologies.",
    image: "/api/placeholder/300/400",
    specialties: ["React/Next.js", "Node.js", "Cloud Architecture"],
    social: {
      linkedin: "#",
      github: "#",
      email: "marcus@growbrandi.com"
    }
  },
  {
    name: "Elena Rodriguez",
    role: "AI Solutions Architect",
    description: "AI/ML specialist focused on integrating intelligent solutions that drive business growth and user engagement.",
    image: "/api/placeholder/300/400",
    specialties: ["Machine Learning", "AI Integration", "Data Analytics"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "elena@growbrandi.com"
    }
  },
  {
    name: "David Kim",
    role: "Digital Marketing Strategist",
    description: "Performance marketing expert who combines data-driven insights with creative campaigns to maximize ROI.",
    image: "/api/placeholder/300/400",
    specialties: ["SEO/SEM", "Content Strategy", "Analytics"],
    social: {
      linkedin: "#",
      instagram: "#",
      email: "david@growbrandi.com"
    }
  },
  {
    name: "Amy Thompson",
    role: "UI/UX Designer",
    description: "Creative designer passionate about crafting intuitive user interfaces that deliver exceptional user experiences.",
    image: "/api/placeholder/300/400",
    specialties: ["UI Design", "Prototyping", "User Research"],
    social: {
      linkedin: "#",
      dribbble: "#",
      email: "amy@growbrandi.com"
    }
  },
  {
    name: "James Wilson",
    role: "Project Manager",
    description: "Agile project management expert ensuring seamless delivery of complex projects on time and within budget.",
    image: "/api/placeholder/300/400",
    specialties: ["Agile/Scrum", "Team Leadership", "Client Relations"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "james@growbrandi.com"
    }
  }
];

type Page = 'home' | 'services' | 'projects' | 'contact';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
}

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

// --- Streamlined Hero Section ---
const Hero: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <section className="relative overflow-hidden">
      {/* Main Hero Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-teal-500/5" />
        
        {/* Simplified Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-emerald-400/5 to-blue-400/5"
              style={{
                width: 200 + i * 100,
                height: 200 + i * 100,
                left: `${20 + i * 30}%`,
                top: `${20 + i * 20}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 container mx-auto text-center max-w-6xl"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Subtitle Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3 mb-8"
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">AI-Powered Digital Agency</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          </motion.div>

          {/* Main Heading - Simplified */}
          <motion.h1 
            variants={itemVariants} 
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8"
          >
            <span className="block">Transform Your</span>
            <span className="block text-gradient">Business Growth</span>
          </motion.h1>

          {/* Simplified Description */}
          <motion.p 
            variants={itemVariants} 
            className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Expert digital solutions that combine <span className="text-emerald-400 font-semibold">AI innovation</span> with 
            proven strategies to <span className="text-blue-400 font-semibold">accelerate your success</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              onClick={onGetStarted}
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-5 px-12 rounded-2xl text-lg shadow-2xl"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Our Work
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
            
            <motion.button
              className="group flex items-center gap-2 text-slate-300 hover:text-white font-semibold py-5 px-10 rounded-2xl border border-slate-600 hover:border-emerald-400 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Schedule Consultation
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            className="flex flex-col items-center text-slate-400 cursor-pointer hover:text-emerald-400 transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-xs mb-2 font-medium">Discover More</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Enhanced AI Slogan Generator ---
const SloganGenerator: React.FC = () => {
    const [keywords, setKeywords] = useState('');
    const [slogans, setSlogans] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!keywords.trim()) {
            setError('Please enter some keywords.');
            return;
        }
        setIsLoading(true);
        setError('');
        setSlogans([]);
        try {
            const result = await generateSlogan(keywords);
            setSlogans(result);
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.section
            className="py-24 px-4 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5" />
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-5xl relative z-10">
                <motion.div variants={itemVariants} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-2 mb-6">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-sm font-medium text-emerald-400">AI-POWERED TOOL</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6">
                        Try Our <span className="text-gradient">AI Slogan Generator</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Experience the power of AI in action! Enter a few keywords about your business 
                        and watch our intelligent system craft compelling slogans tailored to your brand.
                    </p>
                </motion.div>

                <motion.div 
                    variants={itemVariants}
                    className="glass-effect rounded-3xl p-8 md:p-12 shadow-2xl"
                >
                    <div className="flex flex-col lg:flex-row gap-6 mb-8">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-300 mb-3">
                                Enter Keywords
                            </label>
                            <input
                                type="text"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="e.g., sustainable, innovative, coffee, community, growth"
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                        </div>
                        <div className="flex items-end">
                            <motion.button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span>Generate Slogans</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
                        >
                            <p className="text-red-400 text-center">{error}</p>
                        </motion.div>
                    )}

                    {slogans.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <h3 className="text-2xl font-bold text-gradient text-center mb-6">
                                ✨ Your AI-Generated Slogans
                            </h3>
                            <div className="grid gap-4">
                                {slogans.map((slogan, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group glass-effect p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg text-white font-medium flex-1">
                                                "{slogan}"
                                            </p>
                                            <button className="opacity-0 group-hover:opacity-100 ml-4 p-2 rounded-lg hover:bg-emerald-500/20 transition-all duration-200">
                                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.section>
    );
};

// --- Team Section ---
const TeamSection: React.FC = () => {
    const [hoveredMember, setHoveredMember] = useState<number | null>(null);

    return (
        <motion.section
            className="py-24 px-4 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/70" />
            <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Section Header */}
                <motion.div variants={itemVariants} className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 glass-effect rounded-full px-8 py-3 mb-8">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                        </svg>
                        <span className="text-sm font-bold text-emerald-400 tracking-wide">OUR EXPERT TEAM</span>
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                        Meet the <span className="text-gradient">Creative Minds</span> Behind Your Success
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-5xl mx-auto leading-relaxed">
                        Our diverse team of experts brings together decades of experience in 
                        <span className="text-emerald-400 font-semibold"> design, development, AI, and marketing</span> to 
                        deliver exceptional results that exceed expectations.
                    </p>
                </motion.div>

                {/* Team Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                    variants={containerVariants}
                >
                    {TEAM_MEMBERS.map((member, index) => (
                        <motion.div
                            key={member.name}
                            className="group relative"
                            variants={itemVariants}
                            onMouseEnter={() => setHoveredMember(index)}
                            onMouseLeave={() => setHoveredMember(null)}
                            whileHover={{ y: -12, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="glass-effect rounded-3xl p-8 h-full relative overflow-hidden">
                                {/* Background Glow Effect */}
                                <div className={`absolute inset-0 transition-all duration-500 ${
                                    hoveredMember === index 
                                        ? 'bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10' 
                                        : 'bg-transparent'
                                }`} />
                                
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full translate-y-8 -translate-x-8" />

                                <div className="relative z-10">
                                    {/* Profile Image */}
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                                        <div className="relative w-24 h-24 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto">
                                            <span className="text-white font-bold text-3xl">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        
                                        {/* Online Status Indicator */}
                                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-slate-800 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Member Info */}
                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gradient transition-colors duration-300">
                                            {member.name}
                                        </h3>
                                        <div className="text-emerald-400 font-semibold text-lg mb-4">
                                            {member.role}
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {member.description}
                                        </p>
                                    </div>

                                    {/* Specialties */}
                                    <div className="mb-6">
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {member.specialties.map((specialty, idx) => (
                                                <motion.span
                                                    key={specialty}
                                                    className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs font-medium rounded-full border border-slate-600 group-hover:border-emerald-400/50 group-hover:text-emerald-400 transition-all duration-300"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                >
                                                    {specialty}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="flex justify-center gap-4">
                                        {Object.entries(member.social).map(([platform, url]) => {
                                            const icons = {
                                                linkedin: (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                                                    </svg>
                                                ),
                                                twitter: (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                                    </svg>
                                                ),
                                                github: (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                                    </svg>
                                                ),
                                                dribbble: (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zM7.394 17.064c-.297-.149-.568-.351-.801-.595a8.958 8.958 0 01-.662-4.975A20.719 20.719 0 007.394 17.064zM1.851 8.967c.214 2.047.995 3.9 2.199 5.35-.35-1.493-.35-3.061 0-4.554C3.248 10.1 2.478 9.567 1.851 8.967z" clipRule="evenodd" />
                                                    </svg>
                                                ),
                                                instagram: (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.629-.167 5.652-2.182 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.245 17.821.230 14.189.06 13.124.012 12.784 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.009 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
                                                    </svg>
                                                ),
                                                email: (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                )
                                            };

                                            return (
                                                <motion.a
                                                    key={platform}
                                                    href={url}
                                                    className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-300 group/social"
                                                    whileHover={{ scale: 1.1, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    aria-label={`${member.name} ${platform}`}
                                                >
                                                    <div className="group-hover/social:animate-pulse">
                                                        {icons[platform as keyof typeof icons]}
                                                    </div>
                                                </motion.a>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Team Stats */}
                <motion.div 
                    variants={itemVariants}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
                >
                    {[
                        { number: "50+", label: "Projects Completed", icon: "🚀" },
                        { number: "6", label: "Team Members", icon: "👥" },
                        { number: "15+", label: "Years Experience", icon: "⭐" },
                        { number: "24/7", label: "Support Available", icon: "🔧" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="glass-effect p-6 rounded-2xl text-center group"
                            whileHover={{ scale: 1.05, y: -3 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-black text-gradient mb-2">
                                {stat.number}
                            </div>
                            <div className="text-slate-400 text-sm font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call to Action */}
                <motion.div variants={itemVariants} className="text-center">
                    <div className="glass-effect rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Work with <span className="text-gradient">Our Amazing Team?</span>
                        </h3>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Let's discuss your project and see how our expert team can help you achieve 
                            your digital transformation goals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <motion.button 
                                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Start a Conversation
                            </motion.button>
                            <motion.button 
                                className="bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-600 transition-all duration-300 flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7h8v10a2 2 0 01-2 2H10a2 2 0 01-2-2V7z" />
                                </svg>
                                View Our Portfolio
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

// --- AI Business Advisor Section ---  
const AIBusinessAdvisor: React.FC = () => {
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedGoal, setSelectedGoal] = useState('');
    const [insights, setInsights] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const industries = [
        'E-commerce', 'SaaS', 'Healthcare', 'Education', 'Real Estate', 
        'Finance', 'Restaurant', 'Fitness', 'Travel', 'Technology'
    ];

    const goals = [
        'Increase Revenue', 'Build Brand Awareness', 'Generate More Leads',
        'Improve Customer Experience', 'Expand Market Reach', 'Launch New Products',
        'Optimize Operations', 'Enhance Digital Presence'
    ];

    const quickInsights = {
        'E-commerce': {
            opportunities: ['Mobile optimization', 'Social commerce', 'Personalization'],
            challenges: ['Cart abandonment', 'Customer acquisition cost', 'Competition'],
            trends: ['Voice commerce', 'AR try-ons', 'Sustainable packaging']
        },
        'SaaS': {
            opportunities: ['Free trial optimization', 'Customer onboarding', 'Upselling'],
            challenges: ['Churn reduction', 'Product-market fit', 'Pricing strategy'],
            trends: ['AI integration', 'No-code solutions', 'API-first approach']
        },
        'Healthcare': {
            opportunities: ['Telemedicine', 'Patient engagement', 'Digital health records'],
            challenges: ['HIPAA compliance', 'Patient trust', 'Integration complexity'],
            trends: ['AI diagnostics', 'Wearable integration', 'Mental health focus']
        }
    };

    const getQuickInsight = () => {
        if (!selectedIndustry || !selectedGoal) return null;
        
        const industryData = quickInsights[selectedIndustry as keyof typeof quickInsights];
        if (!industryData) return null;

        return {
            insight: `For ${selectedIndustry} businesses focusing on "${selectedGoal}", here are key insights:`,
            opportunities: industryData.opportunities,
            challenges: industryData.challenges,
            trends: industryData.trends,
            recommendation: `Start with ${industryData.opportunities[0]} and address ${industryData.challenges[0]} first.`
        };
    };

    return (
        <motion.section
            className="py-24 px-4 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5" />
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <motion.div variants={itemVariants} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-2 mb-6">
                        <svg className="w-4 h-4 text-purple-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="text-sm font-medium text-purple-400">AI BUSINESS ADVISOR</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6">
                        Get Instant <span className="text-gradient">Business Insights</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                        Our AI analyzes your industry and goals to provide personalized growth strategies, 
                        market opportunities, and actionable recommendations in seconds.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Interactive Selector */}
                    <motion.div 
                        variants={itemVariants}
                        className="glass-effect rounded-3xl p-8 space-y-8"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">Quick Business Analysis</h3>
                        
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-4">
                                Select Your Industry
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {industries.map((industry) => (
                                    <button
                                        key={industry}
                                        onClick={() => setSelectedIndustry(industry)}
                                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                            selectedIndustry === industry
                                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                                                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                                        }`}
                                    >
                                        {industry}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-4">
                                Primary Business Goal
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                {goals.map((goal) => (
                                    <button
                                        key={goal}
                                        onClick={() => setSelectedGoal(goal)}
                                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 text-left ${
                                            selectedGoal === goal
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                                        }`}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* AI Insights Display */}
                    <motion.div 
                        variants={itemVariants}
                        className="glass-effect rounded-3xl p-8"
                    >
                        {selectedIndustry && selectedGoal ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                    <h3 className="text-2xl font-bold text-white">AI Analysis Ready</h3>
                                </div>

                                {(() => {
                                    const insight = getQuickInsight();
                                    if (!insight) return null;

                                    return (
                                        <div className="space-y-6">
                                            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">
                                                <p className="text-white font-medium mb-4">{insight.insight}</p>
                                                <p className="text-slate-300 text-sm italic">"{insight.recommendation}"</p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                                    <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                        Opportunities
                                                    </h4>
                                                    <ul className="space-y-1 text-sm text-slate-300">
                                                        {insight.opportunities.map((opp, idx) => (
                                                            <li key={idx} className="flex items-center gap-2">
                                                                <span className="w-1 h-1 bg-green-400 rounded-full" />
                                                                {opp}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                                                    <h4 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                                        </svg>
                                                        Key Challenges
                                                    </h4>
                                                    <ul className="space-y-1 text-sm text-slate-300">
                                                        {insight.challenges.map((challenge, idx) => (
                                                            <li key={idx} className="flex items-center gap-2">
                                                                <span className="w-1 h-1 bg-orange-400 rounded-full" />
                                                                {challenge}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                                    <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
                                                        </svg>
                                                        Industry Trends
                                                    </h4>
                                                    <ul className="space-y-1 text-sm text-slate-300">
                                                        {insight.trends.map((trend, idx) => (
                                                            <li key={idx} className="flex items-center gap-2">
                                                                <span className="w-1 h-1 bg-blue-400 rounded-full" />
                                                                {trend}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <motion.button
                                                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center gap-2"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                Get Detailed AI Strategy Plan
                                            </motion.button>
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Ready for AI Analysis</h3>
                                <p className="text-slate-400">Select your industry and primary goal to get personalized insights</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Call to Action */}
                <motion.div 
                    variants={itemVariants}
                    className="text-center mt-16"
                >
                    <div className="glass-effect rounded-2xl p-8 max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Want a Complete Business Analysis?
                        </h3>
                        <p className="text-slate-300 mb-6">
                            Get a comprehensive AI-powered business assessment with detailed recommendations, 
                            competitor analysis, and a custom growth strategy.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button 
                                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Get Full AI Analysis
                            </motion.button>
                            <motion.button 
                                className="bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Schedule Strategy Call
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};


// --- Enhanced Services Preview Section ---
// --- Service Modal Component ---
interface ServiceModalProps {
    service: Service | null;
    isOpen: boolean;
    onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, isOpen, onClose }) => {
    if (!isOpen || !service) return null;

    const processSteps = {
        'Brand Strategy': [
            { step: 'Discovery', description: 'Brand audit and market research', duration: '1-2 weeks' },
            { step: 'Strategy', description: 'Brand positioning and messaging', duration: '1 week' },
            { step: 'Design', description: 'Visual identity development', duration: '2-3 weeks' },
            { step: 'Implementation', description: 'Brand guidelines and rollout', duration: '1 week' }
        ],
        'UI/UX Design': [
            { step: 'Research', description: 'User research and analysis', duration: '1 week' },
            { step: 'Wireframing', description: 'Information architecture', duration: '1-2 weeks' },
            { step: 'Design', description: 'Visual design and prototyping', duration: '2-3 weeks' },
            { step: 'Testing', description: 'User testing and refinement', duration: '1 week' }
        ],
        'Web Development': [
            { step: 'Planning', description: 'Technical architecture and setup', duration: '1 week' },
            { step: 'Development', description: 'Frontend and backend coding', duration: '4-6 weeks' },
            { step: 'Testing', description: 'Quality assurance and debugging', duration: '1 week' },
            { step: 'Launch', description: 'Deployment and go-live', duration: '1 week' }
        ]
    };

    const defaultSteps = [
        { step: 'Consultation', description: 'Understanding your requirements', duration: '1 week' },
        { step: 'Strategy', description: 'Planning and approach', duration: '1-2 weeks' },
        { step: 'Execution', description: 'Implementation and delivery', duration: '2-4 weeks' },
        { step: 'Optimization', description: 'Testing and refinement', duration: '1 week' }
    ];

    const steps = processSteps[service.title as keyof typeof processSteps] || defaultSteps;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            
            {/* Modal Content */}
            <motion.div
                className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-effect rounded-3xl p-8"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Service Details */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white`}>
                                {service.icon}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{service.title}</h2>
                                <p className="text-emerald-400 font-semibold text-lg">{service.price}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-300 leading-relaxed text-lg">{service.description}</p>

                        {/* Features */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 text-xl">What's Included</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {service.features?.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 glass-effect p-3 rounded-xl">
                                        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-slate-300 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 text-xl">Key Benefits</h3>
                            <div className="space-y-3">
                                {[
                                    'Dedicated project manager',
                                    '24/7 customer support',
                                    'Unlimited revisions',
                                    '30-day money-back guarantee',
                                    'Post-launch support included'
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full" />
                                        <span className="text-slate-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Process Timeline */}
                    <div className="space-y-6">
                        <h3 className="text-white font-semibold text-xl">Our Process</h3>
                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <div key={index} className="relative">
                                    {/* Timeline Line */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-emerald-400 to-blue-400" />
                                    )}
                                    
                                    <div className="flex items-start gap-4">
                                        {/* Step Number */}
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-white font-bold text-sm relative z-10`}>
                                            {index + 1}
                                        </div>
                                        
                                        {/* Step Content */}
                                        <div className="flex-1 glass-effect p-4 rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-white font-semibold">{step.step}</h4>
                                                <span className="text-emerald-400 text-sm font-medium">{step.duration}</span>
                                            </div>
                                            <p className="text-slate-300 text-sm">{step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="pt-6 space-y-4">
                            <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300">
                                Get Started Now
                            </button>
                            <button className="w-full border border-slate-600 text-slate-300 py-3 px-6 rounded-xl hover:border-emerald-400 hover:text-emerald-400 transition-all">
                                Schedule Consultation
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="glass-effect p-4 rounded-xl text-center">
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-white font-semibold">4.9/5</span>
                            </div>
                            <p className="text-slate-400 text-sm">Based on 150+ client reviews</p>
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

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, onLearnMore, featured = false }) => (
    <motion.div
        className={`group relative overflow-hidden rounded-3xl text-center ${featured ? 'ring-2 ring-emerald-400 ring-opacity-50' : ''}`}
        variants={itemVariants}
        whileHover={{ y: -12, scale: 1.02 }}
        transition={{ duration: 0.3 }}
    >
        {/* Featured Badge */}
        {featured && (
            <div className="absolute -top-1 -right-1 z-10">
                <div className="bg-gradient-to-r from-emerald-400 to-blue-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                </div>
            </div>
        )}

        <div className={`glass-effect p-8 h-full relative ${featured ? 'bg-gradient-to-br from-emerald-500/5 to-blue-500/5' : ''}`}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full translate-y-12 -translate-x-12" />
            
            {/* Service Number */}
            <div className="absolute top-4 right-4 text-5xl font-black text-slate-800/30 group-hover:text-slate-700/40 transition-colors">
                {(index + 1).toString().padStart(2, '0')}
            </div>

            <div className="relative z-10">
                {/* Service Icon */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all" />
                    <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${service.color} text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                        {service.icon}
                    </div>
                </div>

                {/* Service Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gradient transition-colors duration-300">
                    {service.title}
                </h3>
                <p className="text-slate-300 mb-6 leading-relaxed text-sm">
                    {service.description}
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {service.features?.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            <span className="truncate">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Price */}
                <div className="mb-6">
                    <div className={`text-xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                        {service.price}
                    </div>
                    <div className="text-slate-400 text-xs mt-1">No hidden fees</div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <motion.button 
                        onClick={onLearnMore}
                        className={`w-full bg-gradient-to-r ${service.color} text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Learn More
                    </motion.button>
                    <button className="w-full border border-slate-600 text-slate-300 py-2 px-6 rounded-xl text-sm hover:border-emerald-400 hover:text-emerald-400 transition-all">
                        Get Quote
                    </button>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 pt-4 border-t border-slate-700">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Money-back guarantee</span>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

// --- Enhanced Services Preview Section ---
const ServicesPreview: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLearnMore = (service: Service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    return (
        <>
            <motion.section
                className="py-24 px-4 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 to-slate-800/70" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />
                <div className="absolute top-2/3 left-2/3 w-64 h-64 bg-purple-500/6 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    {/* Enhanced Section Header */}
                    <motion.div variants={itemVariants} className="text-center mb-20">
                        <div className="inline-flex items-center gap-3 glass-effect rounded-full px-8 py-3 mb-8">
                            <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span className="text-sm font-bold text-emerald-400 tracking-wide">PREMIUM SERVICES</span>
                            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                            Comprehensive <span className="text-gradient">Digital Solutions</span> 
                            <span className="block">For Your Business</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-slate-300 max-w-5xl mx-auto leading-relaxed mb-8">
                            Transform your business with our 
                            <span className="text-emerald-400 font-semibold"> award-winning services</span> that combine 
                            <span className="text-blue-400 font-semibold">cutting-edge technology</span> with proven strategies 
                            to deliver exceptional results.
                        </p>
                    </motion.div>

                    {/* Enhanced Services Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
                        variants={containerVariants}
                    >
                        {SERVICES.map((service, index) => (
                            <ServiceCard
                                key={service.title}
                                service={service}
                                index={index}
                                onLearnMore={() => handleLearnMore(service)}
                                featured={index === 1} // Make UI/UX Design featured
                            />
                        ))}
                    </motion.div>

                    {/* Process Overview */}
                    <motion.div variants={itemVariants} className="mb-20">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Our <span className="text-gradient">Proven Process</span>
                            </h3>
                            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                                Every project follows our streamlined methodology for consistent, 
                                high-quality results that exceed expectations.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { 
                                    icon: '🔍', 
                                    title: 'Discovery', 
                                    description: 'Understanding your goals and requirements' 
                                },
                                { 
                                    icon: '💡', 
                                    title: 'Strategy', 
                                    description: 'Crafting the perfect solution approach' 
                                },
                                { 
                                    icon: '🚀', 
                                    title: 'Execution', 
                                    description: 'Bringing your vision to life with precision' 
                                },
                                { 
                                    icon: '📈', 
                                    title: 'Optimization', 
                                    description: 'Continuous improvement and growth' 
                                }
                            ].map((step, index) => (
                                <motion.div 
                                    key={index}
                                    className="glass-effect p-6 rounded-2xl text-center group hover:bg-gradient-to-br hover:from-emerald-500/5 hover:to-blue-500/5 transition-all duration-300"
                                    whileHover={{ y: -5, scale: 1.02 }}
                                >
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                                        {step.icon}
                                    </div>
                                    <h4 className="text-white font-bold text-lg mb-2">{step.title}</h4>
                                    <p className="text-slate-400 text-sm">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Service Statistics */}
                    <motion.div 
                        variants={itemVariants}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
                    >
                        {[
                            { number: '500+', label: 'Projects Delivered', icon: '🎯' },
                            { number: '98%', label: 'Client Satisfaction', icon: '⭐' },
                            { number: '24/7', label: 'Support Available', icon: '💬' },
                            { number: '15+', label: 'Industry Awards', icon: '🏆' }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="glass-effect p-6 rounded-2xl text-center group"
                                whileHover={{ scale: 1.05, y: -3 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-black text-gradient mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-slate-400 text-sm font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Enhanced Call to Action */}
                    <motion.div variants={itemVariants} className="text-center">
                        <div className="glass-effect rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Ready to <span className="text-gradient">Transform Your Business?</span>
                            </h3>
                            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Choose from our comprehensive service offerings or let us create a 
                                custom solution tailored specifically to your unique business needs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <motion.button
                                    onClick={(e) => { e.preventDefault(); setCurrentPage('services'); }}
                                    className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Explore All Services
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </motion.button>
                                <motion.button
                                    className="group inline-flex items-center justify-center gap-3 bg-slate-700 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:bg-slate-600 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Get Free Consultation
                                </motion.button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex items-center justify-center gap-8 mt-8 pt-8 border-t border-slate-700">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-slate-300 text-sm">SSL Secured</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span className="text-slate-300 text-sm">Money Back Guarantee</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-slate-300 text-sm">24/7 Support</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Service Modal */}
            <ServiceModal 
                service={selectedService}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedService(null);
                }}
            />
        </>
    );
};

// --- Enhanced Projects Preview Section ---
// --- Enhanced Project Modal ---
interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
    if (!isOpen || !project) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            
            {/* Modal Content */}
            <motion.div
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-effect rounded-3xl p-8"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Project Image */}
                    <div className="relative">
                        <img 
                            src={project.imageUrl} 
                            alt={project.title}
                            className="w-full h-80 object-cover rounded-2xl"
                        />
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            {project.category}
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-5 h-5 ${i < Math.floor(project.rating) ? 'text-yellow-400' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    ))}
                                    <span className="text-slate-300 ml-2">{project.rating}</span>
                                </div>
                                <div className="text-emerald-400 font-semibold">{project.completionTime}</div>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{project.description}</p>
                        </div>

                        {/* Client Info */}
                        <div className="glass-effect p-4 rounded-xl">
                            <h3 className="text-white font-semibold mb-2">Client</h3>
                            <p className="text-emerald-400 font-medium">{project.client}</p>
                        </div>

                        {/* Technologies */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Technologies Used</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies?.map((tech, index) => (
                                    <span key={index} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm border border-slate-600">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Results */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Key Results</h3>
                            <div className="space-y-2">
                                {project.results?.map((result, index) => (
                                    <div key={index} className="flex items-center gap-2 text-slate-300">
                                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {result}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all">
                                Start Similar Project
                            </button>
                            <button className="px-6 py-3 border border-slate-600 text-slate-300 rounded-xl hover:border-emerald-400 hover:text-emerald-400 transition-all">
                                View Live Site
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Enhanced Project Card ---
interface ProjectCardProps {
    project: Project;
    index: number;
    onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onClick }) => (
    <motion.div
        className="group relative overflow-hidden rounded-3xl shadow-2xl h-96 cursor-pointer"
        variants={itemVariants}
        whileHover={{ scale: 1.02, y: -8 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
    >
        <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full -translate-y-16 translate-x-16" />
        
        {/* Project Number */}
        <div className="absolute top-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-lg">{(index + 1).toString().padStart(2, '0')}</span>
        </div>

        {/* Quick Action Buttons */}
        <div className="absolute top-6 left-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </button>
            <button className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        </div>

        {/* Project Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                {/* Category and Time */}
                <div className="flex items-center justify-between mb-4">
                    <span className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        {project.category}
                    </span>
                    <span className="text-slate-300 text-sm font-medium">{project.completionTime}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gradient transition-colors duration-300">
                    {project.title}
                </h3>
                
                <p className="text-slate-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed">
                    {project.description?.substring(0, 120)}...
                </p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.technologies?.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                            {tech}
                        </span>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                            +{project.technologies.length - 3}
                        </span>
                    )}
                </div>
                
                {/* Rating and Client */}
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(project.rating) ? 'text-yellow-400' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                            ))}
                        </div>
                        <span className="text-slate-300 text-sm font-medium">{project.rating}</span>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">{project.client}</span>
                </div>
            </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
);

// --- Enhanced Projects Preview Section ---
const ProjectsPreview: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [displayedProjects, setDisplayedProjects] = useState(PROJECTS);

    const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleFilterChange = (category: string) => {
        setActiveFilter(category);
        if (category === 'All') {
            setDisplayedProjects(PROJECTS);
        } else {
            setDisplayedProjects(PROJECTS.filter(p => p.category === category));
        }
    };

    return (
        <>
            <motion.section
                className="py-24 px-4 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 to-slate-800/90" />
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl" />
                <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-blue-500/6 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    {/* Enhanced Section Header */}
                    <motion.div variants={itemVariants} className="text-center mb-20">
                        <div className="inline-flex items-center gap-3 glass-effect rounded-full px-8 py-3 mb-8">
                            <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                            </svg>
                            <span className="text-sm font-bold text-emerald-400 tracking-wide">FEATURED PROJECTS</span>
                            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                            Portfolio of <span className="text-gradient">Exceptional Work</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-slate-300 max-w-5xl mx-auto leading-relaxed mb-8">
                            Discover our most impactful projects that showcase 
                            <span className="text-emerald-400 font-semibold"> innovative solutions, cutting-edge design,</span> and 
                            <span className="text-blue-400 font-semibold">measurable business results</span> across various industries.
                        </p>
                    </motion.div>

                    {/* Enhanced Filter Tabs */}
                    <motion.div variants={itemVariants} className="flex justify-center mb-16">
                        <div className="glass-effect rounded-2xl p-2 inline-flex gap-2">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category}
                                    onClick={() => handleFilterChange(category)}
                                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                        activeFilter === category
                                            ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {category}
                                    {category !== 'All' && (
                                        <span className="ml-2 px-2 py-0.5 bg-slate-600/50 rounded-full text-xs">
                                            {PROJECTS.filter(p => p.category === category).length}
                                        </span>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Enhanced Projects Grid */}
                    <motion.div layout className="mb-20">
                        <motion.div 
                            className={`grid gap-8 ${
                                displayedProjects.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
                                displayedProjects.length === 2 ? 'grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto' :
                                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            }`}
                            variants={containerVariants}
                            layout
                        >
                            {displayedProjects.map((project, index) => (
                                <motion.div
                                    key={project.title}
                                    variants={itemVariants}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <ProjectCard 
                                        project={project} 
                                        index={index} 
                                        onClick={() => handleProjectClick(project)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* No Projects Found */}
                        {displayedProjects.length === 0 && (
                            <motion.div 
                                className="text-center py-16"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.239 0-4.268-.967-5.708-2.709M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">No Projects Found</h3>
                                <p className="text-slate-400">Try selecting a different category to see more projects.</p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Project Statistics */}
                    <motion.div 
                        variants={itemVariants}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
                    >
                        {[
                            { number: '150+', label: 'Projects Delivered', icon: '🚀', color: 'from-emerald-500 to-teal-500' },
                            { number: '98%', label: 'Client Satisfaction', icon: '⭐', color: 'from-blue-500 to-cyan-500' },
                            { number: '24/7', label: 'Support Available', icon: '🛡️', color: 'from-purple-500 to-pink-500' },
                            { number: '5+', label: 'Years Experience', icon: '🏆', color: 'from-orange-500 to-red-500' }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="glass-effect p-6 rounded-2xl text-center group"
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                    {stat.number}
                                </div>
                                <div className="text-slate-400 text-sm font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Enhanced Call to Action */}
                    <motion.div variants={itemVariants} className="text-center">
                        <div className="glass-effect rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Ready to Create <span className="text-gradient">Your Success Story?</span>
                            </h3>
                            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Join our portfolio of successful projects. Let's discuss how we can bring 
                                your vision to life with innovative solutions and exceptional results.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <motion.button
                                    onClick={(e) => { e.preventDefault(); setCurrentPage('projects'); }}
                                    className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    View Full Portfolio
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </motion.button>
                                <motion.button
                                    className="group inline-flex items-center justify-center gap-3 bg-slate-700 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:bg-slate-600 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Start Your Project
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Project Modal */}
            <ProjectModal 
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedProject(null);
                }}
            />
        </>
    );
};

// --- Enhanced Testimonials Slider Section ---
const TestimonialsSlider: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const touchStartX = useRef(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchStartX.current - touchEndX > 50) {
            handleNext();
        } else if (touchEndX - touchStartX.current > 50) {
            handlePrev();
        }
    }

    useEffect(() => {
        const interval = setInterval(handleNext, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.section
            className="py-24 px-4 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/60" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-6xl text-center relative z-10">
                <motion.div variants={itemVariants} className="mb-20">
                    <div className="inline-flex items-center gap-2 glass-effect rounded-full px-8 py-3 mb-8">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-sm font-bold text-emerald-400 tracking-wide">CLIENT TESTIMONIALS</span>
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                        What Our <span className="text-gradient">Amazing Clients</span> Say
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                        Don't just take our word for it. Hear from the businesses we've helped transform their 
                        digital presence and <span className="text-emerald-400 font-semibold">achieve remarkable success</span>.
                    </p>
                </motion.div>

                <motion.div 
                    variants={itemVariants}
                    className="relative"
                    onTouchStart={handleTouchStart} 
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Navigation Buttons */}
                    <button 
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 glass-effect p-3 rounded-full hover:bg-white/10 transition-all duration-300 group"
                        aria-label="Previous testimonial"
                    >
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 glass-effect p-3 rounded-full hover:bg-white/10 transition-all duration-300 group"
                        aria-label="Next testimonial"
                    >
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Enhanced Testimonial Cards */}
                    <div className="relative overflow-hidden rounded-3xl">
                        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                            {TESTIMONIALS.map((testimonial, index) => (
                                <div key={index} className="w-full flex-shrink-0 px-2">
                                    <motion.div 
                                        className="glass-effect rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col justify-between"
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full -translate-y-16 translate-x-16" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 rounded-full translate-y-12 -translate-x-12" />
                                        
                                        {/* Header with Quote and Rating */}
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="text-8xl text-gradient font-black leading-none opacity-20">"</div>
                                            <div className="flex">
                                                {testimonial.rating && [...Array(5)].map((_, i) => (
                                                    <motion.svg 
                                                        key={i} 
                                                        className={`w-6 h-6 ${i < testimonial.rating! ? 'text-yellow-400' : 'text-slate-600'}`} 
                                                        fill="currentColor" 
                                                        viewBox="0 0 20 20"
                                                        initial={{ scale: 0, rotate: -180 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ delay: i * 0.1, duration: 0.3 }}
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                    </motion.svg>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Testimonial Content */}
                                        <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-auto relative z-10 flex-grow">
                                            {testimonial.quote}
                                        </blockquote>
                                        
                                        {/* Enhanced Author Section */}
                                        <div className="flex items-center gap-6 mt-8 relative z-10">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl blur-lg opacity-50" />
                                                <div className="relative w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                                                    <span className="text-white font-bold text-2xl">
                                                        {testimonial.author.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-white text-xl mb-1">{testimonial.author}</div>
                                                <div className="text-emerald-400 font-semibold text-lg">{testimonial.company}</div>
                                                <div className="text-slate-400 text-sm mt-1">Verified Client</div>
                                            </div>
                                            <div className="hidden md:block">
                                                <svg className="w-12 h-12 text-emerald-400/20" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Pagination and Progress */}
                    <div className="flex flex-col items-center gap-6 mt-12">
                        {/* Progress Bar */}
                        <div className="w-full max-w-md">
                            <div className="flex justify-between text-sm text-slate-400 mb-2">
                                <span>Testimonial {activeIndex + 1} of {TESTIMONIALS.length}</span>
                                <span>Auto-advancing</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${((activeIndex + 1) / TESTIMONIALS.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                        
                        {/* Enhanced Pagination Dots */}
                        <div className="flex items-center gap-3">
                            {TESTIMONIALS.map((_, index) => (
                                <motion.button 
                                    key={index} 
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-3 rounded-full transition-all duration-300 ${
                                        index === activeIndex 
                                            ? 'bg-gradient-to-r from-emerald-400 to-blue-400 w-8 shadow-lg' 
                                            : 'bg-slate-600 hover:bg-slate-500 w-3'
                                    }`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}


// --- Company Stats Section ---
const CompanyStats: React.FC = () => (
  <motion.section
    className="py-20 px-4 relative"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={containerVariants}
  >
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" />
    
    <div className="container mx-auto relative z-10">
      <motion.div 
        variants={itemVariants}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Trusted by <span className="text-gradient">Leading Brands</span>
        </h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Our proven track record speaks for itself with exceptional results across all metrics
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto"
      >
        {COMPANY_STATS.map((stat, index) => (
          <motion.div
            key={index}
            className="glass-effect p-8 rounded-2xl text-center group"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              transition: { duration: 0.2 } 
            }}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <motion.div 
              className="text-4xl md:text-5xl font-black text-gradient mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {stat.number}
            </motion.div>
            <div className="text-base text-slate-400 font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </motion.section>
);

export const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  return (
    <>
      <Hero onGetStarted={() => setCurrentPage('projects')} />
      <CompanyStats />
      <ServicesPreview setCurrentPage={setCurrentPage}/>
      <SloganGenerator />
      <AIBusinessAdvisor />
      <TeamSection />
      <ProjectsPreview setCurrentPage={setCurrentPage} />
      <TestimonialsSlider />
      <FAQ />
    </>
  );
};