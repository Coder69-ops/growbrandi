import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import { APP_NAME, CONTACT_INFO } from '../constants';

// Privacy Policy Page
export const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-luxury-black relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-50 dark:from-zinc-800/20 dark:via-luxury-black dark:to-luxury-black" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 font-heading tracking-tight">
              {t('legal.privacy.title')} <span className="text-gradient">{t('legal.privacy.title_highlight')}</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-light">
              {t('legal.common.last_updated')}
            </p>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8 text-slate-600 dark:text-zinc-400 leading-relaxed font-light">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.privacy.intro.title')}</h2>
                <p>
                  <Trans i18nKey="legal.privacy.intro.text" values={{ appName: APP_NAME }} />
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.privacy.collect.title')}</h2>
                <p className="mb-4">{t('legal.privacy.collect.text')}</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t('legal.privacy.collect.list.1')}</li>
                  <li>{t('legal.privacy.collect.list.2')}</li>
                  <li>{t('legal.privacy.collect.list.3')}</li>
                  <li>{t('legal.privacy.collect.list.4')}</li>
                </ul>
                <p className="mt-4">
                  {t('legal.privacy.collect.text_2')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.privacy.use.title')}</h2>
                <p className="mb-4">{t('legal.privacy.use.text')}</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t('legal.privacy.use.list.1')}</li>
                  <li>{t('legal.privacy.use.list.2')}</li>
                  <li>{t('legal.privacy.use.list.3')}</li>
                  <li>{t('legal.privacy.use.list.4')}</li>
                  <li>{t('legal.privacy.use.list.5')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.privacy.sharing.title')}</h2>
                <p>
                  {t('legal.privacy.sharing.text')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.privacy.security.title')}</h2>
                <p>
                  {t('legal.privacy.security.text')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.privacy.contact.title')}</h2>
                <p>
                  <Trans i18nKey="legal.common.contact_us.intro" values={{ email: CONTACT_INFO.email }} />
                </p>
                <div className="mt-4 p-4 bg-slate-100 dark:bg-zinc-900/50 rounded-lg border border-slate-200 dark:border-white/5">
                  <p className="font-bold text-slate-900 dark:text-white">{APP_NAME}</p>
                  <p>{t('legal.common.contact_us.address')}: {CONTACT_INFO.address}</p>
                  <p>{t('legal.common.contact_us.phone')}: {CONTACT_INFO.phone}</p>
                  <p>{t('legal.common.contact_us.email')}: {CONTACT_INFO.email}</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

// Terms of Service Page
// Terms of Service Page
export const TermsOfServicePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-luxury-black relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-50 dark:from-zinc-800/20 dark:via-luxury-black dark:to-luxury-black" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 font-heading tracking-tight">
              {t('legal.terms.title')} <span className="text-gradient">{t('legal.terms.title_highlight')}</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-light">
              {t('legal.common.last_updated')}
            </p>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8 text-slate-600 dark:text-zinc-400 leading-relaxed font-light">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.terms.agreement.title')}</h2>
                <p>
                  <Trans i18nKey="legal.terms.agreement.text" values={{ appName: APP_NAME }} />
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.terms.ip.title')}</h2>
                <p className="mb-4">
                  {t('legal.terms.ip.text')}
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><Trans i18nKey="legal.terms.ip.list.deliverables" /></li>
                  <li><Trans i18nKey="legal.terms.ip.list.tools" values={{ appName: APP_NAME }} /></li>
                  <li><Trans i18nKey="legal.terms.ip.list.portfolio" /></li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.terms.engagement.title')}</h2>
                <p className="mb-4">
                  {t('legal.terms.engagement.text')}
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t('legal.terms.engagement.list.1')}</li>
                  <li>{t('legal.terms.engagement.list.2')}</li>
                  <li>{t('legal.terms.engagement.list.3')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.terms.prohibited.title')}</h2>
                <p>
                  {t('legal.terms.prohibited.text')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.terms.liability.title')}</h2>
                <p>
                  {t('legal.terms.liability.text')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.terms.governing.title')}</h2>
                <p>
                  <Trans i18nKey="legal.terms.governing.text" values={{ appName: APP_NAME }} />
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

// Cookie Policy Page
export const CookiePolicyPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-luxury-black relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-50 dark:from-zinc-800/20 dark:via-luxury-black dark:to-luxury-black" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 font-heading tracking-tight">
              {t('legal.cookies.title')} <span className="text-gradient">{t('legal.cookies.title_highlight')}</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-light">
              {t('legal.common.last_updated')}
            </p>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8 text-slate-600 dark:text-zinc-400 leading-relaxed font-light">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.cookies.what_are.title')}</h2>
                <p>
                  {t('legal.cookies.what_are.text')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.cookies.how_use.title')}</h2>
                <p className="mb-4">{t('legal.cookies.how_use.text')}</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><Trans i18nKey="legal.cookies.how_use.list.essential" /></li>
                  <li><Trans i18nKey="legal.cookies.how_use.list.analytics" /></li>
                  <li><Trans i18nKey="legal.cookies.how_use.list.functional" /></li>
                  <li><Trans i18nKey="legal.cookies.how_use.list.marketing" /></li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.cookies.types.title')}</h2>

                <div className="space-y-6">
                  <div className="p-4 bg-slate-100 dark:bg-zinc-900/50 rounded-lg border border-slate-200 dark:border-white/5">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 font-heading">{t('legal.cookies.types.strict.title')}</h3>
                    <p>{t('legal.cookies.types.strict.text')}</p>
                  </div>

                  <div className="p-4 bg-slate-100 dark:bg-zinc-900/50 rounded-lg border border-slate-200 dark:border-white/5">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 font-heading">{t('legal.cookies.types.performance.title')}</h3>
                    <p>{t('legal.cookies.types.performance.text')}</p>
                  </div>

                  <div className="p-4 bg-slate-100 dark:bg-zinc-900/50 rounded-lg border border-slate-200 dark:border-white/5">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 font-heading">{t('legal.cookies.types.functionality.title')}</h3>
                    <p>{t('legal.cookies.types.functionality.text')}</p>
                  </div>

                  <div className="p-4 bg-slate-100 dark:bg-zinc-900/50 rounded-lg border border-slate-200 dark:border-white/5">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 font-heading">{t('legal.cookies.types.targeting.title')}</h3>
                    <p>{t('legal.cookies.types.targeting.text')}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.cookies.managing.title')}</h2>
                <p className="mb-4">{t('legal.cookies.managing.text')}</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t('legal.cookies.managing.list.browser')}</li>
                  <li>{t('legal.cookies.managing.list.delete')}</li>
                  <li>{t('legal.cookies.managing.list.notify')}</li>
                </ul>
                <p className="mt-4">
                  {t('legal.cookies.managing.text_2')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('legal.cookies.contact.title')}</h2>
                <p>
                  {t('legal.cookies.contact.text')}
                </p>
                <div className="mt-4 p-4 bg-slate-100 dark:bg-zinc-900/50 rounded-lg border border-slate-200 dark:border-white/5">
                  <p><strong>{t('legal.common.contact_us.email')}:</strong> {CONTACT_INFO.email}</p>
                  <p><strong>{t('legal.common.contact_us.address')}:</strong> {CONTACT_INFO.address}</p>
                  <p><strong>{t('legal.common.contact_us.phone')}:</strong> {CONTACT_INFO.phone}</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};