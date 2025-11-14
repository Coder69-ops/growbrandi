import React from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../constants';
import { Project } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: [0.6, 0.01, 0.05, 0.95]
    },
  },
};

// --- StarRating Component ---
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-slate-600'}`}
                >
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.596 2.87c-1-.608-2.231.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
                </svg>
            ))}
        </div>
    );
};

// --- ProjectCard Component ---
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <motion.div
        className="glass-effect rounded-xl overflow-hidden group"
        variants={itemVariants}
        whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
    >
        <div className="relative overflow-hidden">
            <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-4 left-4">
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {project.category}
                </span>
            </div>
            {project.completionTime && (
                <div className="absolute top-4 right-4">
                    <span className="bg-slate-900/80 text-white px-3 py-1 rounded-full text-xs">
                        {project.completionTime}
                    </span>
                </div>
            )}
        </div>
        
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-gradient transition-colors duration-300 mb-2">
                        {project.title}
                    </h3>
                    {project.client && (
                        <p className="text-sm text-emerald-400 font-medium mb-2">Client: {project.client}</p>
                    )}
                </div>
                <StarRating rating={project.rating} />
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-4">{project.description}</p>
            
            {project.technologies && (
                <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                            <span key={index} className="bg-slate-800 text-slate-300 px-2 py-1 rounded-md text-xs">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            {project.results && (
                <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Key Results</h4>
                    <ul className="space-y-1">
                        {project.results.slice(0, 2).map((result, index) => (
                            <li key={index} className="flex items-center text-xs text-slate-400">
                                <svg className="w-3 h-3 text-emerald-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                {result}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <motion.button 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                View Project Details
            </motion.button>
        </div>
    </motion.div>
);

// --- ProjectsPage Component ---
export const ProjectsPage: React.FC = () => {
    return (
        <section className="py-20 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Our Latest <span className="text-gradient">Successful Projects</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 mt-6 leading-relaxed">
                            Explore our latest successful projects at GrowBrandi, showcasing innovative solutions and exceptional results. Each project reflects our dedication to quality, creativity, and client satisfaction.
                        </p>
                    </motion.div>
                </div>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {PROJECTS.map((project) => (
                        <ProjectCard key={project.title} project={project} />
                    ))}
                    {/* You can add more projects to constants.ts to populate this page further */}
                </motion.div>
            </div>
        </section>
    );
};