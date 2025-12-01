import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaTwitter, FaGithub, FaDribbble, FaArrowLeft, FaCheckCircle, FaMedal, FaUser, FaLightbulb, FaSearchPlus, FaCalendarCheck, FaBriefcase, FaEnvelope, FaInstagram } from 'react-icons/fa';
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
        <div className="min-h-screen bg-luxury-black pb-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Architectural Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                {/* Dynamic Mesh Gradients - Optimized for Mobile */}
                <div className="absolute top-[-10%] left-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen" />
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {isImageExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsImageExpanded(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out"
                    >
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={member.image}
                            alt={member.name}
                            width="800"
                            height="800"
                            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Banner */}
            <div className="relative min-h-[300px] lg:h-[450px] w-full overflow-hidden flex flex-col justify-center items-center">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-black/50 to-luxury-black" />

                <div className="absolute top-24 left-4 lg:top-28 lg:left-8 z-20">
                    <Link to="/team" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-300 backdrop-blur-md">
                            <FaArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="font-medium hidden sm:inline">Back to Team</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-40 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-4">
                        <motion.div variants={itemVariants} className="glass-effect rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl lg:sticky lg:top-24 bg-zinc-900/40 backdrop-blur-xl">
                            <div className="p-8 flex flex-col items-center text-center">
                                <div
                                    className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 mb-8 group cursor-zoom-in"
                                    onClick={() => setIsImageExpanded(true)}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                                    <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-br from-white/20 to-white/5 border border-white/10 group-hover:border-white/30 transition-all duration-500">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            loading="lazy"
                                            width="300"
                                            height="300"
                                            className="w-full h-full object-cover rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                                        />
                                    </div>
                                    <div className="absolute bottom-4 right-4 w-6 h-6 bg-emerald-500 border-4 border-zinc-900 rounded-full z-10" title="Available for work" />

                                    {/* Overlay hint */}
                                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <FaSearchPlus className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                                    </div>
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 font-heading tracking-tight">{member.name}</h1>
                                <p className="text-blue-400 font-bold text-lg mb-8 uppercase tracking-wide">{member.role}</p>

                                <div className="flex flex-wrap justify-center gap-3 mb-8">
                                    {member.social.linkedin && (
                                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-[#0077b5] text-zinc-400 hover:text-white rounded-full transition-all duration-300 border border-white/5 hover:border-transparent">
                                            <span className="sr-only">LinkedIn</span>
                                            <FaLinkedin className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.social.twitter && (
                                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-[#1DA1F2] text-zinc-400 hover:text-white rounded-full transition-all duration-300 border border-white/5 hover:border-transparent">
                                            <span className="sr-only">Twitter</span>
                                            <FaTwitter className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.social.github && (
                                        <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-[#333] text-zinc-400 hover:text-white rounded-full transition-all duration-300 border border-white/5 hover:border-transparent">
                                            <span className="sr-only">GitHub</span>
                                            <FaGithub className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.social.dribbble && (
                                        <a href={member.social.dribbble} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-[#ea4c89] text-zinc-400 hover:text-white rounded-full transition-all duration-300 border border-white/5 hover:border-transparent">
                                            <span className="sr-only">Dribbble</span>
                                            <FaDribbble className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.social.instagram && (
                                        <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-[#E1306C] text-zinc-400 hover:text-white rounded-full transition-all duration-300 border border-white/5 hover:border-transparent">
                                            <span className="sr-only">Instagram</span>
                                            <FaInstagram className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.social.email && (
                                        <a href={member.social.email} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-red-500 text-zinc-400 hover:text-white rounded-full transition-all duration-300 border border-white/5 hover:border-transparent">
                                            <span className="sr-only">Email</span>
                                            <FaEnvelope className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>

                                <button
                                    onClick={handleContactClick}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
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
                        <motion.div variants={itemVariants} className="glass-effect rounded-[2rem] p-8 sm:p-10 border border-white/5 bg-zinc-900/40 backdrop-blur-xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-heading">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <FaUser className="text-blue-400 w-5 h-5" />
                                </div>
                                About {member.name.split(' ')[0]}
                            </h2>
                            <p className="text-zinc-300 leading-relaxed text-lg font-light">
                                {member.bio}
                            </p>
                        </motion.div>

                        {/* Achievements Grid */}
                        <motion.div variants={itemVariants}>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-heading px-2">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <FaMedal className="text-purple-400 w-5 h-5" />
                                </div>
                                Key Achievements
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {member.achievements.map((achievement, index) => (
                                    <div key={index} className="glass-effect p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors group bg-zinc-900/40">
                                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                            <FaMedal className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <p className="text-zinc-300 font-medium leading-relaxed">{achievement}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Specialties */}
                        <motion.div variants={itemVariants} className="glass-effect rounded-[2rem] p-8 sm:p-10 border border-white/5 bg-zinc-900/40 backdrop-blur-xl">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 font-heading">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <FaLightbulb className="text-emerald-400 w-5 h-5" />
                                </div>
                                Expertise
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {member.specialties.map((specialty, index) => (
                                    <span
                                        key={index}
                                        className="px-5 py-3 bg-white/5 border border-white/5 rounded-xl text-zinc-300 font-medium hover:border-emerald-500/30 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all duration-300 cursor-default flex items-center gap-2"
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
