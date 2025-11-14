import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
  // Using the same team data from the homepage Hero component
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Creative Director",
      description: "10+ years leading digital transformation projects with expertise in brand strategy and user experience design.",
      image: "https://static.vecteezy.com/system/resources/thumbnails/038/962/461/small/ai-generated-caucasian-successful-confident-young-businesswoman-ceo-boss-bank-employee-worker-manager-with-arms-crossed-in-formal-wear-isolated-in-white-background-photo.jpg",
      specialties: ["Brand Strategy", "UX Design", "Leadership"],
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@growbrandi.com"
      }
    },
    {
      name: "Marcus Johnson",
      role: "Head of Development",
      description: "Full-stack developer with passion for creating scalable, high-performance web applications using modern technologies.",
      image: "https://heroshotphotography.com/wp-content/uploads/2023/03/male-linkedin-corporate-headshot-on-white-square-1024x1024.jpg",
      specialties: ["React/Next.js", "Node.js", "Cloud Architecture"],
      social: {
        linkedin: "#",
        github: "#",
        email: "marcus@growbrandi.com"
      }
    },
    {
      name: "Elena Rodriguez",
      role: "AI Solutions Architect",
      description: "AI/ML specialist focused on integrating intelligent solutions that drive business growth and user engagement.",
      image: "https://images.stockcake.com/public/5/5/a/55aa0081-3d0d-495b-b649-4838f12aedd3_large/professional-young-man-stockcake.jpg",
      specialties: ["Machine Learning", "AI Integration", "Data Analytics"],
      social: {
        linkedin: "#",
        twitter: "#",
        email: "elena@growbrandi.com"
      }
    },
    {
      name: "David Kim",
      role: "Digital Marketing Strategist",
      description: "Performance marketing expert who combines data-driven insights with creative campaigns to maximize ROI.",
      image: "https://media.istockphoto.com/id/1391718981/photo/portrait-of-a-confident-young-businessman-standing-with-his-arms-crossed-in-an-office.jpg?s=612x612&w=0&k=20&c=eF_0QCtw-Y8Q2c4_xQe6KTkcSPiGCT6qBf6nuavE2Dg=",
      specialties: ["SEO/SEM", "Content Strategy", "Analytics"],
      social: {
        linkedin: "#",
        instagram: "#",
        email: "david@growbrandi.com"
      }
    },
    {
      name: "Amy Thompson",
      role: "UI/UX Designer",
      description: "Creative designer passionate about crafting intuitive user interfaces that deliver exceptional user experiences.",
      image: "https://static.vecteezy.com/system/resources/thumbnails/038/962/461/small/ai-generated-caucasian-successful-confident-young-businesswoman-ceo-boss-bank-employee-worker-manager-with-arms-crossed-in-formal-wear-isolated-in-white-background-photo.jpg",
      specialties: ["UI Design", "Prototyping", "User Research"],
      social: {
        linkedin: "#",
        dribbble: "#",
        email: "amy@growbrandi.com"
      }
    },
    {
      name: "James Wilson",
      role: "Project Manager",
      description: "Agile project management expert ensuring seamless delivery of complex projects on time and within budget.",
      image: "https://heroshotphotography.com/wp-content/uploads/2023/03/male-linkedin-corporate-headshot-on-white-square-1024x1024.jpg",
      specialties: ["Agile/Scrum", "Team Leadership", "Client Relations"],
      social: {
        linkedin: "#",
        twitter: "#",
        email: "james@growbrandi.com"
      }
    }
  ];

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
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
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="glass-effect rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-center">
                  {/* Profile Image */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur-sm opacity-50 group-hover:opacity-70 transition-opacity" />
                    <img
                      src={member.image}
                      alt={member.name}
                      className="relative w-24 h-24 rounded-full mx-auto object-cover border-2 border-white/20"
                    />
                  </div>

                  {/* Name and Role */}
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-emerald-400 font-semibold text-sm mb-4">{member.role}</p>

                  {/* Description */}
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {member.description}
                  </p>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-white/10 text-slate-300 text-xs rounded-full border border-white/20"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        className="w-10 h-10 bg-white/10 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        className="w-10 h-10 bg-white/10 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </a>
                    )}
                    {member.social.github && (
                      <a
                        href={member.social.github}
                        className="w-10 h-10 bg-white/10 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    )}
                    {member.social.instagram && (
                      <a
                        href={member.social.instagram}
                        className="w-10 h-10 bg-white/10 hover:bg-pink-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {member.social.dribbble && (
                      <a
                        href={member.social.dribbble}
                        className="w-10 h-10 bg-white/10 hover:bg-pink-400 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm7.568 5.302c1.4 1.5 2.252 3.5 2.273 5.698-.653-.126-7.512-1.563-7.512-1.563s-.04-.472-.088-1.127c7.583-3.15 7.327-2.998 7.327-2.998zm-7.568-1.704s-.678 1.679-4.357 5.062C5.418 6.816 4.04 5.415 4.04 5.415A10.728 10.728 0 0112 1.596zM2.258 7.882s1.27 1.04 5.522 2.44c.992-1.772 2.1-4.145 2.1-4.145A10.7 10.7 0 002.258 7.882zm16.227 7.75c-.456 2.023-1.952 3.977-1.952 3.977s-2.31-6.84-2.4-7.047c5.775-.987 6.352.93 6.352.93zm-8.485 5.36s-.04-.678-.04-1.61c6.418-2.676 6.153-2.558 6.153-2.558-.456 1.862-2.023 3.574-2.023 3.574s-2.31-.406-4.09-.406z"/>
                        </svg>
                      </a>
                    )}
                    <a
                      href={`mailto:${member.social.email}`}
                      className="w-10 h-10 bg-white/10 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
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