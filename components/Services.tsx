import React, { useRef, useState, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaCheck, FaCircle, FaStar, FaShieldAlt, FaLayerGroup, FaGem, FaCommentDots, FaChartPie, FaLock, FaCheckCircle, FaHeadset } from 'react-icons/fa';
import { SERVICES } from '../constants';
import { Service } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
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
    ],
    'Content Creation': [
      { step: 'Strategy', description: 'Content planning and research', duration: '1 week' },
      { step: 'Creation', description: 'Content development and writing', duration: '2-3 weeks' },
      { step: 'Review', description: 'Quality assurance and editing', duration: '1 week' },
      { step: 'Optimization', description: 'SEO and performance tuning', duration: '1 week' }
    ],
    'SEO Optimization': [
      { step: 'Audit', description: 'Website and competitor analysis', duration: '1 week' },
      { step: 'Strategy', description: 'Keyword research and planning', duration: '1 week' },
      { step: 'Implementation', description: 'On-page and technical SEO', duration: '2-3 weeks' },
      { step: 'Monitoring', description: 'Performance tracking and optimization', duration: 'Ongoing' }
    ],
    'Digital Marketing': [
      { step: 'Analysis', description: 'Market research and audience analysis', duration: '1 week' },
      { step: 'Strategy', description: 'Campaign planning and setup', duration: '1 week' },
      { step: 'Execution', description: 'Campaign launch and management', duration: '2-4 weeks' },
      { step: 'Optimization', description: 'Performance analysis and improvement', duration: 'Ongoing' }
    ]
  };

  const steps = processSteps[service.title as keyof typeof processSteps] || [
    { step: 'Consultation', description: 'Understanding your requirements', duration: '1 week' },
    { step: 'Strategy', description: 'Planning and approach', duration: '1-2 weeks' },
    { step: 'Execution', description: 'Implementation and delivery', duration: '2-4 weeks' },
    { step: 'Optimization', description: 'Testing and refinement', duration: '1 week' }
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <motion.div
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-effect rounded-3xl p-8"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-600/50 transition-all z-10"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white`}>
                {service.icon}
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">{service.title}</h2>
                <p className="text-emerald-400 font-semibold text-xl">{service.price}</p>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed text-lg">{service.description}</p>

            <div>
              <h3 className="text-white font-semibold mb-6 text-2xl">Complete Package Includes</h3>
              <div className="grid grid-cols-1 gap-4">
                {service.features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4 glass-effect p-4 rounded-xl">
                    <FaCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <span className="text-zinc-300 font-medium text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-effect p-6 rounded-2xl">
              <h3 className="text-white font-semibold mb-4 text-xl">Why Choose This Service?</h3>
              <div className="space-y-3">
                {[
                  'Dedicated project manager assigned',
                  '24/7 priority customer support',
                  'Unlimited revisions until satisfied',
                  '30-day money-back guarantee',
                  'Post-launch support included',
                  'Industry-leading tools and technologies'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FaCircle className="w-3 h-3 text-emerald-400" />
                    <span className="text-zinc-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-white font-semibold text-2xl mb-6">Our Proven Process</h3>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    {index < steps.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-20 bg-gradient-to-b from-emerald-400 to-blue-400" />
                    )}

                    <div className="flex items-start gap-6">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-white font-bold relative z-10`}>
                        {index + 1}
                      </div>

                      <div className="flex-1 glass-effect p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold text-lg">{step.step}</h4>
                          <span className="text-emerald-400 text-sm font-medium bg-emerald-400/10 px-3 py-1 rounded-full">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-zinc-300">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-xl">
                Start Your Project Now
              </button>
              <button className="w-full border border-zinc-600 text-zinc-300 py-3 px-8 rounded-xl hover:border-emerald-400 hover:text-emerald-400 transition-all">
                Schedule Free Consultation
              </button>
            </div>

            <div className="glass-effect p-6 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <span className="text-white font-bold text-lg">4.9/5</span>
              </div>
              <p className="text-zinc-400">Average rating from 200+ clients</p>
              <p className="text-emerald-400 text-sm mt-2">✓ 98% project success rate</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Enhanced ServiceCard Component ---
interface ServiceCardProps {
  service: Service;
  onLearnMore: () => void;
  featured?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onLearnMore, featured = false }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      className={`relative overflow-hidden rounded-3xl h-full group ${featured ? 'ring-2 ring-emerald-400 ring-opacity-50' : ''}`}
      variants={itemVariants}
      whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.3 } }}
    >
      {featured && (
        <div className="absolute -top-1 -right-1 z-20">
          <div className="bg-gradient-to-r from-emerald-400 to-blue-400 text-white px-4 py-2 rounded-full text-sm font-bold">
            MOST POPULAR
          </div>
        </div>
      )}

      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.15), transparent 40%)`,
        }}
      />

      <div className={`glass-effect p-8 h-full relative ${featured ? 'bg-gradient-to-br from-emerald-500/5 to-blue-500/5' : ''}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full translate-y-12 -translate-x-12" />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all" />
                <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-gradient transition-colors duration-300">{service.title}</h3>
                <p className={`text-lg font-semibold bg-gradient-to-r ${service.color} bg-clip-text text-transparent mt-1`}>{service.price}</p>
              </div>
            </div>
          </div>

          <p className="text-zinc-300 mb-8 flex-grow leading-relaxed text-lg">{service.description}</p>

          <div className="mb-8">
            <h4 className="text-white font-semibold mb-4 text-lg">Key Features:</h4>
            <div className="grid grid-cols-1 gap-3">
              {service.features?.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center text-zinc-400">
                  <FaCheck className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <motion.button
              onClick={onLearnMore}
              className={`w-full bg-gradient-to-r ${service.color} text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More & Get Started
            </motion.button>
            <button className="w-full border border-zinc-600 text-zinc-300 py-3 px-6 rounded-xl hover:border-emerald-400 hover:text-emerald-400 transition-all">
              Get Free Quote
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-700 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
              <FaShieldAlt className="w-4 h-4 text-emerald-400" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Enhanced ServicesPage Component ---
export const ServicesPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [displayedServices, setDisplayedServices] = useState(SERVICES);

  const categories = ['All', 'Design', 'Development', 'Marketing', 'Strategy'];

  const serviceCategories = {
    'Design': ['UI/UX Design', 'Brand Strategy'],
    'Development': ['Web Development'],
    'Marketing': ['SEO Optimization', 'Digital Marketing', 'Content Creation'],
    'Strategy': ['Brand Strategy', 'Digital Marketing']
  };

  const handleLearnMore = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    if (category === 'All') {
      setDisplayedServices(SERVICES);
    } else {
      const categoryServices = serviceCategories[category as keyof typeof serviceCategories] || [];
      setDisplayedServices(SERVICES.filter(service => categoryServices.includes(service.title)));
    }
  };

  return (
    <>
      <section className="py-24 px-4 relative overflow-hidden bg-luxury-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-luxury-black to-luxury-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-20 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 glass-effect rounded-full px-8 py-3 mb-8">
                <FaLayerGroup className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400 tracking-wide">COMPREHENSIVE SERVICES</span>
                <FaGem className="w-5 h-5 text-blue-400" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight font-heading tracking-tight text-white">
                Premium <span className="text-gradient">Digital Solutions</span>
                <span className="block">For Every Business Need</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed mb-8 font-light">
                Transform your business with our comprehensive suite of services. From
                <span className="text-white font-semibold"> cutting-edge design and development</span> to
                <span className="text-white font-semibold"> data-driven marketing strategies</span>,
                we deliver exceptional results that drive growth.
              </p>
            </motion.div>
          </div>

          <motion.div className="flex justify-center mb-16">
            <div className="glass-effect rounded-2xl p-2 inline-flex gap-2">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  onClick={() => handleFilterChange(category)}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${activeFilter === category
                    ? 'bg-white text-black shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
          >
            {displayedServices.map((service, index) => (
              <motion.div
                key={service.title}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ServiceCard
                  service={service}
                  onLearnMore={() => handleLearnMore(service)}
                  featured={service.title === 'UI/UX Design'}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            {[
              { number: '500+', label: 'Projects Completed', icon: '🎯' },
              { number: '98%', label: 'Client Satisfaction', icon: '⭐' },
              { number: '24/7', label: 'Support Available', icon: '💬' },
              { number: '15+', label: 'Industry Awards', icon: '🏆' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="glass-effect p-6 rounded-2xl text-center group"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-zinc-400 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="text-center">
            <div className="glass-effect rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to <span className="text-gradient">Elevate Your Business?</span>
              </h3>
              <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get started with a free consultation. Our experts will analyze your needs
                and recommend the perfect service package for your business goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                <motion.button
                  className="group inline-flex items-center justify-center gap-3 bg-white text-black font-bold py-4 px-8 rounded-full text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaCommentDots className="w-5 h-5" />
                  Get Free Consultation
                </motion.button>
                <motion.button
                  className="group inline-flex items-center justify-center gap-3 bg-zinc-700 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:bg-zinc-600 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaChartPie className="w-5 h-5" />
                  View Our Portfolio
                </motion.button>
              </div>

              <div className="flex items-center justify-center gap-8 pt-8 border-t border-zinc-700">
                <div className="flex items-center gap-2">
                  <FaLock className="w-5 h-5 text-emerald-400" />
                  <span className="text-zinc-300 text-sm">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-zinc-300 text-sm">Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHeadset className="w-5 h-5 text-purple-400" />
                  <span className="text-zinc-300 text-sm">24/7 Support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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