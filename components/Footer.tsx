import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import LoadingSpinner from './LoadingSpinner';

// --- Footer Component ---
const Footer: React.FC = () => {
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

  return (
    <footer className="glass-effect border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-emerald-400">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <h3 className="font-bold text-white text-xl">GrowBrandi</h3>
            </div>
            <p className="text-slate-400 mb-4">Delivering robust development solutions that drive measurable success.</p>
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

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Subscribe Our Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">Get the latest updates, insights, and offers delivered straight to your inbox.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                required
              />
              <motion.button 
                type="submit" 
                disabled={isSubscribing || subscriptionStatus === 'success'}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubscribing ? 'Subscribing...' : subscriptionStatus === 'success' ? 'Subscribed!' : 'Subscribe'}
              </motion.button>
            </form>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a href="https://linkedin.com/company/growbrandi" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
                </svg>
              </a>
              <a href="https://twitter.com/growbrandi" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="https://instagram.com/growbrandi" className="text-slate-400 hover:text-emerald-400 transition-colors">
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


// --- ContactPage Component ---
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState('');
    const [formStatus, setFormStatus] = useState<FormStatus>('idle');

    const generateBrief = async () => {
        setIsGenerating(true);
        setAiError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `A user wants to contact GrowBrand. Generate a BRIEF, urgent project brief (max 100 words) that includes project goal, target audience, and key features. Make it sound professional but concise. Focus on conversion. The output must be only the JSON object.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            brief: {
                                type: Type.STRING,
                                description: 'The generated project brief as a string.'
                            }
                        }
                    }
                }
            });
            const result = JSON.parse(response.text);
            setFormData(prev => ({ ...prev, message: result.brief }));
        } catch (err) {
            console.error(err);
            setAiError("Failed to generate brief. Please write your message manually.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');
        // Simulate form submission
        setTimeout(() => {
            // Randomly succeed or fail for demo purposes
            if (Math.random() > 0.2) {
                setFormStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setFormStatus('error');
            }
        }, 1500);
    }

    return (
        <>
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-3xl">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">
                                Contact GrowBrandi for expert <span className="text-gradient">digital solutions</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 mt-6 leading-relaxed max-w-3xl mx-auto">
                                Let's bring your vision to life! Have a project in mind? We'd love to hear about it. Fill out the form below or let our AI assistant help you draft the perfect message.
                            </p>
                        </motion.div>
                    </div>
                    <div className="glass-effect rounded-2xl shadow-2xl p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                                    <input type="text" id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                    <input type="email" id="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                                <input type="text" id="subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-300">Message</label>
                                    <button type="button" onClick={generateBrief} disabled={isGenerating} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                                        {isGenerating ? <LoadingSpinner /> : 'Auto-draft with AI'}
                                        {!isGenerating && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.636-6.364l.707-.707M12 21v-1m-6.364-1.636l.707-.707" /></svg>}
                                    </button>
                                </div>
                                <textarea id="message" rows={6} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
                                {aiError && <p className="text-red-400 text-sm mt-2">{aiError}</p>}
                            </div>
                            <div>
                                <motion.button
                                  type="submit"
                                  disabled={formStatus === 'submitting'}
                                  className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-cyan-500/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                  whileHover={{ scale: formStatus === 'idle' ? 1.03 : 1 }}
                                  whileTap={{ scale: formStatus === 'idle' ? 0.97 : 1 }}
                                >
                                  {formStatus === 'submitting' && <LoadingSpinner />}
                                  {formStatus === 'idle' && 'Send Message'}
                                  {formStatus === 'success' && 'Message Sent!'}
                                  {formStatus === 'error' && 'Try Again'}
                                </motion.button>
                                {formStatus === 'success' && <p className="text-green-400 text-center mt-4">Thank you! We've received your message and will get back to you shortly.</p>}
                                {formStatus === 'error' && <p className="text-red-400 text-center mt-4">Something went wrong. Please check your connection and try again.</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};