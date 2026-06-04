export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: 'Free' | 'Pro' | 'Enterprise';
  bio?: string;
  supabaseConnected: boolean;
  sendgridVerified: boolean;
  googleLinked: boolean;
}

export type AuthMethod = 'google' | 'email_otp';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  otpSent: boolean;
  otpEmail: string | null;
  otpCode: string | null;
}

export interface PlannerTask {
  id: string;
  title: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  category: string;
  description?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl: string;
  rating: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface TemplateItem {
  id: string;
  title: string;
  category: 'productivity' | 'engineering' | 'marketing' | 'personal';
  description: string;
  likes: number;
  downloads: number;
  tasksCount: number;
  badge?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'auth' | 'task_create' | 'task_status' | 'template_apply' | 'settings_update';
  message: string;
  status: 'success' | 'warning' | 'info';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
