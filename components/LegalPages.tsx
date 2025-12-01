import React from 'react';
import { motion } from 'framer-motion';
import { APP_NAME, CONTACT_INFO } from '../constants';

// Privacy Policy Page
export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-luxury-black to-luxury-black" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading tracking-tight">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
              Last updated: December 01, 2025
            </p>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-8 md:p-12 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8 text-zinc-400 leading-relaxed font-light">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">1. Introduction</h2>
                <p>
                  Welcome to {APP_NAME} ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage with our digital services, including Brand Growth, Web Development, and UI/UX Design.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">2. Information We Collect</h2>
                <p className="mb-4">We collect personal information that you voluntarily provide to us when you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Request a consultation or project quote</li>
                  <li>Subscribe to our newsletter or marketing communications</li>
                  <li>Engage with our "Slogan Generator" or "Health Audit" tools</li>
                  <li>Contact us via email or our contact forms</li>
                </ul>
                <p className="mt-4">
                  The personal information we collect may include names, email addresses, phone numbers, job titles, and specific business requirements relevant to your project.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">3. How We Use Your Information</h2>
                <p className="mb-4">We use personal information collected via our website for a variety of business purposes described below:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and deliver the services you request (e.g., delivering audit reports, project proposals)</li>
                  <li>To communicate with you about your projects, appointments, and account updates</li>
                  <li>To send you marketing and promotional communications regarding our latest services and offers</li>
                  <li>To improve our website performance and user experience through analytics</li>
                  <li>To protect our services and legal rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">4. Sharing Your Information</h2>
                <p>
                  We do not sell your personal information. We only share information with your consent, to comply with laws, to provide you with services (e.g., sharing data with third-party advertising platforms like Meta or Google for your ad campaigns), or to fulfill business obligations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">5. Security of Your Information</h2>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">6. Contact Us</h2>
                <p>
                  If you have questions or comments about this policy, you may email us at {CONTACT_INFO.email} or by post to:
                </p>
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg border border-white/5">
                  <p className="font-bold text-white">{APP_NAME}</p>
                  <p>{CONTACT_INFO.address}</p>
                  <p>Phone: {CONTACT_INFO.phone}</p>
                  <p>Email: {CONTACT_INFO.email}</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

// Terms of Service Page
export const TermsOfServicePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-luxury-black to-luxury-black" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading tracking-tight">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
              Last updated: December 01, 2025
            </p>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-8 md:p-12 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8 text-zinc-400 leading-relaxed font-light">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">1. Agreement to Terms</h2>
                <p>
                  These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and {APP_NAME} ("we," "us" or "our"), concerning your access to and use of the {APP_NAME} website and our digital agency services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">2. Intellectual Property Rights</h2>
                <p className="mb-4">
                  Unless otherwise indicated, the Site is our proprietary property. However, regarding client projects:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Client Deliverables:</strong> Upon full payment, all final deliverables (e.g., website code, design assets, ad creatives) created specifically for the Client shall become the property of the Client.</li>
                  <li><strong>Agency Tools:</strong> {APP_NAME} retains all rights to its background technology, frameworks, pre-existing code, and methodologies used to create the deliverables.</li>
                  <li><strong>Portfolio Rights:</strong> We reserve the right to display completed projects in our portfolio and marketing materials unless a Non-Disclosure Agreement (NDA) is signed.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">3. Service Engagement</h2>
                <p className="mb-4">
                  By engaging our services (Web Development, UI/UX Design, Marketing, etc.), you agree that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You will provide all necessary content, assets, and information required for the project in a timely manner.</li>
                  <li>Project timelines are estimates and may vary based on the scope of changes or delays in feedback.</li>
                  <li>Payment terms are defined in your specific project proposal or contract.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">4. Prohibited Activities</h2>
                <p>
                  You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">5. Limitation of Liability</h2>
                <p>
                  In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site or our services, even if we have been advised of the possibility of such damages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">6. Governing Law</h2>
                <p>
                  These Terms shall be governed by and defined following the laws of Bangladesh. {APP_NAME} and yourself irrevocably consent that the courts of Khulna, Bangladesh shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

// Cookie Policy Page
export const CookiePolicyPage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-luxury-black to-luxury-black" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading tracking-tight">
              Cookie <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
              Last updated: December 01, 2025
            </p>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-8 md:p-12 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8 text-zinc-400 leading-relaxed font-light">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">1. What Are Cookies</h2>
                <p>
                  Cookies are small text files that are stored on your computer or mobile device when you visit a website.
                  They are widely used to make websites work more efficiently and to provide information to website owners.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">2. How We Use Cookies</h2>
                <p className="mb-4">We use cookies for several purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (e.g., Google Analytics)</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used to track visitors and deliver personalized ads</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">3. Types of Cookies We Use</h2>

                <div className="space-y-6">
                  <div className="p-4 bg-zinc-900/50 rounded-lg border border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-2 font-heading">Strictly Necessary Cookies</h3>
                    <p>These cookies are essential for the website to function and cannot be switched off. They are usually set in response to actions you take such as setting privacy preferences or filling in forms.</p>
                  </div>

                  <div className="p-4 bg-zinc-900/50 rounded-lg border border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-2 font-heading">Performance Cookies</h3>
                    <p>These cookies collect information about how visitors use our website, such as which pages are visited most often. This data helps us improve how our website works.</p>
                  </div>

                  <div className="p-4 bg-zinc-900/50 rounded-lg border border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-2 font-heading">Functionality Cookies</h3>
                    <p>These cookies allow our website to remember choices you make and provide enhanced features and personal content.</p>
                  </div>

                  <div className="p-4 bg-zinc-900/50 rounded-lg border border-white/5">
                    <h3 className="text-lg font-semibold text-white mb-2 font-heading">Targeting Cookies</h3>
                    <p>These cookies are used to deliver advertisements that are relevant to you and your interests. They may be used to limit the number of times you see an advertisement.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">4. Managing Your Cookie Preferences</h2>
                <p className="mb-4">You can control and manage cookies in several ways:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use your browser settings to accept or reject cookies</li>
                  <li>Delete existing cookies from your browser</li>
                  <li>Set your browser to notify you when cookies are being sent</li>
                </ul>
                <p className="mt-4">
                  Please note that disabling certain cookies may affect the functionality of our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4 font-heading">5. Contact Us</h2>
                <p>
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg border border-white/5">
                  <p><strong>Email:</strong> {CONTACT_INFO.email}</p>
                  <p><strong>Address:</strong> {CONTACT_INFO.address}</p>
                  <p><strong>Phone:</strong> {CONTACT_INFO.phone}</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};