import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLightbulb, FaUsers, FaCheckCircle, FaLinkedin, FaTwitter, FaGithub, FaDribbble, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { TEAM_MEMBERS } from '../constants';
import SEO from './SEO';

// About Us Page
export const AboutUsPage: React.FC = () => {
  return (
    <>
      <SEO
        title="About Us"
        description="We're a passionate team of digital innovators, strategists, and creators dedicated to helping businesses thrive in the digital age."
      />
      {/* Hero Section */}
      <section className="py-20 px-4 bg-luxury-black relative overflow-hidden min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-luxury-black to-luxury-black" />
        {/* Animated background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-400 font-bold text-sm tracking-[0.2em] uppercase mb-4 block">
              Who We Are
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 font-heading tracking-tight leading-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient-x">GrowBrandi</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
              We're a passionate team of digital innovators, strategists, and creators dedicated to helping businesses thrive in the digital age. Founded on the principle that every business deserves exceptional digital experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-luxury-black relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">
                Our <span className="text-gradient">Story</span>
              </h2>
              <div className="space-y-6 text-lg text-zinc-400 font-light leading-relaxed">
                <p>
                  Founded in 2020, GrowBrandi emerged from a simple belief: every business, regardless of size, deserves access to world-class digital solutions. What started as a small team of developers and designers has grown into a full-service digital agency serving clients worldwide.
                </p>
                <p>
                  Our journey began when we noticed a gap in the market - businesses struggling to find partners who truly understood both technology and business strategy. We set out to bridge that gap by combining technical expertise with deep business acumen.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-10">
                <div className="text-center p-6 glass-effect rounded-2xl border border-white/5">
                  <div className="text-4xl font-black text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">200+</div>
                  <div className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Projects Completed</div>
                </div>
                <div className="text-center p-6 glass-effect rounded-2xl border border-white/5">
                  <div className="text-4xl font-black text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">50+</div>
                  <div className="text-zinc-400 text-sm uppercase tracking-wider font-semibold">Happy Clients</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="glass-effect rounded-3xl p-8 border border-white/5 relative overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all duration-300">
                    <FaLightbulb className="w-7 h-7 text-white group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 font-heading group-hover:text-blue-400 transition-colors">Innovation First</h3>
                    <p className="text-zinc-400 font-light leading-relaxed">We stay ahead of industry trends and emerging technologies to deliver cutting-edge solutions that give you a competitive advantage.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-all duration-300">
                    <FaUsers className="w-7 h-7 text-white group-hover:text-purple-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 font-heading group-hover:text-purple-400 transition-colors">Client-Centric</h3>
                    <p className="text-zinc-400 font-light leading-relaxed">Your success is our success. We build long-term partnerships based on trust, transparency, and measurable results.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-pink-500/30 group-hover:bg-pink-500/10 transition-all duration-300">
                    <FaCheckCircle className="w-7 h-7 text-white group-hover:text-pink-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 font-heading group-hover:text-pink-400 transition-colors">Quality Driven</h3>
                    <p className="text-zinc-400 font-light leading-relaxed">We maintain the highest standards of quality in every project, from concept to completion, ensuring pixel-perfect delivery.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-zinc-800/20 via-luxury-black to-luxury-black" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
              The brilliant minds behind GrowBrandi's success, dedicated to delivering excellence in every project.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-2xl p-8 border border-white/5 text-center hover:border-white/20 transition-all duration-300 group relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="w-32 h-32 bg-white/5 rounded-full mx-auto mb-6 overflow-hidden border-2 border-white/10 group-hover:border-blue-500/50 transition-all duration-300 relative z-10">
                  <img src={member.image} alt={member.name} loading="lazy" width="400" height="400" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2 font-heading group-hover:text-blue-400 transition-colors">{member.name}</h3>
                  <p className="text-blue-400 font-semibold mb-4 text-sm uppercase tracking-wider">{member.role}</p>
                  <p className="text-zinc-400 font-light text-sm mb-6 line-clamp-3 leading-relaxed">{member.bio}</p>

                  <div className="flex justify-center gap-4">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                        <FaLinkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                        <FaTwitter className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.email && (
                      <a href={`mailto:${member.social.email}`} className="text-zinc-500 hover:text-white transition-colors">
                        <FaEnvelope className="w-5 h-5" />
                      </a>
                    )}
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

// Our Process Page
export const ProcessPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Our Process"
        description="A proven methodology that ensures project success from initial concept to final delivery."
      />
      {/* Hero Section */}
      <section className="py-20 px-4 bg-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-luxury-black to-luxury-black" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading tracking-tight">
              Our <span className="text-gradient">Process</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
              A proven methodology that ensures project success from initial concept to final delivery. Our systematic approach combines industry best practices with innovative thinking.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4 bg-luxury-black">
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
                  <div className="text-6xl font-black text-white/10 mb-4">{processStep.step}</div>
                  <h3 className="text-3xl font-black text-white mb-4 font-heading">{processStep.title}</h3>
                  <p className="text-lg text-zinc-400 leading-relaxed font-light">{processStep.description}</p>
                </div>
                <div className="lg:w-2/3">
                  <div className="glass-effect rounded-2xl p-8 border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {processStep.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-white rounded-full shrink-0"></div>
                          <span className="text-zinc-300 font-light">{detail}</span>
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
      <SEO
        title="Case Studies"
        description="Real success stories from businesses that transformed their digital presence with GrowBrandi."
      />
      {/* Hero Section */}
      <section className="py-20 px-4 bg-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-luxury-black to-luxury-black" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading tracking-tight">
              Case <span className="text-gradient">Studies</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
              Real success stories from businesses that transformed their digital presence with GrowBrandi. See how we've helped companies achieve remarkable growth and success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 px-4 bg-luxury-black">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCase(selectedCase === index ? null : index)}
              >
                <div className="h-48 overflow-hidden">
                  <img src={study.image} alt={study.title} loading="lazy" width="600" height="400" className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="text-white/70 font-semibold text-sm mb-2 uppercase tracking-wider">{study.category}</div>
                  <h3 className="text-xl font-bold text-white mb-3 font-heading">{study.title}</h3>
                  <div className="text-2xl font-black text-white mb-4">{study.results}</div>
                  <button className="text-zinc-400 font-semibold hover:text-white transition-colors">
                    {selectedCase === index ? 'Hide Details' : 'View Details'} →
                  </button>
                </div>

                {selectedCase === index && (
                  <motion.div
                    className="border-t border-white/5 p-6 bg-zinc-900/50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Challenge</h4>
                        <p className="text-zinc-400 text-sm font-light">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Solution</h4>
                        <p className="text-zinc-400 text-sm font-light">{study.solution}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Key Results</h4>
                        <ul className="space-y-1">
                          {study.metrics.map((metric, metricIndex) => (
                            <li key={metricIndex} className="text-zinc-400 text-sm flex items-center gap-2 font-light">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
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
      <SEO
        title="Careers"
        description="Join our team of digital innovators and creators. We're always looking for talented individuals."
      />
      {/* Hero Section */}
      <section className="py-20 px-4 bg-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-luxury-black to-luxury-black" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading tracking-tight">
              Join Our <span className="text-gradient">Team</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
              Be part of a passionate team that's shaping the future of digital experiences. We're always looking for talented individuals who share our vision of excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-20 px-4 bg-luxury-black">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">
              Open <span className="text-gradient">Positions</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-2xl p-8 border border-white/5 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-heading">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-zinc-400 font-light">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <motion.button
                    className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-6 py-3 rounded-full font-bold hover:from-blue-600 hover:to-blue-600 transition-all duration-300 mt-4 md:mt-0 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply Now
                  </motion.button>
                </div>
                <p className="text-zinc-300 font-light">{job.description}</p>
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
      <SEO
        title="Our Team"
        description="Meet the diverse team of digital experts behind GrowBrandi's success."
      />
      <section className="relative min-h-screen bg-luxury-black flex flex-col items-center justify-center overflow-hidden py-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Architectural Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          {/* Dynamic Mesh Gradients */}
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-400 font-bold text-sm tracking-[0.2em] uppercase mb-4 block">
              Meet Our Team
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 font-heading tracking-tight leading-tight">
              The Experts Behind <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient-x">
                Your Success
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
              Our diverse team of digital experts brings together decades of experience in
              development, design, marketing, and AI to deliver exceptional results for our clients.
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.div
                key={member.name}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredMember(index)}
                onMouseLeave={() => setHoveredMember(null)}
                whileHover={{ y: -12, scale: 1.02 }}
              >
                <div className="glass-effect rounded-[2rem] p-8 h-full relative overflow-hidden border border-white/5 group-hover:border-white/20 transition-all duration-500 bg-zinc-900/30 backdrop-blur-xl">
                  {/* Background Glow Effect */}
                  <div className={`absolute inset-0 transition-all duration-700 opacity-0 group-hover:opacity-100 ${hoveredMember === index
                    ? 'bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent'
                    : ''
                    }`} />

                  {/* Decorative Gradient Border Top */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                  <div className="relative z-10 flex flex-col h-full">
                    <Link to={`/team/${member.slug}`} className="block flex-grow">
                      {/* Profile Image Container */}
                      <div className="relative mb-8 mx-auto w-40 h-40">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                        <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 group-hover:border-white/30 transition-all duration-500">
                          <img
                            src={member.image}
                            alt={member.name}
                            loading="lazy"
                            width="300"
                            height="300"
                            className="w-full h-full object-cover rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          {/* Fallback */}
                          <div className="hidden absolute inset-0 bg-zinc-800 rounded-full items-center justify-center">
                            <span className="text-2xl font-bold text-zinc-400">{member.name.charAt(0)}</span>
                          </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-zinc-900 z-20" title="Available"></div>
                      </div>

                      {/* Member Info */}
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300 font-heading tracking-tight">
                          {member.name}
                        </h3>
                        <div className="text-zinc-400 font-medium text-sm uppercase tracking-wider mb-4 group-hover:text-white transition-colors duration-300">
                          {member.role}
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed font-light line-clamp-3 group-hover:text-zinc-400 transition-colors duration-300">
                          {member.description}
                        </p>
                      </div>
                    </Link>

                    {/* Specialties */}
                    <div className="mb-8">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.specialties.slice(0, 3).map((specialty, idx) => (
                          <span
                            key={specialty}
                            className="px-3 py-1 bg-white/5 text-zinc-400 text-xs font-medium rounded-full border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 group-hover:text-blue-300 transition-all duration-300"
                          >
                            {specialty}
                          </span>
                        ))}
                        {member.specialties.length > 3 && (
                          <span className="px-2 py-1 text-zinc-400 text-xs font-medium">+ {member.specialties.length - 3}</span>
                        )}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-3 mt-auto pt-6 border-t border-white/5 group-hover:border-white/10 transition-colors duration-300">
                      {Object.entries(member.social).map(([platform, url]) => {
                        if (!url) return null;
                        const icons = {
                          linkedin: <FaLinkedin className="w-4 h-4" />,
                          twitter: <FaTwitter className="w-4 h-4" />,
                          github: <FaGithub className="w-4 h-4" />,
                          dribbble: <FaDribbble className="w-4 h-4" />,
                          instagram: <FaInstagram className="w-4 h-4" />,
                          email: <FaEnvelope className="w-4 h-4" />
                        };

                        return (
                          <motion.a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-full bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`${member.name} ${platform}`}
                          >
                            {icons[platform as keyof typeof icons]}
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
            className="text-center mt-32"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-effect rounded-[2.5rem] p-12 max-w-5xl mx-auto border border-white/10 bg-gradient-to-b from-zinc-900/50 to-black/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading tracking-tight">
                Ready to Work with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Our Amazing Team?</span>
              </h2>
              <p className="text-zinc-400 text-xl mb-10 max-w-2xl mx-auto font-light">
                Let's discuss your project and see how our expert team can help you achieve
                your digital goals. We're here to turn your vision into reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Your Project
                  </motion.button>
                </Link>
                <Link to="/about">
                  <motion.button
                    className="glass-effect text-white hover:bg-white/10 font-bold px-10 py-4 rounded-full transition-all duration-300 border border-white/10 hover:border-white/30 text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More
                  </motion.button>
                </Link>
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
      <SEO
        title="Blog"
        description="Insights, tips, and industry trends from our team of digital experts."
      />
      {/* Hero Section */}
      <section className="py-20 px-4 bg-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-luxury-black to-luxury-black" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-heading tracking-tight">
              Our <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
              Insights, tips, and industry trends from our team of digital experts. Stay informed about the latest in web development, design, and digital marketing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 px-4 bg-luxury-black">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={index}
                className="glass-effect rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} loading="lazy" width="800" height="400" className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/70 font-semibold text-sm uppercase tracking-wider">{post.category}</span>
                    <span className="text-zinc-400 text-sm font-light">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-heading">{post.title}</h3>
                  <p className="text-zinc-400 mb-4 font-light">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm font-light">{post.date}</span>
                    <button className="text-white font-semibold hover:text-zinc-300 transition-colors">
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
