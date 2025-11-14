import React from 'react';
import { motion } from 'framer-motion';

// Privacy Policy Page
export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-lg text-slate-300">
              Last updated: November 14, 2024
            </p>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-8 md:p-12 border border-white/10 prose prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8 text-slate-300 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                <p className="mb-4">
                  We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, 
                  or contact us for support. This may include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Company information and job title</li>
                  <li>Messages and communications you send to us</li>
                  <li>Payment information for our services</li>
                  <li>Any other information you choose to provide</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Monitor and analyze trends and usage</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
                <p className="mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                  except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With service providers who assist in our operations</li>
                  <li>In connection with a merger or acquisition</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, 
                  and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your personal information</li>
                  <li>Object to processing of your information</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar tracking technologies to collect and use personal information about you. 
                  You can control cookies through your browser settings and other tools.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                  <p><strong>Email:</strong> privacy@growbrandi.com</p>
                  <p><strong>Address:</strong> GrowBrandi, San Francisco, CA</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-lg text-slate-300">
              Last updated: November 14, 2024
            </p>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-8 md:p-12 border border-white/10 prose prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8 text-slate-300 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using GrowBrandi's services, you accept and agree to be bound by the terms and provision 
                  of these Terms of Service. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
                <p className="mb-4">
                  GrowBrandi provides digital services including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Web development and design</li>
                  <li>Digital marketing services</li>
                  <li>Brand strategy and consulting</li>
                  <li>AI solutions and automation</li>
                  <li>SEO optimization services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
                <p className="mb-4">You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Use our services in compliance with applicable laws</li>
                  <li>Not engage in any fraudulent or harmful activities</li>
                  <li>Respect intellectual property rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Payment Terms</h2>
                <p className="mb-4">
                  Payment terms for our services are as follows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All fees are due upon invoice unless otherwise agreed</li>
                  <li>Late payments may incur additional charges</li>
                  <li>Refunds are subject to our refund policy</li>
                  <li>Prices are subject to change with notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
                <p>
                  All content, features, and functionality of our services are owned by GrowBrandi and are protected by 
                  international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                <p>
                  GrowBrandi shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Termination</h2>
                <p>
                  We may terminate or suspend your access to our services immediately, without prior notice or liability, 
                  for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Contact Information</h2>
                <p>
                  For questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                  <p><strong>Email:</strong> legal@growbrandi.com</p>
                  <p><strong>Address:</strong> GrowBrandi, San Francisco, CA</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Cookie <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-lg text-slate-300">
              Last updated: November 14, 2024
            </p>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-8 md:p-12 border border-white/10 prose prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-8 text-slate-300 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies</h2>
                <p>
                  Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work more efficiently and to provide information to website owners.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
                <p className="mb-4">We use cookies for several purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used to track visitors and deliver personalized ads</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Strictly Necessary Cookies</h3>
                    <p>These cookies are essential for the website to function and cannot be switched off. They are usually set in response to actions you take such as setting privacy preferences or filling in forms.</p>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Performance Cookies</h3>
                    <p>These cookies collect information about how visitors use our website, such as which pages are visited most often. This data helps us improve how our website works.</p>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Functionality Cookies</h3>
                    <p>These cookies allow our website to remember choices you make and provide enhanced features and personal content.</p>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Targeting Cookies</h3>
                    <p>These cookies are used to deliver advertisements that are relevant to you and your interests. They may be used to limit the number of times you see an advertisement.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Managing Your Cookie Preferences</h2>
                <p className="mb-4">You can control and manage cookies in several ways:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use your browser settings to accept or reject cookies</li>
                  <li>Delete existing cookies from your browser</li>
                  <li>Set your browser to notify you when cookies are being sent</li>
                  <li>Use our cookie preference center (when available)</li>
                </ul>
                <p className="mt-4">
                  Please note that disabling certain cookies may affect the functionality of our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Cookies</h2>
                <p className="mb-4">
                  We may use third-party services that set cookies on our website, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Google Analytics for website analytics</li>
                  <li>Facebook Pixel for advertising</li>
                  <li>LinkedIn Insight Tag for professional targeting</li>
                  <li>Other marketing and analytics tools</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Updates to This Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time. When we do, we will post the updated policy on this page 
                  and update the "Last updated" date at the top of this policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
                <p>
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                  <p><strong>Email:</strong> privacy@growbrandi.com</p>
                  <p><strong>Address:</strong> GrowBrandi, San Francisco, CA</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};