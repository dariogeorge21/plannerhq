import { Testimonial, PricingPlan, TemplateItem, FAQItem, PlannerTask, ActivityLog } from '@/types/types';

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    role: 'VP of Product',
    company: 'LinearFlow',
    content: 'PlannerHQ completely transformed our weekly launch sprint mapping. The seamless calendar integrations and minimal interface let us focus on building, not managing software.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    rating: 5,
  },
  {
    id: 't2',
    name: 'David Kojo',
    role: 'Lead Project Coordinator',
    company: 'SupaDevs',
    content: 'We migrated from static spreadsheets to PlannerHQ inside a single weekend. Syncing schedules with our database schema is a breeze, and the Google JWT flow operates flawlessly.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Elena Rostova',
    role: 'Founder & Designer',
    company: 'Aura Studio',
    content: 'I live inside the templates marketplace. The Product Roadmap templates cut my preparation time in half, giving our agency a polished, client-ready timeline within minutes.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    rating: 5,
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'p1',
    name: 'Free Workspace',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Essential task scheduling tools for solo developers.',
    features: [
      'Up to 3 Active Planner Roadmaps',
      'Standard JWT Client Authentication',
      'Vibrant White UI Customizations',
      'Local Sandbox Persistence',
      'Community Form Support',
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'p2',
    name: 'Pro Planner',
    monthlyPrice: 24,
    yearlyPrice: 19,
    description: 'Perfect for fast-moving startups and high-intensity builders.',
    features: [
      'Unlimited Active Action Planners',
      'Supabase Database Auto-Synchronization',
      'Secure SMS & Sendgrid OTP OTP Flows',
      'Premium Template Marketplace Access',
      'Personalized Activity Dashboard Sync',
      'Priority Email Support (under 3h)',
    ],
    cta: 'Upgrade to Pro Account',
    popular: true,
  },
  {
    id: 'p3',
    name: 'HQ Enterprise',
    monthlyPrice: 79,
    yearlyPrice: 65,
    description: 'Custom governance, infinite scaling, and absolute security.',
    features: [
      'Dedicated Isolated DB Infrastructure',
      'Custom SAML SSO & GoogleAuth Identity',
      'Enterprise-grade SLA & 99.99% Uptime SLA',
      'On-demand Custom Marketplace Templates',
      'Sendgrid Dedicated SMTP Senders',
      'Dedicated Success Account Executive',
    ],
    cta: 'Schedule Custom Demo',
    popular: false,
  },
];

export const MARKETPLACE_TEMPLATES: TemplateItem[] = [
  {
    id: 'tpl1',
    title: 'Product Launch Checklist',
    category: 'marketing',
    description: 'Organize critical cross-functional steps across engineering, legal, marketing, and sales to launch new features successfully.',
    likes: 142,
    downloads: 980,
    tasksCount: 18,
    badge: 'Popular',
  },
  {
    id: 'tpl2',
    title: 'Weekly Iterative Agile Sprint',
    category: 'engineering',
    description: 'A robust template designed for 2-week active cycle teams targeting code freezes, smoke tests, and deployments.',
    likes: 210,
    downloads: 1450,
    tasksCount: 12,
    badge: 'Highly Rated',
  },
  {
    id: 'tpl3',
    title: 'Minimal Daily Focus Planner',
    category: 'productivity',
    description: 'Simplify your brain backlog. Highlight direct key objectives and delegate minor tasks with visual micro-blocks.',
    likes: 95,
    downloads: 870,
    tasksCount: 5,
    badge: 'Editor Choice',
  },
  {
    id: 'tpl4',
    title: 'Enterprise Risk Audit Track',
    category: 'personal',
    description: 'Track internal security controls, periodic compliance logs, and standard checklist items for SOC2 audits.',
    likes: 47,
    downloads: 320,
    tasksCount: 25,
  },
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq1',
    question: 'How does Supabase handle database persistence on PlannerHQ?',
    answer: 'PlannerHQ connects seamlessly with your Supabase backend via direct REST endpoints and JWT tokens. All plans, tasks, and settings update React state instantly and persist in real-time. In this demo environment, your settings simulate active SQL queries with low latency.',
  },
  {
    id: 'faq2',
    question: 'How do GoogleAuth and Sendgrid OTP work?',
    answer: 'We deploy a unified JWT validation system. You can choose to instantly link a Google Identity profile or input your email to trigger a simulated Sendgrid secure verification OTP code. In this sandbox, an OTP code notification triggers right on your screen for convenient direct testing without real inbox setup.',
  },
  {
    id: 'faq3',
    question: 'Are there any setup required for external API keys?',
    answer: 'By default, the application runs perfectly out of the box using our server-side proxy models. You can optionally paste your Supabase and Sendgrid credentials inside the Settings panel to review connection status.',
  },
  {
    id: 'faq4',
    question: 'Can I export templates from the Marketplace?',
    answer: 'Yes! Select any template and load it directly into your live dashboard workspace in one click. The dashboard instantly integrates pre-configured template items into your scheduler.',
  },
];

export const STARTER_TASKS: PlannerTask[] = [
  {
    id: 'task-1',
    title: 'Perform SOC-2 compliance check on Supabase rules',
    date: '2026-06-04',
    time: '14:30',
    priority: 'high',
    status: 'pending',
    category: 'Security',
    description: 'Audit read-write parameters and policy filters on Supabase public tables.',
  },
  {
    id: 'task-2',
    title: 'Revamp Pricing landing page with crisp white UI details',
    date: '2026-06-04',
    time: '10:00',
    priority: 'medium',
    status: 'completed',
    category: 'Growth',
    description: 'Integrate dynamic annual-monthly price visual toggle with motion fade transitions.',
  },
  {
    id: 'task-3',
    title: 'Verify Sendgrid OTP delivery speed',
    date: '2026-06-05',
    time: '09:15',
    priority: 'low',
    status: 'pending',
    category: 'Engineering',
    description: 'Run automated dispatch smoke tests on JWT OTP authorization triggers.',
  },
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '15:19:35',
    type: 'auth',
    message: 'User session created using secure JSON Web Token',
    status: 'success',
  },
  {
    id: 'log-2',
    timestamp: '15:19:36',
    type: 'settings_update',
    message: 'Supabase real-time connection initialized at endpoint /v1/auth',
    status: 'info',
  },
];
