import React from 'react';
import { Service, Project, Testimonial, CompanyStat, FAQItem } from './types';

// App Constants
export const APP_NAME = 'GrowBrandi';
export const APP_TAGLINE = 'AI-Powered Digital Agency';
export const APP_SUBTITLE = 'Transform Your Business with Expert Digital Solutions';

// Company Statistics (similar to ecomixpower.com)
export const COMPANY_STATS: CompanyStat[] = [
  { number: '150+', label: 'Projects Completed', icon: '📊' },
  { number: '50+', label: 'Happy Clients', icon: '😊' },
  { number: '5+', label: 'Years Experience', icon: '🏆' },
  { number: '24/7', label: 'Support Available', icon: '🔧' }
];

// Contact Information
export const CONTACT_INFO = {
  email: 'hello@growbrandi.com',
  phone: '+1 (555) 123-4567',
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
    answer: 'We combine AI-powered insights with human creativity to deliver exceptional digital solutions. Our data-driven approach, modern tech stack, and focus on ROI set us apart from traditional agencies.'
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
    answer: 'We specialize in modern technologies including React, Next.js, Node.js, TypeScript, and AI/ML integration. We choose the best tech stack based on your specific project requirements and goals.'
  },
  {
    question: 'Can you help with existing website improvements?',
    answer: 'Absolutely! We offer website audits, performance optimization, redesigns, and feature enhancements for existing websites. We can work with your current platform or recommend migrations if needed.'
  }
];

// Using Heroicons for a consistent, modern look
const ICONS = {
    'Brand Strategy': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" }, 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a12.06 12.06 0 00-4.5 0m3.75 2.311a12.06 12.06 0 01-4.5 0m3.75-2.311a12.06 12.06 0 00-4.5 0" }), 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-6-6v0a6 6 0 00-6 6v1.5a6 6 0 006 6z" })),
    'UI/UX Design': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" }, 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5v-5.714c0-.597-.237-1.17-.659-1.591L14.25 3.104" }), 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 14.5L3 21m18-6.5l-2 6.5m-3.75-11.25a24.301 24.301 0 00-4.5 0" })),
    'Web Development': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" }, 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" })),
    'Content Creation': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" }, 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" })),
    'SEO Optimization': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" }, 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" }), 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 12c0-5.242-4.258-9.5-9.5-9.5S.5 6.758.5 12s4.258 9.5 9.5 9.5 9.5-4.258 9.5-9.5z" })),
    'Digital Marketing': React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" }, 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" }), 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5a6 6 0 11-12 0 6 6 0 0112 0z" }), 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 21l-4.35-4.35" })),
};

export const SERVICES: Service[] = [
  {
    title: 'Brand Strategy',
    description: 'Build a powerful brand identity that resonates with your target audience and drives business growth through comprehensive strategy and positioning.',
    icon: ICONS['Brand Strategy'],
    features: ['Brand Identity Design', 'Market Research', 'Competitive Analysis', 'Brand Guidelines'],
    price: 'Starting at $2,999',
    color: 'from-emerald-500 to-teal-500'
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
    description: 'Develop fast, secure, and scalable websites using cutting-edge technologies that perform flawlessly across all devices.',
    icon: ICONS['Web Development'],
    features: ['React/Next.js', 'Responsive Design', 'Performance Optimization', 'CMS Integration'],
    price: 'Starting at $3,999',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Content Creation',
    description: 'Craft compelling content that tells your brand story, engages your audience, and drives meaningful conversions.',
    icon: ICONS['Content Creation'],
    features: ['Content Strategy', 'Copywriting', 'Visual Content', 'SEO Content'],
    price: 'Starting at $999',
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'SEO Optimization',
    description: 'Improve your search rankings and drive organic traffic with comprehensive SEO strategies and technical optimization.',
    icon: ICONS['SEO Optimization'],
    features: ['Technical SEO', 'Keyword Research', 'Content Optimization', 'Link Building'],
    price: 'Starting at $1,499',
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Digital Marketing',
    description: 'Scale your business with data-driven digital marketing campaigns across multiple channels for maximum ROI.',
    icon: ICONS['Digital Marketing'],
    features: ['Social Media Marketing', 'PPC Campaigns', 'Email Marketing', 'Analytics & Reporting'],
    price: 'Starting at $1,999',
    color: 'from-cyan-500 to-blue-500'
  },
];

export const PROJECTS: Project[] = [
  {
    title: "E-commerce Fashion Platform",
    category: "Web Development",
    description: "A modern, responsive e-commerce platform with advanced filtering, wishlist, and seamless checkout experience for a leading fashion brand.",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    rating: 5,
    completionTime: '8 weeks',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    client: 'Fashion Forward Co.',
    results: ['300% increase in online sales', '50% better conversion rate', '40% faster page load times']
  },
  {
    title: "SaaS Analytics Dashboard",
    category: "UI/UX Design",
    description: "Intuitive dashboard design for a complex analytics platform with real-time data visualization and comprehensive reporting capabilities.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    rating: 5,
    completionTime: '6 weeks',
    technologies: ['Figma', 'React', 'D3.js', 'TypeScript'],
    client: 'DataTech Solutions',
    results: ['60% improvement in user engagement', '90% user satisfaction score', '35% reduction in support tickets']
  },
  {
    title: "Restaurant Chain Mobile App",
    category: "Mobile Development",
    description: "Cross-platform mobile app with online ordering, loyalty program, and location-based services for a major restaurant chain.",
    imageUrl: "https://images.unsplash.com/photo-1553678324-f84674bd7b24?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    rating: 4.8,
    completionTime: '12 weeks',
    technologies: ['React Native', 'Firebase', 'Stripe', 'Google Maps'],
    client: 'Gourmet Chains Inc.',
    results: ['500K+ app downloads', '75% increase in mobile orders', '95% app store rating']
  },
  {
    title: "FinTech Startup Brand Identity",
    category: "Brand Strategy",
    description: "Complete brand identity and website for a revolutionary fintech startup focusing on micro-investments and wealth building.",
    imageUrl: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    rating: 5,
    completionTime: '10 weeks',
    technologies: ['Brand Design', 'Web Development', 'Motion Graphics'],
    client: 'InvestSmart',
    results: ['$2M seed funding raised', 'Featured in TechCrunch', '10K+ beta signups']
  },
];

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: "GrowBrandi transformed our digital presence completely. Their AI-powered approach to web development and design resulted in a 300% increase in leads and a stunning website that our customers love.",
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