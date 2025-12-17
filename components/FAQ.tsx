import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaQuestionCircle, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BackgroundEffects } from './ui/BackgroundEffects';
import { GlassCard } from './ui/GlassCard';
import { SectionHeading } from './ui/SectionHeading';
import { useContent } from '../src/hooks/useContent';
import { getLocalizedField } from '../src/utils/localization';
import { Skeleton } from './ui/Skeleton';
import { FAQItem as FAQItemType } from '../types';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';

const FAQDisplayItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void }> = ({
  question,
  answer,
  isOpen,
  onClick
}) => {
  return (
    <GlassCard
      className="overflow-hidden p-0"
      hoverEffect={true}
      whileHover={{ scale: 1.01, y: -2 }}
    >
      <button
        onClick={onClick}
        className="w-full px-6 md:px-8 py-5 md:py-6 text-left flex justify-between items-center hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-zinc-500 group-hover:bg-blue-500/10 group-hover:text-blue-500'}`}>
            <FaQuestionCircle className="w-4 h-4" />
          </div>
          <h3 className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
            {question}
          </h3>
        </div>
        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 ${isOpen ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-200 dark:border-white/10 text-slate-400 dark:text-zinc-500'}`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-slate-50/50 dark:bg-white/5"
          >
            <div className="px-8 pb-8 pt-2 pl-[4.5rem]">
              <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-lg">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

const FAQ: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const { getLocalizedPath } = useLocalizedPath();
  const { data: faqs, loading } = useContent<FAQItemType>('faqs');

  // Helper to get text: handles both legacy translation keys and new multi-lang objects
  const getText = (field: any) => {
    if (!field) return '';
    if (typeof field === 'string') return t(field);
    return getLocalizedField(field, i18n.language);
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
      <BackgroundEffects />

      <div className="container mx-auto max-w-4xl relative z-10">
        <SectionHeading
          badge={t('section_headers.faq.badge')}
          title={t('section_headers.faq.title')}
          highlight={t('section_headers.faq.highlight')}
          description={t('section_headers.faq.description')}
        />

        <div className="space-y-4">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="w-5 h-5 rounded-full" />
                </div>
              </div>
            ))
          ) : (
            <motion.div
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
              className="space-y-4"
            >
              {faqs.length > 0 ? (
                faqs.map((faq, index) => (
                  <motion.div
                    key={faq.id || index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <FAQDisplayItem
                      question={getText(faq.question)}
                      answer={getText(faq.answer)}
                      isOpen={openIndex === index}
                      onClick={() => toggleFAQ(index)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">No FAQs available at the moment.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Call to Action */}
        {!loading && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="p-8 md:p-10 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('section_headers.faq.cta_title')}
              </h3>
              <p className="text-slate-600 dark:text-zinc-300 mb-8 max-w-xl mx-auto">
                {t('section_headers.faq.cta_desc')}
              </p>
              <motion.button
                onClick={() => navigate(getLocalizedPath('/contact'))}
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaEnvelope className="w-4 h-4" />
                {t('section_headers.faq.cta_button')}
              </motion.button>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FAQ;