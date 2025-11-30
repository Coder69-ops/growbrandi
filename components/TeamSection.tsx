import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaUsers, FaCode, FaLinkedin, FaTwitter, FaGithub, FaDribbble, FaInstagram, FaEnvelope, FaCommentDots, FaBriefcase } from 'react-icons/fa';

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
            <div className="absolute inset-0 bg-luxury-black" />
            <div className="absolute top-1/4 right-1/3 w-64 md:w-96 h-64 md:h-96 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 left-1/4 w-64 md:w-80 h-64 md:h-80 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute top-2/3 right-1/4 w-48 md:w-64 h-48 md:h-64 bg-purple-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Section Header */}
                <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16 lg:mb-20">
                    <div className="inline-flex items-center gap-2 glass-effect rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 mb-6 sm:mb-8 mx-4 sm:mx-0">
                        <FaUsers className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                        <span className="text-xs sm:text-sm font-bold text-emerald-400 tracking-wide">OUR EXPERT TEAM</span>
                        <FaCode className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8 leading-tight px-4 sm:px-0">
                        Meet the <span className="text-gradient">Creative Minds</span> Behind Your Success
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-300 max-w-5xl mx-auto leading-relaxed px-4 sm:px-0">
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
                            <div className="glass-effect rounded-3xl p-6 md:p-8 h-full relative overflow-hidden">
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
                                                    className="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-zinc-700 group-hover:border-emerald-400/50 transition-all duration-300"
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
                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-zinc-800 flex items-center justify-center">
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
                                            <p className="text-zinc-300 text-sm leading-relaxed">
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
                                                    className="px-3 py-1 bg-zinc-700/50 text-zinc-300 text-xs font-medium rounded-full border border-zinc-600 group-hover:border-emerald-400/50 group-hover:text-emerald-400 transition-all duration-300"
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
                                                linkedin: <FaLinkedin className="w-5 h-5" />,
                                                twitter: <FaTwitter className="w-5 h-5" />,
                                                github: <FaGithub className="w-5 h-5" />,
                                                dribbble: <FaDribbble className="w-5 h-5" />,
                                                instagram: <FaInstagram className="w-5 h-5" />,
                                                email: <FaEnvelope className="w-5 h-5" />
                                            };

                                            return (
                                                <motion.a
                                                    key={platform}
                                                    href={url}
                                                    className="p-2 rounded-lg bg-zinc-700/50 text-zinc-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-300 group/social"
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
                        <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Let's discuss your project and see how our expert team can help you achieve
                            your digital transformation goals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <motion.button
                                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaCommentDots className="w-5 h-5" />
                                Start a Conversation
                            </motion.button>
                            <motion.button
                                className="bg-zinc-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-zinc-600 transition-all duration-300 flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaBriefcase className="w-5 h-5" />
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
