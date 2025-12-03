import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaCheck, FaSearch, FaLightbulb, FaRocket, FaChartLine, FaArrowRight, FaCommentDots, FaLock, FaCheckCircle, FaHeadset, FaLayerGroup, FaStar, FaClipboardList, FaWhatsapp } from 'react-icons/fa';
import { SERVICES, CONTACT_INFO } from '../constants';
import ServiceAIWidget from './ServiceAIWidget';
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
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/80 dark:bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
                className="relative w-[95%] md:w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-effect rounded-3xl p-4 md:p-8"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-200/50 dark:bg-zinc-700/50 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/50 dark:hover:bg-zinc-600/50 transition-all z-10"
                >
                    <FaTimes className="w-6 h-6" />
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
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h2>
                                <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">{service.price}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-lg">{service.description}</p>

                        {/* Features */}
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-xl">What's Included</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {service.features?.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 glass-effect p-3 rounded-xl">
                                        <FaCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <span className="text-slate-700 dark:text-zinc-300 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits */}
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 text-xl">Key Benefits</h3>
                            <div className="space-y-3">
                                {[
                                    'Dedicated project manager',
                                    '24/7 customer support',
                                    'Unlimited revisions',
                                    '30-day money-back guarantee',
                                    'Post-launch support included'
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                                        <span className="text-slate-600 dark:text-zinc-300">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Process Timeline */}
                    <div className="space-y-6">
                        <h3 className="text-slate-900 dark:text-white font-semibold text-xl">Our Process</h3>
                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <div key={index} className="relative">
                                    {/* Timeline Line */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-400 to-cyan-400" />
                                    )}

                                    <div className="flex items-start gap-4">
                                        {/* Step Number */}
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-white font-bold text-sm relative z-10`}>
                                            {index + 1}
                                        </div>

                                        {/* Step Content */}
                                        <div className="flex-1 glass-effect p-4 rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-slate-900 dark:text-white font-semibold">{step.step}</h4>
                                                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">{step.duration}</span>
                                            </div>
                                            <p className="text-slate-600 dark:text-zinc-300 text-sm">{step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* AI Widget in Modal */}
                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10">
                            <h3 className="text-slate-900 dark:text-white font-semibold text-xl mb-4">Get an Instant Estimate</h3>
                            <ServiceAIWidget serviceTitle={service.title} compact={true} />
                        </div>



                        {/* Trust Indicators */}
                        <div className="glass-effect p-4 rounded-xl text-center">
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-slate-900 dark:text-white font-semibold">4.9/5</span>
                            </div>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm">Based on 150+ client reviews</p>
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
        className={`group relative rounded-3xl text-center ${featured ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
        variants={itemVariants}
        whileHover={{ y: -12, scale: 1.02 }}
        transition={{ duration: 0.3 }}
    >
        {/* Featured Badge - Floating Upper Layer */}
        {featured && (
            <div className="absolute -top-4 -right-2 z-20">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/40 text-xs font-bold tracking-wider uppercase transform rotate-2">
                    POPULAR
                </div>
            </div>
        )}

        {/* Inner Content Wrapper with Overflow Hidden */}
        <div className="relative overflow-hidden rounded-3xl h-full">
            <div className={`glass-effect p-6 md:p-8 h-full relative ${featured ? 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5' : ''}`}>
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full translate-y-12 -translate-x-12" />

                {/* Service Number */}
                <div className="absolute top-4 right-4 text-5xl font-black text-slate-200 dark:text-zinc-800/30 group-hover:text-slate-300 dark:group-hover:text-zinc-700/40 transition-colors">
                    {(index + 1).toString().padStart(2, '0')}
                </div>

                <div className="relative z-10">
                    {/* Service Icon */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all" />
                        <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${service.color} text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                            {service.icon}
                        </div>
                    </div>

                    {/* Service Content */}
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-gradient transition-colors duration-300">
                        {service.title}
                    </h3>
                    <p className="text-slate-600 dark:text-zinc-300 mb-6 leading-relaxed text-sm">
                        {service.description}
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {service.features?.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                                <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full" />
                                <span className="truncate">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <div className={`text-xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                            {service.price}
                        </div>
                        <div className="text-slate-400 dark:text-zinc-400 text-xs mt-1">No hidden fees</div>
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
                        <button
                            onClick={() => window.open(`https://wa.me/${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                            className="w-full border border-slate-300 dark:border-zinc-600 text-slate-600 dark:text-zinc-300 py-2 px-6 rounded-xl text-sm hover:border-green-500 hover:text-green-600 dark:hover:border-green-400 dark:hover:text-green-400 transition-all flex items-center justify-center gap-2"
                        >
                            <FaWhatsapp className="w-4 h-4" />
                            Chat on WhatsApp
                        </button>
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-zinc-700">
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                            <FaCheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                            <span>Money-back guarantee</span>
                        </div>
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
                className="py-12 md:py-24 px-4 relative overflow-hidden bg-slate-50 dark:bg-luxury-black transition-colors duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0 }}
                variants={containerVariants}
            >
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 bg-slate-50 dark:bg-luxury-black transition-colors duration-300" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
                <div className="absolute top-2/3 left-2/3 w-64 h-64 bg-purple-500/6 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    {/* Enhanced Section Header */}
                    <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16 lg:mb-20">
                        <div className="inline-flex items-center gap-3 glass-effect rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 mb-6 sm:mb-8 mx-4 sm:mx-0">
                            <FaLayerGroup className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-bold text-blue-400 tracking-wide">GROWBRANDI PREMIUM SERVICES</span>
                            <FaStar className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8 leading-tight px-4 sm:px-0 text-slate-900 dark:text-white">
                            Comprehensive <span className="text-gradient">Digital Solutions</span>
                            <span className="block">For Your Business</span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-zinc-300 max-w-5xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
                            Transform your business with
                            <span className="text-blue-600 dark:text-blue-400 font-semibold"> GrowBrandi's award-winning services</span> that combine
                            <span className="text-blue-600 dark:text-blue-400 font-semibold"> intelligent technology</span> with data-driven strategies
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
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 px-4 sm:px-0">
                                Our <span className="text-gradient">Proven Process</span>
                            </h3>
                            <p className="text-slate-600 dark:text-zinc-300 text-base sm:text-lg max-w-3xl mx-auto px-4 sm:px-0">
                                Every project follows our streamlined methodology for consistent,
                                high-quality results that exceed expectations.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
                            {[
                                {
                                    icon: <FaSearch className="w-8 h-8" />,
                                    title: 'Discovery',
                                    description: 'Understanding your goals and requirements'
                                },
                                {
                                    icon: <FaLightbulb className="w-8 h-8" />,
                                    title: 'Strategy',
                                    description: 'Crafting the perfect solution approach'
                                },
                                {
                                    icon: <FaRocket className="w-8 h-8" />,
                                    title: 'Execution',
                                    description: 'Bringing your vision to life with precision'
                                },
                                {
                                    icon: <FaChartLine className="w-8 h-8" />,
                                    title: 'Optimization',
                                    description: 'Continuous improvement and growth'
                                }
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="glass-effect p-6 rounded-2xl text-center group hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-cyan-500/5 transition-all duration-300"
                                    whileHover={{ y: -5, scale: 1.02 }}
                                >
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform flex justify-center text-blue-600 dark:text-blue-400">
                                        {step.icon}
                                    </div>
                                    <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-2">{step.title}</h4>
                                    <p className="text-slate-600 dark:text-zinc-400 text-sm">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>



                    {/* Enhanced Call to Action */}
                    <motion.div variants={itemVariants} className="text-center">
                        <div className="glass-effect rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                                Ready to <span className="text-gradient">Transform Your Business?</span>
                            </h3>
                            <p className="text-xl text-slate-600 dark:text-zinc-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Choose from our comprehensive service offerings or let us create a
                                custom solution tailored specifically to your unique business needs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <motion.button
                                    onClick={() => navigate('/services')}
                                    className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaClipboardList className="w-5 h-5" />
                                    Explore All Services
                                    <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                                <motion.button
                                    onClick={() => window.open(`https://wa.me/${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                                    className="group inline-flex items-center justify-center gap-3 bg-zinc-700 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:bg-green-600 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaWhatsapp className="w-5 h-5" />
                                    Chat on WhatsApp
                                </motion.button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 pt-8 border-t border-slate-200 dark:border-zinc-700">
                                <div className="flex items-center gap-2">
                                    <FaLock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span className="text-slate-600 dark:text-zinc-300 text-sm">SSL Secured</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span className="text-slate-600 dark:text-zinc-300 text-sm">Money Back Guarantee</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaHeadset className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <span className="text-slate-600 dark:text-zinc-300 text-sm">24/7 Support</span>
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
