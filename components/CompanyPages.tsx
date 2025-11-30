import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TEAM_MEMBERS } from '../constants';

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
    </>
  );
};

// Team Page
export const TeamPage: React.FC = () => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center overflow-hidden py-20">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-400 font-semibold text-sm tracking-wide uppercase mb-4 block">
              Meet Our Team
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              The Experts Behind <span className="text-gradient">Your Success</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Our diverse team of digital experts brings together decades of experience in
              development, design, marketing, and AI to deliver exceptional results for our clients.
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.div
                key={member.name}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredMember(index)}
                onMouseLeave={() => setHoveredMember(null)}
                whileHover={{ y: -12, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="glass-effect rounded-3xl p-8 h-full relative overflow-hidden border border-white/10">
                  {/* Background Glow Effect */}
                  <div className={`absolute inset-0 transition-all duration-500 ${hoveredMember === index
                    ? 'bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10'
                    : 'bg-transparent'
                    }`} />

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full translate-y-8 -translate-x-8" />

                  <div className="relative z-10">
                    <Link to={`/team/${member.slug}`} className="block">
                      {/* Profile Image */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                        <div className="relative w-32 h-32 mx-auto">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-slate-700 group-hover:border-emerald-400/50 transition-all duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          {/* Fallback initials */}
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl items-center justify-center shadow-xl hidden">
                            <span className="text-white font-bold text-2xl">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Member Info */}
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gradient transition-colors duration-300">
                          {member.name}
                        </h3>
                        <div className="text-emerald-400 font-semibold text-lg mb-4">
                          {member.role}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {member.description}
                        </p>
                      </div>
                    </Link>

                    {/* Specialties */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.specialties.map((specialty, idx) => (
                          <span
                            key={specialty}
                            className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs font-medium rounded-full border border-slate-600 group-hover:border-emerald-400/50 group-hover:text-emerald-400 transition-all duration-300"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-4">
                      {Object.entries(member.social).map(([platform, url]) => {
                        if (!url) return null;
                        const icons = {
                          linkedin: (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                            </svg>
                          ),
                          twitter: (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                          ),
                          github: (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                            </svg>
                          ),
                          dribbble: (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zM7.394 17.064c-.297-.149-.568-.351-.801-.595a8.958 8.958 0 01-.662-4.975A20.719 20.719 0 007.394 17.064zM1.851 8.967c.214 2.047.995 3.9 2.199 5.35-.35-1.493-.35-3.061 0-4.554C3.248 10.1 2.478 9.567 1.851 8.967z" clipRule="evenodd" />
                            </svg>
                          ),
                          instagram: (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.629-.167 5.652-2.182 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.245 17.821.230 14.189.06 13.124.012 12.784 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.009 2.988-.057 4.042-.124 2.687-1.387 3.977-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
                            </svg>
                          ),
                          email: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )
                        };

                        return (
                          <motion.a
                            key={platform}
                            href={url}
                            className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-300 group/social"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`${member.name} ${platform}`}
                          >
                            <div className="group-hover/social:animate-pulse">
                              {icons[platform as keyof typeof icons]}
                            </div>
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto border border-white/10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Work with <span className="text-gradient">Our Amazing Team?</span>
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Let's discuss your project and see how our expert team can help you achieve
                your digital goals. We're here to turn your vision into reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg">
                  Start Your Project
                </button>
                <button className="border border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-lg transition-all duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
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
    </>
  );
};