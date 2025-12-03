import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaRocket, FaEye, FaCheck, FaStar, FaPhone } from 'react-icons/fa';
import SEO from './SEO';
import ServiceAIWidget from './ServiceAIWidget';
import { BackgroundEffects } from './ui/BackgroundEffects';
import { GlassCard } from './ui/GlassCard';
import { SectionHeading } from './ui/SectionHeading';

interface ServicePageProps {
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  technologies?: string[];
  process?: string[];
  pricing?: {
    starter: { price: string; features: string[] };
    professional: { price: string; features: string[] };
    enterprise: { price: string; features: string[] };
  };
}

const ServicePage: React.FC<ServicePageProps> = ({
  title,
  description,
  features,
  benefits,
  technologies = [],
  process = [],
  pricing
}) => {
  return (
    <>
      <SEO title={title} description={description} />
      <div className="bg-slate-50 dark:bg-[#09090b] min-h-screen transition-colors duration-300">
        {/* Hero Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          <BackgroundEffects />
          <div className="container mx-auto max-w-6xl relative z-10">
            <SectionHeading
              badge="Service"
              title={title}
              highlight=""
              description={description}
              align="center"
            />

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-20 mt-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link to="/contact">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaRocket className="w-5 h-5" />
                  Get Started Today
                </motion.button>
              </Link>
              <Link to="/portfolio">
                <motion.button
                  className="bg-white/10 backdrop-blur-md text-slate-700 dark:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-white/20 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaEye className="w-5 h-5" />
                  View Case Studies
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white dark:bg-[#09090b] transition-colors duration-300">
          <div className="container mx-auto max-w-6xl">
            <SectionHeading
              badge="Features"
              title="What's"
              highlight="Included"
              description="Comprehensive solutions designed to deliver exceptional results"
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard className="p-8 h-full" hoverEffect={true}>
                    <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 border border-blue-500/20 dark:border-blue-500/20">
                      <FaCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">{feature}</h3>
                    <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-light">Professional implementation with attention to detail and best practices.</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-300">
          <BackgroundEffects />
          <div className="container mx-auto max-w-6xl relative z-10">
            <SectionHeading
              badge="Benefits"
              title="Why Choose"
              highlight="GrowBrandi"
              description="Experience the difference with our proven approach and expertise"
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 flex items-start gap-4" hoverEffect={true}>
                    <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0 border border-blue-500/20 dark:border-blue-500/20">
                      <FaStar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-heading">{benefit}</h3>
                      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-light">Delivered with excellence and backed by our commitment to your success.</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Section (if provided) */}
        {technologies.length > 0 && (
          <section className="py-20 px-4 bg-white dark:bg-[#09090b] transition-colors duration-300">
            <div className="container mx-auto max-w-6xl">
              <SectionHeading
                badge="Tech Stack"
                title="Technologies"
                highlight="We Use"
                description="Cutting-edge tools and frameworks for optimal performance"
                align="center"
              />

              <div className="flex flex-wrap justify-center gap-4 mt-12">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <GlassCard className="px-6 py-3" hoverEffect={true}>
                      <span className="text-slate-700 dark:text-zinc-300 font-medium">{tech}</span>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Process Section (if provided) */}
        {process.length > 0 && (
          <section className="py-20 px-4 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-300">
            <BackgroundEffects />
            <div className="container mx-auto max-w-6xl relative z-10">
              <SectionHeading
                badge="Methodology"
                title="Our"
                highlight="Process"
                description="A systematic approach that ensures success at every step"
                align="center"
              />

              <div className="space-y-8 mt-12">
                {process.map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-6"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl shrink-0 shadow-lg z-10">
                      {index + 1}
                    </div>
                    <GlassCard className="p-6 flex-1" hoverEffect={true}>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading">Step {index + 1}</h3>
                      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-light">{step}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing Section (if provided) */}
        {pricing && (
          <section className="py-20 px-4 bg-white dark:bg-[#09090b] transition-colors duration-300">
            <div className="container mx-auto max-w-6xl">
              <SectionHeading
                badge="Pricing"
                title="Pricing"
                highlight="Plans"
                description="Choose the perfect plan for your business needs"
                align="center"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {Object.entries(pricing).map(([planName, plan], index) => (
                  <motion.div
                    key={planName}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <GlassCard
                      className={`p-8 h-full flex flex-col ${planName === 'professional' ? 'border-blue-500/50 dark:border-blue-400/50 shadow-lg shadow-blue-500/10' : ''}`}
                      hoverEffect={true}
                    >
                      {planName === 'professional' && (
                        <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full text-center mb-4 inline-block tracking-wider uppercase self-start">
                          Most Popular
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 capitalize font-heading">{planName}</h3>
                      <div className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        {plan.price}
                        <span className="text-lg font-normal text-slate-500 dark:text-zinc-400 ml-2">/project</span>
                      </div>
                      <ul className="space-y-4 mb-8 flex-grow">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3 text-slate-600 dark:text-zinc-400 font-light">
                            <FaCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link to="/contact" className="w-full block mt-auto">
                        <motion.button
                          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${planName === 'professional'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-600 hover:to-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Get Started
                        </motion.button>
                      </Link>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* AI Analysis Section */}
        <section className="py-20 px-4 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-300">
          <BackgroundEffects />
          <div className="container mx-auto max-w-4xl relative z-10">
            <SectionHeading
              badge="AI Analysis"
              title="Get a"
              highlight="Custom AI Analysis"
              description="Not sure where to start? Let our AI analyze your needs and provide a personalized recommendation instantly."
              align="center"
            />
            <div className="mt-12">
              <ServiceAIWidget serviceTitle={title} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-white dark:bg-[#09090b] transition-colors duration-300">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GlassCard className="p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight font-heading">
                  Ready to Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Started?</span>
                </h2>
                <p className="text-xl text-slate-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto font-light">
                  Let's discuss your project and create something amazing together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <motion.button
                      className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaRocket className="w-5 h-5" />
                      Start Your Project
                    </motion.button>
                  </Link>
                  <Link to="/contact">
                    <motion.button
                      className="bg-white/10 backdrop-blur-md text-slate-700 dark:text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-white/20 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaPhone className="w-5 h-5" />
                      Book Strategy Call
                    </motion.button>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicePage;