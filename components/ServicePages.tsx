import React from 'react';
import ServicePage from './ServicePage';

// 1. Brand Growth Page
export const BrandGrowthPage: React.FC = () => {
  return (
    <ServicePage
      title="Brand Growth"
      description="Scale your business with high-performance ad campaigns on TikTok, Meta, and Google. We focus on measurable ROI and rapid growth."
      features={[
        "TikTok Ads Management",
        "Meta Ads (Facebook/Instagram)",
        "Google Ads Campaigns",
        "Performance Analytics",
        "Audience Targeting",
        "Creative Strategy",
        "Conversion Tracking",
        "Retargeting Campaigns",
        "A/B Testing"
      ]}
      benefits={[
        "Rapid Revenue Growth",
        "High ROAS (Return on Ad Spend)",
        "Targeted Lead Generation",
        "Scalable Campaigns",
        "Data-Driven Decisions",
        "Brand Visibility",
        "Customer Acquisition",
        "Market Domination"
      ]}
      technologies={[
        "TikTok Ads Manager", "Meta Business Suite", "Google Ads", "Google Analytics 4",
        "Pixel Tracking", "Looker Studio", "Canva", "CapCut", "Zapier"
      ]}
      process={[
        "Audit & Strategy - We analyze your current performance and market position to build a winning growth strategy.",
        "Creative Development - Designing high-converting ad creatives (video/static) that stop the scroll.",
        "Campaign Setup - Precision targeting and technical setup across ad platforms.",
        "Launch & Optimize - Going live and continuously tweaking for lower CPA and higher ROI.",
        "Scale - Increasing budget on winning campaigns to maximize revenue.",
        "Reporting - Transparent weekly reports showing exactly where your money is going and what it's returning."
      ]}
      pricing={{
        starter: {
          price: "$399",
          features: [
            "1 Ad Platform",
            "Campaign Setup",
            "Basic Creative",
            "Weekly Reporting",
            "Audience Targeting",
            "Standard Support"
          ]
        },
        professional: {
          price: "$1,199",
          features: [
            "3 Ad Platforms",
            "Advanced Creative Suite",
            "Retargeting Setup",
            "A/B Testing",
            "Daily Optimization",
            "Priority Support"
          ]
        },
        enterprise: {
          price: "Custom",
          features: [
            "Omnichannel Strategy",
            "Dedicated Growth Team",
            "Custom Reporting Dashboard",
            "Unlimited Scale",
            "24/7 Support",
            "Strategy Workshops"
          ]
        }
      }}
    />
  );
};

// 2. Social Media Content Page
export const SocialMediaContentPage: React.FC = () => {
  return (
    <ServicePage
      title="Social Media Content"
      description="Engage your audience with professional video editing and post creation. We create content that stops the scroll and drives action."
      features={[
        "Short-Form Video Editing (Reels/TikTok)",
        "Social Media Post Design",
        "Content Strategy",
        "Trend Analysis",
        "Caption Writing",
        "Hashtag Strategy",
        "Thumbnail Design",
        "Content Calendar",
        "Brand Storytelling"
      ]}
      benefits={[
        "Increased Engagement",
        "Viral Potential",
        "Consistent Brand Voice",
        "Time Saving",
        "Professional Aesthetic",
        "Community Growth",
        "Higher Retention",
        "Algorithm Favorability"
      ]}
      technologies={[
        "Adobe Premiere Pro", "After Effects", "CapCut", "Canva Pro", "Photoshop",
        "Illustrator", "Notion", "Later", "Buffer"
      ]}
      process={[
        "Content Strategy - Defining your content pillars, tone of voice, and visual style.",
        "Ideation & Scripting - Generating viral ideas and writing compelling scripts.",
        "Production/Editing - Professional editing with hooks, captions, and effects.",
        "Review & Approval - You review the content and we make necessary revisions.",
        "Scheduling & Posting - Optimizing posting times for maximum reach.",
        "Performance Review - Analyzing metrics to improve future content."
      ]}
      pricing={{
        starter: {
          price: "$599/mo",
          features: [
            "8 Short-Form Videos",
            "4 Static Posts",
            "Basic Editing",
            "Content Calendar",
            "1 Revision Round",
            "Monthly Call"
          ]
        },
        professional: {
          price: "$2,999/mo",
          features: [
            "20 Short-Form Videos",
            "10 Static Posts",
            "Advanced Editing & VFX",
            "Strategy & Scripting",
            "Unlimited Revisions",
            "Trend Jacking"
          ]
        },
        enterprise: {
          price: "Custom",
          features: [
            "Daily Content Production",
            "On-Location Shoots",
            "Dedicated Editor",
            "Full Channel Management",
            "Influencer Collabs",
            "Priority Turnaround"
          ]
        }
      }}
    />
  );
};

// 3. UI/UX Design Page
export const UIUXDesignPage: React.FC = () => {
  return (
    <ServicePage
      title="UI/UX Design"
      description="Create stunning, user-friendly interfaces that enhance user experience and boost conversion rates with modern design principles."
      features={[
        "User Research",
        "Wireframing",
        "Prototyping",
        "Design Systems",
        "Mobile App Design",
        "Web Design",
        "Interaction Design",
        "Usability Testing",
        "Accessibility Compliance"
      ]}
      benefits={[
        "Higher Conversion Rates",
        "Improved User Retention",
        "Reduced Dev Costs",
        "Brand Consistency",
        "Competitive Advantage",
        "Customer Satisfaction",
        "Intuitive Navigation",
        "Modern Aesthetic"
      ]}
      technologies={[
        "Figma", "Adobe XD", "Sketch", "Principle", "Framer", "Miro",
        "UserTesting", "Maze", "Zeplin"
      ]}
      process={[
        "Discovery - Understanding user needs and business goals.",
        "Research - Competitor analysis and user personas.",
        "Wireframing - Structuring the layout and flow.",
        "Visual Design - Applying branding and high-fidelity styling.",
        "Prototyping - Creating interactive mockups for testing.",
        "Handoff - Delivering pixel-perfect assets to developers."
      ]}
      pricing={{
        starter: {
          price: "$799",
          features: [
            "5 Page Design",
            "Basic Wireframes",
            "Mobile Responsive",
            "Style Guide",
            "2 Revisions",
            "Source Files"
          ]
        },
        professional: {
          price: "$1,999",
          features: [
            "Full Website/App Design",
            "Interactive Prototype",
            "Design System",
            "User Research",
            "Unlimited Revisions",
            "Developer Handoff"
          ]
        },
        enterprise: {
          price: "Custom",
          features: [
            "Complex SaaS Design",
            "Advanced Micro-interactions",
            "Usability Testing Labs",
            "Accessibility Audit",
            "Dedicated Design Team",
            "Long-term Support"
          ]
        }
      }}
    />
  );
};

// 4. Web Development Page
export const WebDevelopmentPage: React.FC = () => {
  return (
    <ServicePage
      title="Web Development"
      description="Develop fast, secure, and scalable websites using Shopify and WordPress. We build platforms that sell."
      features={[
        "Shopify Development",
        "WordPress Solutions",
        "Custom Web Apps",
        "E-commerce Optimization",
        "Speed Optimization",
        "Security Implementation",
        "API Integrations",
        "Responsive Design",
        "SEO-Friendly Structure"
      ]}
      benefits={[
        "Lightning Fast Speed",
        "Secure Transactions",
        "Mobile Optimized",
        "Easy Content Management",
        "Scalable Architecture",
        "SEO Ready",
        "High Reliability",
        "Custom Functionality"
      ]}
      technologies={[
        "React", "Next.js", "Shopify Liquid", "WordPress/PHP", "Node.js",
        "Tailwind CSS", "PostgreSQL", "Vercel", "AWS"
      ]}
      process={[
        "Planning - Technical architecture and roadmap.",
        "Design - UI/UX approval (if needed).",
        "Development - Coding the frontend and backend.",
        "Testing - QA for bugs, speed, and responsiveness.",
        "Launch - Deployment to live server.",
        "Support - Post-launch maintenance and updates."
      ]}
      pricing={{
        starter: {
          price: "$999",
          features: [
            "5-Page Website",
            "CMS Integration",
            "Contact Forms",
            "Basic SEO",
            "Mobile Responsive",
            "1 Month Support"
          ]
        },
        professional: {
          price: "$2,999",
          features: [
            "E-commerce Store",
            "Payment Gateway",
            "Product Management",
            "Advanced SEO",
            "Speed Optimization",
            "3 Months Support"
          ]
        },
        enterprise: {
          price: "Custom",
          features: [
            "Custom Web App",
            "Complex Database",
            "API Development",
            "High Traffic Scaling",
            "Security Audit",
            "12 Months Support"
          ]
        }
      }}
    />
  );
};

// 5. Virtual Assistance Page
export const VirtualAssistancePage: React.FC = () => {
  return (
    <ServicePage
      title="Virtual Assistance"
      description="Delegate time-consuming tasks to our professional virtual assistants. Focus on growing your business while we handle the rest."
      features={[
        "Administrative Support",
        "Data Entry & Management",
        "Market Research",
        "Calendar Management",
        "Email Management",
        "Travel Planning",
        "CRM Management",
        "Lead Generation",
        "Social Media Scheduling"
      ]}
      benefits={[
        "Save 20+ Hours/Week",
        "Reduce Overhead Costs",
        "Increase Productivity",
        "Focus on Core Business",
        "Flexible Scalability",
        "No Training Required",
        "24/7 Availability",
        "Professional Representation"
      ]}
      technologies={[
        "Google Workspace", "Microsoft 365", "Slack", "Trello/Asana", "Zoom",
        "Salesforce", "HubSpot", "Calendly", "LastPass"
      ]}
      process={[
        "Onboarding - We learn your processes and preferences.",
        "Task Delegation - You assign tasks via email or project management tool.",
        "Execution - Your dedicated VA completes tasks efficiently.",
        "Review - Regular check-ins to ensure quality and alignment.",
        "Optimization - We suggest process improvements.",
        "Scaling - Add more hours or VAs as needed."
      ]}
      pricing={{
        starter: {
          price: "$299/mo",
          features: [
            "20 Hours/Month",
            "Dedicated VA",
            "Email & Chat Support",
            "Weekly Report",
            "General Admin Tasks",
            "Business Hours"
          ]
        },
        professional: {
          price: "$999/mo",
          features: [
            "80 Hours/Month",
            "Senior VA",
            "Project Management",
            "Daily Reports",
            "Specialized Tasks",
            "Priority Support"
          ]
        },
        enterprise: {
          price: "Custom",
          features: [
            "Full-Time Team",
            "Team Lead Included",
            "24/7 Coverage",
            "Custom Workflows",
            "SOP Creation",
            "Dedicated Slack Channel"
          ]
        }
      }}
    />
  );
};

// 6. Customer Support Page
export const CustomerSupportPage: React.FC = () => {
  return (
    <ServicePage
      title="Customer Support"
      description="Provide exceptional 24/7 support to your customers. Our trained team ensures high satisfaction and retention."
      features={[
        "Live Chat Support",
        "Email Ticket Support",
        "Phone Support",
        "Social Media Moderation",
        "Order Management",
        "Refund Processing",
        "Technical Troubleshooting",
        "FAQ Management",
        "Customer Success"
      ]}
      benefits={[
        "24/7 Coverage",
        "Higher CSAT Scores",
        "Faster Response Times",
        "Customer Retention",
        "Brand Loyalty",
        "Scalable Team",
        "Multi-Language Support",
        "Cost Efficiency"
      ]}
      technologies={[
        "Zendesk", "Intercom", "Freshdesk", "Salesforce Service Cloud", "LiveChat",
        "Slack", "Shopify", "Jira", "Help Scout"
      ]}
      process={[
        "Knowledge Transfer - We learn your product, policies, and tone.",
        "Setup - Configuring support channels and tools.",
        "Go Live - Team starts handling inquiries.",
        "Quality Assurance - Monitoring responses for accuracy and empathy.",
        "Reporting - Weekly insights on ticket volume and issues.",
        "Feedback Loop - Suggesting product improvements based on user feedback."
      ]}
      pricing={{
        starter: {
          price: "$299/mo",
          features: [
            "Email Support",
            "8/5 Coverage",
            "24h Response Time",
            "Weekly Reporting",
            "1 Dedicated Agent",
            "Basic Training"
          ]
        },
        professional: {
          price: "$1,199/mo",
          features: [
            "Live Chat + Email",
            "24/7 Coverage",
            "1h Response Time",
            "Daily Reporting",
            "3 Dedicated Agents",
            "Advanced Training"
          ]
        },
        enterprise: {
          price: "Custom",
          features: [
            "Omnichannel Support",
            "Phone Support",
            "Dedicated Team Lead",
            "Custom SLAs",
            "Multi-Language",
            "QA Specialist"
          ]
        }
      }}
    />
  );
};