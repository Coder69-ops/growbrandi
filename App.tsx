import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import { HomePage } from './components/Hero';
import { ServicesPage } from './components/Services';
import { ProjectsPage } from './components/ServiceCard';
import { ContactPage } from './components/Footer';
import ChatInterface from './components/ChatInterface';
import AnimatedBackground from './components/AnimatedBackground';
import AIUseCases from './components/AIUseCases';
import ContactAssistant from './components/ContactAssistant';

// Create a simple footer component to avoid circular imports
const SimpleFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="glass-effect border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-xl">GrowBrandi</h3>
            </div>
            <p className="text-slate-400 mb-4">AI-powered digital solutions that drive measurable success.</p>
            <div className="space-y-2 text-sm text-slate-400">
              <p>📍 San Francisco, CA</p>
              <p>📧 hello@growbrandi.com</p>
              <p>📞 +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Services Menu */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Web Development</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">UI/UX Design</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">SEO Optimization</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Digital Marketing</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Brand Strategy</a></li>
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Information</h3>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Our Process</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Connect With Us</h3>
            <p className="text-slate-400 text-sm mb-4">Follow us for updates and insights</p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.246.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.631 2.186 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.631-.167 5.65-2.186 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.246 17.814.227 14.183.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-slate-400">
          <p>&copy; {currentYear} All rights reserved GrowBrandi</p>
        </div>
      </div>
    </footer>
  );
};

type Page = 'home' | 'services' | 'projects' | 'contact';

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




// --- Main App Component ---
function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
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
  }, [currentPage]);

  const renderPage = () => {
    // Show AI Use Cases as overlay
    if (showAIUseCases) {
      return <AIUseCases />;
    }
    
    switch (currentPage) {
      case 'services': return <ServicesPage />;
      case 'projects': return <ProjectsPage />;
      case 'contact': return <ContactPage />;
      case 'home':
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
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

    switch(currentPage) {
        case 'home': return `${baseInstruction} 

**HOMEPAGE CONVERSION STRATEGY**: 
• Immediately qualify their business needs
• Push AI Slogan Generator for instant value demonstration
• Create urgency: "Try our FREE tools before competitors do!"
• Direct to consultation booking: "Book your strategy call - 3 spots left this week!"
• Mention: "We're helping 50+ businesses grow 300% faster with AI"`;

        case 'services': return `${baseInstruction}

**SERVICES PAGE CONVERSION STRATEGY**:
• Immediately ask about their budget and timeline
• Show ROI: "Our clients see 400% ROI average in 6 months"
• Create package urgency: "Limited slots for Q1 2026 projects"
• Push consultation: "Free strategy session + custom proposal"
• Price anchor: "Investment starts at $5K - but ROI is 10x that"`;

        case 'projects': return `${baseInstruction}

**PROJECTS PAGE CONVERSION STRATEGY**:
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
  }, [currentPage]);


  return (
    <div className="text-slate-100 w-full" style={{ minHeight: '100vh' }}>
      <AnimatedBackground />
      <div className="relative z-10 w-full">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main id="main-content" role="main" className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
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
        
        {/* Footer on all pages except contact (which has its own footer) */}
        {currentPage !== 'contact' && <SimpleFooter />}
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

export default App;