import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { TEAM_MEMBERS } from '../constants';

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
                <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16 lg:mb-20">
                    <div className="inline-flex items-center gap-2 glass-effect rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 mb-6 sm:mb-8 mx-4 sm:mx-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                        <span className="text-xs sm:text-sm font-bold text-emerald-400 tracking-wide">OUR EXPERT TEAM</span>
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8 leading-tight px-4 sm:px-0">
                        Meet the <span className="text-gradient">Creative Minds</span> Behind Your Success
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 max-w-5xl mx-auto leading-relaxed px-4 sm:px-0">
                        Our diverse team of experts brings together decades of experience in
                        <span className="text-emerald-400 font-semibold"> design, development, AI, and marketing</span> to
                        deliver exceptional results that exceed expectations.
                    </p>
                </motion.div>

                {/* Team Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4 sm:px-0"
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
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="glass-effect rounded-3xl p-8 h-full relative overflow-hidden">
                                {/* Background Glow Effect */}
                                <div className={`absolute inset-0 transition-all duration-500 ${hoveredMember === index
                                    ? 'bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10'
                                    : 'bg-transparent'
                                    }`} />

                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full translate-y-8 -translate-x-8" />

                                <div className="relative z-10">
                                    <Link to={`/team/${member.slug}`} className="block">
                                        {/* Profile Image */}
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                                            <div className="relative w-32 h-32 mx-auto">
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-slate-700 group-hover:border-emerald-400/50 transition-all duration-300"
                                                    onError={(e) => {
                                                        // Fallback to initials if image fails to load
                                                        e.currentTarget.style.display = 'none';
                                                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                        if (fallback) fallback.style.display = 'flex';
                                                    }}
                                                />
                                                {/* Fallback initials (hidden by default) */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl items-center justify-center shadow-xl hidden">
                                                    <span className="text-white font-bold text-2xl">
                                                        {member.name.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
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
                                    </Link>

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
                                                        <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.629-.167 5.652-2.182 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.245 17.821.230 14.189.06 13.124.012 12.784 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.009 2.988-.057 4.042-.124 2.687-1.387 3.977-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
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

export default TeamSection;
