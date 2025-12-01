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
import FloatingActionButtons from './components/FloatingActionButtons';
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
    <>
      <SEO
        title={metadata.title}
        description={metadata.description || ''}
        keywords={metadata.keywords}
        canonicalUrl={`https://growbrandi.com${metadata.path}`}
      />
      <AnimatedBackground />

      <div className="text-slate-100 w-full relative z-10" style={{ minHeight: '100vh' }}>
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

      {/* Enhanced Floating Action Buttons */}
      <FloatingActionButtons
        onChatOpen={() => setIsChatOpen(true)}
        onContactOpen={() => setIsContactAssistantOpen(true)}
        onToggleAI={() => setShowAIUseCases(!showAIUseCases)}
        showAIUseCases={showAIUseCases}
        isChatPreloaded={isChatPreloaded}
      />

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
    </>
  );
}

// --- Main App Component with Enhanced Router ---
function App() {
  return (
    <HelmetProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;