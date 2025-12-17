import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaLinkedin, FaTiktok, FaGithub, FaBuilding, FaInstagram, FaEnvelope, FaBriefcase, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
// import { CONTACT_INFO } from '../constants'; // Removed
import { BackgroundEffects } from './ui/BackgroundEffects';
import { GlassCard } from './ui/GlassCard';
import { SectionHeading } from './ui/SectionHeading';
import { useContent } from '../src/hooks/useContent';
import { getLocalizedField } from '../src/utils/localization';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';
import { TeamMember } from '../types';
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

const TeamSection: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { getLocalizedPath } = useLocalizedPath();
    const [hoveredMember, setHoveredMember] = useState<number | null>(null);
    const { data: team, loading } = useContent<TeamMember>('team_members');

    const localized = (field: any) => getLocalizedField(field, i18n.language);

    return (
        <motion.section
            className="py-24 px-4 relative overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-300"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={containerVariants}
        >
            <BackgroundEffects />

            <div className="container mx-auto max-w-7xl relative z-10">
                <SectionHeading
                    badge={t('section_headers.team.badge')}
                    title={t('section_headers.team.title')}
                    highlight={t('section_headers.team.highlight') || "Creative Minds"}
                    description={t('section_headers.team.description')}
                />

                {/* Team Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4 sm:px-0">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-[500px] rounded-3xl overflow-hidden bg-white/5 dark:bg-white/5 border border-white/10 relative">
                                <Skeleton className="w-full h-full absolute inset-0 bg-slate-200/50 dark:bg-zinc-800/50" />
                                <div className="absolute top-8 left-8 right-8 bottom-8 flex flex-col items-center">
                                    <Skeleton variant="card" className="w-32 h-32 mb-6 shadow-lg" />
                                    <Skeleton className="h-8 w-3/4 mb-3" />
                                    <Skeleton className="h-6 w-1/2 mb-4" />
                                    <Skeleton className="h-20 w-full mb-6" />
                                    <div className="flex gap-2 mb-6">
                                        <Skeleton variant="circle" className="h-6 w-16" />
                                        <Skeleton variant="circle" className="h-6 w-16" />
                                        <Skeleton variant="circle" className="h-6 w-16" />
                                    </div>
                                    <div className="mt-auto flex gap-4">
                                        <Skeleton variant="card" className="w-8 h-8" />
                                        <Skeleton variant="card" className="w-8 h-8" />
                                        <Skeleton variant="card" className="w-8 h-8" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4 sm:px-0"
                        variants={containerVariants}
                    >
                        {team.map((member, index) => (
                            <motion.div
                                key={member.id || index}
                                className="group relative h-full"
                                variants={itemVariants}
                                onMouseEnter={() => setHoveredMember(index)}
                                onMouseLeave={() => setHoveredMember(null)}
                            >
                                <GlassCard
                                    className="h-full p-0 overflow-hidden flex flex-col"
                                    hoverEffect={true}
                                >
                                    {/* Background Glow Effect */}
                                    <div className={`absolute inset-0 transition-all duration-500 ${hoveredMember === index
                                        ? 'bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5'
                                        : 'bg-transparent'
                                        }`} />

                                    <div className="relative z-10 flex flex-col h-full p-6 md:p-8">
                                        <Link to={getLocalizedPath(`/team/${member.slug}`)} className="block flex-grow">
                                            {/* Profile Image */}
                                            <div className="relative mb-6">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                                <div className="relative w-32 h-32 mx-auto">
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        loading="lazy"
                                                        width="300"
                                                        height="300"
                                                        className="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-slate-100 dark:border-zinc-800 group-hover:border-blue-400/50 transition-all duration-300"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                    {/* Fallback initials */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl items-center justify-center shadow-xl hidden">
                                                        <span className="text-white font-bold text-3xl">
                                                            {member.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Online Status Indicator */}
                                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center">
                                                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse" />
                                                </div>
                                            </div>

                                            {/* Member Info */}
                                            <div className="text-center mb-6">
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 flex items-center justify-center gap-2">
                                                    {member.name}
                                                    <FaCheckCircle className="w-4 h-4 text-blue-500" title="Verified Expert" />
                                                </h3>
                                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 font-semibold text-lg mb-4">
                                                    {localized(member.role)}
                                                </div>
                                                <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3">
                                                    {localized(member.description)}
                                                </p>
                                            </div>
                                        </Link>

                                        {/* Specialties */}
                                        <div className="mb-6 mt-auto">
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {member.specialties?.slice(0, 3).map((specialty: any, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-300 text-xs font-medium rounded-full border border-slate-200 dark:border-white/10"
                                                    >
                                                        {localized(specialty)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Social Links */}
                                        <div className="flex justify-center gap-3 pt-6 border-t border-slate-200 dark:border-white/10">
                                            {member.social && Object.entries(member.social).map(([platform, url]) => {
                                                const icons: any = {
                                                    linkedin: <FaLinkedin className="w-4 h-4" />,
                                                    tiktok: <FaTiktok className="w-4 h-4" />,
                                                    github: <FaGithub className="w-4 h-4" />,
                                                    goodfirms: <FaBuilding className="w-4 h-4" />,
                                                    instagram: <FaInstagram className="w-4 h-4" />,
                                                    email: <FaEnvelope className="w-4 h-4" />
                                                };

                                                if (!url || url === '#' || !icons[platform]) return null;

                                                return (
                                                    <motion.a
                                                        key={platform}
                                                        href={url as string}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-zinc-500 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                                                        whileHover={{ scale: 1.1, y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        aria-label={`${member.name} ${platform}`}
                                                    >
                                                        {icons[platform]}
                                                    </motion.a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Call to Action */}
                <motion.div variants={itemVariants} className="text-center">
                    <GlassCard className="p-8 md:p-12 max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white/5 dark:to-white/5 border-none text-white">
                        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                            {t('section_headers.team.cta_title_prefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{t('section_headers.team.cta_title_highlight')}</span>
                        </h3>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                            {t('section_headers.team.cta_desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <motion.button
                                onClick={() => window.open(`https://wa.me/15551234567`, '_blank')}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaWhatsapp className="w-5 h-5" />
                                {t('section_headers.team.cta_whatsapp')}
                            </motion.button>
                            <motion.button
                                onClick={() => navigate(getLocalizedPath('/portfolio'))}
                                className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 border border-white/10"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaBriefcase className="w-5 h-5" />
                                {t('section_headers.team.cta_portfolio')}
                            </motion.button>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default TeamSection;
