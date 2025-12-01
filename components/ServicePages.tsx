import React from 'react';
import ServicePage from './ServicePage';

// Web Development Service Page
export const WebDevelopmentPage: React.FC = () => {
  return (
    <ServicePage
      title="Web Development"
      description="Transform your digital presence with cutting-edge web development solutions. From responsive websites to complex web applications, we build scalable, secure, and high-performance digital experiences that drive business growth."
      features={[
        "Custom Website Development",
        "Responsive Design Implementation",
        "Progressive Web Applications (PWA)",
        "E-commerce Solutions",
        "Content Management Systems",
        "API Development & Integration",
        "Database Design & Optimization",
        "Performance Optimization",
        "Security Implementation"
      ]}
      benefits={[
        "Lightning-Fast Loading Times",
        "Mobile-First Responsive Design",
        "Search Engine Optimized Structure",
        "Scalable Architecture",
        "Advanced Security Features",
        "Cross-Browser Compatibility",
        "24/7 Technical Support",
        "Regular Updates & Maintenance"
      ]}
      technologies={[
        "React", "Next.js", "TypeScript", "Node.js", "Express.js", "MongoDB", "PostgreSQL",
        "AWS", "Docker", "Tailwind CSS", "Framer Motion", "GraphQL", "REST APIs"
      ]}
      process={[
        "Discovery & Requirements Analysis - We dive deep into your business needs, target audience, and project goals to create a comprehensive development strategy.",
        "UI/UX Design & Prototyping - Creating user-centric designs and interactive prototypes to visualize the final product before development begins.",
        "Development & Implementation - Building your website using modern technologies with clean, maintainable code and best development practices.",
        "Testing & Quality Assurance - Rigorous testing across devices, browsers, and performance scenarios to ensure flawless functionality.",
        "Deployment & Launch - Seamless deployment to production with monitoring, analytics, and performance optimization.",
        "Maintenance & Support - Ongoing support, updates, and enhancements to keep your website secure and performing at its best."
      ]}
      pricing={{
        starter: {
          price: "$999",
          features: [
            "5-Page Custom Website",
            "Responsive Design",
            "Contact Form Integration",
            "Basic SEO Setup",
            "1 Month Support",
            "Basic Analytics"
          ]
        },
        professional: {
          price: "$2,999",
          features: [
            "Up to 15 Pages",
            "Advanced Custom Features",
            "E-commerce Integration",
            "CMS Implementation",
            "Advanced SEO",
            "3 Months Support",
            "Performance Optimization",
            "Security Features"
          ]
        },
        enterprise: {
          price: "$5,999",
          features: [
            "Unlimited Pages",
            "Custom Web Application",
            "Advanced Integrations",
            "Database Design",
            "API Development",
            "6 Months Support",
            "Dedicated Project Manager",
            "Priority Support"
          ]
        }
      }}
    />
  );
};

// UI/UX Design Service Page
export const UIUXDesignPage: React.FC = () => {
  return (
    <ServicePage
      title="UI/UX Design"
      description="Create exceptional user experiences that captivate and convert. Our design team crafts intuitive interfaces and seamless user journeys that not only look stunning but drive meaningful engagement and business results."
      features={[
        "User Experience (UX) Research",
        "User Interface (UI) Design",
        "Wireframing & Prototyping",
        "Design System Creation",
        "Usability Testing",
        "Interaction Design",
        "Visual Brand Identity",
        "Mobile App Design",
        "Accessibility Design"
      ]}
      benefits={[
        "Increased User Engagement",
        "Higher Conversion Rates",
        "Improved Brand Perception",
        "Reduced Development Costs",
        "Enhanced User Satisfaction",
        "Competitive Advantage",
        "Data-Driven Design Decisions",
        "Scalable Design Systems"
      ]}
      technologies={[
        "Figma", "Adobe XD", "Sketch", "InVision", "Principle", "Framer",
        "Adobe Creative Suite", "Miro", "Whimsical", "UserTesting", "Hotjar"
      ]}
      process={[
        "Discovery & Research - Understanding your users, business goals, and market landscape through comprehensive research and analysis.",
        "Information Architecture - Structuring content and functionality to create intuitive navigation and user flows.",
        "Wireframing & Prototyping - Creating low and high-fidelity wireframes and interactive prototypes to test concepts and functionality.",
        "Visual Design - Developing the visual identity, color schemes, typography, and UI elements that bring your brand to life.",
        "Usability Testing - Testing designs with real users to validate decisions and identify areas for improvement.",
        "Design Handoff & Support - Providing detailed specifications and ongoing support during development to ensure pixel-perfect implementation."
      ]}
      pricing={{
        starter: {
          price: "$799",
          features: [
            "5 Page UI Design",
            "Basic Wireframes",
            "Mobile Responsive Design",
            "Style Guide",
            "2 Revision Rounds",
            "Design Assets"
          ]
        },
        professional: {
          price: "$1,999",
          features: [
            "Complete Website/App Design",
            "User Research & Personas",
            "Interactive Prototypes",
            "Comprehensive Design System",
            "Usability Testing",
            "4 Revision Rounds",
            "Developer Handoff"
          ]
        },
        enterprise: {
          price: "$3,999",
          features: [
            "Complex Application Design",
            "Advanced User Research",
            "Custom Design System",
            "Accessibility Compliance",
            "A/B Testing Setup",
            "Unlimited Revisions",
            "Ongoing Design Support"
          ]
        }
      }}
    />
  );
};

// Brand Strategy Service Page
export const BrandStrategyPage: React.FC = () => {
  return (
    <ServicePage
      title="Brand Strategy"
      description="Build a powerful brand that resonates with your audience and drives business growth. Our strategic approach combines market insights, creative vision, and proven methodologies to position your brand for long-term success."
      features={[
        "Brand Positioning Strategy",
        "Competitive Analysis",
        "Target Audience Research",
        "Brand Identity Development",
        "Messaging Framework",
        "Visual Identity System",
        "Brand Guidelines Creation",
        "Brand Voice & Tone",
        "Go-to-Market Strategy"
      ]}
      benefits={[
        "Clear Brand Differentiation",
        "Stronger Market Position",
        "Increased Brand Recognition",
        "Higher Customer Loyalty",
        "Premium Pricing Capability",
        "Consistent Brand Experience",
        "Improved Marketing ROI",
        "Long-term Brand Value"
      ]}
      technologies={[
        "Brand Strategy Frameworks", "Market Research Tools", "Adobe Creative Suite",
        "Figma", "Miro", "Survey Tools", "Analytics Platforms", "Social Listening Tools"
      ]}
      process={[
        "Brand Discovery - Deep dive into your business, values, goals, and current market position to understand your unique story.",
        "Market Research & Analysis - Comprehensive analysis of your industry, competitors, and target audience to identify opportunities.",
        "Strategy Development - Creating your brand positioning, messaging framework, and strategic roadmap for market success.",
        "Identity Creation - Developing visual identity, logo design, color palette, and typography that embodies your brand essence.",
        "Brand Guidelines - Comprehensive brand guidelines to ensure consistent application across all touchpoints.",
        "Implementation Support - Ongoing guidance and support to implement your brand strategy across all business functions."
      ]}
      pricing={{
        starter: {
          price: "$1,499",
          features: [
            "Brand Audit & Analysis",
            "Basic Brand Positioning",
            "Logo Design",
            "Color Palette",
            "Typography Selection",
            "Basic Brand Guidelines"
          ]
        },
        professional: {
          price: "$3,999",
          features: [
            "Comprehensive Brand Strategy",
            "Market Research",
            "Complete Visual Identity",
            "Messaging Framework",
            "Brand Guidelines Package",
            "Marketing Materials Design"
          ]
        },
        enterprise: {
          price: "$7,999",
          features: [
            "Full Brand Transformation",
            "Advanced Market Research",
            "Complete Brand System",
            "Go-to-Market Strategy",
            "Brand Training & Workshops",
            "12 Months Implementation Support"
          ]
        }
      }}
    />
  );
};

// SEO Optimization Service Page
export const SEOOptimizationPage: React.FC = () => {
  return (
    <ServicePage
      title="SEO Optimization"
      description="Dominate search results and drive organic traffic with data-driven SEO strategies. Our comprehensive approach combines technical expertise, content optimization, and proven tactics to boost your search rankings and online visibility."
      features={[
        "Technical SEO Audit",
        "Keyword Research & Strategy",
        "On-Page Optimization",
        "Content Optimization",
        "Link Building Campaigns",
        "Local SEO Optimization",
        "Site Speed Optimization",
        "Mobile SEO",
        "Analytics & Reporting"
      ]}
      benefits={[
        "Higher Search Rankings",
        "Increased Organic Traffic",
        "Better User Experience",
        "Improved Website Authority",
        "Higher Conversion Rates",
        "Cost-Effective Marketing",
        "Long-term Results",
        "Competitive Advantage"
      ]}
      technologies={[
        "Google Analytics", "Google Search Console", "SEMrush", "Ahrefs", "Moz",
        "Screaming Frog", "GTmetrix", "PageSpeed Insights", "Schema Markup Tools"
      ]}
      process={[
        "SEO Audit & Analysis - Comprehensive technical audit to identify optimization opportunities and performance issues.",
        "Keyword Research - Strategic keyword research to identify high-value search terms and content opportunities.",
        "Technical Optimization - Implementing technical SEO improvements for better crawlability and indexing.",
        "Content Strategy - Developing SEO-optimized content that ranks well and provides value to users.",
        "Link Building - Building high-quality backlinks to improve domain authority and search rankings.",
        "Monitoring & Optimization - Continuous monitoring, reporting, and optimization to maintain and improve rankings."
      ]}
      pricing={{
        starter: {
          price: "$499",
          features: [
            "Basic SEO Audit",
            "Keyword Research (50 keywords)",
            "On-Page Optimization (5 pages)",
            "Meta Tags Optimization",
            "Monthly Reporting",
            "3 Months Campaign"
          ]
        },
        professional: {
          price: "$1,499",
          features: [
            "Comprehensive SEO Audit",
            "Advanced Keyword Research",
            "Complete Site Optimization",
            "Content Strategy",
            "Link Building Campaign",
            "Local SEO Setup",
            "Monthly Reporting",
            "6 Months Campaign"
          ]
        },
        enterprise: {
          price: "$2,999",
          features: [
            "Enterprise SEO Strategy",
            "Advanced Technical SEO",
            "Content Marketing Integration",
            "Competitive Analysis",
            "Advanced Link Building",
            "Priority Support",
            "Custom Reporting",
            "12 Months Campaign"
          ]
        }
      }}
    />
  );
};

// Digital Marketing Service Page
export const DigitalMarketingPage: React.FC = () => {
  return (
    <ServicePage
      title="Digital Marketing"
      description="Accelerate your business growth with comprehensive digital marketing strategies. From social media campaigns to PPC advertising, we create data-driven marketing solutions that generate leads, increase conversions, and maximize ROI."
      features={[
        "Social Media Marketing",
        "Pay-Per-Click (PPC) Advertising",
        "Content Marketing Strategy",
        "Email Marketing Campaigns",
        "Conversion Rate Optimization",
        "Marketing Automation",
        "Influencer Marketing",
        "Analytics & Performance Tracking",
        "A/B Testing & Optimization"
      ]}
      benefits={[
        "Increased Brand Awareness",
        "Higher Quality Leads",
        "Improved ROI",
        "Better Customer Engagement",
        "Data-Driven Decisions",
        "Scalable Growth",
        "Multi-Channel Presence",
        "Competitive Market Position"
      ]}
      technologies={[
        "Google Ads", "Facebook Ads Manager", "HubSpot", "Mailchimp", "Hootsuite",
        "Google Analytics", "SEMrush", "Canva", "Buffer", "Zapier", "Hotjar"
      ]}
      process={[
        "Marketing Audit & Strategy - Analyzing your current marketing efforts and developing a comprehensive strategy aligned with business goals.",
        "Campaign Development - Creating targeted campaigns across multiple channels with compelling content and creative assets.",
        "Implementation & Launch - Executing campaigns with proper tracking, monitoring, and optimization from day one.",
        "Performance Monitoring - Continuous monitoring of campaign performance with real-time adjustments for optimal results.",
        "Optimization & Scaling - Data-driven optimization and scaling of successful campaigns to maximize ROI.",
        "Reporting & Analysis - Detailed reporting and analysis with actionable insights for future marketing decisions."
      ]}
      pricing={{
        starter: {
          price: "$999",
          features: [
            "2 Social Media Platforms",
            "Basic PPC Campaign",
            "Content Creation (20 posts)",
            "Monthly Analytics Report",
            "Email Marketing Setup",
            "3 Months Campaign"
          ]
        },
        professional: {
          price: "$2,499",
          features: [
            "Multi-Channel Marketing",
            "Advanced PPC Management",
            "Content Marketing Strategy",
            "Marketing Automation",
            "A/B Testing",
            "Bi-weekly Reporting",
            "6 Months Campaign"
          ]
        },
        enterprise: {
          price: "$4,999",
          features: [
            "Full Marketing Ecosystem",
            "Advanced Analytics Setup",
            "Custom Marketing Funnels",
            "Influencer Partnerships",
            "Priority Account Management",
            "Weekly Strategy Calls",
            "12 Months Campaign"
          ]
        }
      }}
    />
  );
};

// AI Solutions Service Page
export const AISolutionsPage: React.FC = () => {
  return (
    <ServicePage
      title="AI Solutions"
      description="Harness the power of artificial intelligence to revolutionize your business operations. From intelligent automation to predictive analytics, we develop custom AI solutions that drive efficiency, innovation, and competitive advantage."
      features={[
        "Custom AI Model Development",
        "Machine Learning Integration",
        "Natural Language Processing",
        "Computer Vision Solutions",
        "Predictive Analytics",
        "Intelligent Automation",
        "Chatbot Development",
        "AI-Powered Recommendations",
        "Data Science Consulting"
      ]}
      benefits={[
        "Process Automation",
        "Improved Decision Making",
        "Enhanced Customer Experience",
        "Cost Reduction",
        "Increased Efficiency",
        "Competitive Advantage",
        "Scalable Solutions",
        "Future-Ready Technology"
      ]}
      technologies={[
        "Python", "TensorFlow", "PyTorch", "OpenAI GPT", "Hugging Face", "AWS AI/ML",
        "Google Cloud AI", "Azure AI", "Jupyter", "Pandas", "NumPy", "Scikit-learn"
      ]}
      process={[
        "AI Strategy Consultation - Understanding your business challenges and identifying AI opportunities for maximum impact.",
        "Data Assessment & Preparation - Evaluating your data quality and preparing datasets for AI model training.",
        "Model Development & Training - Building and training custom AI models tailored to your specific business requirements.",
        "Integration & Testing - Seamlessly integrating AI solutions into your existing systems with thorough testing.",
        "Deployment & Monitoring - Deploying AI solutions with continuous monitoring and performance optimization.",
        "Maintenance & Evolution - Ongoing model maintenance, updates, and enhancements to ensure optimal performance."
      ]}
      pricing={{
        starter: {
          price: "$1,999",
          features: [
            "AI Consultation",
            "Simple Chatbot Development",
            "Basic Data Analysis",
            "Integration Support",
            "1 Month Support",
            "Training & Documentation"
          ]
        },
        professional: {
          price: "$4,999",
          features: [
            "Custom AI Model Development",
            "Advanced NLP Solutions",
            "Predictive Analytics",
            "API Development",
            "3 Months Support",
            "Performance Monitoring"
          ]
        },
        enterprise: {
          price: "$9,999",
          features: [
            "Enterprise AI Platform",
            "Multiple AI Models",
            "Advanced Analytics Dashboard",
            "Custom Integrations",
            "6 Months Support",
            "Dedicated AI Specialist"
          ]
        }
      }}
    />
  );
};