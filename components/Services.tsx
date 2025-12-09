import React, { useRef, useState, MouseEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaCheck, FaCircle, FaStar, FaShieldAlt, FaLayerGroup, FaGem, FaCommentDots, FaChartPie, FaLock, FaCheckCircle, FaHeadset, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Service } from '../types';
import { BackgroundEffects } from './ui/BackgroundEffects';
import { GlassCard } from './ui/GlassCard';
import { SectionHeading } from './ui/SectionHeading';
import { getIcon } from '../src/utils/icons';
import { useContent } from '../src/hooks/useContent';
import { getLocalizedField } from '../src/utils/localization';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';
import { Skeleton } from './ui/Skeleton';
import SEO from './SEO';

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
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedPath();
  const { t, i18n } = useTranslation();

  // Helper to get text safely
  const txt = (field: any) => getLocalizedField(field, i18n.language);

  // Get process steps from translation.json using service id
  // Fallback to default process if specific process not found
  const stepsData = service ? t(`services.${service.id}.process`, { returnObjects: true }) : null;
  const defaultSteps = t('services.process.default', { returnObjects: true });

  let steps: any[] = [];
  if (stepsData && Array.isArray(stepsData)) {
    steps = stepsData;
  } else if (defaultSteps) {
    // If defaultSteps is an object (step1, step2...), convert to array
    steps = Object.values(defaultSteps);
  }

  // Get why choose benefits from translation
  const benefitsData = t('services.ui.benefits', { returnObjects: true });
  const benefits = Array.isArray(benefitsData) ? benefitsData : [];

  if (!isOpen || !service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          <motion.div
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-white/10 shadow-2xl"
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image/Gradient */}
            <div className={`h-48 w-full bg-gradient-to-r ${service.color} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-all z-10 backdrop-blur-md border border-white/10"
              >
                <FaTimes className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-8 flex items-end gap-6">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl">
                  {getIcon(service.icon, "w-8 h-8")}
                </div>
                <div className="text-white mb-1">
                  <h2 className="text-3xl md:text-4xl font-bold">{txt(service.title)}</h2>
                  <p className="text-white/80 font-medium text-lg">{txt(service.price)}</p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 bg-slate-50 dark:bg-[#09090b]">
              {/* Left Column */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('services.ui.overview')}</h3>
                  <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-lg">{txt(service.description)}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('services.ui.package_includes')}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {service.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                          <FaCheck className="w-3 h-3 text-green-500" />
                        </div>
                        <span className="text-slate-700 dark:text-zinc-300 font-medium">{txt(feature)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/10">
                  <h3 className="text-blue-900 dark:text-blue-100 font-bold mb-4 flex items-center gap-2">
                    <FaShieldAlt className="w-5 h-5" />
                    {t('services.ui.why_choose')}
                  </h3>
                  <div className="space-y-3">
                    {benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <FaCircle className="w-2 h-2 text-blue-500" />
                        <span className="text-slate-700 dark:text-blue-200/80 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Our Proven Process</h3>
                  <div className="space-y-6">
                    {steps.map((step: any, index: number) => (
                      <div key={index} className="relative pl-8 border-l-2 border-slate-200 dark:border-white/10 last:border-0">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 ${index === 0 ? 'bg-blue-500' : 'bg-slate-300 dark:bg-zinc-700'}`} />

                        <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-slate-900 dark:text-white">{step.step}</h4>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-full">
                              {step.duration}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-zinc-400">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sticky top-0 space-y-4 pt-4">
                  <button
                    onClick={() => navigate(getLocalizedPath('/contact'), { state: { service: txt(service.title) } })}
                    className={`w-full bg-gradient-to-r ${service.color} text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    {t('services.ui.start_project')} <FaArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(getLocalizedPath('/contact'))}
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300"
                  >
                    {t('services.ui.schedule_consultation')}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500 dark:text-zinc-500">
                    <FaLock className="w-3 h-3" />
                    <span>{t('services.ui.secure_payment')}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Enhanced ServiceCard Component ---
interface ServiceCardProps {
  service: Service;
  onLearnMore: () => void;
  featured?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onLearnMore, featured = false }) => {
  const { t, i18n } = useTranslation();
  const txt = (field: any) => getLocalizedField(field, i18n.language);

  return (
    <GlassCard
      className={`h-full flex flex-col p-0 overflow-hidden ${featured ? 'ring-2 ring-blue-500/50 dark:ring-blue-400/50' : ''}`}
      hoverEffect={true}
    >
      {featured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {t('services.ui.popular')}
          </div>
        </div>
      )}

      {/* Card Header with Gradient */}
      <div className={`relative p-8 pb-0`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />

        <div className="relative z-10 flex items-start justify-between mb-6">
          <div className={`p-3 rounded-2xl bg-gradient-to-r ${service.color} text-white shadow-lg`}>
            {getIcon(service.icon, "w-8 h-8")}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{txt(service.title)}</h3>
        <p className={`text-lg font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>{txt(service.price)}</p>
      </div>

      <div className="p-8 pt-4 flex-grow flex flex-col">
        <p className="text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed text-sm flex-grow">{txt(service.description)}</p>

        <div className="space-y-3 mb-8">
          {service.features?.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-slate-600 dark:text-zinc-400">
              <FaCheckCircle className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
              {txt(feature)}
            </div>
          ))}
        </div>

        <button
          onClick={onLearnMore}
          className="w-full py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-all duration-300 border border-slate-200 dark:border-white/10"
        >
          {t('services.ui.view_details')}
        </button>
      </div>
    </GlassCard>
  );
};

// --- Enhanced ServicesPage Component ---
export const ServicesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedPath();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: services, loading } = useContent<Service>('services');
  const [activeFilter, setActiveFilter] = useState('All');
  const [displayedServices, setDisplayedServices] = useState<Service[]>([]);

  useEffect(() => {
    if (services) {
      // Optimized filtering which respects both data IDs and English titles
      const filterServices = () => {
        if (activeFilter === 'All') return services;

        const categoryIds = serviceCategories[activeFilter as keyof typeof serviceCategories] || [];
        return services.filter(service => {
          // Check exact ID match or contained in ID
          const idMatch = categoryIds.some(cat => service.id.includes(cat) || (service as any).serviceId?.includes(cat));
          // Check title match (safely get EN title)
          const title = getLocalizedField(service.title, 'en');
          const titleMatch = categoryIds.some(cat => title.includes(cat));

          return idMatch || titleMatch;
        });
      };

      setDisplayedServices(filterServices());
    }
  }, [services, activeFilter]);

  const categories = ['All', 'Design', 'Development', 'Marketing', 'Strategy'];

  const serviceCategories = {
    'Design': ['UI/UX Design', 'Brand Strategy', 'ui_ux_design', 'creative_studio'],
    'Development': ['Web Development', 'web_shopify_dev', 'web_development'],
    'Marketing': ['SEO Optimization', 'Digital Marketing', 'Content Creation', 'performance_marketing', 'social_media_management'],
    'Strategy': ['Brand Strategy', 'Digital Marketing', 'creative_studio', 'ecommerce_management']
  };

  // Helper for title checking
  const getIsFeatured = (title: any) => {
    const t = getLocalizedField(title, 'en');
    return t === 'UI/UX Design' || t.includes('UI/UX');
  };

  const handleLearnMore = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
  };

  return (
    <>
      <SEO
        title={t('services.meta.title', 'Our Services | GrowBrandi')}
        description={t('services.meta.description', 'Explore our comprehensive digital services including web development, UI/UX design, SEO optimization, brand strategy, and AI solutions.')}
        keywords={['services', 'web development', 'design', 'SEO', 'digital marketing', 'AI solutions']}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">
        <BackgroundEffects />

        <div className="container mx-auto max-w-7xl relative z-10">
          <SectionHeading
            badge="Comprehensive Services"
            title="Premium Digital"
            highlight="Solutions"
            description="Transform your business with our comprehensive suite of services. From cutting-edge design and development to data-driven marketing strategies."
          />

          {!loading && (
            <motion.div className="flex justify-center mb-16">
              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-2 inline-flex gap-2 border border-slate-200 dark:border-white/10 shadow-lg overflow-x-auto max-w-full">
                {categories.map((category, index) => (
                  <motion.button
                    key={category}
                    onClick={() => handleFilterChange(category)}
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${activeFilter === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[400px] rounded-3xl bg-white/5 border border-white/10 p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <Skeleton className="w-16 h-16 rounded-2xl shadow-lg" />
                  </div>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <div className="space-y-3 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-xl mt-auto" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              layout
            >
              <AnimatePresence mode='popLayout'>
                {displayedServices.map((service, index) => (
                  <motion.div
                    key={service.id || index}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ServiceCard
                      service={service}
                      onLearnMore={() => handleLearnMore(service)}
                      featured={getIsFeatured(service.title)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              { number: '500+', label: 'Projects Completed', icon: '🎯' },
              { number: '98%', label: 'Client Satisfaction', icon: '⭐' },
              { number: '24/7', label: 'Support Available', icon: '💬' },
              { number: '15+', label: 'Industry Awards', icon: '🏆' }
            ].map((stat, index) => (
              <GlassCard
                key={index}
                className="p-6 text-center flex flex-col items-center justify-center"
                hoverEffect={true}
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-500 dark:text-zinc-400 text-sm font-bold uppercase tracking-wider">
                  {stat.label}
                </div>
              </GlassCard>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-10 md:p-16 max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
              <div className="relative z-10">
                <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                  Ready to Elevate Your Business?
                </h3>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Get started with a free consultation. Our experts will analyze your needs
                  and recommend the perfect service package for your business goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                  <motion.button
                    onClick={() => navigate(getLocalizedPath('/contact'))}
                    className="inline-flex items-center justify-center gap-3 bg-white text-blue-600 font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:bg-blue-50 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaCommentDots className="w-5 h-5" />
                    Get Free Consultation
                  </motion.button>
                  <motion.button
                    onClick={() => navigate(getLocalizedPath('/portfolio'))}
                    className="inline-flex items-center justify-center gap-3 bg-blue-700/50 backdrop-blur-md text-white border border-white/20 font-bold py-4 px-8 rounded-xl text-lg hover:bg-blue-700/70 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaChartPie className="w-5 h-5" />
                    View Our Portfolio
                  </motion.button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-2 text-blue-100">
                    <FaLock className="w-4 h-4" />
                    <span className="text-sm font-medium">SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <FaCheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Money Back Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <FaHeadset className="w-4 h-4" />
                    <span className="text-sm font-medium">24/7 Support</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

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