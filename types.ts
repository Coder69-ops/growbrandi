
export type Role = 'user' | 'model';

export interface ChatMessage {
  role: Role;
  parts: { text: string }[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  price: string;
  color: string;
}

export interface Project {
  id?: string;
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
  question: string;
  answer: string;
}

export interface TeamMember {
  id?: string;
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
    twitter?: string;
    github?: string;
    dribbble?: string;
    instagram?: string;
    email?: string;
    [key: string]: string | undefined;
  };
}
