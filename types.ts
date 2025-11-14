
export type Role = 'user' | 'model';

export interface ChatMessage {
  role: Role;
  parts: { text: string }[];
}

export interface Service {
  title: string;
  description: string;
  icon: React.ReactElement;
  features: string[];
  price: string;
  color: string;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  rating: number;
  completionTime: string;
  technologies: string[];
  client: string;
  results: string[];
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
