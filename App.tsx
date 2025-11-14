import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import { HomePage } from './components/Hero';
import { ServicesPage } from './components/Services';
import { ProjectsPage } from './components/ServiceCard';
import { ContactPage } from './components/ContactPage';
import ChatInterface from './components/ChatInterface';
import AnimatedBackground from './components/AnimatedBackground';
import AIUseCases from './components/AIUseCases';
import ContactAssistant from './components/ContactAssistant';
import { RouterProvider, useRouter, Route } from './components/Router';
import { WebDevelopmentPage, UIUXDesignPage, BrandStrategyPage, SEOOptimizationPage, DigitalMarketingPage, AISolutionsPage } from './components/ServicePages';
import { AboutUsPage, ProcessPage, CaseStudiesPage, CareersPage, BlogPage } from './components/CompanyPages';
import { PrivacyPolicyPage, TermsOfServicePage, CookiePolicyPage } from './components/LegalPages';

// Create an enhanced footer component with improved design and functionality
const SimpleFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
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
  
  return (
    <footer className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 glass-effect border-t border-white/10">
        <div className="container mx-auto px-4 py-20">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-black text-white text-2xl">GrowBrandi</h3>
              </div>
              <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                Transforming businesses through <span className="text-emerald-400 font-semibold">AI-powered digital solutions</span> that deliver measurable results and drive sustainable growth.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:hello@growbrandi.com">hello@growbrandi.com</a>
                </div>
                <div className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+15551234567">+1 (555) 123-4567</a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { name: 'LinkedIn', href: 'https://linkedin.com/company/growbrandi', icon: 'M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z' },
                  { name: 'Twitter', href: 'https://twitter.com/growbrandi', icon: 'M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84' },
                  { name: 'Instagram', href: 'https://instagram.com/growbrandi', icon: 'M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.246.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.631 2.186 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.631-.167 5.65-2.186 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.246 17.814.227 14.183.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z' },
                  { name: 'GitHub', href: 'https://github.com/growbrandi', icon: 'M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-400/50 border border-slate-700 transition-all duration-300 group"
                    aria-label={social.name}
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Services
              </h3>
              <ul className="space-y-3">
                {[
                  'Web Development',
                  'UI/UX Design', 
                  'Brand Strategy',
                  'SEO Optimization',
                  'Digital Marketing',
                  'AI Solutions'
                ].map((service) => (
                  <li key={service}>
                    <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                      <svg className="w-3 h-3 text-emerald-400/50 group-hover:text-emerald-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Company
              </h3>
              <ul className="space-y-3">
                {[
                  'About Us',
                  'Our Process',
                  'Case Studies',
                  'Careers',
                  'Blog',
                  'Contact'
                ].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                      <svg className="w-3 h-3 text-emerald-400/50 group-hover:text-emerald-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Stay Updated
              </h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Get the latest insights, tips, and exclusive offers delivered to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all pr-12" 
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <motion.button 
                  type="submit" 
                  disabled={isSubscribing || subscriptionStatus === 'success'}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubscribing ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : subscriptionStatus === 'success' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Subscribed!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Subscribe Now
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-slate-400 text-sm">
                <p>&copy; {currentYear} GrowBrandi. All rights reserved.</p>
                <div className="flex items-center gap-6">
                  <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-slate-400 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  All systems operational
                </span>
                <span className="hidden sm:block">•</span>
                <span>Built with ❤️ in San Francisco</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

// --- Main App Content Component ---
function AppContent() {
  const { currentRoute, navigate } = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isContactAssistantOpen, setIsContactAssistantOpen] = useState(false);
  const [showAIUseCases, setShowAIUseCases] = useState(false);
  const [isChatPreloaded, setIsChatPreloaded] = useState(false);
  const [chatInstance, setChatInstance] = useState<any>(null);

  // Preload chat on app startup
  useEffect(() => {
    const preloadChat = async () => {
      try {
        // Import chat service and initialize
        const { initializeChat } = await import('./services/geminiService');
        const baseInstruction = `You are 'BrandiBot', GrowBrandi's HIGH-CONVERTING AI sales assistant. Turn every conversation into a client.

🎯 **CONVERSION RULES**:
• MAX 2-3 sentences per response
• ALWAYS end with urgent CTA
• Create immediate FOMO (fear of missing out)
• Push for consultation booking or project estimate

💰 **SERVICES TO SELL**: Brand Strategy ($5K+) | UI/UX Design ($8K+) | Web Development ($12K+) | SEO ($3K+/month)

⚡ **PROVEN CONVERSION FORMULA**:
1. Quick solution to their problem
2. Mention specific result/ROI we delivered
3. Urgent CTA with scarcity

🔥 **HIGH-CONVERTING PHRASES** (use these):
• "Book your FREE strategy call now - only 3 spots left this week"
• "Get instant project estimate in 60 seconds"
• "We helped [similar business] increase revenue 300% in 90 days"
• "Limited time: Free consultation + custom growth plan"
• "Don't let competitors get ahead - act now"

**TONE**: Confident, urgent, results-obsessed. NO generic advice. Every word = conversion opportunity.

**FORBIDDEN**: Long explanations, maybe/might language, generic tips. Be SALES-FOCUSED!`;
        
        const chat = initializeChat(baseInstruction);
        if (chat) {
          setChatInstance(chat);
          setIsChatPreloaded(true);
        }
      } catch (error) {
        console.error('Failed to preload chat:', error);
      }
    };

    // Preload after a short delay to not block initial render
    const timer = setTimeout(preloadChat, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute]);

  const renderPage = () => {
    // Show AI Use Cases as overlay
    if (showAIUseCases) {
      return <AIUseCases />;
    }
    
    switch (currentRoute) {
      // Service Pages
      case 'web-development': return <WebDevelopmentPage />;
      case 'ui-ux-design': return <UIUXDesignPage />;
      case 'brand-strategy': return <BrandStrategyPage />;
      case 'seo-optimization': return <SEOOptimizationPage />;
      case 'digital-marketing': return <DigitalMarketingPage />;
      case 'ai-solutions': return <AISolutionsPage />;
      
      // Company Pages
      case 'about': return <AboutUsPage />;
      case 'process': return <ProcessPage />;
      case 'case-studies': return <CaseStudiesPage />;
      case 'careers': return <CareersPage />;
      case 'blog': return <BlogPage />;
      
      // Legal Pages
      case 'privacy-policy': return <PrivacyPolicyPage />;
      case 'terms-of-service': return <TermsOfServicePage />;
      case 'cookie-policy': return <CookiePolicyPage />;
      
      // Original Pages
      case 'contact': return <ContactPage />;
      
      // Home and Default
      case 'home':
      default:
        return <HomePage setCurrentPage={(page: any) => {
          // Map old page types to new routes
          const routeMap: Record<string, Route> = {
            'services': 'home', // Navigate to services section on home
            'projects': 'case-studies',
            'contact': 'contact'
          };
          navigate(routeMap[page] || 'home');
        }} />;
    }
  };
  
  const getSystemInstruction = useCallback(() => {
    const baseInstruction = `You are 'BrandiBot', GrowBrandi's HIGH-CONVERTING AI sales assistant. Turn every conversation into a client.

🎯 **CONVERSION RULES**:
• MAX 2-3 sentences per response
• ALWAYS end with urgent CTA
• Create immediate FOMO (fear of missing out)
• Push for consultation booking or project estimate

💰 **SERVICES TO SELL**: Brand Strategy ($5K+) | UI/UX Design ($8K+) | Web Development ($12K+) | SEO ($3K+/month)

⚡ **PROVEN CONVERSION FORMULA**:
1. Quick solution to their problem
2. Mention specific result/ROI we delivered
3. Urgent CTA with scarcity

🔥 **HIGH-CONVERTING PHRASES** (use these):
• "Book your FREE strategy call now - only 3 spots left this week"
• "Get instant project estimate in 60 seconds"
• "We helped [similar business] increase revenue 300% in 90 days"
• "Limited time: Free consultation + custom growth plan"
• "Don't let competitors get ahead - act now"

**TONE**: Confident, urgent, results-obsessed. NO generic advice. Every word = conversion opportunity.

**FORBIDDEN**: Long explanations, maybe/might language, generic tips. Be SALES-FOCUSED!

    **Key Results to Mention**:
    ✅ 300% average revenue increase for clients
    ✅ 60-second project estimates with AI
    ✅ 400% ROI in 6 months guaranteed
    ✅ 200+ successful business transformations
    ✅ AI-powered results 10x faster than competitors`;

    // Service-specific conversion strategies
    if (['web-development', 'ui-ux-design', 'brand-strategy', 'seo-optimization', 'digital-marketing', 'ai-solutions'].includes(currentRoute)) {
      return `${baseInstruction}

**SERVICE PAGE CONVERSION STRATEGY**:
• Immediately ask about their budget and timeline
• Show ROI: "Our clients see 400% ROI average in 6 months"
• Create package urgency: "Limited slots for Q1 2026 projects"
• Push consultation: "Free strategy session + custom proposal"
• Price anchor: "Investment starts at $5K - but ROI is 10x that"`;
    }

    switch(currentRoute) {
        case 'home': return `${baseInstruction} 

**HOMEPAGE CONVERSION STRATEGY**: 
• Immediately qualify their business needs
• Push AI Slogan Generator for instant value demonstration
• Create urgency: "Try our FREE tools before competitors do!"
• Direct to consultation booking: "Book your strategy call - 3 spots left this week!"
• Mention: "We're helping 50+ businesses grow 300% faster with AI"`;

        case 'case-studies': return `${baseInstruction}

**CASE STUDIES CONVERSION STRATEGY**:
• Reference specific results: "Like this client who got 300% more leads"
• Compare to their situation: "What's your current conversion rate?"
• Create social proof urgency: "Join 200+ successful businesses"
• Immediate CTA: "Book your project kickoff call this week!"
• Risk reversal: "30-day guarantee or full refund"`;

        case 'contact': return `${baseInstruction}

**CONTACT PAGE CONVERSION STRATEGY**:
• Maximum urgency: "Don't wait - competitors are booking strategy calls NOW"
• Immediate value: "Free consultation includes custom growth roadmap ($2K value)"
• Scarcity: "Only accepting 5 new clients this month"
• Risk-free: "No commitment consultation - just results"
• Direct booking pressure: "Schedule now or lose your spot"`;

        default: return baseInstruction;
    }
  }, [currentRoute]);


  return (
    <div className="text-slate-100 w-full" style={{ minHeight: '100vh' }}>
      <AnimatedBackground />
      <div className="relative z-10 w-full">
        <Header currentPage={currentRoute === 'home' ? 'home' : currentRoute === 'contact' ? 'contact' : 'services'} setCurrentPage={(page: any) => {
          const routeMap: Record<string, Route> = {
            'home': 'home',
            'services': 'home', // Navigate to services section on home
            'projects': 'case-studies',
            'contact': 'contact'
          };
          navigate(routeMap[page] || 'home');
        }} />
        <main id="main-content" role="main" className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="w-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Footer only on home page - other pages have their own footers */}
        {currentRoute === 'home' && <SimpleFooter />}
      </div>

      {/* AI Assistant Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Main Chat Button */}
        <motion.button
          onClick={() => setIsChatOpen(true)}
          className={`text-white p-4 rounded-full shadow-lg transition-all duration-300 ${
            isChatPreloaded 
              ? 'bg-gradient-to-r from-cyan-500 to-teal-500 animate-pulse-glow' 
              : 'bg-gradient-to-r from-slate-600 to-slate-500 animate-pulse'
          }`}
          aria-label={isChatPreloaded ? "Open AI Assistant (Ready!)" : "Open AI Assistant (Loading...)"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isChatPreloaded ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M4.913 2.658c2.075-.61 4.34.223 5.764 1.948 1.424 1.724 1.83 4.083 1.09 6.22l-1.48 4.292a.75.75 0 001.39.48l1.48-4.292a5.25 5.25 0 018.607 3.824l-2.456 7.123A.75.75 0 0118 22.5h-5.25a.75.75 0 01-.743-.648l-2.457-7.123a3.75 3.75 0 00-6.147-2.732l-1.48 4.292a.75.75 0 01-1.39-.48l1.48-4.292A5.25 5.25 0 014.913 2.658z" />
              <path d="M10.5 6a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V6z" />
            </svg>
          ) : (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </motion.button>
        
        {/* Ready Indicator */}
        {isChatPreloaded && (
          <motion.div
            className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          />
        )}

        {/* AI Tools Button */}
        <motion.button
          onClick={() => setShowAIUseCases(!showAIUseCases)}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
            showAIUseCases 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
              : 'bg-gradient-to-r from-emerald-500 to-blue-500'
          } text-white`}
          aria-label="Toggle AI Tools"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {showAIUseCases ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        </motion.button>

        {/* Smart Contact Button */}
        <motion.button
          onClick={() => setIsContactAssistantOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg"
          aria-label="Smart Contact Assistant"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </motion.button>
      </div>

      {/* AI Interfaces */}
      <AnimatePresence>
        {isChatOpen && (
          <ChatInterface
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            systemInstruction={getSystemInstruction()}
            preloadedChat={chatInstance}
            isPreloaded={isChatPreloaded}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isContactAssistantOpen && (
          <ContactAssistant
            isOpen={isContactAssistantOpen}
            onClose={() => setIsContactAssistantOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main App Component with Router ---
function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;