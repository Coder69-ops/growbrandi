import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { FAQ_DATA } from '../constants';

const FAQItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void }> = ({
  question,
  answer,
  isOpen,
  onClick
}) => {
  return (
    <motion.div
      className="glass-effect rounded-2xl overflow-hidden"
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onClick}
        className="w-full px-6 md:px-8 py-4 md:py-6 text-left flex justify-between items-center hover:bg-white/5 transition-all duration-300 group"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg md:text-xl font-bold text-white pr-4 group-hover:text-gradient transition-colors duration-300">
          {question}
        </h3>
        <motion.div
          className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className="w-5 h-5 text-white" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-6 pt-2">
              <div className="w-full h-px bg-gradient-to-r from-blue-500/20 to-blue-500/20 mb-4" />
              <p className="text-zinc-300 leading-relaxed text-lg">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-luxury-black" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-2 mb-6">
            <span className="text-sm font-medium text-blue-400">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-black mb-6">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Get answers to common questions about our services, process, and how we can help
            transform your business with our AI-powered digital solutions.
          </p>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {FAQ_DATA.map((faq, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => toggleFAQ(index)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass-effect rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-zinc-300 mb-6">
              Can't find the answer you're looking for? Our team is here to help you.
            </p>
            <motion.button
              className="bg-gradient-to-r from-blue-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:from-blue-600 hover:to-blue-600 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Our Team
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;