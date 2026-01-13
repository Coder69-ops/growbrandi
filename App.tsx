import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import SEO from './components/SEO';
import PageLoader from './components/PageLoader';
import FloatingActionButtons from './components/FloatingActionButtons';
import GlobalOfferDisplay from './src/components/GlobalOfferDisplay';
import GlobalPromoEffects from './components/GlobalPromoEffects';
import Footer from './components/Footer';
import PromoSection from './components/PromoSection';
import { routeConfig, getRouteMetadata, getRouteFromPath } from './utils/routeConfig';
// import { CONTACT_INFO } from './constants'; // Removed
import { db } from './src/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ThemeProvider } from './components/ThemeContext';
import { SeoProvider, useSeo } from './src/context/SeoContext';
import { useSiteSettings } from './src/hooks/useSiteSettings';

import { lazyWithRetry } from './src/utils/lazyWithRetry';
// Lazy load components
import { HomePage } from './components/Hero';
import FreeGrowthCall from './components/FreeGrowthCall'; // Direct Import
import BookingSuccess from './src/pages/BookingSuccess';
const ServicesPage = lazyWithRetry(() => import('./components/Services').then(module => ({ default: module.ServicesPage })));
const PortfolioPage = lazyWithRetry(() => import('./components/Portfolio').then(module => ({ default: module.PortfolioPage })));
const ContactPage = lazyWithRetry(() => import('./components/ContactPage').then(module => ({ default: module.ContactPage })));
const ChatInterface = lazyWithRetry(() => import('./components/ChatInterface'));
const AnimatedBackground = React.lazy(() => import('./components/AnimatedBackground'));

const ContactAssistant = React.lazy(() => import('./components/ContactAssistant'));
const TeamMemberProfile = React.lazy(() => import('./components/TeamMemberProfile'));
const NotFoundPage = React.lazy(() => import('./components/NotFoundPage'));
const DynamicPage = React.lazy(() => import('./src/components/DynamicPage'));

// Service Pages
const BrandGrowthPage = React.lazy(() => import('./components/ServicePages').then(module => ({ default: module.BrandGrowthPage })));
const SocialMediaContentPage = React.lazy(() => import('./components/ServicePages').then(module => ({ default: module.SocialMediaContentPage })));
const UIUXDesignPage = React.lazy(() => import('./components/ServicePages').then(module => ({ default: module.UIUXDesignPage })));
const WebDevelopmentPage = React.lazy(() => import('./components/ServicePages').then(module => ({ default: module.WebDevelopmentPage })));
const VirtualAssistancePage = React.lazy(() => import('./components/ServicePages').then(module => ({ default: module.VirtualAssistancePage })));
const CustomerSupportPage = React.lazy(() => import('./components/ServicePages').then(module => ({ default: module.CustomerSupportPage })));
const DynamicServicePage = React.lazy(() => import('./components/DynamicServicePage'));

// Company Pages
const AboutUsPage = React.lazy(() => import('./components/CompanyPages').then(module => ({ default: module.AboutUsPage })));
const ProcessPage = React.lazy(() => import('./components/CompanyPages').then(module => ({ default: module.ProcessPage })));
const CaseStudiesPage = React.lazy(() => import('./components/CompanyPages').then(module => ({ default: module.CaseStudiesPage })));
const TeamPage = React.lazy(() => import('./components/CompanyPages').then(module => ({ default: module.TeamPage })));
const BlogPostPage = React.lazy(() => import('./components/BlogPostPage'));
const JobDetailsPage = React.lazy(() => import('./components/JobDetailsPage'));
const CareersPage = React.lazy(() => import('./components/CompanyPages').then(module => ({ default: module.CareersPage })));
const BlogPage = React.lazy(() => import('./components/CompanyPages').then(module => ({ default: module.BlogPage })));

// ... (existing code)

// ... (existing code)

// Legal Pages
const PrivacyPolicyPage = React.lazy(() => import('./components/LegalPages').then(module => ({ default: module.PrivacyPolicyPage })));
const TermsOfServicePage = React.lazy(() => import('./components/LegalPages').then(module => ({ default: module.TermsOfServicePage })));
const CookiePolicyPage = React.lazy(() => import('./components/LegalPages').then(module => ({ default: module.CookiePolicyPage })));

// Admin Imports
import { AuthProvider } from './src/context/AuthContext';
import ProtectedRoute from './src/components/admin/ProtectedRoute';
import AdminLogin from './src/pages/admin/Login';
import AdminLayout from './src/components/admin/AdminLayout';
import AdminDashboard from './src/pages/admin/Dashboard';
const AdminProjects = React.lazy(() => import('./src/pages/admin/Projects'));
const AdminTeam = React.lazy(() => import('./src/pages/admin/Team'));
const AdminTasks = React.lazy(() => import('./src/pages/admin/Tasks'));
const Timesheet = React.lazy(() => import('./src/pages/admin/Timesheet'));
const AdminAssets = React.lazy(() => import('./src/pages/admin/Assets'));
const AdminBlog = React.lazy(() => import('./src/pages/admin/Blog'));
import AdminServices from './src/pages/admin/Services';
import AdminTestimonials from './src/pages/admin/Testimonials';
import AdminFAQs from './src/pages/admin/FAQs';
import AdminSettings from './src/pages/admin/Settings';
import AdminSeedData from './src/pages/admin/SeedData';
import AdminSiteContent from './src/pages/admin/SiteContent';
import AdminContactSettings from './src/pages/admin/ContactSettings';
import AdminMessages from './src/pages/admin/Messages';
import AdminChat from './src/pages/admin/Chat';
import AdminTeamManagement from './src/pages/admin/TeamManagement';
import AdminJobs from './src/pages/admin/Jobs';
import AdminAuditLog from './src/pages/admin/AuditLog';
import AdminOnlineUsers from './src/pages/admin/OnlineUsers';
import AdminProfile from './src/pages/admin/Profile';
import AdminAIConfig from './src/pages/admin/AIConfig';
const AdminFreeGrowthCallConfig = React.lazy(() => import('./src/pages/admin/FreeGrowthCallConfig'));
import AdminSeoSettings from './src/pages/admin/SeoSettings';
import AdminPageList from './src/pages/admin/PageList';
import AdminPageBuilder from './src/pages/admin/PageBuilder';
const AdminPromotions = lazyWithRetry(() => import('./src/pages/admin/Promotions'));
import { LanguageWrapper } from './src/components/LanguageWrapper';
import { RootRedirect } from './src/components/RootRedirect';
import { useLocalizedPath } from './src/hooks/useLocalizedPath';
import { ToastProvider } from './src/context/ToastContext';
import { DeepLinkRedirect } from './src/components/DeepLinkRedirect';
import { GlobalDataProvider, useGlobalData } from './src/context/GlobalDataProvider';

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
  const { settings } = useSiteSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const currentRoute = getRouteFromPath(currentPath);
  // Removed static metadata call
  // const metadata = getRouteMetadata(currentRoute, currentPath);
  const { getLocalizedPath, currentLang } = useLocalizedPath();
  const { getSeoMetadata } = useSeo();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isContactAssistantOpen, setIsContactAssistantOpen] = useState(false);

  const [isChatPreloaded, setIsChatPreloaded] = useState(false);
  const [chatInstance, setChatInstance] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);

  const breadcrumbs = routeConfig[currentRoute]?.breadcrumb || ['Home'];
  const isAdminRoute = currentPath.startsWith('/admin');

  // Fetch dynamic SEO metadata based on current language
  const seoMetadata = getSeoMetadata(currentRoute, currentPath, currentLang);
  // Replaces the static call: const metadata = getRouteMetadata(currentRoute, currentPath);

  const { services, loading: globalLoading } = useGlobalData();

  // Use global services instead of local fetch
  useEffect(() => {
    if (services.length > 0) {
      setServicesData(services);
    }
  }, [services]);

  useEffect(() => {
    /* 
       Refactored: Service fetching moved to GlobalDataProvider.
       This effect now only handles loader removal.
    */

    // Remove simple loader once React apps starts mounting/handling content
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
      }, 500);
    }
  }, []);

  // Preload chat on app startup
  useEffect(() => {
    const preloadChat = async () => {
      try {
        // Import chat service and initialize
        const { initializeChat } = await import('./services/geminiService');

        const servicesList = servicesData.length > 0
          ? servicesData.map((s: any) => `• ${s.title?.en || s.title}: ${s.price?.en || s.price}`).join('\n')
          : "Services details available upon request.";

        const baseInstruction = `You are 'BrandiBot', GrowBrandi's helpful AI assistant. Your goal is to help users understand our services and guide them towards working with us.

🎯 **YOUR ROLE**:
• Be helpful, friendly, and professional.
• Answer questions clearly and concisely (max 2-3 sentences).
• Guide users to the right pages using links.
• If you don't know something, ask for their contact info so a human can help.

🧠 **KNOWLEDGE BASE**:

**Our Services**:
${servicesList}

**Contact Info**:
• Email: contact@growbrandi.com
• Phone: +1 (555) 123-4567
• Address: San Francisco, CA

**Key Pages**:
• [Services](${getLocalizedPath('/services')}) - List of all services
• [Portfolio](${getLocalizedPath('/portfolio')}) - Our past work
• [Contact](${getLocalizedPath('/contact')}) - Get in touch
• [About](${getLocalizedPath('/about')}) - Our story

GUIDELINES:
• Use markdown links: [Link Text](URL).
• Be encouraging and positive.
• Focus on value and solutions.

**EXAMPLE**:
"We can definitely help with that! Our [Web Development](${getLocalizedPath('/services/web-development')}) team builds high-converting sites. You can see some examples in our [Portfolio](${getLocalizedPath('/portfolio')})."

**SUGGESTIONS**: At the end of your response, provide 3 relevant follow-up questions for the user to ask. Format them as a JSON array inside <SUGGESTIONS> tags. Example: <SUGGESTIONS>["Question 1", "Question 2", "Question 3"]</SUGGESTIONS>`;

        const chat = initializeChat(baseInstruction);
        if (chat) {
          setChatInstance(chat);
          setIsChatPreloaded(true);
        }
      } catch (error) {
        console.error('Failed to preload chat:', error);
      }
    };

    if (servicesData.length > 0 || true) {
      const timer = setTimeout(preloadChat, 1000);
      return () => clearTimeout(timer);
    }
  }, [servicesData]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  const getSystemInstruction = useCallback(() => {
    const servicesDetails = servicesData.length > 0
      ? servicesData.map((s: any) => `• ${s.title?.en || s.title} (${s.price?.en || s.price}): ${s.description?.en || s.description}`).join('\n')
      : "";

    const baseInstruction = `You are 'GrowBrandi AI', a helpful and knowledgeable business growth assistant.

🎯 **YOUR MISSION**:
• Help users find the right digital solutions for their business.
• Provide clear, concise answers (max 2-3 sentences).
• Use links to guide users to relevant pages.
• Gently encourage conversion (booking a call or requesting a quote).

💰 **GROWBRANDI SERVICES**: 
${servicesDetails}

🔗 **USEFUL LINKS**:
• [Home](${getLocalizedPath('/')})
• [Services](${getLocalizedPath('/services')})
• [Portfolio](${getLocalizedPath('/portfolio')})
• [Contact](${getLocalizedPath('/contact')})
• [About Us](${getLocalizedPath('/about')})
• [Team](${getLocalizedPath('/team')})
• [Blog](${getLocalizedPath('/blog')})
• [Brand Growth](${getLocalizedPath('/services/brand-growth')})
• [Social Media Content](${getLocalizedPath('/services/social-media-content')})
• [UI/UX Design](${getLocalizedPath('/services/ui-ux-design')})
• [Web Development](${getLocalizedPath('/services/web-development')})
• [Virtual Assistance](${getLocalizedPath('/services/virtual-assistance')})
• [Customer Support](${getLocalizedPath('/services/customer-support')})

🧠 **SMART SUGGESTIONS**:
• Need more traffic? Suggest [Brand Growth](${getLocalizedPath('/services/brand-growth')}) or [SEO](${getLocalizedPath('/services/brand-growth')}).
• Need a new website? Suggest [Web Development](${getLocalizedPath('/services/web-development')}).
• Overwhelmed? Suggest [Virtual Assistance](${getLocalizedPath('/services/virtual-assistance')}).
• Need design? Suggest [UI/UX Design](${getLocalizedPath('/services/ui-ux-design')}).

✨ **RESPONSE STYLE**:
• Use markdown links: [Link Text](URL).
• Be encouraging and positive.
• Focus on value and solutions.

**EXAMPLE**:
"We can definitely help with that! Our [Web Development](${getLocalizedPath('/services/web-development')}) team builds high-converting sites. You can see some examples in our [Portfolio](${getLocalizedPath('/portfolio')})."

**SUGGESTIONS**: At the end of your response, provide 3 relevant follow-up questions for the user to ask. Format them as a JSON array inside <SUGGESTIONS> tags. Example: <SUGGESTIONS>["Question 1", "Question 2", "Question 3"]</SUGGESTIONS>`;

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


  const metadata = seoMetadata; // Aligning with the instruction's implied `metadata` object

  return (
    <>
      {!isAdminRoute && <GlobalOfferDisplay />}
      <GlobalPromoEffects />
      {!isAdminRoute && (
        <SEO
          title={metadata.title}
          description={metadata.description || ''}
          keywords={metadata.keywords}
          canonicalUrl={`https://growbrandi.com${currentPath}`} // Using currentPath as metadata.path is not available in SeoContext
          siteTitleSuffix={metadata.titleSuffix}
          noIndex={metadata.noIndex}
          ogImage={metadata.ogImage}
        />
      )}
      <Suspense fallback={<PageLoader />}>
        <AnimatedBackground />

      </Suspense>

      <div className="text-slate-100 w-full relative z-10" style={{ minHeight: '100vh' }}>
        {!isAdminRoute && <Header />}

        {/* Breadcrumb Navigation */}
        {breadcrumbs.length > 1 && currentRoute !== 'home' && !isAdminRoute && (
          <nav className="bg-white/80 dark:bg-luxury-black/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 py-3 px-4 sm:px-6 lg:px-8 relative z-20 transition-colors duration-300">
            <div className="container mx-auto">
              <ol className="flex items-center space-x-2 text-sm font-sans">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <svg className="w-4 h-4 text-slate-400 dark:text-zinc-600 mx-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={index === breadcrumbs.length - 1 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors duration-300'}>
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
              <Routes
                location={location}
              >
                {/* Root Redirect */}
                <Route path="/" element={<RootRedirect />} />

                {/* Localized Public Routes */}
                <Route path="/:lang" element={
                  <LanguageWrapper>
                    <PageWrapper>
                      <HomePage />
                      <PromoSection />
                    </PageWrapper>
                  </LanguageWrapper>
                } />
                <Route path="/free-growth-call" element={<PageWrapper><FreeGrowthCall /></PageWrapper>} />
                <Route path="/:lang/free-growth-call" element={<LanguageWrapper><PageWrapper><FreeGrowthCall /></PageWrapper></LanguageWrapper>} />
                <Route path="/booking-success" element={<PageWrapper><BookingSuccess /></PageWrapper>} />

                {/* Services */}
                <Route path="/:lang/services/brand-growth" element={<LanguageWrapper><PageWrapper><BrandGrowthPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/services/social-media-content" element={<LanguageWrapper><PageWrapper><SocialMediaContentPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/services/ui-ux-design" element={<LanguageWrapper><PageWrapper><UIUXDesignPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/services/web-development" element={<LanguageWrapper><PageWrapper><WebDevelopmentPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/services/virtual-assistance" element={<LanguageWrapper><PageWrapper><VirtualAssistancePage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/services/customer-support" element={<LanguageWrapper><PageWrapper><CustomerSupportPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/services/:serviceId" element={<LanguageWrapper><PageWrapper><DynamicServicePage /></PageWrapper></LanguageWrapper>} />

                {/* Company */}
                <Route path="/:lang/about" element={<LanguageWrapper><PageWrapper><AboutUsPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/process" element={<LanguageWrapper><PageWrapper><ProcessPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/case-studies" element={<LanguageWrapper><PageWrapper><CaseStudiesPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/team" element={<LanguageWrapper><PageWrapper><TeamPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/team/:slug" element={<LanguageWrapper><PageWrapper><TeamMemberProfile /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/careers" element={<LanguageWrapper><PageWrapper><CareersPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/careers/:id" element={<LanguageWrapper><PageWrapper><JobDetailsPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/blog" element={<LanguageWrapper><PageWrapper><BlogPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/blog/:slug" element={<LanguageWrapper><PageWrapper><BlogPostPage /></PageWrapper></LanguageWrapper>} />

                {/* Legal */}
                <Route path="/:lang/legal/privacy-policy" element={<LanguageWrapper><PageWrapper><PrivacyPolicyPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/legal/terms-of-service" element={<LanguageWrapper><PageWrapper><TermsOfServicePage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/legal/cookie-policy" element={<LanguageWrapper><PageWrapper><CookiePolicyPage /></PageWrapper></LanguageWrapper>} />

                {/* Contact */}
                <Route path="/:lang/contact" element={<LanguageWrapper><PageWrapper><ContactPage /></PageWrapper></LanguageWrapper>} />

                {/* Legacy/Redirects/Other */}
                <Route path="/:lang/services" element={<LanguageWrapper><PageWrapper><ServicesPage /></PageWrapper></LanguageWrapper>} />
                <Route path="/:lang/portfolio" element={<LanguageWrapper><PageWrapper><PortfolioPage /></PageWrapper></LanguageWrapper>} />

                {/* GSC Fixes: Deep Link Redirects for non-localized paths */}
                <Route path="/team/*" element={<DeepLinkRedirect />} />
                <Route path="/services/*" element={<DeepLinkRedirect />} />
                <Route path="/about" element={<DeepLinkRedirect />} />
                <Route path="/process" element={<DeepLinkRedirect />} />
                <Route path="/case-studies" element={<DeepLinkRedirect />} />
                <Route path="/careers/*" element={<DeepLinkRedirect />} />
                <Route path="/blog/*" element={<DeepLinkRedirect />} />
                <Route path="/contact" element={<DeepLinkRedirect />} />
                <Route path="/legal/*" element={<DeepLinkRedirect />} />
                <Route path="/Home" element={<Navigate to="/" replace />} />

                {/* Custom Pages - Dynamic page routing */}
                <Route path="/:lang/:customSlug" element={
                  <LanguageWrapper>
                    <PageWrapper>
                      <DynamicPage />
                    </PageWrapper>
                  </LanguageWrapper>
                } />

                {/* 404 - Global catch-all should still work, but ideally we want localized 404 */}
                <Route path="/:lang/*" element={<LanguageWrapper><PageWrapper><NotFoundPage /></PageWrapper></LanguageWrapper>} />
                <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="projects" element={<AdminProjects />} />
                    <Route path="team" element={<AdminTeam />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="testimonials" element={<AdminTestimonials />} />
                    <Route path="faqs" element={<AdminFAQs />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="seed-data" element={<AdminSeedData />} />
                    <Route path="site-content" element={<AdminSiteContent />} />
                    <Route path="contact-settings" element={<AdminContactSettings />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="chat" element={<AdminChat />} />
                    <Route path="work" element={<AdminTasks />} />
                    <Route path="timesheet" element={<Timesheet />} />
                    <Route path="assets" element={<AdminAssets />} />
                    <Route path="team-management" element={<AdminTeamManagement />} />
                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="jobs" element={<AdminJobs />} />
                    <Route path="audit" element={<AdminAuditLog />} />
                    <Route path="online-users" element={<AdminOnlineUsers />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="free-growth-call" element={<AdminFreeGrowthCallConfig />} />
                    <Route path="ai-config" element={<AdminAIConfig />} />
                    <Route path="seo-settings" element={<AdminSeoSettings />} />
                    <Route path="promotions" element={<AdminPromotions />} />
                    <Route path="pages" element={<AdminPageList />} />
                    <Route path="pages/new" element={<AdminPageBuilder />} />
                    <Route path="pages/edit/:id" element={<AdminPageBuilder />} />
                  </Route>
                </Route>
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>

        {/* Global Footer */}
        {!isAdminRoute && <Footer />}
      </div>

      {/* Enhanced Floating Action Buttons */}
      {!isAdminRoute && settings?.sections?.floating_buttons !== false && (
        <FloatingActionButtons
          onChatOpen={() => setIsChatOpen(true)}
          onContactOpen={() => setIsContactAssistantOpen(true)}
          isChatPreloaded={isChatPreloaded}
        />
      )}

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
      <ThemeProvider>
        <AuthProvider>
          <GlobalDataProvider>
            <ToastProvider>
              <SeoProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <AppContent />
                </BrowserRouter>
              </SeoProvider>
            </ToastProvider>
          </GlobalDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;