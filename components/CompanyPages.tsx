import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaLightbulb, FaUsers, FaCheckCircle, FaLinkedin, FaTwitter, FaGithub, FaDribbble, FaInstagram, FaEnvelope, FaArrowRight, FaBriefcase, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
// import { TEAM_MEMBERS } from '../constants'; // Removed
import SEO from './SEO';
import { BackgroundEffects } from './ui/BackgroundEffects';
import { GlassCard } from './ui/GlassCard';
import { SectionHeading } from './ui/SectionHeading';

// About Us Page
// Hook Import
import { useContent } from '../src/hooks/useContent';
import { useSiteContentData } from '../src/hooks/useSiteContent';
import { getLocalizedField, SupportedLanguage } from '../src/utils/localization';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';

// About Us Page
export const AboutUsPage: React.FC = () => {
  const { t, i18n } = useTranslation(); // Keep for legacy fallbacks or strict hardcoded UI strings
  const { data: teamMembers } = useContent('team_members');
  const { getText, content } = useSiteContentData();
  const { getLocalizedPath } = useLocalizedPath();
  const lang = i18n.language as SupportedLanguage;

  // Helper to get text: handles both legacy translation keys and new multi-lang objects
  const getLegacyText = (field: any) => {
    if (!field) return '';
    if (typeof field === 'string') return t(field);
    return getLocalizedField(field, lang);
  };

  return (
    <>
      <SEO
        title="About Us"
        description="We're a passionate team of digital innovators, strategists, and creators dedicated to helping businesses thrive in the digital age."
      />
      {/* Hero Section */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden min-h-[60vh] flex items-center justify-center transition-colors duration-300">
        <BackgroundEffects />

        {/* Dynamic Background Image */}
        {content?.about?.hero?.bg_image && (
          <>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
              style={{ backgroundImage: `url(${content.about.hero.bg_image})` }}
            />
            <div className="absolute inset-0 z-0 bg-white/90 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300" />
          </>
        )}

        <div className="container mx-auto max-w-6xl relative z-10">
          <SectionHeading
            badge={getText('about.hero.badge', lang) || t('company.about_us.hero.badge')}
            title={getText('about.hero.title', lang) || t('company.about_us.hero.title')}
            highlight={getText('about.hero.highlight', lang) || t('company.about_us.hero.highlight')}
            description={getText('about.hero.description', lang) || t('company.about_us.hero.description')}
          />
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-white dark:bg-[#09090b] relative transition-colors duration-300">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >

              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 font-heading tracking-tight">
                {getText('about.story.title', lang) || t('company.about_us.story.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">{getText('about.story.title_highlight', lang) || t('company.about_us.story.title_highlight')}</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-600 dark:text-zinc-400 font-light leading-relaxed">
                <p>
                  {getText('about.story.p1', lang) || t('company.about_us.story.p1')}
                </p>
                <p>
                  {getText('about.story.p2', lang) || t('company.about_us.story.p2')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-10">
                <GlassCard className="text-center p-6" hoverEffect={true}>
                  <div className="text-4xl font-black text-slate-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    {getText('about.stats.projects_value', lang) || "200+"}
                  </div>
                  <div className="text-slate-500 dark:text-zinc-400 text-sm uppercase tracking-wider font-semibold">{getText('about.stats.projects_label', lang) || t('company.about_us.stats.projects')}</div>
                </GlassCard>
                <GlassCard className="text-center p-6" hoverEffect={true}>
                  <div className="text-4xl font-black text-slate-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                    {getText('about.stats.clients_value', lang) || "50+"}
                  </div>
                  <div className="text-slate-500 dark:text-zinc-400 text-sm uppercase tracking-wider font-semibold">{getText('about.stats.clients_label', lang) || t('company.about_us.stats.clients')}</div>
                </GlassCard>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

                <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all duration-300">
                      <span className="w-7 h-7 text-blue-600 dark:text-blue-400"><FaLightbulb /></span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{getText('about.values.innovation.title', lang) || t('company.about_us.values.innovation.title')}</h3>
                      <p className="text-slate-600 dark:text-zinc-400 font-light leading-relaxed">{getText('about.values.innovation.desc', lang) || t('company.about_us.values.innovation.desc')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all duration-300">
                      <span className="w-7 h-7 text-purple-600 dark:text-purple-400"><FaUsers /></span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{getText('about.values.client.title', lang) || t('company.about_us.values.client.title')}</h3>
                      <p className="text-slate-600 dark:text-zinc-400 font-light leading-relaxed">{getText('about.values.client.desc', lang) || t('company.about_us.values.client.desc')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-pink-500/20 group-hover:bg-pink-500/20 transition-all duration-300">
                      <span className="w-7 h-7 text-pink-600 dark:text-pink-400"><FaCheckCircle /></span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{getText('about.values.quality.title', lang) || t('company.about_us.values.quality.title')}</h3>
                      <p className="text-slate-600 dark:text-zinc-400 font-light leading-relaxed">{getText('about.values.quality.desc', lang) || t('company.about_us.values.quality.desc')}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Preview Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-300">
        <BackgroundEffects />
        <div className="container mx-auto max-w-6xl relative z-10">
          <SectionHeading
            badge={getText('about.team_preview.badge', lang) || t('company.about_us.team.badge')}
            title={getText('about.team_preview.title', lang) || t('company.about_us.team.title')}
            highlight={getText('about.team_preview.highlight', lang) || t('company.about_us.team.highlight')}
            description={getText('about.team_preview.description', lang) || t('company.about_us.team.description')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.slice(0, 3).map((member: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="p-8 text-center h-full" hoverEffect={true}>
                  <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden border-2 border-slate-200 dark:border-white/10 group-hover:border-blue-500/50 transition-all duration-300 relative z-10">
                    <img src={member.image} alt={member.name} loading="lazy" width="400" height="400" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{member.name}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4 text-sm uppercase tracking-wider">{getLegacyText(member.role)}</p>
                    <p className="text-slate-600 dark:text-zinc-400 font-light text-sm mb-6 line-clamp-3 leading-relaxed">{getLegacyText(member.description)}</p>

                    <div className="flex justify-center gap-4">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-white transition-colors">
                          <span className="w-5 h-5"><FaLinkedin /></span>
                        </a>
                      )}
                      {member.social.twitter && (
                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-zinc-500 hover:text-blue-400 dark:hover:text-white transition-colors">
                          <span className="w-5 h-5"><FaTwitter /></span>
                        </a>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to={getLocalizedPath('/team')}>
              <button className="px-8 py-3 rounded-full border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-semibold">
                {getText('about.team_preview.view_full', lang) || t('company.about_us.team.view_full')}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

// Our Process Page
export const ProcessPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { getText, content } = useSiteContentData();
  const lang = i18n.language as SupportedLanguage;
  const legacyProcessSteps = t('company.process.steps', { returnObjects: true }) as any[];
  const processSteps = content?.process?.steps || legacyProcessSteps;

  return (
    <>
      <SEO
        title={t('company.process.title')}
        description={t('company.process.description')}
      />
      {/* Hero Section */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-300">
        <BackgroundEffects />
        {/* Dynamic Background Image */}
        {content?.process?.hero?.bg_image && (
          <>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${content.process.hero.bg_image})` }}
            />
            <div className="absolute inset-0 z-0 bg-white/90 dark:bg-black/80 backdrop-blur-sm" />
          </>
        )}
        <div className="container mx-auto max-w-6xl relative z-10">
          <SectionHeading
            badge={getText('process.hero.badge', lang) || t('company.process.heading.badge')}
            title={getText('process.hero.title', lang) || t('company.process.heading.title')}
            highlight={getText('process.hero.highlight', lang) || t('company.process.heading.highlight')}
            description={getText('process.hero.description', lang) || t('company.process.heading.description')}
          />
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4 bg-white dark:bg-[#09090b] transition-colors duration-300">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-16">
            {processSteps.map((processStep, index) => (
              <motion.div
                key={index}
                className="flex flex-col lg:flex-row items-center gap-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="lg:w-1/3">
                  <div className="text-6xl font-black text-slate-200 dark:text-white/10 mb-4">{processStep.step || `0${index + 1}`}</div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 font-heading">{getLocalizedField(processStep.title, lang)}</h3>
                  <p className="text-lg text-slate-600 dark:text-zinc-400 leading-relaxed font-light">{getLocalizedField(processStep.description, lang)}</p>
                </div>
                <div className="lg:w-2/3">
                  <GlassCard className="p-8" hoverEffect={true}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {processStep.details?.map((detail: any, detailIndex: number) => (
                        <div key={detailIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full shrink-0"></div>
                          <span className="text-slate-600 dark:text-zinc-300 font-light">{getLocalizedField(detail, lang)}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// Case Studies Page
export const CaseStudiesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const { data: caseStudies, loading } = useContent('projects', { localizedFields: ['title', 'description', 'challenge', 'solution', 'results', 'category'] });
  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <>
      <SEO
        title={t('company.case_studies.title')}
        description={t('company.case_studies.description')}
      />
      {/* Hero Section */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-300">
        <BackgroundEffects />
        <div className="container mx-auto max-w-6xl relative z-10">
          <SectionHeading
            badge={t('company.case_studies.heading.badge')}
            title={t('company.case_studies.heading.title')}
            highlight={t('company.case_studies.heading.highlight')}
            description={t('company.case_studies.heading.description')}
          />
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 px-4 bg-white dark:bg-[#09090b] transition-colors duration-300">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => {
              const image = study.image || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => setSelectedCase(selectedCase === index ? null : index)}
                >
                  <GlassCard className="p-0 overflow-hidden cursor-pointer h-full flex flex-col" hoverEffect={true}>
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <img src={image} alt={study.title} loading="lazy" width="600" height="400" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute bottom-4 left-4 z-20">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">{study.category}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">{study.title}</h3>
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">{study.results}</div>

                      <div className="mt-auto">
                        <button className="text-slate-500 dark:text-zinc-400 font-semibold hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-2 text-sm">
                          {selectedCase === index ? t('company.case_studies.common.hide_details') : t('company.case_studies.common.view_details')} <span className="w-3 h-3"><FaArrowRight /></span>
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedCase === index && (
                        <motion.div
                          className="border-t border-slate-200 dark:border-white/5 p-6 bg-slate-50 dark:bg-zinc-900/50"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-slate-900 dark:text-white font-semibold mb-2 text-sm uppercase tracking-wider">{t('company.case_studies.common.challenge')}</h4>
                              <p className="text-slate-600 dark:text-zinc-400 text-sm font-light">{study.challenge || "No challenge detailed."}</p>
                            </div>
                            <div>
                              <h4 className="text-slate-900 dark:text-white font-semibold mb-2 text-sm uppercase tracking-wider">{t('company.case_studies.common.solution')}</h4>
                              <p className="text-slate-600 dark:text-zinc-400 text-sm font-light">{study.solution || "No solution detailed."}</p>
                            </div>
                            <div>
                              <h4 className="text-slate-900 dark:text-white font-semibold mb-2 text-sm uppercase tracking-wider">{t('company.case_studies.common.key_results')}</h4>
                              <ul className="space-y-2">
                                {study.results ? (
                                  Array.isArray(study.results) ? study.results.map((metric: any, metricIndex: number) => (
                                    <li key={metricIndex} className="text-slate-600 dark:text-zinc-400 text-sm flex items-center gap-2 font-light">
                                      <span className="w-4 h-4 text-green-500"><FaCheckCircle /></span>
                                      {typeof metric === 'string' ? metric : getLocalizedField(metric, i18n.language)}
                                    </li>
                                  )) : null
                                ) : (
                                  <li className="text-slate-500 text-sm">Results pending...</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

// CareersPage
export const CareersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { getText, content } = useSiteContentData();
  const lang = i18n.language as SupportedLanguage;
  const { data: jobOpenings, loading } = useContent('jobs', { localizedFields: ['title', 'description'] });
  const { getLocalizedPath } = useLocalizedPath();

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <>
      <SEO
        title={t('company.careers.title')}
        description={t('company.careers.description')}
      />
      {/* Hero Section */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-300">
        <BackgroundEffects />
        {/* Dynamic Background Image */}
        {content?.careers?.hero?.bg_image && (
          <>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${content.careers.hero.bg_image})` }}
            />
            <div className="absolute inset-0 z-0 bg-white/90 dark:bg-black/80 backdrop-blur-sm" />
          </>
        )}
        <div className="container mx-auto max-w-6xl relative z-10">
          <SectionHeading
            badge={getText('careers.hero.badge', lang) || t('company.careers.heading.badge')}
            title={getText('careers.hero.title', lang) || t('company.careers.heading.title')}
            highlight={getText('careers.hero.highlight', lang) || t('company.careers.heading.highlight')}
            description={getText('careers.hero.description', lang) || t('company.careers.heading.description')}
          />
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-20 px-4 bg-white dark:bg-[#09090b] transition-colors duration-300">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 font-heading tracking-tight">
              {getText('careers.open_positions.title', lang) || t('company.careers.open_positions.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">{getText('careers.open_positions.highlight', lang) || t('company.careers.open_positions.highlight')}</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="p-8" hoverEffect={true}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-heading">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-slate-600 dark:text-zinc-400 font-light text-sm">
                        <span className="flex items-center gap-1"><span className="text-blue-500"><FaBriefcase /></span> {job.department}</span>
                        <span className="flex items-center gap-1"><span className="text-blue-500"><FaMapMarkerAlt /></span> {job.location}</span>
                        <span className="flex items-center gap-1"><span className="text-blue-500"><FaClock /></span> {job.type}</span>
                      </div>
                    </div>
                    <Link to={getLocalizedPath(`/careers/${job.id}`)}>
                      <motion.button
                        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full font-bold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 mt-4 md:mt-0 shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {t('company.careers.apply_now')}
                      </motion.button>
                    </Link>
                  </div>
                  <p className="text-slate-600 dark:text-zinc-300 font-light">{job.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// Team Page
export const TeamPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const { data: teamMembers } = useContent('team_members');
  const { getText, content } = useSiteContentData();
  const { getLocalizedPath } = useLocalizedPath();
  const lang = i18n.language as SupportedLanguage;

  // Helper to get text: handles both legacy translation keys and new multi-lang objects
  const getLegacyText = (field: any) => {
    if (!field) return '';
    if (typeof field === 'string') return t(field);
    return getLocalizedField(field, i18n.language);
  };

  return (
    <>
      <SEO
        title={t('company.team.title')}
        description={t('company.team.description')}
      />
      <section className="relative min-h-screen bg-slate-50 dark:bg-[#09090b] flex flex-col items-center justify-center overflow-hidden py-24 transition-colors duration-300">
        <BackgroundEffects />
        {/* Dynamic Background Image */}
        {content?.team_page?.hero?.bg_image && (
          <>
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${content.team_page.hero.bg_image})` }}
            />
            <div className="absolute inset-0 z-0 bg-white/90 dark:bg-black/80 backdrop-blur-sm" />
          </>
        )}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <SectionHeading
            badge={getText('team_page.hero.badge', lang) || t('company.team.heading.badge')}
            title={getText('team_page.hero.title', lang) || t('company.team.heading.title')}
            highlight={getText('team_page.hero.highlight', lang) || t('company.team.heading.highlight')}
            description={getText('team_page.hero.description', lang) || t('company.team.heading.description')}
          />

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {teamMembers.map((member: any, index: number) => (
              <motion.div
                key={member.name}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredMember(index)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <GlassCard className="p-8 h-full relative overflow-hidden" hoverEffect={true}>
                  {/* Background Glow Effect */}
                  <div className={`absolute inset-0 transition-all duration-700 opacity-0 group-hover:opacity-100 ${hoveredMember === index
                    ? 'bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent'
                    : ''
                    }`} />

                  <div className="relative z-10 flex flex-col h-full">
                    <Link to={getLocalizedPath(`/team/${member.slug}`)} className="block flex-grow">
                      {/* Profile Image Container */}
                      <div className="relative mb-8 mx-auto w-40 h-40">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                        <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-br from-white/50 to-white/20 dark:from-white/10 dark:to-white/5 border border-slate-200 dark:border-white/10 group-hover:border-blue-500/30 dark:group-hover:border-white/30 transition-all duration-500">
                          <img
                            src={member.image}
                            alt={member.name}
                            loading="lazy"
                            width="300"
                            height="300"
                            className="w-full h-full object-cover rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          {/* Fallback */}
                          <div className="hidden absolute inset-0 bg-slate-200 dark:bg-zinc-800 rounded-full items-center justify-center">
                            <span className="text-2xl font-bold text-slate-500 dark:text-zinc-400">{member.name.charAt(0)}</span>
                          </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-50 dark:border-zinc-900 z-20" title="Available"></div>
                      </div>

                      {/* Member Info */}
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 font-heading tracking-tight">
                          {member.name}
                        </h3>
                        <div className="text-slate-500 dark:text-zinc-400 font-medium text-sm uppercase tracking-wider mb-4 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                          {getLegacyText(member.role)}
                        </div>
                        <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed font-light line-clamp-3 group-hover:text-slate-700 dark:group-hover:text-zinc-400 transition-colors duration-300">
                          {getLegacyText(member.description)}
                        </p>
                      </div>
                    </Link>

                    {/* Specialties */}
                    <div className="mb-8">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.specialties.slice(0, 3).map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400 text-xs font-medium rounded-full border border-slate-200 dark:border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-all duration-300"
                          >
                            {getLegacyText(specialty)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-3 mt-auto pt-6 border-t border-slate-200 dark:border-white/5 group-hover:border-slate-300 dark:group-hover:border-white/10 transition-colors duration-300">
                      {Object.entries(member.social).map(([platform, url]) => {
                        if (!url) return null;
                        const icons = {
                          linkedin: <span className="w-4 h-4 inline-flex"><FaLinkedin /></span>,
                          twitter: <span className="w-4 h-4 inline-flex"><FaTwitter /></span>,
                          github: <span className="w-4 h-4 inline-flex"><FaGithub /></span>,
                          dribbble: <span className="w-4 h-4 inline-flex"><FaDribbble /></span>,
                          instagram: <span className="w-4 h-4 inline-flex"><FaInstagram /></span>,
                          email: <span className="w-4 h-4 inline-flex"><FaEnvelope /></span>
                        };

                        return (
                          <motion.a
                            key={platform}
                            href={url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-300 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`${member.name} ${platform}`}
                          >
                            {icons[platform as keyof typeof icons]}
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            className="text-center mt-32"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-12 max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white/5 dark:to-white/5 border-none text-white">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">
                {getText('team_page.cta.title', lang) || t('company.team.cta.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{getText('team_page.cta.highlight', lang) || t('company.team.cta.highlight')}</span>
              </h2>
              <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto font-light">
                {getText('team_page.cta.description', lang) || t('company.team.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={getLocalizedPath('/contact')}>
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {getText('team_page.cta.start_project', lang) || t('company.team.cta.start_project')}
                  </motion.button>
                </Link>
                <Link to={getLocalizedPath('/about')}>
                  <motion.button
                    className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 font-bold px-10 py-4 rounded-full transition-all duration-300 border border-white/10 hover:border-white/30 text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {getText('team_page.cta.learn_more', lang) || t('company.team.cta.learn_more')}
                  </motion.button>
                </Link>
              </div>
            </GlassCard>
          </motion.div >
        </div >
      </section >
    </>
  );
};

import { FaSearch, FaTag, FaMagnet } from 'react-icons/fa';
import { BlogPageSkeleton } from './skeletons/BlogSkeletons';

// Blog Page
export const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { getLocalizedPath } = useLocalizedPath();
  const { data: blogPosts, loading } = useContent('blog_posts', { localizedFields: ['title', 'excerpt', 'category'] });
  // Fetch Global Site Content for Blog Settings
  const { content, getText } = useSiteContentData();
  const blogSettings = content?.blog_settings || {};
  const lang = i18n.language as SupportedLanguage;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(blogPosts.map((post: any) => post.category).filter(Boolean)))];

  // Filter posts
  const filteredPosts = blogPosts.filter((post: any) => {
    const matchesStatus = !post.status || post.status === 'published';
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesStatus && matchesSearch && matchesCategory;
  });

  // Featured Post Logic
  let featuredPost = null;
  if (blogSettings.featured_post_mode === 'manual' && blogSettings.featured_post_id) {
    featuredPost = blogPosts.find((p: any) => p.id === blogSettings.featured_post_id);
  }
  // Fallback to latest post if manual not found or mode is latest
  if (!featuredPost && filteredPosts.length > 0) {
    featuredPost = filteredPosts[0];
  }

  // Exclude featured post from grid if it's the latest one and we are showing it as hero
  // BUT only if we are on the first page/default view (simplification: just don't duplicate it if possible, 
  // but for now, let's keep it simple and maybe duplicate or just filter it out)
  const gridPosts = filteredPosts.filter((p: any) => p.id !== featuredPost?.id);

  if (loading) return <BlogPageSkeleton />;

  return (
    <>
      <SEO
        title={t('company.blog.title')}
        description={t('company.blog.description')}
      />
      {/* Featured Post Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-slate-50 dark:bg-[#09090b] relative overflow-hidden transition-colors duration-300">
        <BackgroundEffects />
        <div className="container mx-auto max-w-6xl relative z-10">

          <div className="text-center mb-12">
            <SectionHeading
              badge={t('company.blog.heading.badge')}
              title={t('company.blog.heading.title')}
              highlight={t('company.blog.heading.highlight')}
              description={t('company.blog.heading.description')}
            />
          </div>

          {featuredPost && (
            <div className="mb-16">
              <Link to={getLocalizedPath(`/blog/${featuredPost.slug || featuredPost.id}`)}>
                <GlassCard className="p-0 overflow-hidden group relative min-h-[400px] flex items-end" hoverEffect={true}>
                  <div className="absolute inset-0 z-0">
                    <img
                      src={featuredPost.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop"}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                  </div>
                  <div className="relative z-10 p-8 md:p-12 w-full max-w-4xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">{featuredPost.category || 'Blog'}</span>
                      <span className="text-slate-300 text-sm flex items-center gap-2"><span className="w-3 h-3"><FaClock /></span> {featuredPost.readTime}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 font-heading leading-tight group-hover:text-blue-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-200 text-lg md:text-xl font-light line-clamp-2 mb-6 max-w-2xl">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-sm">
                      {getText('blog_settings.labels.hero_read_article', lang) || t('company.blog.common.hero_read_article')} <FaArrowRight />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </div>
          )}

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaSearch /></span>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-black/20 border border-transparent focus:border-blue-500 rounded-xl outline-none text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog & Lead Magnet Grid */}
      <section className="pb-24 px-4 bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Dynamic Lead Magnet Card - Injected at position 2 (index 1) */}
            {blogSettings.lead_magnet?.enabled && gridPosts.length > 0 && (
              <motion.div
                className="md:col-span-2 lg:col-span-1 lg:row-span-1 order-2 lg:order-none"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="h-full rounded-3xl p-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white flex flex-col justify-center items-center text-center shadow-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <span className="w-8 h-8 text-white"><FaMagnet /></span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 font-heading">
                      {getText('blog_settings.lead_magnet.title', lang) || "Free Growth Checklist"}
                    </h3>
                    <p className="text-blue-100 mb-8 leading-relaxed">
                      {getText('blog_settings.lead_magnet.description', lang) || "Download our ultimate guide to 10x your business growth."}
                    </p>
                    <a
                      href={getLocalizedField(blogSettings.lead_magnet?.button_url, lang) || blogSettings.lead_magnet?.button_url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
                    >
                      {getText('blog_settings.lead_magnet.button_text', lang) || "Download Free"}
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {gridPosts.map((post: any, index: number) => {
              const image = post.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop";
              const linkUrl = `/blog/${post.slug || post.id}`;

              // Adjust order if needed to flow around lead magnet
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <GlassCard className="p-0 overflow-hidden h-full flex flex-col" hoverEffect={true}>
                    <Link to={getLocalizedPath(linkUrl)} className="h-48 overflow-hidden relative block">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <img src={image} alt={post.title} loading="lazy" width="800" height="400" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute bottom-4 left-4 z-20">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">{post.category}</span>
                      </div>
                    </Link>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center justify-between mb-3 text-sm text-slate-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1"><span className="w-3 h-3"><FaClock /></span> {post.readTime}</span>
                        <span>{post.date}</span>
                      </div>
                      <Link to={getLocalizedPath(linkUrl)}>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{post.title}</h3>
                      </Link>
                      <p className="text-slate-600 dark:text-zinc-400 mb-4 font-light flex-grow line-clamp-3">{post.excerpt}</p>
                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                        <Link to={getLocalizedPath(linkUrl)} className="text-slate-900 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 text-sm">
                          {getText('blog_settings.labels.card_read_more', lang) || t('company.blog.card_read_more')} <span className="w-3 h-3"><FaArrowRight /></span>
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                </motion.article>
              );
            })}
          </div>

          {gridPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full py-20 text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full mb-6 text-slate-400 dark:text-zinc-500">
                <span className="w-8 h-8"><FaSearch /></span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-heading">No articles found</h3>
              <p className="text-slate-500 dark:text-zinc-400 text-lg mb-8 max-w-md mx-auto">
                We couldn't find any articles matching "{searchTerm}" in {selectedCategory}.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};
