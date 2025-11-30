import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../constants';
import { Service } from '../types';

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
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
const ServicesPreview: React.FC = () => {
    const navigate = useNavigate();
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
                viewport={{ once: true, amount: 0.1, margin: "-50px" }}
                variants={containerVariants}
            >
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 to-slate-800/70" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />
                <div className="absolute top-2/3 left-2/3 w-64 h-64 bg-purple-500/6 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    {/* Enhanced Section Header */}
                    <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16 lg:mb-20">
                        <div className="inline-flex items-center gap-3 glass-effect rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 mb-6 sm:mb-8 mx-4 sm:mx-0">
                            <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-bold text-emerald-400 tracking-wide">GROWBRANDI PREMIUM SERVICES</span>
                            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8 leading-tight px-4 sm:px-0">
                            Comprehensive <span className="text-gradient">Digital Solutions</span>
                            <span className="block">For Your Business</span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 max-w-5xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
                            Transform your business with
                            <span className="text-emerald-400 font-semibold">GrowBrandi's award-winning services</span> that combine
                            <span className="text-blue-400 font-semibold">intelligent technology</span> with data-driven strategies
                            to deliver <span className="text-gradient font-semibold">measurable, exceptional results</span>.
                        </p>
                    </motion.div>

                    {/* Enhanced Services Grid */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20 px-4 sm:px-0"
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
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 px-4 sm:px-0">
                                Our <span className="text-gradient">Proven Process</span>
                            </h3>
                            <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto px-4 sm:px-0">
                                Every project follows our streamlined methodology for consistent,
                                high-quality results that exceed expectations.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
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
                                    onClick={(e) => { e.preventDefault(); /* Services section is on home page, could scroll to it */ }}
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
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <AnimatePresence>
                {isModalOpen && (
                    <ServiceModal
                        service={selectedService}
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedService(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default ServicesPreview;
