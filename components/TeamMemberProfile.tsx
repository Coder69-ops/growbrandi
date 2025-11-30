import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TEAM_MEMBERS } from '../constants';

const TeamMemberProfile: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

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
        <div className="min-h-screen bg-slate-900 pb-20">
            {/* Hero Banner */}
            <div className="relative h-96 w-full overflow-hidden">
                {/* Background Base */}
                <div className="absolute inset-0 bg-slate-900" />

                {/* Classy Grid Pattern */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-slate-900/90 to-blue-900/80" />

                {/* Animated Glow Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                    >
                        <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight mb-4">
                            {member.name}
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full" />
                    </motion.div>
                </div>

                <div className="absolute top-28 left-6 z-20">
                    <Link to="/team" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                        <span className="font-medium">Back to Team</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-4">
                        <motion.div variants={itemVariants} className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl sticky top-24">
                            <div className="p-8 flex flex-col items-center text-center">
                                <div className="relative w-48 h-48 mb-6 group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="relative w-full h-full object-cover rounded-full border-4 border-slate-800 shadow-xl"
                                    />
                                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-slate-800 rounded-full" title="Available for work" />
                                </div>

                                <h1 className="text-3xl font-bold text-white mb-2">{member.name}</h1>
                                <p className="text-emerald-400 font-medium text-lg mb-6">{member.role}</p>

                                <div className="flex gap-3 mb-8">
                                    {member.social.linkedin && (
                                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-700/50 hover:bg-[#0077b5] text-slate-300 hover:text-white rounded-xl transition-all duration-300">
                                            <span className="sr-only">LinkedIn</span>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                        </a>
                                    )}
                                    {member.social.twitter && (
                                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-700/50 hover:bg-[#1DA1F2] text-slate-300 hover:text-white rounded-xl transition-all duration-300">
                                            <span className="sr-only">Twitter</span>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                        </a>
                                    )}
                                    {member.social.github && (
                                        <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-700/50 hover:bg-[#333] text-slate-300 hover:text-white rounded-xl transition-all duration-300">
                                            <span className="sr-only">GitHub</span>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                        </a>
                                    )}
                                    {member.social.dribbble && (
                                        <a href={member.social.dribbble} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-700/50 hover:bg-[#ea4c89] text-slate-300 hover:text-white rounded-xl transition-all duration-300">
                                            <span className="sr-only">Dribbble</span>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm9.885 11.441c-2.564-1.15-5.777-1.288-7.661-.791.528 1.668 1.116 3.385 1.61 5.096 2.737-1.117 4.874-2.648 6.051-4.305zm-7.605-1.004c-1.306-2.435-2.464-4.744-3.066-5.932 1.378-.291 2.813-.263 4.184.086 1.134 1.776 2.035 3.756 2.453 5.898-1.287-.208-2.472-.193-3.571-.052zm-12.013.62c1.324-.44 3.702-.827 6.245-.269-1.055 2.527-1.956 5.029-2.566 7.084-2.697-1.969-3.679-4.885-3.679-6.815zm1.536 8.35c2.378 1.758 5.189 2.636 7.645 1.845-.584-1.89-1.238-3.795-1.812-5.632-1.919.687-4.151.767-5.833 3.787zm9.648.332c2.476-1.107 4.361-3.038 5.176-5.587-1.353 1.586-3.562 2.952-6.385 3.992-.416 1.722-.821 3.42-1.219 5.008 1.056.096 1.957-.346 2.428-3.413zm-3.061-8.305c.57-1.156 1.084-2.338 1.521-3.521-1.794-.534-3.719-.519-5.597.042 1.04 1.88 2.537 4.28 4.076 3.479z" /></svg>
                                        </a>
                                    )}
                                </div>

                                <button
                                    onClick={handleContactClick}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <span>{member.bookingUrl ? 'Book a Call' : 'Work with Me'}</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Bio Section */}
                        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-1 bg-emerald-500 rounded-full" />
                                About {member.name.split(' ')[0]}
                            </h2>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                {member.bio}
                            </p>
                        </motion.div>

                        {/* Achievements Grid */}
                        <motion.div variants={itemVariants}>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-blue-500 rounded-full" />
                                Key Achievements
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {member.achievements.map((achievement, index) => (
                                    <div key={index} className="bg-slate-800/30 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                                        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-200 font-medium">{achievement}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Specialties */}
                        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-purple-500 rounded-full" />
                                Expertise
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {member.specialties.map((specialty, index) => (
                                    <span
                                        key={index}
                                        className="px-5 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-300 font-medium hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all duration-300 cursor-default flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4 text-emerald-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
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
