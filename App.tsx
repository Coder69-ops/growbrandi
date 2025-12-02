import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import SEO from './components/SEO';
import PageLoader from './components/PageLoader';
import FloatingActionButtons from './components/FloatingActionButtons';
import Footer from './components/Footer';
import { routeConfig, getRouteMetadata, getRouteFromPath } from './utils/routeConfig';
import { SERVICES } from './constants';

// Lazy load components
import { HomePage } from './components/Hero';
const ServicesPage = React.lazy(() => import('./components/Services').then(module => ({ default: module.ServicesPage })));
const PortfolioPage = React.lazy(() => import('./components/Portfolio').then(module => ({ default: module.PortfolioPage })));
const ContactPage = React.lazy(() => import('./components/ContactPage').then(module => ({ default: module.ContactPage })));
const ChatInterface = React.lazy(() => import('./components/ChatInterface'));
const AnimatedBackground = React.lazy(() => import('./components/AnimatedBackground'));

const ContactAssistant = React.lazy(() => import('./components/ContactAssistant'));
const TeamMemberProfile = React.lazy(() => import('./components/TeamMemberProfile'));
const NotFoundPage = React.lazy(() => import('./components/NotFoundPage'));

// Service Pages
// Service Pages
const BrandGrowthPage = React.lazy(() => import('./components/ServicePages').then(module => ({ default: module.BrandGrowthPage })));
const SocialMediaContentPage = React.lazy(() => import('./components/ServicePages').then(module => ({ default: module.SocialMediaContentPage })));
const UIUXDesignPage = React.lazy(() => import('./components/ServicePages').then(module => ({ default: module.UIUXDesignPage })));
const WebDevelopmentPage = React.lazy(() => import('./components/ServicePages').then(module => ({ default: module.WebDevelopmentPage })));
const VirtualAssistancePage = React.lazy(() => import('./components/ServicePages').then(module => ({ default: module.VirtualAssistancePage })));
const CustomerSupportPage = React.lazy(() => import('./components/ServicePages').then(module => ({ default: module.CustomerSupportPage })));

// Company Pages
const AboutUsPage = React.lazy(() => import('./components/CompanyPages').then(module => ({ default: module.AboutUsPage })));
const ProcessPage = React.lazy(() => import('./components/CompanyPages').then(module => ({ default: module.ProcessPage })));
const CaseStudiesPage = React.lazy(() => import('./components/CompanyPages').then(module => ({ default: module.CaseStudiesPage })));
const TeamPage = React.lazy(() => import('./components/CompanyPages').then(module => ({ default: module.TeamPage })));
const CareersPage = React.lazy(() => import('./components/CompanyPages').then(module => ({ default: module.CareersPage })));
const BlogPage = React.lazy(() => import('./components/CompanyPages').then(module => ({ default: module.BlogPage })));

// Legal Pages
const PrivacyPolicyPage = React.lazy(() => import('./components/LegalPages').then(module => ({ default: module.PrivacyPolicyPage })));
const TermsOfServicePage = React.lazy(() => import('./components/LegalPages').then(module => ({ default: module.TermsOfServicePage })));
const CookiePolicyPage = React.lazy(() => import('./components/LegalPages').then(module => ({ default: module.CookiePolicyPage })));

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
  const metadata = getRouteMetadata(currentRoute, currentPath);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isContactAssistantOpen, setIsContactAssistantOpen] = useState(false);

  const [isChatPreloaded, setIsChatPreloaded] = useState(false);
  const [chatInstance, setChatInstance] = useState<any>(null);

  const breadcrumbs = routeConfig[currentRoute]?.breadcrumb || ['Home'];

  // Preload chat on app startup
  useEffect(() => {
    const preloadChat = async () => {
      try {
        // Import chat service and initialize
        const { initializeChat } = await import('./services/geminiService');
        const servicesList = SERVICES.map(s => `• ${s.title}: ${s.price}`).join('\n');
        const baseInstruction = `You are 'BrandiBot', GrowBrandi's helpful AI assistant. Your goal is to help users understand our services and guide them towards working with us.

🎯 **YOUR ROLE**:
• Be helpful, friendly, and professional.
• Answer questions clearly and concisely (max 2-3 sentences).
• Guide users to the right pages using links.
• Encourage them to book a consultation or get a quote.

💰 **OUR SERVICES**:
${servicesList}

🔗 **NAVIGATION LINKS** (Use these in your responses):
• [Home](/)
• [Services](/services)
• [Portfolio](/portfolio)
• [Contact](/contact)
• [About Us](/about)
• [Team](/team)
• [Blog](/blog)

✨ **GUIDELINES**:
• If they ask about a specific service, explain it briefly and link to it (e.g., "Check out our [Brand Growth](/services/brand-growth) service").
• If they seem interested, suggest booking a [free consultation](/contact).
• Use markdown for links: [Link Text](URL).

**TONE**: Professional, knowledgeable, and inviting. Avoid being overly aggressive.`;

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
    const servicesDetails = SERVICES.map(s =>
      `• ${s.title} (${s.price}): ${s.description}`
    ).join('\n');

    const baseInstruction = `You are 'GrowBrandi AI', a helpful and knowledgeable business growth assistant.

🎯 **YOUR MISSION**:
• Help users find the right digital solutions for their business.
• Provide clear, concise answers (max 2-3 sentences).
• Use links to guide users to relevant pages.
• Gently encourage conversion (booking a call or requesting a quote).

💰 **GROWBRANDI SERVICES**: 
${servicesDetails}

🔗 **USEFUL LINKS**:
• [Home](/)
• [Services](/services)
• [Portfolio](/portfolio)
• [Contact](/contact)
• [About Us](/about)
• [Team](/team)
• [Blog](/blog)
• [Brand Growth](/services/brand-growth)
• [Social Media Content](/services/social-media-content)
• [UI/UX Design](/services/ui-ux-design)
• [Web Development](/services/web-development)
• [Virtual Assistance](/services/virtual-assistance)
• [Customer Support](/services/customer-support)

🧠 **SMART SUGGESTIONS**:
• Need more traffic? Suggest [Brand Growth](/services/brand-growth) or [SEO](/services/brand-growth).
• Need a new website? Suggest [Web Development](/services/web-development).
• Overwhelmed? Suggest [Virtual Assistance](/services/virtual-assistance).
• Need design? Suggest [UI/UX Design](/services/ui-ux-design).

✨ **RESPONSE STYLE**:
• Use markdown links: [Link Text](URL).
• Be encouraging and positive.
• Focus on value and solutions.

**EXAMPLE**:
"We can definitely help with that! Our [Web Development](/services/web-development) team builds high-converting sites. You can see some examples in our [Portfolio](/portfolio)."`;

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
      <Suspense fallback={<PageLoader />}>
        <AnimatedBackground />
      </Suspense>

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
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* Home */}
                <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />

                {/* Services */}
                <Route path="/services/brand-growth" element={<PageWrapper><BrandGrowthPage /></PageWrapper>} />
                <Route path="/services/social-media-content" element={<PageWrapper><SocialMediaContentPage /></PageWrapper>} />
                <Route path="/services/ui-ux-design" element={<PageWrapper><UIUXDesignPage /></PageWrapper>} />
                <Route path="/services/web-development" element={<PageWrapper><WebDevelopmentPage /></PageWrapper>} />
                <Route path="/services/virtual-assistance" element={<PageWrapper><VirtualAssistancePage /></PageWrapper>} />
                <Route path="/services/customer-support" element={<PageWrapper><CustomerSupportPage /></PageWrapper>} />

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
          </Suspense>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Enhanced Floating Action Buttons */}
      <FloatingActionButtons
        onChatOpen={() => setIsChatOpen(true)}
        onContactOpen={() => setIsContactAssistantOpen(true)}
        isChatPreloaded={isChatPreloaded}
      />

      {/* AI Interfaces */}
      <AnimatePresence>
        {isChatOpen && (
          <Suspense fallback={null}>
            <ChatInterface
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              systemInstruction={getSystemInstruction()}
              preloadedChat={chatInstance}
              isPreloaded={isChatPreloaded}
            />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isContactAssistantOpen && (
          <Suspense fallback={null}>
            <ContactAssistant
              isOpen={isContactAssistantOpen}
              onClose={() => setIsContactAssistantOpen(false)}
            />
          </Suspense>
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