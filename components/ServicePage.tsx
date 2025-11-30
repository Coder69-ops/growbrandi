import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaEye, FaCheck, FaStar, FaPhone } from 'react-icons/fa';

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
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              {title}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.button
              className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaRocket className="w-5 h-5" />
              Get Started Today
            </motion.button>
            <motion.button
              className="glass-effect text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-700/50 transition-all duration-300 border border-slate-600 hover:border-emerald-400 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaEye className="w-5 h-5" />
              View Case Studies
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              What's <span className="text-gradient">Included</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Comprehensive solutions designed to deliver exceptional results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-2xl p-8 border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <FaCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature}</h3>
                <p className="text-slate-400">Professional implementation with attention to detail and best practices.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Why Choose <span className="text-gradient">GrowBrandi</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience the difference with our proven approach and expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mt-1 shrink-0">
                  <FaStar className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit}</h3>
                  <p className="text-slate-400">Delivered with excellence and backed by our commitment to your success.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section (if provided) */}
      {technologies.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                <span className="text-gradient">Technologies</span> We Use
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Cutting-edge tools and frameworks for optimal performance
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  className="glass-effect rounded-xl px-6 py-3 border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-white font-medium">{tech}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Section (if provided) */}
      {process.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Our <span className="text-gradient">Process</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                A systematic approach that ensures success at every step
              </p>
            </motion.div>

            <div className="space-y-8">
              {process.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-8"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {index + 1}
                  </div>
                  <div className="glass-effect rounded-xl p-6 flex-1 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">Step {index + 1}</h3>
                    <p className="text-slate-300">{step}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section (if provided) */}
      {pricing && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                <span className="text-gradient">Pricing</span> Plans
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Choose the perfect plan for your business needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(pricing).map(([planName, plan], index) => (
                <motion.div
                  key={planName}
                  className={`glass-effect rounded-2xl p-8 border transition-all duration-300 ${planName === 'professional'
                      ? 'border-emerald-400/50 ring-2 ring-emerald-400/20 scale-105'
                      : 'border-white/10 hover:border-emerald-400/30'
                    }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {planName === 'professional' && (
                    <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full text-center mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2 capitalize">{planName}</h3>
                  <div className="text-4xl font-black text-white mb-6">
                    {plan.price}
                    <span className="text-lg font-normal text-slate-400">/project</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-slate-300">
                        <FaCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 ${planName === 'professional'
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600'
                        : 'glass-effect text-white border border-slate-600 hover:border-emerald-400'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="glass-effect rounded-3xl p-12 text-center border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Ready to Get <span className="text-gradient">Started?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Let's discuss your project and create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaRocket className="w-5 h-5" />
                Start Your Project
              </motion.button>
              <motion.button
                className="glass-effect text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-700/50 transition-all duration-300 border border-slate-600 hover:border-emerald-400 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPhone className="w-5 h-5" />
                Call Us Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ServicePage;