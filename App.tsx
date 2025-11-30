import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import SEO from './components/SEO';
import { HomePage } from './components/Hero';
import { ServicesPage } from './components/Services';
import { PortfolioPage } from './components/Portfolio';
import { ContactPage } from './components/ContactPage';
import ChatInterface from './components/ChatInterface';
import AnimatedBackground from './components/AnimatedBackground';
import AIUseCases from './components/AIUseCases';
import ContactAssistant from './components/ContactAssistant';
import { WebDevelopmentPage, UIUXDesignPage, BrandStrategyPage, SEOOptimizationPage, DigitalMarketingPage, AISolutionsPage } from './components/ServicePages';
import { AboutUsPage, ProcessPage, CaseStudiesPage, TeamPage, CareersPage, BlogPage } from './components/CompanyPages';
import TeamMemberProfile from './components/TeamMemberProfile';
import { PrivacyPolicyPage, TermsOfServicePage, CookiePolicyPage } from './components/LegalPages';
import Footer from './components/Footer';
import NotFoundPage from './components/NotFoundPage';
import { routeConfig, getRouteMetadata, getRouteFromPath, Route as AppRoute } from './utils/routeConfig';

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

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="w-full"
  >
    {children}
  </motion.div>
);

// --- Main App Content Component ---
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const currentRoute = getRouteFromPath(currentPath);
  const metadata = getRouteMetadata(currentRoute);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isContactAssistantOpen, setIsContactAssistantOpen] = useState(false);
  const [showAIUseCases, setShowAIUseCases] = useState(false);
  const [isChatPreloaded, setIsChatPreloaded] = useState(false);
  const [chatInstance, setChatInstance] = useState<any>(null);

  const breadcrumbs = routeConfig[currentRoute]?.breadcrumb || ['Home'];

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
  }, [currentPath]);

  const getSystemInstruction = useCallback(() => {
    const baseInstruction = `You are 'GrowBrandi AI', the elite business growth assistant that turns conversations into high-value clients.

🎯 **CONVERSION MISSION**:
• MAX 2 sentences per response (CRITICAL!)
• ALWAYS end with compelling action command
• Create instant urgency and FOMO
• Focus on booking consultations or project estimates

💰 **GROWBRANDI PREMIUM SERVICES**: 
Brand Strategy ($5K-15K) | UI/UX Design ($8K-25K) | Web Development ($12K-50K) | SEO ($3K-10K/month) | Business Intelligence ($2K-8K)

⚡ **GROWBRANDI CONVERSION FORMULA**:
1. Identify their pain point instantly
2. Share specific GrowBrandi client result
3. Urgent CTA with time-sensitive offer

🚀 **POWER PHRASES** (use frequently):
• "GrowBrandi helped [industry] client achieve 300% revenue growth in 90 days"
• "Book FREE GrowBrandi strategy session - only 2 spots left this week"
• "Get your custom GrowBrandi growth plan in 60 seconds"
• "Limited time: FREE consultation + personalized business intelligence report"
• "Don't let competitors win - GrowBrandi clients dominate their markets"

**GROWBRANDI IDENTITY**: We're THE premium growth agency. Elite expertise, guaranteed results, cutting-edge intelligence.

**BANNED WORDS**: maybe, might, try, consider, think about. Use: WILL, GUARANTEE, PROVEN, RESULTS.

    **GROWBRANDI SUCCESS METRICS**:
    ✅ 300% average revenue boost for clients
    ✅ 90-day business transformation guarantee  
    ✅ 500% ROI within 6 months (proven track record)
    ✅ 300+ successful business transformations
    ✅ GrowBrandi intelligence = 10x faster results than competitors`;

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

    switch (currentRoute) {
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
      <SEO
        title={metadata.title}
        description={metadata.description || ''}
        keywords={metadata.keywords}
        canonicalUrl={`https://growbrandi.com${metadata.path}`}
      />
      <AnimatedBackground />
      <div className="relative z-10 w-full">
        <Header />

        {/* Breadcrumb Navigation */}
        {breadcrumbs.length > 1 && currentRoute !== 'home' && (
          <nav className="bg-luxury-black/80 backdrop-blur-md border-b border-white/5 py-3 px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="container mx-auto">
              <ol className="flex items-center space-x-2 text-sm font-sans">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <svg className="w-4 h-4 text-zinc-600 mx-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={index === breadcrumbs.length - 1 ? 'text-white font-medium' : 'text-zinc-500 hover:text-white cursor-pointer transition-colors duration-300'}>
                      {crumb}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}

        <main id="main-content" role="main" className="w-full">
          {showAIUseCases ? (
            <AIUseCases />
          ) : (
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* Home */}
                <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />

                {/* Services */}
                <Route path="/services/web-development" element={<PageWrapper><WebDevelopmentPage /></PageWrapper>} />
                <Route path="/services/ui-ux-design" element={<PageWrapper><UIUXDesignPage /></PageWrapper>} />
                <Route path="/services/brand-strategy" element={<PageWrapper><BrandStrategyPage /></PageWrapper>} />
                <Route path="/services/seo-optimization" element={<PageWrapper><SEOOptimizationPage /></PageWrapper>} />
                <Route path="/services/digital-marketing" element={<PageWrapper><DigitalMarketingPage /></PageWrapper>} />
                <Route path="/services/ai-solutions" element={<PageWrapper><AISolutionsPage /></PageWrapper>} />

                {/* Company */}
                <Route path="/about" element={<PageWrapper><AboutUsPage /></PageWrapper>} />
                <Route path="/process" element={<PageWrapper><ProcessPage /></PageWrapper>} />
                <Route path="/case-studies" element={<PageWrapper><CaseStudiesPage /></PageWrapper>} />
                <Route path="/team" element={<PageWrapper><TeamPage /></PageWrapper>} />
                <Route path="/team/:slug" element={<PageWrapper><TeamMemberProfile /></PageWrapper>} />
                <Route path="/careers" element={<PageWrapper><CareersPage /></PageWrapper>} />
                <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />

                {/* Legal */}
                <Route path="/legal/privacy-policy" element={<PageWrapper><PrivacyPolicyPage /></PageWrapper>} />
                <Route path="/legal/terms-of-service" element={<PageWrapper><TermsOfServicePage /></PageWrapper>} />
                <Route path="/legal/cookie-policy" element={<PageWrapper><CookiePolicyPage /></PageWrapper>} />

                {/* Contact */}
                <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />

                {/* Legacy/Redirects/Other */}
                <Route path="/services" element={<PageWrapper><ServicesPage /></PageWrapper>} />
                <Route path="/portfolio" element={<PageWrapper><PortfolioPage /></PageWrapper>} />

                {/* 404 */}
                <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
              </Routes>
            </AnimatePresence>
          )}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* AI Assistant Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Main Chat Button */}
        <motion.button
          onClick={() => setIsChatOpen(true)}
          className={`text-white p-4 rounded-full shadow-lg transition-all duration-300 ${isChatPreloaded
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
          className={`p-4 rounded-full shadow-lg transition-all duration-300 ${showAIUseCases
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

// --- Main App Component with Enhanced Router ---
function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;