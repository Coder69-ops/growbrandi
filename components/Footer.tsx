import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaInstagram, FaDribbble, FaMapMarkerAlt, FaEnvelope, FaPhone, FaWhatsapp, FaStar } from 'react-icons/fa';
import { APP_NAME, APP_TAGLINE, CONTACT_INFO, SERVICES } from '../constants';

// --- Enhanced Footer Component ---
const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
      case 'twitter': return <FaTwitter className="w-4 h-4" />;
      case 'instagram': return <FaInstagram className="w-4 h-4" />;
      case 'dribbble': return <FaDribbble className="w-4 h-4" />;
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
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/growbrandi-logo.png"
                alt="GrowBrandi Logo"
                loading="lazy"
                width="128"
                height="32"
                className="w-32 h-8 lg:w-48 lg:h-12 object-contain"
              />
            </Link>
            <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed max-w-sm font-light">
              {APP_TAGLINE}. We combine data-driven insights with creative excellence to deliver measurable results.
            </p>

            <div className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(i => <FaStar key={i} className="w-4 h-4" />)}
              </div>
              <span className="text-slate-500 dark:text-zinc-400 ml-2">Rated 5/5 by 50+ Clients</span>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {Object.entries(CONTACT_INFO.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300"
                  aria-label={platform}
                >
                  <span className="sr-only">{platform}</span>
                  {getSocialIcon(platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Services - Spans 1 col on mobile/tablet, 3 cols on desktop */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 md:mb-6">Services</h3>
            <ul className="space-y-2 md:space-y-3">
              {SERVICES.slice(0, 6).map((service) => (
                <li key={service.title}>
                  <Link
                    to={`/services`}
                    className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white text-sm transition-colors duration-200 block font-light"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company - Spans 1 col on mobile/tablet, 2 cols on desktop */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 md:mb-6">Company</h3>
            <ul className="space-y-2 md:space-y-3">
              {[
                { name: 'About', path: '/about' },
                { name: 'Process', path: '/process' },
                { name: 'Work', path: '/case-studies' },
                { name: 'Team', path: '/team' },
                { name: 'Blog', path: '/blog' },
                { name: 'Careers', path: '/careers' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
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
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 md:mb-6">Contact</h3>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-3 text-slate-600 dark:text-zinc-400 text-sm font-light">
                <FaMapMarkerAlt className="w-4 h-4 text-slate-900 dark:text-white mt-0.5 shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-zinc-400 text-sm font-light">
                <FaEnvelope className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-zinc-400 text-sm font-light">
                <FaPhone className="w-4 h-4 text-slate-900 dark:text-white shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-white/5 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-slate-500 dark:text-cyan-600 text-sm">
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-slate-500 dark:text-zinc-400 font-light">
            <Link to="/legal/privacy-policy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link to="/legal/terms-of-service" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link to="/sitemap" className="hover:text-slate-900 dark:hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;