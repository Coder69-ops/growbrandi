import React from 'react';
import { Service, Project, Testimonial, CompanyStat, FAQItem, TeamMember } from './types';

// App Constants
export const APP_NAME = 'GrowBrandi';
export const APP_TAGLINE = 'GrowBrandi - Expert Digital Growth Agency';
export const APP_SUBTITLE = 'Transform Your Business with Expert Digital Solutions';

// Company Statistics
export const COMPANY_STATS: CompanyStat[] = [
  { number: '150+', label: 'Projects Completed', icon: '📊' },
  { number: '50+', label: 'Happy Clients', icon: '😊' },
  { number: '5+', label: 'Years Experience', icon: '🏆' },
  { number: '24/7', label: 'Support Available', icon: '🔧' }
];

// Contact Information
export const CONTACT_INFO = {
  email: 'growbrandi.co@gmail.com',
  phone: '+880 1755 154 194',
  address: 'San Francisco, CA',
  social: {
    linkedin: 'https://linkedin.com/company/growbrandi',
    twitter: 'https://twitter.com/growbrandi',
    instagram: 'https://instagram.com/growbrandi',
    dribbble: 'https://dribbble.com/growbrandi'
  }
};

// FAQ Data
export const FAQ_DATA: FAQItem[] = [
  {
    question: 'What makes GrowBrandi different from other digital agencies?',
    answer: 'GrowBrandi combines intelligent data insights with creative expertise to deliver exceptional digital solutions. Our proprietary growth methodology, cutting-edge tech stack, and obsessive focus on measurable ROI set us apart from traditional agencies.'
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary based on scope and complexity. Simple websites take 4-6 weeks, while complex web applications can take 12-16 weeks. We provide detailed timelines during our initial consultation.'
  },
  {
    question: 'Do you provide ongoing support and maintenance?',
    answer: 'Yes! We offer comprehensive support packages including regular updates, security monitoring, performance optimization, and 24/7 technical support to ensure your digital assets perform optimally.'
  },
  {
    question: 'What technologies do you work with?',
    answer: 'GrowBrandi specializes in cutting-edge technologies including React, Next.js, Node.js, TypeScript, and intelligent automation. Our technical experts choose the optimal tech stack based on your specific project requirements and growth goals.'
  },
  {
    question: 'Can you help with existing website improvements?',
    answer: 'Absolutely! We offer website audits, performance optimization, redesigns, and feature enhancements for existing websites. We can work with your current platform or recommend migrations if needed.'
  }
];

// Using Heroicons for a consistent, modern look
const ICONS = {
  'Brand Growth': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" })),
  'Social Media Content': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" })),
  'UI/UX Design': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5v-5.714c0-.597-.237-1.17-.659-1.591L14.25 3.104" }),
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 14.5L3 21m18-6.5l-2 6.5m-3.75-11.25a24.301 24.301 0 00-4.5 0" })),
  'Web Development': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" })),
  'Virtual Assistance': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" })),
  'Customer Support': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" })),
};

export const SERVICES: Service[] = [
  {
    title: 'Brand Growth',
    description: 'Scale your business with high-performance ad campaigns on TikTok, Meta, and Google. We focus on measurable ROI and rapid growth.',
    icon: ICONS['Brand Growth'],
    features: ['TikTok Ads', 'Meta Ads (Facebook/Instagram)', 'Google Ads', 'Performance Analytics'],
    price: 'Custom Strategy',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    title: 'Social Media Content',
    description: 'Engage your audience with professional video editing and post creation. We create content that stops the scroll and drives action.',
    icon: ICONS['Social Media Content'],
    features: ['Video Editing (Reels/TikToks)', 'Post Design', 'Content Strategy', 'Trend Analysis'],
    price: 'Starting at $1,500/mo',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'UI/UX Design',
    description: 'Create stunning, user-friendly interfaces that enhance user experience and boost conversion rates with modern design principles.',
    icon: ICONS['UI/UX Design'],
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    price: 'Starting at $1,999',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    title: 'Web Development',
    description: 'Develop fast, secure, and scalable websites using Shopify and WordPress. We build platforms that sell.',
    icon: ICONS['Web Development'],
    features: ['Shopify Development', 'WordPress Solutions', 'Custom Web Apps', 'E-commerce Optimization'],
    price: 'Starting at $2,500',
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'Virtual Assistance',
    description: 'Delegate time-consuming tasks to our professional virtual assistants. Focus on growing your business while we handle the rest.',
    icon: ICONS['Virtual Assistance'],
    features: ['Admin Support', 'Data Entry', 'Research', 'Calendar Management'],
    price: 'Hourly Rates Available',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    title: 'Customer Support',
    description: 'Provide exceptional 24/7 support to your customers. Our trained team ensures high satisfaction and retention.',
    icon: ICONS['Customer Support'],
    features: ['Live Chat Support', 'Email Support', 'Ticket Management', 'Weekly/Monthly Packages'],
    price: 'Weekly & Monthly Packages',
    color: 'from-green-500 to-emerald-500'
  },
];

export const PROJECTS: Project[] = [
  {
    title: "Machain Store",
    category: "E-commerce",
    description: "A high-converting Shopify store for a leading fashion retailer. We optimized the user journey and implemented advanced retention strategies.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    rating: 5,
    completionTime: '6 weeks',
    technologies: ['Shopify', 'Liquid', 'Klaviyo', 'Meta Ads'],
    client: 'Machain Store',
    results: ['300% Revenue Increase', '50% Higher AOV', '25% Repeat Purchase Rate'],
    growthMetrics: '300% Revenue Increase',
    beforeImage: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    afterImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max"
  },
  {
    title: "Mauvis",
    category: "Web Development",
    description: "A sleek, modern website for a premium beauty brand. Focused on brand storytelling and seamless booking integration.",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    rating: 5,
    completionTime: '4 weeks',
    technologies: ['WordPress', 'Elementor', 'SEO', 'Google Analytics'],
    client: 'Mauvis Beauty',
    results: ['10x ROI', '200% More Bookings', 'Top 3 Search Ranking'],
    growthMetrics: '10x ROI',
    beforeImage: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    afterImage: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max"
  },
  {
    title: "Saravia Gems",
    category: "E-commerce",
    description: "Luxury jewelry e-commerce platform built for trust and high-ticket sales. Enhanced product visualization and secure checkout flow.",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    rating: 5,
    completionTime: '8 weeks',
    technologies: ['Shopify Plus', '3D Modeling', 'Google Ads', 'Email Marketing'],
    client: 'Saravia Gems',
    results: ['Top 1% Shopify Store', '40% Conversion Rate', 'Zero Downtime'],
    growthMetrics: 'Top 1% Shopify Store',
    beforeImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    afterImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max"
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "GrowBrandi transformed our digital presence completely. Their data-driven approach to web development and intelligent design strategy resulted in a 300% increase in leads and a stunning website that our customers love.",
    author: "Sarah Johnson",
    company: "CEO at TechFlow Solutions",
    rating: 5,
    image: "/testimonials/sarah-johnson.jpg"
  },
  {
    quote: "The team at GrowBrandi is exceptional. They delivered a beautiful, responsive website that perfectly captures our brand essence. The SEO optimization has dramatically improved our search rankings.",
    author: "Michael Chen",
    company: "Founder of EcoVibe",
    rating: 5,
    image: "/testimonials/michael-chen.jpg"
  },
  {
    quote: "Working with GrowBrandi was a game-changer for our fashion brand. Their UI/UX design expertise and attention to detail created an e-commerce platform that converts visitors into customers.",
    author: "Emily Rodriguez",
    company: "Marketing Director at StyleHub",
    rating: 5,
    image: "/testimonials/emily-rodriguez.jpg"
  },
  {
    quote: "GrowBrandi's development team is top-notch. They built us a complex SaaS platform that scales beautifully. Their modern tech stack and clean code practices are impressive.",
    author: "David Thompson",
    company: "CTO at DataDrive",
    rating: 4.9,
    image: "/testimonials/david-thompson.jpg"
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Shuvo Mallick",
    role: "CEO & Founder",
    slug: "shuvo-mallick",
    description: "Visionary leader with a passion for driving business growth through innovative digital strategies.",
    bio: "Shuvo Mallick is the visionary architect behind GrowBrandi. With over a decade of high-stakes experience in digital transformation and brand strategy, he has successfully guided over 50 businesses from early-stage startups to market-dominating enterprises. His unique 'Growth Engine' methodology combines creative storytelling with rigorous data analytics, ensuring that every campaign delivers measurable, scalable results. Shuvo is a sought-after speaker at industry conferences and a mentor to emerging tech entrepreneurs.",
    achievements: [
      "Scaled 50+ businesses to 7-figure annual revenue",
      "Pioneered GrowBrandi's proprietary 'Growth Engine' methodology",
      "Keynote speaker at the 2024 Digital Growth Summit",
      "Awarded 'Digital Innovator of the Year' by TechWeekly"
    ],
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    specialties: ["Business Strategy", "Executive Leadership", "Growth Hacking", "Brand Architecture"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "shuvo@growbrandi.com"
    }
  },
  {
    name: "Binita Biswas",
    role: "GrowBrandi Solutions Architect",
    slug: "binita-biswas",
    description: "Expert in designing scalable solutions and integrating intelligent technologies for maximum efficiency.",
    bio: "Binita is a master of systems thinking. As our Solutions Architect, she specializes in translating complex business requirements into elegant, scalable technical ecosystems. Her expertise spans cloud infrastructure, AI integration, and enterprise software architecture. Binita ensures that GrowBrandi's clients don't just get a website, but a robust digital foundation capable of supporting exponential growth. She is passionate about automation and efficiency, constantly finding ways to streamline operations.",
    achievements: [
      "Architected enterprise-grade solutions for Fortune 500 clients",
      "Reduced client operational costs by an average of 40% through automation",
      "Led the development of GrowBrandi's AI Business Advisor tool",
      "Certified AWS Solutions Architect Professional"
    ],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    specialties: ["Solutions Architecture", "System Integration", "Cloud Infrastructure", "AI Implementation"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "binita@growbrandi.com"
    }
  },
  {
    name: "Ovejit Das",
    role: "Head of Development",
    slug: "ovejit-das",
    description: "Leading the engineering team to build robust, high-performance applications with cutting-edge tech.",
    bio: "Ovejit is the technical backbone of GrowBrandi. Leading our engineering team with a focus on code quality, performance, and security, he ensures that every digital product we build is a masterpiece of modern engineering. A full-stack expert with a deep love for clean code, Ovejit stays ahead of the curve on emerging technologies, from Web3 to edge computing. His leadership style fosters a culture of continuous learning and technical excellence within the development team.",
    achievements: [
      "Oversees a high-performing team of 15+ senior developers",
      "Maintains 99.99% uptime across all client applications",
      "Spearheaded the migration to a serverless architecture, reducing costs by 30%",
      "Contributor to major open-source React libraries"
    ],
    image: "https://ik.imagekit.io/nltb2bcz4/IMG_2765url.JPG",
    specialties: ["Full Stack Development", "Cloud Architecture", "Team Leadership", "Cybersecurity"],
    social: {
      linkedin: "#",
      github: "#",
      email: "ovejit@growbrandi.com"
    }
  },
  {
    name: "Nijhum Nur",
    role: "Digital Marketing Strategist",
    slug: "nijhum-nur",
    description: "Data-driven marketer specializing in paid advertising and conversion rate optimization.",
    bio: "Nijhum lives at the intersection of psychology and data. As our lead strategist, she crafts high-ROI campaigns that turn casual browsers into loyal brand advocates. Her deep understanding of consumer behavior and platform algorithms allows her to uncover hidden opportunities for growth. Nijhum manages substantial ad budgets across Meta, Google, and TikTok, consistently delivering ROAS that exceeds industry benchmarks. She believes that every click tells a story.",
    achievements: [
      "Managed over $2M in ad spend with a 5x average ROAS",
      "Increased client conversion rates by an average of 150% in 2024",
      "Certified Google Ads and Meta Blueprint Professional",
      "Developed a proprietary audience targeting framework"
    ],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    specialties: ["PPC Advertising", "Social Media Strategy", "Conversion Rate Optimization", "Data Analytics"],
    social: {
      linkedin: "#",
      instagram: "#",
      email: "nijhum@growbrandi.com"
    }
  },
  {
    name: "Ar Jinia",
    role: "UI/UX Designer",
    slug: "ar-jinia",
    description: "Creative designer crafting intuitive and visually stunning user experiences.",
    bio: "Jinia believes that great design is invisible—it just works. She creates intuitive, user-centric interfaces that delight users and drive engagement. Her designs balance aesthetic beauty with functional clarity, creating memorable digital experiences that reinforce brand identity. Jinia's process involves deep user research, rapid prototyping, and iterative testing to ensure that every pixel serves a purpose. She is an expert in creating cohesive design systems that scale.",
    achievements: [
      "Winner of the 2023 Awwwards 'Site of the Day'",
      "Redesigned major e-commerce flows resulting in 30% less cart abandonment",
      "Created the comprehensive 'Prism' design system used across all internal projects",
      "Featured in 'Best of Behance' for Interaction Design"
    ],
    image: "https://images.unsplash.com/photo-1598550874175-4d7112ee750c?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    specialties: ["UI/UX Design", "Interaction Design", "User Research", "Prototyping"],
    social: {
      linkedin: "#",
      dribbble: "#",
      email: "jinia@growbrandi.com"
    }
  },
  {
    name: "Riaz Shahriar",
    role: "Project Manager",
    slug: "riaz-shahriar",
    description: "Ensuring projects are delivered on time and within budget with seamless communication.",
    bio: "Riaz is the glue that holds our projects together. With his meticulous attention to detail and proactive communication style, he ensures that every project is delivered on time, within budget, and exceeds client expectations. Riaz is a master of Agile methodologies, capable of adapting to changing requirements while keeping the team focused and motivated. He believes that transparency and trust are the cornerstones of successful project management.",
    achievements: [
      "Successfully delivered 100+ projects on schedule and under budget",
      "Maintains a perfect 100% client satisfaction rating",
      "Certified Scrum Master (CSM) and PMP",
      "Implemented a new project tracking system that improved team velocity by 20%"
    ],
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    specialties: ["Agile Project Management", "Client Relations", "Resource Planning", "Risk Management"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "riaz@growbrandi.com"
    }
  }
];