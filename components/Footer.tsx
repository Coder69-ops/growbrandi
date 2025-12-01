import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaInstagram, FaDribbble, FaMapMarkerAlt, FaEnvelope, FaPhone, FaRocket } from 'react-icons/fa';
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
      default: return null;
    }
  };

  return (
    <footer className="relative overflow-hidden bg-luxury-black pt-12 md:pt-20 pb-8 md:pb-10 border-t border-white/5">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand Section - Spans full width on mobile, 4 cols on desktop */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4 md:space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="https://ik.imagekit.io/nltb2bcz4/growbrandi.png"
                alt="GrowBrandi Logo"
                loading="lazy"
                width="150"
                height="50"
                className="w-auto h-12 object-contain"
              />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm font-light">
              {APP_TAGLINE}. We combine data-driven insights with creative excellence to deliver measurable results.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {Object.entries(CONTACT_INFO.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-all duration-300"
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
            <h3 className="font-semibold text-white mb-4 md:mb-6">Services</h3>
            <ul className="space-y-2 md:space-y-3">
              {SERVICES.slice(0, 5).map((service) => (
                <li key={service.title}>
                  <Link
                    to={`/services`}
                    className="text-zinc-400 hover:text-white text-sm transition-colors duration-200 block font-light"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company - Spans 1 col on mobile/tablet, 2 cols on desktop */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-white mb-4 md:mb-6">Company</h3>
            <ul className="space-y-2 md:space-y-3">
              {[
                { name: 'About', path: '/about' },
                { name: 'Process', path: '/process' },
                { name: 'Work', path: '/case-studies' },
                { name: 'Team', path: '/team' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-zinc-400 hover:text-white text-sm transition-colors duration-200 block font-light"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Spans full width on mobile, 3 cols on desktop */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="font-semibold text-white mb-4 md:mb-6">Contact</h3>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-3 text-zinc-400 text-sm font-light">
                <FaMapMarkerAlt className="w-4 h-4 text-white mt-0.5 shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm font-light">
                <FaEnvelope className="w-4 h-4 text-white shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm font-light">
                <FaPhone className="w-4 h-4 text-white shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-cyan-600 text-sm">
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-zinc-600 font-light">
            <Link to="/legal/privacy-policy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link to="/legal/terms-of-service" className="hover:text-zinc-400 transition-colors">Terms</Link>
            <Link to="/sitemap" className="hover:text-zinc-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;