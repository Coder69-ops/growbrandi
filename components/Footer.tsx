import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaLinkedin, FaTiktok, FaInstagram, FaBuilding, FaMapMarkerAlt, FaEnvelope, FaPhone, FaWhatsapp, FaStar, FaGithub, FaGlobe, FaTwitter, FaYoutube, FaFacebook } from 'react-icons/fa';
import { SiTrustpilot } from 'react-icons/si';
// import { APP_NAME, APP_TAGLINE, CONTACT_INFO } from '../constants'; // Removed
import { useSiteContentData } from '../src/hooks/useSiteContent';
import { useContent } from '../src/hooks/useContent';
import { Service } from '../types';
import { getLocalizedField } from '../src/utils/localization';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';
import { useSiteSettings } from '../src/hooks/useSiteSettings';

// --- Enhanced Footer Component ---
const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { getText } = useSiteContentData();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { getLocalizedPath } = useLocalizedPath();
  const { settings } = useSiteSettings();

  const { data: services } = useContent<Service>('services');

  // Helper to get footer text with fallback
  const getFooterText = (field: string) => {
    const firestoreText = getText(`footer.${field}`, i18n.language as any);
    return firestoreText || t(`footer.${field}`);
  };

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    // Simulate subscription
    setTimeout(() => {
      setSubscriptionStatus('success');
      setEmail('');
      setIsSubscribing(false);
      setTimeout(() => setSubscriptionStatus('idle'), 3000);
    }, 1000);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin': return <FaLinkedin className="w-4 h-4" />;
      case 'tiktok': return <FaTiktok className="w-4 h-4" />;
      case 'instagram': return <FaInstagram className="w-4 h-4" />;
      case 'goodfirms': return <FaBuilding className="w-4 h-4" />;
      case 'whatsapp': return <FaWhatsapp className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <footer className="relative overflow-hidden bg-slate-50 dark:bg-luxury-black pt-12 md:pt-20 pb-8 md:pb-10 border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-white/5 rounded-full blur-3xl pointer-events-none opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand Section - Spans full width on mobile, 4 cols on desktop */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4 md:space-y-6">
            <Link to={getLocalizedPath('/')} className="flex items-center gap-3 group">
              {/* Light Mode Logo */}
              <img
                src={settings?.branding?.logoLight || "/growbrandi-logo.png"}
                alt="GrowBrandi Logo"
                loading="lazy"
                width="128"
                height="32"
                className="w-32 h-8 lg:w-48 lg:h-12 object-contain block dark:hidden"
              />
              {/* Dark Mode Logo */}
              <img
                src={settings?.branding?.logoDark || "/growbrandi-logo.png"}
                alt="GrowBrandi Logo"
                loading="lazy"
                width="128"
                height="32"
                className="w-32 h-8 lg:w-48 lg:h-12 object-contain hidden dark:block"
              />
            </Link>
            <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed max-w-sm font-light">
              {getFooterText('tagline_desc')}
            </p>

            <div className="flex flex-col items-start gap-2 mt-2">
              <div className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => <FaStar key={i} className="w-3.5 h-3.5" />)}
                </div>
                <span className="text-slate-500 dark:text-zinc-400 text-xs font-semibold">{getFooterText('rated_clients')}</span>
              </div>
              <img src="/logos/trustpilot--logo.png" alt="Trustpilot" className="h-7 w-auto object-contain opacity-100" />
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {settings?.social && Array.isArray(settings.social) && settings.social.map((link: any) => {
                if (!link.url || !link.enabled) return null;

                // Icon Component Helper
                const getIcon = (iconName: string) => {
                  switch (iconName) {
                    case 'FaLinkedin': return <FaLinkedin className="w-4 h-4" />;
                    case 'FaTiktok': return <FaTiktok className="w-4 h-4" />;
                    case 'FaInstagram': return <FaInstagram className="w-4 h-4" />;
                    case 'FaBuilding': return <FaBuilding className="w-4 h-4" />;
                    case 'FaWhatsapp': return <FaWhatsapp className="w-4 h-4" />;
                    case 'FaGithub': return <FaGithub className="w-4 h-4" />;
                    case 'FaTwitter': return <FaTwitter className="w-4 h-4" />;
                    case 'FaYoutube': return <FaYoutube className="w-4 h-4" />;
                    case 'FaFacebook': return <FaFacebook className="w-4 h-4" />;
                    case 'SiTrustpilot': return <SiTrustpilot className="w-3.5 h-3.5" />;
                    case 'FaGlobe': return <FaGlobe className="w-4 h-4" />;
                    default: return <FaGlobe className="w-4 h-4" />;
                  }
                };

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300"
                    aria-label={link.platform}
                  >
                    <span className="sr-only">{link.platform}</span>
                    {getIcon(link.icon)}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Services - Spans 1 col on mobile/tablet, 3 cols on desktop */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 md:mb-6">{t('footer.services')}</h3>
            <ul className="space-y-2 md:space-y-3">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    to={getLocalizedPath(`/services`)}
                    className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white text-sm transition-colors duration-200 block font-light"
                  >
                    {getLocalizedField(service.title, i18n.language) || 'Service'}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company - Spans 1 col on mobile/tablet, 2 cols on desktop */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 md:mb-6">{t('footer.company')}</h3>
            <ul className="space-y-2 md:space-y-3">
              {[
                { name: t('footer.menu.about'), path: '/about' },
                { name: t('footer.menu.process'), path: '/process' },
                { name: t('footer.menu.work'), path: '/case-studies' },
                { name: t('footer.menu.team'), path: '/team' },
                { name: t('footer.menu.blog'), path: '/blog' },
                { name: t('footer.menu.careers'), path: '/careers' },
                { name: t('footer.menu.contact'), path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={getLocalizedPath(link.path)}
                    className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white text-sm transition-colors duration-200 block font-light"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Spans full width on mobile, 3 cols on desktop */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 md:mb-6">{t('footer.contact')}</h3>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-3 text-slate-600 dark:text-zinc-400 text-sm font-light">
                <FaMapMarkerAlt className="w-4 h-4 text-slate-900 dark:text-white mt-0.5 shrink-0" />
                <span>{settings?.contact?.address || 'San Francisco, CA'}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-zinc-400 text-sm font-light">
                <FaEnvelope className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                <a href={`mailto:${settings?.contact?.email || 'contact@growbrandi.com'}`} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {settings?.contact?.email || 'contact@growbrandi.com'}
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-zinc-400 text-sm font-light">
                <FaPhone className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                <a href={`tel:${settings?.contact?.phone || '+15551234567'}`} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {settings?.contact?.phone || '+1 (555) 123-4567'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-white/5 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-slate-500 dark:text-zinc-500 text-sm">
            {t('footer.copyright', { year: currentYear })}
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-slate-500 dark:text-zinc-400 font-light">
            <Link to={getLocalizedPath("/legal/privacy-policy")} className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('footer.privacy')}</Link>
            <Link to={getLocalizedPath("/legal/terms-of-service")} className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('footer.terms')}</Link>
            <Link to="/sitemap.xml" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('footer.sitemap')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;