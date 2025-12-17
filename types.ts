
export type Role = 'user' | 'model';

export interface ChatMessage {
  role: Role;
  parts: { text: string }[];
}

export type LocalizedString = {
  [key: string]: string;
};

export interface Service {
  id: string;
  order?: number;
  title: string | LocalizedString;
  description: string | LocalizedString;
  icon: string;
  features: string[];
  price: string;
  color: string;
  isPopular?: boolean;
  category?: string;
  image?: string;
  visualType?: 'social' | 'marketing' | 'design' | 'development' | 'assistant' | 'support' | 'none';
  floatingLogos?: string[];
  process?: {
    step: string | LocalizedString;
    description: string | LocalizedString;
    duration: string | LocalizedString;
  }[];
}

export interface Project {
  id?: string;
  order?: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  rating: number;
  completionTime: string;
  technologies: string[];
  client: string;
  results: string[];
  growthMetrics?: string;
  beforeImage?: string;
  afterImage?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  company: string;
  rating?: number;
  image?: string;
}

export interface CompanyStat {
  number: string;
  label: string;
  icon: string;
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id?: string;
  order?: number;
  name: string;
  role: string;
  description: string;
  image: string;
  specialties: string[];
  slug: string;
  bio: string;
  achievements: string[];
  bookingUrl?: string;
  social: {
    linkedin?: string;
    tiktok?: string;
    github?: string;
    goodfirms?: string;
    instagram?: string;
    email?: string;
    [key: string]: string | undefined;
  };
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  enabled: boolean;
}
