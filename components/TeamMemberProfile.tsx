import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaTwitter, FaGithub, FaDribbble, FaArrowLeft, FaArrowRight, FaCheckCircle, FaMedal, FaUser, FaLightbulb, FaSearchPlus, FaCalendarCheck, FaBriefcase } from 'react-icons/fa';
import { TEAM_MEMBERS } from '../constants';

const TeamMemberProfile: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [isImageExpanded, setIsImageExpanded] = useState(false);

    const member = TEAM_MEMBERS.find((m) => m.slug === slug);

    useEffect(() => {
        if (!member) {
            navigate('/team', { replace: true });
        }
    }, [member, navigate]);

    if (!member) {
        return null;
    }

    const handleContactClick = () => {
        if (member.bookingUrl) {
            window.open(member.bookingUrl, '_blank');
        } else {
            navigate('/contact');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-luxury-black pb-20">
            {/* Image Modal */}
            <AnimatePresence>
                {isImageExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsImageExpanded(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
                    >
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={member.image}
                            alt={member.name}
                            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border-2 border-white/10"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Banner */}
            <div className="relative min-h-[400px] lg:h-[500px] w-full overflow-hidden flex flex-col">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover opacity-50 blur-sm scale-110"
                    />
                    <div className="absolute inset-0 bg-luxury-black/60" />
                </div>

                {/* Classy Grid Pattern */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-zinc-900/80 to-blue-900/80 mix-blend-overlay" />

                {/* Animated Glow Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-4 pt-20 lg:pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                    >
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-4 drop-shadow-lg text-balance">
                            {member.name}
                        </h2>
                        <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto rounded-full shadow-lg shadow-emerald-500/50" />
                    </motion.div>
                </div>

                <div className="absolute top-24 left-4 lg:top-28 lg:left-8 z-20">
                    <Link to="/team" className="flex items-center gap-2 text-zinc-200 hover:text-white transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300 backdrop-blur-md">
                            <FaArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-medium drop-shadow-md hidden sm:inline">Back to Team</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 lg:-mt-32 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-4">
                        <motion.div variants={itemVariants} className="bg-zinc-800/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl lg:sticky lg:top-24">
                            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
                                <div
                                    className="relative w-64 h-64 sm:w-80 sm:h-80 mb-8 group cursor-zoom-in"
                                    onClick={() => setIsImageExpanded(true)}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="relative w-full h-full object-cover rounded-full border-4 border-zinc-800 shadow-xl transition-transform duration-500 group-hover:scale-[1.02]"
                                    />
                                    <div className="absolute bottom-4 right-4 w-8 h-8 bg-emerald-500 border-4 border-zinc-800 rounded-full z-10" title="Available for work" />

                                    {/* Overlay hint */}
                                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <FaSearchPlus className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                                    </div>
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{member.name}</h1>
                                <p className="text-emerald-400 font-medium text-xl mb-8">{member.role}</p>

                                <div className="flex flex-wrap justify-center gap-3 mb-8">
                                    {member.social.linkedin && (
                                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-700/50 hover:bg-[#0077b5] text-zinc-300 hover:text-white rounded-xl transition-all duration-300">
                                            <span className="sr-only">LinkedIn</span>
                                            <FaLinkedin className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.social.twitter && (
                                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-700/50 hover:bg-[#1DA1F2] text-zinc-300 hover:text-white rounded-xl transition-all duration-300">
                                            <span className="sr-only">Twitter</span>
                                            <FaTwitter className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.social.github && (
                                        <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-700/50 hover:bg-[#333] text-zinc-300 hover:text-white rounded-xl transition-all duration-300">
                                            <span className="sr-only">GitHub</span>
                                            <FaGithub className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.social.dribbble && (
                                        <a href={member.social.dribbble} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-700/50 hover:bg-[#ea4c89] text-zinc-300 hover:text-white rounded-xl transition-all duration-300">
                                            <span className="sr-only">Dribbble</span>
                                            <FaDribbble className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>

                                <button
                                    onClick={handleContactClick}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <span>{member.bookingUrl ? 'Book a Call' : 'Work with Me'}</span>
                                    {member.bookingUrl ? <FaCalendarCheck className="w-5 h-5" /> : <FaBriefcase className="w-5 h-5" />}
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-8 space-y-6 lg:space-y-8">
                        {/* Bio Section */}
                        <motion.div variants={itemVariants} className="bg-zinc-800/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <FaUser className="text-emerald-500" />
                                About {member.name.split(' ')[0]}
                            </h2>
                            <p className="text-zinc-300 leading-relaxed text-lg">
                                {member.bio}
                            </p>
                        </motion.div>

                        {/* Achievements Grid */}
                        <motion.div variants={itemVariants}>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaMedal className="text-blue-500" />
                                Key Achievements
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {member.achievements.map((achievement, index) => (
                                    <div key={index} className="bg-zinc-800/30 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                                            <FaMedal className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <p className="text-zinc-200 font-medium">{achievement}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Specialties */}
                        <motion.div variants={itemVariants} className="bg-zinc-800/50 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaLightbulb className="text-purple-500" />
                                Expertise
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {member.specialties.map((specialty, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 sm:px-5 sm:py-2.5 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-300 font-medium hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all duration-300 cursor-default flex items-center gap-2 text-sm sm:text-base"
                                    >
                                        <FaCheckCircle className="w-4 h-4 text-emerald-500/50" />
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TeamMemberProfile;
