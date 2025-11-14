import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer';

// About Us Page
export const AboutUsPage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              About <span className="text-gradient">GrowBrandi</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We're a passionate team of digital innovators, strategists, and creators dedicated to helping businesses thrive in the digital age. Founded on the principle that every business deserves exceptional digital experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Our <span className="text-gradient">Story</span>
              </h2>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                Founded in 2020, GrowBrandi emerged from a simple belief: every business, regardless of size, deserves access to world-class digital solutions. What started as a small team of developers and designers has grown into a full-service digital agency serving clients worldwide.
              </p>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                Our journey began when we noticed a gap in the market - businesses struggling to find partners who truly understood both technology and business strategy. We set out to bridge that gap by combining technical expertise with deep business acumen.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-emerald-400 mb-2">200+</div>
                  <div className="text-slate-400">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-400 mb-2">50+</div>
                  <div className="text-slate-400">Happy Clients</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="glass-effect rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.636-6.364l.707-.707M12 21v-1m-6.364-1.636l.707-.707" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Innovation First</h3>
                    <p className="text-slate-400">We stay ahead of industry trends and emerging technologies to deliver cutting-edge solutions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Client-Centric</h3>
                    <p className="text-slate-400">Your success is our success. We build long-term partnerships based on trust and results.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Quality Driven</h3>
                    <p className="text-slate-400">We maintain the highest standards of quality in every project, from concept to completion.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              The brilliant minds behind GrowBrandi's success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Founder",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop&crop=face",
                bio: "10+ years in digital strategy and business development"
              },
              {
                name: "Michael Chen",
                role: "CTO",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face",
                bio: "Expert in AI, machine learning, and scalable architectures"
              },
              {
                name: "Emily Rodriguez",
                role: "Creative Director",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face",
                bio: "Award-winning designer with a passion for user experience"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-2xl p-6 border border-white/10 text-center hover:border-emerald-400/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mx-auto mb-4 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-emerald-400 font-semibold mb-3">{member.role}</p>
                <p className="text-slate-400">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

// Our Process Page
export const ProcessPage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Our <span className="text-gradient">Process</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              A proven methodology that ensures project success from initial concept to final delivery. Our systematic approach combines industry best practices with innovative thinking.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-16">
            {[
              {
                step: "01",
                title: "Discovery & Strategy",
                description: "We start by understanding your business, goals, and challenges through comprehensive research and stakeholder interviews.",
                details: [
                  "Business Analysis & Requirements Gathering",
                  "Market Research & Competitive Analysis", 
                  "User Research & Persona Development",
                  "Technical Architecture Planning",
                  "Project Roadmap Creation"
                ]
              },
              {
                step: "02", 
                title: "Design & Prototyping",
                description: "Creating user-centric designs and interactive prototypes that visualize the final product before development begins.",
                details: [
                  "Information Architecture Design",
                  "Wireframing & User Flow Mapping",
                  "Visual Design & Brand Integration",
                  "Interactive Prototype Development", 
                  "Usability Testing & Validation"
                ]
              },
              {
                step: "03",
                title: "Development & Integration",
                description: "Building your solution using modern technologies with clean, maintainable code and industry best practices.",
                details: [
                  "Agile Development Methodology",
                  "Clean Code & Documentation",
                  "API Development & Integration",
                  "Database Design & Optimization",
                  "Performance & Security Implementation"
                ]
              },
              {
                step: "04",
                title: "Testing & Quality Assurance",
                description: "Rigorous testing across all platforms and scenarios to ensure flawless functionality and user experience.",
                details: [
                  "Automated Testing Suite",
                  "Cross-Browser & Device Testing",
                  "Performance & Load Testing",
                  "Security Vulnerability Testing",
                  "User Acceptance Testing"
                ]
              },
              {
                step: "05",
                title: "Launch & Optimization",
                description: "Seamless deployment with monitoring, analytics, and continuous optimization for peak performance.",
                details: [
                  "Production Deployment Strategy",
                  "Performance Monitoring Setup",
                  "Analytics & Tracking Implementation",
                  "SEO Optimization",
                  "Post-Launch Support & Maintenance"
                ]
              }
            ].map((processStep, index) => (
              <motion.div
                key={index}
                className="flex flex-col lg:flex-row items-center gap-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="lg:w-1/3">
                  <div className="text-6xl font-black text-emerald-400/20 mb-4">{processStep.step}</div>
                  <h3 className="text-3xl font-black text-white mb-4">{processStep.title}</h3>
                  <p className="text-lg text-slate-300 leading-relaxed">{processStep.description}</p>
                </div>
                <div className="lg:w-2/3">
                  <div className="glass-effect rounded-2xl p-8 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {processStep.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0"></div>
                          <span className="text-slate-300">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

// Case Studies Page
export const CaseStudiesPage: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);

  const caseStudies = [
    {
      title: "E-commerce Revolution for TechStore",
      category: "E-commerce Development",
      results: "300% increase in online sales",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      challenge: "TechStore needed a modern, scalable e-commerce platform to compete with industry giants.",
      solution: "We built a custom React-based e-commerce platform with advanced search, AI recommendations, and seamless checkout.",
      metrics: ["300% increase in sales", "50% reduction in cart abandonment", "85% improvement in page load speed"]
    },
    {
      title: "Brand Transformation for HealthPlus",
      category: "Brand Strategy & Design",
      results: "500% increase in brand recognition",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
      challenge: "HealthPlus needed to modernize their brand identity and digital presence to attract younger demographics.",
      solution: "Complete brand overhaul including new visual identity, messaging framework, and digital-first marketing strategy.",
      metrics: ["500% increase in brand recognition", "200% growth in social media following", "150% increase in lead generation"]
    },
    {
      title: "AI-Powered Analytics for DataCorp",
      category: "AI Solutions",
      results: "40% improvement in decision making",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      challenge: "DataCorp needed intelligent automation to process vast amounts of customer data for better insights.",
      solution: "Custom AI platform with machine learning algorithms for predictive analytics and automated reporting.",
      metrics: ["40% improvement in decision making", "60% reduction in manual processing", "90% accuracy in predictions"]
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Case <span className="text-gradient">Studies</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Real success stories from businesses that transformed their digital presence with GrowBrandi. See how we've helped companies achieve remarkable growth and success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/30 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCase(selectedCase === index ? null : index)}
              >
                <div className="h-48 overflow-hidden">
                  <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="text-emerald-400 font-semibold text-sm mb-2">{study.category}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{study.title}</h3>
                  <div className="text-2xl font-black text-gradient mb-4">{study.results}</div>
                  <button className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                    {selectedCase === index ? 'Hide Details' : 'View Details'} →
                  </button>
                </div>
                
                {selectedCase === index && (
                  <motion.div
                    className="border-t border-white/10 p-6 bg-slate-800/50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Challenge</h4>
                        <p className="text-slate-400 text-sm">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Solution</h4>
                        <p className="text-slate-400 text-sm">{study.solution}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Key Results</h4>
                        <ul className="space-y-1">
                          {study.metrics.map((metric, metricIndex) => (
                            <li key={metricIndex} className="text-slate-400 text-sm flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                              {metric}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

// Careers Page
export const CareersPage: React.FC = () => {
  const jobOpenings = [
    {
      title: "Senior Full-Stack Developer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      description: "We're looking for an experienced full-stack developer to join our growing team and help build amazing digital experiences."
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "San Francisco, CA / Remote", 
      type: "Full-time",
      description: "Join our creative team to design beautiful, intuitive user experiences that delight our clients and their customers."
    },
    {
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Help our clients grow their digital presence through strategic marketing campaigns and data-driven optimization."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Join Our <span className="text-gradient">Team</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Be part of a passionate team that's shaping the future of digital experiences. We're always looking for talented individuals who share our vision of excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Open <span className="text-gradient">Positions</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-2xl p-8 border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-slate-400">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <motion.button
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 mt-4 md:mt-0"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply Now
                  </motion.button>
                </div>
                <p className="text-slate-300">{job.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

// Blog Page
export const BlogPage: React.FC = () => {
  const blogPosts = [
    {
      title: "The Future of AI in Web Development",
      excerpt: "Exploring how artificial intelligence is revolutionizing the way we build and maintain websites.",
      date: "November 10, 2024",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
      readTime: "5 min read"
    },
    {
      title: "Design Systems That Scale",
      excerpt: "Best practices for creating design systems that grow with your business and maintain consistency.",
      date: "November 5, 2024", 
      category: "Design",
      image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600&h=400&fit=crop",
      readTime: "7 min read"
    },
    {
      title: "Digital Marketing Trends for 2025",
      excerpt: "Key trends and strategies that will dominate digital marketing in the coming year.",
      date: "October 28, 2024",
      category: "Marketing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      readTime: "6 min read"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Our <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Insights, tips, and industry trends from our team of digital experts. Stay informed about the latest in web development, design, and digital marketing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={index}
                className="glass-effect rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-emerald-400 font-semibold text-sm">{post.category}</span>
                    <span className="text-slate-400 text-sm">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{post.title}</h3>
                  <p className="text-slate-400 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">{post.date}</span>
                    <button className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                      Read More →
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};