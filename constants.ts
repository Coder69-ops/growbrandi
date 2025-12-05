import React from 'react';
import { FaChartLine, FaVideo, FaPalette, FaCode, FaHeadset, FaComments } from 'react-icons/fa';
import { Service, Project, Testimonial, CompanyStat, FAQItem, TeamMember } from './types';

// App Constants
export const APP_NAME = 'app.name';
export const APP_TAGLINE = 'app.tagline';
export const APP_SUBTITLE = 'app.subtitle';

// Company Statistics
export const COMPANY_STATS: CompanyStat[] = [
  { number: '150+', label: 'stats.projects_completed', icon: '📊' },
  { number: '50+', label: 'stats.happy_clients', icon: '😊' },
  { number: '5+', label: 'stats.years_experience', icon: '🏆' },
  { number: '24/7', label: 'stats.support_available', icon: '🔧' }
];

// Contact Information
export const CONTACT_INFO = {
  email: 'hello@growbrandi.com',
  phone: '+880 1755 154 194',
  address: 'Khulna, Bangladesh',
  social: {
    linkedin: 'https://linkedin.com/company/growbrandi',
    twitter: 'https://twitter.com/growbrandi',
    instagram: 'https://instagram.com/growbrandi',
    dribbble: 'https://dribbble.com/growbrandi',
    whatsapp: 'https://wa.me/8801755154194'
  }
};

// FAQ Data
export const FAQ_DATA: FAQItem[] = [
  {
    question: 'faq.q1',
    answer: 'faq.a1'
  },
  {
    question: 'faq.q2',
    answer: 'faq.a2'
  },
  {
    question: 'faq.q3',
    answer: 'faq.a3'
  },
  {
    question: 'faq.q4',
    answer: 'faq.a4'
  },
  {
    question: 'faq.q5',
    answer: 'faq.a5'
  }
];

// Using React Icons for a consistent, modern look
const ICONS = {
  'Brand Growth': React.createElement(FaChartLine, { className: "w-8 h-8" }),
  'Social Media Content': React.createElement(FaVideo, { className: "w-8 h-8" }),
  'UI/UX Design': React.createElement(FaPalette, { className: "w-8 h-8" }),
  'Web Development': React.createElement(FaCode, { className: "w-8 h-8" }),
  'Virtual Assistance': React.createElement(FaHeadset, { className: "w-8 h-8" }),
  'Customer Support': React.createElement(FaComments, { className: "w-8 h-8" }),
};

export const SERVICES: Service[] = [
  {
    id: 'web_shopify_dev',
    title: 'services.web_shopify_dev.title',
    description: 'services.web_shopify_dev.description',
    icon: ICONS['Web Development'],
    features: [
      'services.web_shopify_dev.features.shopify_development',
      'services.web_shopify_dev.features.wordpress_solutions',
      'services.web_shopify_dev.features.custom_theme_dev',
      'services.web_shopify_dev.features.store_optimization'
    ],
    price: 'services.web_shopify_dev.price',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'ecommerce_management',
    title: 'services.ecommerce_management.title',
    description: 'services.ecommerce_management.description',
    icon: ICONS['Virtual Assistance'],
    features: [
      'services.ecommerce_management.features.business_operations',
      'services.ecommerce_management.features.inventory_management',
      'services.ecommerce_management.features.order_processing',
      'services.ecommerce_management.features.growth_strategy'
    ],
    price: 'services.ecommerce_management.price',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'social_media_management',
    title: 'services.social_media_management.title',
    description: 'services.social_media_management.description',
    icon: ICONS['Customer Support'],
    features: [
      'services.social_media_management.features.schedule_posts',
      'services.social_media_management.features.community_management',
      'services.social_media_management.features.profile_optimization',
      'services.social_media_management.features.engagement_strategy'
    ],
    price: 'services.social_media_management.price',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'performance_marketing',
    title: 'services.performance_marketing.title',
    description: 'services.performance_marketing.description',
    icon: ICONS['Brand Growth'],
    features: [
      'services.performance_marketing.features.meta_ads',
      'services.performance_marketing.features.audience_targeting',
      'services.performance_marketing.features.ab_testing',
      'services.performance_marketing.features.roi_tracking'
    ],
    price: 'services.performance_marketing.price',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'creative_studio',
    title: 'services.creative_studio.title',
    description: 'services.creative_studio.description',
    icon: ICONS['Social Media Content'],
    features: [
      'services.creative_studio.features.video_content_creation',
      'services.creative_studio.features.background_music',
      'services.creative_studio.features.motion_graphics',
      'services.creative_studio.features.content_strategy'
    ],
    price: 'services.creative_studio.price',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'ui_ux_design_full',
    title: 'services.ui_ux_design_full.title',
    description: 'services.ui_ux_design_full.description',
    icon: ICONS['UI/UX Design'],
    features: [
      'services.ui_ux_design_full.features.user_research',
      'services.ui_ux_design_full.features.wireframing',
      'services.ui_ux_design_full.features.prototyping',
      'services.ui_ux_design_full.features.design_systems'
    ],
    price: 'services.ui_ux_design_full.price',
    color: 'from-violet-500 to-purple-500'
  },
];

export const PROJECTS: Project[] = [
  {
    title: "projects.machain_store.title",
    category: "services.web_shopify_dev.title",
    description: "projects.machain_store.description",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    rating: 5,
    completionTime: 'projects.machain_store.completion_time',
    technologies: ['tech.shopify', 'tech.liquid', 'tech.klaviyo', 'tech.meta_ads'],
    client: 'projects.machain_store.client',
    results: [
      'projects.machain_store.results.0',
      'projects.machain_store.results.1',
      'projects.machain_store.results.2'
    ],
    growthMetrics: 'projects.machain_store.results.0',
    beforeImage: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    afterImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max"
  },
  {
    title: "projects.velvet_vine.title",
    category: "services.social_media_management.title",
    description: "projects.velvet_vine.description",
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5,
    completionTime: 'projects.velvet_vine.completion_time',
    technologies: ['tech.instagram', 'tech.tiktok', 'tech.capcut', 'tech.sprout_social'],
    client: 'projects.velvet_vine.client',
    results: [
      'projects.velvet_vine.results.0',
      'projects.velvet_vine.results.1',
      'projects.velvet_vine.results.2'
    ],
    growthMetrics: 'projects.velvet_vine.growth_metrics'
  },
  {
    title: "projects.adscale_pro.title",
    category: "services.performance_marketing.title",
    description: "projects.adscale_pro.description",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5,
    completionTime: 'projects.adscale_pro.completion_time',
    technologies: ['tech.meta_ads', 'tech.google_ads', 'tech.ga4', 'tech.supermetrics'],
    client: 'projects.adscale_pro.client',
    results: [
      'projects.adscale_pro.results.0',
      'projects.adscale_pro.results.1',
      'projects.adscale_pro.results.2'
    ],
    growthMetrics: 'projects.adscale_pro.results.0'
  },
  {
    title: "projects.mauvis_beauty.title",
    category: "services.web_shopify_dev.title",
    description: "projects.mauvis_beauty.description",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5,
    completionTime: 'projects.mauvis_beauty.completion_time',
    technologies: ['tech.wordpress', 'tech.elementor', 'tech.seo', 'tech.google_analytics'],
    client: 'projects.mauvis_beauty.client',
    results: [
      'projects.mauvis_beauty.results.0',
      'projects.mauvis_beauty.results.1',
      'projects.mauvis_beauty.results.2'
    ],
    growthMetrics: 'projects.mauvis_beauty.results.0',
    beforeImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "projects.lumina_reveal.title",
    category: "services.creative_studio.title",
    description: "projects.lumina_reveal.description",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5,
    completionTime: 'projects.lumina_reveal.completion_time',
    technologies: ['tech.after_effects', 'tech.cinema_4d', 'tech.premiere_pro', 'tech.blender'],
    client: 'projects.lumina_reveal.client',
    results: [
      'projects.lumina_reveal.results.0',
      'projects.lumina_reveal.results.1',
      'projects.lumina_reveal.results.2'
    ],
    growthMetrics: 'projects.lumina_reveal.results.0'
  },
  {
    title: "projects.peak_performance.title",
    category: "services.ecommerce_management.title",
    description: "projects.peak_performance.description",
    imageUrl: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5,
    completionTime: 'projects.peak_performance.completion_time',
    technologies: ['tech.shopify_flow', 'tech.stocky', 'tech.klaviyo', 'tech.asana'],
    client: 'projects.peak_performance.client',
    results: [
      'projects.peak_performance.results.0',
      'projects.peak_performance.results.1',
      'projects.peak_performance.results.2'
    ],
    growthMetrics: 'projects.peak_performance.results.1'
  },
  {
    title: "projects.luxe_estate.title",
    category: "services.ui_ux_design_full.title",
    description: "projects.luxe_estate.description",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
    rating: 5,
    completionTime: 'projects.luxe_estate.completion_time',
    technologies: ['tech.figma', 'tech.protopie', 'tech.nextjs', 'tech.threejs'],
    client: 'projects.luxe_estate.client',
    results: [
      'projects.luxe_estate.results.0',
      'projects.luxe_estate.results.1',
      'projects.luxe_estate.results.2'
    ],
    growthMetrics: 'projects.luxe_estate.results.0',
    beforeImage: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    afterImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop"
  },
  {
    title: "projects.flowbank_app.title",
    category: "services.ui_ux_design_full.title",
    description: "projects.flowbank_app.description",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    completionTime: 'projects.flowbank_app.completion_time',
    technologies: ['tech.figma', 'tech.useberry', 'tech.flutter', 'tech.design_systems'],
    client: 'projects.flowbank_app.client',
    results: [
      'projects.flowbank_app.results.0',
      'projects.flowbank_app.results.1',
      'projects.flowbank_app.results.2'
    ],
    growthMetrics: 'projects.flowbank_app.results.0',
    beforeImage: "https://images.unsplash.com/photo-1616077168712-fc6c788da4af?auto=format&fit=crop&q=80&w=800",
    afterImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "projects.saravia_gems.title",
    category: "services.web_shopify_dev.title",
    description: "projects.saravia_gems.description",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    rating: 5,
    completionTime: 'projects.saravia_gems.completion_time',
    technologies: ['tech.shopify_plus', 'tech.3d_modeling', 'tech.google_ads', 'tech.email_marketing'],
    client: 'projects.saravia_gems.client',
    results: [
      'projects.saravia_gems.results.0',
      'projects.saravia_gems.results.1',
      'projects.saravia_gems.results.2'
    ],
    growthMetrics: 'projects.saravia_gems.results.0',
    beforeImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    afterImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max"
  },
  {
    title: "projects.neonfin_dashboard.title",
    category: "services.web_shopify_dev.title",
    description: "projects.neonfin_dashboard.description",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    rating: 5,
    completionTime: 'projects.neonfin_dashboard.completion_time',
    technologies: ['tech.react', 'tech.nodejs', 'tech.aws', 'tech.websockets'],
    client: 'projects.neonfin_dashboard.client',
    results: [
      'projects.neonfin_dashboard.results.0',
      'projects.neonfin_dashboard.results.1',
      'projects.neonfin_dashboard.results.2'
    ],
    growthMetrics: 'projects.neonfin_dashboard.results.0',
    beforeImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    afterImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "testimonials.sarah_johnson.quote",
    author: "Sarah Johnson",
    company: "testimonials.sarah_johnson.role",
    rating: 5,
    image: "/testimonials/sarah-johnson.jpg"
  },
  {
    quote: "testimonials.michael_chen.quote",
    author: "Michael Chen",
    company: "testimonials.michael_chen.role",
    rating: 5,
    image: "/testimonials/michael-chen.jpg"
  },
  {
    quote: "testimonials.emily_rodriguez.quote",
    author: "Emily Rodriguez",
    company: "testimonials.emily_rodriguez.role",
    rating: 5,
    image: "/testimonials/emily-rodriguez.jpg"
  },
  {
    quote: "testimonials.david_thompson.quote",
    author: "David Thompson",
    company: "testimonials.david_thompson.role",
    rating: 4.9,
    image: "/testimonials/david-thompson.jpg"
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Shuvo Mallick",
    role: "team.roles.ceo_founder",
    slug: "shuvo-mallick",
    description: "team.shuvo.description",
    bio: "team.shuvo.bio",
    achievements: [
      "team.shuvo.achievements.0",
      "team.shuvo.achievements.1",
      "team.shuvo.achievements.2",
      "team.shuvo.achievements.3"
    ],
    image: "/team/shuvo-mallick.png",
    specialties: ["team.specialties.business_strategy", "team.specialties.executive_leadership", "team.specialties.growth_hacking", "team.specialties.brand_architecture"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "shuvo@growbrandi.com"
    }
  },
  {
    name: "Binita Biswas",
    role: "team.roles.solutions_architect",
    slug: "binita-biswas",
    description: "team.binita.description",
    bio: "team.binita.bio",
    achievements: [
      "team.binita.achievements.0",
      "team.binita.achievements.1",
      "team.binita.achievements.2",
      "team.binita.achievements.3"
    ],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    specialties: ["team.specialties.solutions_architecture", "team.specialties.system_integration", "team.specialties.cloud_infrastructure", "team.specialties.ai_implementation"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "binita@growbrandi.com"
    }
  },
  {
    name: "Ovejit Das",
    role: "team.roles.head_of_development",
    slug: "ovejit-das",
    description: "team.ovejit.description",
    bio: "team.ovejit.bio",
    achievements: [
      "team.ovejit.achievements.0",
      "team.ovejit.achievements.1",
      "team.ovejit.achievements.2",
      "team.ovejit.achievements.3"
    ],
    image: "/team/ovejit.jpg",
    specialties: ["team.specialties.full_stack_development", "team.specialties.cloud_architecture", "team.specialties.team_leadership", "team.specialties.cybersecurity"],
    social: {
      linkedin: "https://www.linkedin.com/in/ovejit-das-826987354/",
      github: "https://github.com/Coder69-ops",
      email: "oveisawesome@gmail.com"
    }
  },
  {
    name: "Nijhum Nur",
    role: "team.roles.digital_marketing_strategist",
    slug: "nijhum-nur",
    description: "team.nijhum.description",
    bio: "team.nijhum.bio",
    achievements: [
      "team.nijhum.achievements.0",
      "team.nijhum.achievements.1",
      "team.nijhum.achievements.2",
      "team.nijhum.achievements.3"
    ],
    image: "/team/nijhum.jpeg",
    specialties: ["team.specialties.ppc_advertising", "team.specialties.social_media_strategy", "team.specialties.conversion_rate_optimization", "team.specialties.data_analytics"],
    social: {
      linkedin: "#",
      instagram: "#",
      email: "nijhum@growbrandi.com"
    }
  },
  {
    name: "Sabrina Jui",
    role: "team.roles.ui_ux_designer",
    slug: "sabrina-jui",
    description: "team.sabrina.description",
    bio: "team.sabrina.bio",
    achievements: [
      "team.sabrina.achievements.0",
      "team.sabrina.achievements.1",
      "team.sabrina.achievements.2",
      "team.sabrina.achievements.3"
    ],
    image: "/team/sabrina-jui.jpg",
    specialties: ["team.specialties.ui_ux_design", "team.specialties.interaction_design", "team.specialties.user_research", "team.specialties.prototyping"],
    social: {
      linkedin: "#",
      dribbble: "#",
      email: "sabrina@growbrandi.com"
    }
  },
  {
    name: "Riaz Shahriar",
    role: "team.roles.project_manager",
    slug: "riaz-shahriar",
    description: "team.riaz.description",
    bio: "team.riaz.bio",
    achievements: [
      "team.riaz.achievements.0",
      "team.riaz.achievements.1",
      "team.riaz.achievements.2",
      "team.riaz.achievements.3"
    ],
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
    specialties: ["team.specialties.agile_project_management", "team.specialties.client_relations", "team.specialties.resource_planning", "team.specialties.risk_management"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "riaz@growbrandi.com"
    }
  }
];