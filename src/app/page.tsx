'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Check, CheckCircle2, ChevronRight, Compass, Database, FileText, 
  HelpCircle, Layers, Mail, ShieldCheck, Star, Users, Sliders, ArrowRight, Eye, Grid
} from 'lucide-react';
import { PricingPlan, TemplateItem, FAQItem, Testimonial } from '@/types/types';
import { PRICING_PLANS, TESTIMONIALS, MARKETPLACE_TEMPLATES, FAQS } from '@/data/data';

interface LandingPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onApplyTemplate: (template: TemplateItem) => void;
}

export default function LandingPage({ onLoginClick, onSignupClick, onApplyTemplate }: LandingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Enterprise pricing sliding estimator state
  const [teamMembers, setTeamMembers] = useState(15);
  
  // Individual FAQ accordion states
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredTemplates = MARKETPLACE_TEMPLATES.filter((tpl) => {
    const matchesSearch = tpl.title.toLowerCase().includes(templateSearch.toLowerCase()) || 
                          tpl.description.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesCat = selectedCategory === 'all' || tpl.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const estimatedCost = Math.round(teamMembers * (billingCycle === 'yearly' ? 12 : 15));

  const FEATURE_TABS = [
    {
      title: 'Real-time Scheduler',
      tagline: 'Synchronized visual calendars for instant roadmapping',
      description: 'Ditch lagging kanban boards. Create custom visual milestones, prioritize actions with priority tags, and verify team sync progress live.',
      icon: Calendar,
      badge: 'Interactive',
    },
    {
      title: 'Supabase Database Integration',
      tagline: 'Direct, stable persistence with public security layers',
      description: 'Your changes update instantly in React and execute direct queries securely with custom row-level credentials matching Supabase JWT patterns.',
      icon: Database,
      badge: 'Zero Lag Config',
    },
    {
      title: 'WorkSpace OTP Governance',
      tagline: 'Next-gen security with Sendgrid and Google OAuth',
      description: 'Log in with high trust. Verify credentials securely with Google Identity tokens or instant Sendgrid OTPs generated under automated secure loops.',
      icon: ShieldCheck,
      badge: 'Protected',
    },
  ];

  return (
    <div className="bg-slate-50/50 text-slate-900 min-h-screen selection:bg-slate-950 selection:text-white smooth-scroll">
      
      {/* Navigation Rail */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-xs rotate-45"></div>
              </div>
              <span className="font-display font-black text-xl tracking-tight text-slate-950">
                PlannerHQ
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#features" className="hover:text-slate-950 transition-colors">Features</a>
            <a href="#templates" className="hover:text-slate-950 transition-colors">Templates</a>
            <a href="#enterprise" className="hover:text-slate-950 transition-colors">Enterprise</a>
            <a href="#pricing" className="hover:text-slate-950 transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-slate-950 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <button 
              onClick={onLoginClick}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button 
              onClick={onSignupClick}
              className="px-4.5 py-2 text-sm font-medium bg-slate-950 hover:bg-slate-800 text-white rounded-full transition-all cursor-pointer shadow-xs"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Visual Banner */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-28 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 mb-2">
            <span className="text-slate-900 pr-2 mr-2 border-r border-slate-200">New</span> Templates Marketplace is live
          </div>
          
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.1]">
            Plan, execute, and scale <br/><span className="text-slate-400">with precision.</span>
          </h1>

          <p className="text-slate-500 text-base sm:text-xl max-w-2xl mx-auto font-sans leading-relaxed">
            The operating system for modern teams. Consolidate your roadmaps, team syncs, and database updates in one minimalist, sleek workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onSignupClick}
              className="w-full sm:w-auto px-8 py-4 bg-slate-950 text-white hover:bg-slate-800 font-bold text-lg rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Start Planning Free</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#templates"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-950 text-center font-bold text-lg transition-all shadow-xxs"
            >
              Book a Demo
            </a>
          </div>

          <div className="pt-8 text-slate-400 text-xs font-mono flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Supabase Session Stores</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Sendgrid OTP Integrations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>99.99% Node Container Uptime</span>
            </div>
          </div>
        </div>

        {/* Floating Mock Preview Card - Enhanced with Sleek Interface layered border/shadow style */}
        <div className="max-w-5xl mx-auto mt-16 px-4">
          <div className="w-full h-full bg-slate-50 rounded-t-3xl border-t border-x border-slate-200 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.05)] p-4">
            <div className="bg-white rounded-t-xl border border-slate-100 overflow-hidden shadow-inner flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="p-6 md:w-3/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase">Live Preview Simulator</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 italic border border-slate-200">active_session.db</span>
                </div>
                <h4 className="font-display font-bold text-lg text-slate-950">Create Launch Sprint Milestone</h4>
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 text-sm space-y-3">
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-100 shadow-xxs">
                    <div className="flex items-center gap-2.5">
                      <span className="h-4 w-4 rounded-full border border-slate-300 inline-block"></span>
                      <span className="font-medium text-slate-800">Finalize security checklist on Supabase endpoints</span>
                    </div>
                    <span className="text-xxs font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded uppercase font-bold">High</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-100 shadow-xxs">
                    <div className="flex items-center gap-2.5">
                      <span className="h-4 w-4 rounded-full bg-slate-900 border border-slate-900 flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </span>
                      <span className="font-medium text-slate-500 line-through">Configure Twilio verification routers</span>
                    </div>
                    <span className="text-xxs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-bold">Med</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  ⭐ Enter your email inside the credentials modal to play with fully interactive dashboard states instantly!
                </p>
              </div>
              <div className="p-6 md:w-2/5 md:bg-slate-50 bg-slate-50/50 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="text-xs font-mono font-semibold text-slate-400 uppercase">Interactive Telemetries</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-xxs font-semibold uppercase">API Ingress</div>
                      <div className="text-xl font-bold tracking-tight text-slate-950">99.8%</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-xxs font-semibold uppercase">Sync Speed</div>
                      <div className="text-xl font-bold tracking-tight text-slate-950 font-mono">1.2ms</div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onSignupClick}
                  className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md mt-auto cursor-pointer"
                >
                  Access Full Interactive WorkSpace
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Tab Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Operational Superiority</span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-950 tracking-tight">
            Clean features. No complexity clutter.
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
            PlannerHQ bridges clean white-theme components with powerful mock Supabase JWT authentication hooks. Click options below to preview.
          </p>
        </div>

        {/* Feature Switches */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            {FEATURE_TABS.map((tab, idx) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveFeatureTab(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                    activeFeatureTab === idx
                      ? 'bg-white border-slate-200 shadow-md ring-1 ring-slate-200'
                      : 'bg-transparent border-transparent hover:bg-slate-100/50'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeFeatureTab === idx ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <TabIcon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-slate-950">{tab.title}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-medium">
                        {tab.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{tab.tagline}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden min-h-[320px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeatureTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xxs font-mono text-slate-400 uppercase tracking-widest">Milestone Feature Insights</span>
                  <h3 className="font-display font-extrabold text-2xl text-slate-950 mt-1">
                    {FEATURE_TABS[activeFeatureTab].tagline}
                  </h3>
                  <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                    {FEATURE_TABS[activeFeatureTab].description}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                    <span>Included on all PlannerHQ memberships:</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pl-6 list-disc">
                    <li>Visual deadline trackers</li>
                    <li>Row-level security tokens</li>
                    <li>Infinite local sync states</li>
                    <li>Automatic JWT resets</li>
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="border-t border-slate-100 pt-6 mt-6 flex justify-between items-center">
              <span className="text-xs text-slate-400">Interactive Preview Console</span>
              <button 
                onClick={onSignupClick}
                className="text-xs font-semibold text-slate-900 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Provision this feature now</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Marketplace */}
      <section id="templates" className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Ready to deploy assets</span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
                Templates Marketplace
              </h2>
              <p className="text-slate-500 max-w-lg text-sm">
                Instantly inject comprehensive plans, sprints, agendas, or security workflows directly into your planner dashboard in one click.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 w-full sm:w-auto">
              {['all', 'productivity', 'engineering', 'marketing', 'personal'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold capitalize rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white text-slate-950 shadow-xxs'
                      : 'text-slate-500 hover:text-slate-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar inside marketplace */}
          <div className="relative mb-8 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Compass className="h-4.5 w-4.5 animate-spin-slow" />
            </span>
            <input
              type="text"
              placeholder="Search blueprint templates..."
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-slate-950 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-slate-50/50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-all hover:bg-white relative group"
                >
                  {template.badge && (
                    <span className="absolute top-4 right-4 bg-slate-950 text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded font-mono uppercase">
                      {template.badge}
                    </span>
                  )}

                  <div className="space-y-4">
                    <div className="text-xxs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      {template.category}
                    </div>
                    <h4 className="font-display font-extrabold text-base text-slate-950 tracking-tight group-hover:text-slate-900">
                      {template.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed min-h-[72px]">
                      {template.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-200/60 pt-4 mt-6 space-y-4">
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                      <span>Tasks: <strong>{template.tasksCount}</strong></span>
                      <span>DLs: <strong>{template.downloads}</strong></span>
                    </div>

                    <button
                      onClick={() => onApplyTemplate(template)}
                      className="w-full py-2 bg-white group-hover:bg-slate-950 group-hover:text-white border border-slate-200 group-hover:border-slate-950 text-slate-800 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>Load into Dashboard</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <Compass className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">No template blueprints matches your filters</p>
                <p className="text-xs text-slate-400 mt-1">Try resetting the custom search bar or selecting All.</p>
              </div>
            )}
          </div>
        </div>
      </section>      {/* Enterprise Interactive Cost Calculator Section */}
      <section id="enterprise" className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Governance SLA & Uptime SLA</span>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-950 tracking-tight">
                HQ Enterprise Control Tier
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Scale secure planning schemas across 100+ team coordinators with ease. Our dedicated Enterprise infrastructure isolates your databases, validates client queries with dedicated Supabase RLS logs, and optimizes notifications with Sendgrid dedicate IPs.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="p-0.5 bg-slate-950 text-white rounded mt-0.5"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong className="text-slate-950 font-semibold">Custom SAML Authentications</strong>
                    <p className="text-slate-500 text-xs mt-0.5">Link corporate Google Workspace profiles directly inside the login framework.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="p-0.5 bg-slate-950 text-white rounded mt-0.5"><Check className="h-3.5 w-3.5" /></span>
                  <div>
                    <strong className="text-slate-950 font-semibold">Row-Level Security Policies</strong>
                    <p className="text-slate-500 text-xs mt-0.5">Control team actions and queries dynamically on custom database tables.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400 uppercase">
                <span>Calculators API</span>
                <span className="text-slate-800">formula_v2.cjs</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-bold text-slate-800">HQ Team Size Estimate</label>
                  <span className="text-sm font-black font-mono text-slate-950 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                    {teamMembers} Members
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(parseInt(e.target.value))}
                  className="w-full accent-slate-950 bg-slate-100 h-2 rounded-lg cursor-pointer my-4"
                />
                <div className="flex justify-between text-xxs text-slate-400 font-mono">
                  <span>5 Users</span>
                  <span>150 Users</span>
                  <span>500 Users</span>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between">
                <div>
                  <span className="text-xxs font-mono text-slate-400 uppercase block">Estimated cost</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black font-display text-slate-950">${estimatedCost}</span>
                    <span className="text-xs text-slate-500">/ month</span>
                  </div>
                </div>
                <button
                  onClick={onSignupClick}
                  className="px-4.5 py-2 text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white rounded-full transition-colors cursor-pointer"
                >
                  Provision isolated cluster
                </button>
              </div>

              <p className="text-xxs text-slate-400 leading-relaxed">
                *ESTIMATE is computed dynamically under {billingCycle === 'yearly' ? 'Yearly Promo (Save 20%)' : 'Monthly'} contract structures. Subject to local cloud ingress quotas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Tiers */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Flexible options</span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-950 tracking-tight">
            Clear Pricing. Cancel Anytime.
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm">
            Unlock professional workspaces, templates, and unlimited action items. Choose annual plans for immediate discounts.
          </p>

          {/* Pricing Toggle Billing Cycle */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-950 font-extrabold' : 'text-slate-400'}`}>
              Bill Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 px-1 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center transition-colors relative cursor-pointer"
            >
              <div className={`h-4.5 w-4.5 bg-white rounded-full transition-transform shadow-xs ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}></div>
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-slate-950 font-extrabold' : 'text-slate-400'}`}>
              <span>Bill Yearly</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const displayPrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 border flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'bg-white border-slate-900 shadow-xl ring-2 ring-slate-900'
                    : 'bg-slate-50/20 border-slate-200'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular Choice
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-slate-950">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-2 min-h-[32px]">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2 border-t border-slate-200/50">
                    <span className="text-4xl font-black font-display text-slate-900">${displayPrice}</span>
                    <span className="text-xs text-slate-400">/ member month</span>
                  </div>

                  <ul className="space-y-3.5 pt-4 text-xs">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex gap-2.5 items-start text-slate-700">
                        <Check className="h-4 w-4 shrink-0 text-emerald-500 stroke-[3]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={onSignupClick}
                    className={`w-full py-3 px-4 font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-xxs cursor-pointer ${
                      plan.popular
                        ? 'bg-slate-950 hover:bg-slate-800 text-white font-bold'
                        : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Customer Testimonials Grid */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block font-mono">Trusted globally</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
              Endorsed by Fast-Building Startups
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-slate-50/80 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-slate-200/40">
                  <img
                    src={testimonial.avatarUrl}
                    alt={testimonial.name}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-950">{testimonial.name}</h5>
                    <p className="text-[10px] text-slate-400 font-mono uppercase font-semibold">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQ Grid */}
      <section id="faqs" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-14">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block font-mono">Any Queries?</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-200 shadow-xxs"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="font-display font-bold text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <span className={`h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-600 transition-transform ${isExpanded ? 'rotate-180 bg-slate-900 text-white' : ''}`}>
                    ▼
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-slate-950 rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-xs rotate-45"></div>
          </div>
          <span className="font-display font-black tracking-tight text-slate-900">PlannerHQ</span>
        </div>
        <p className="max-w-md mx-auto leading-relaxed">
          The ultimate minimalist white theme SaaS scheduling workspace dashboard. Fast database interactions. Simulated Sendgrid notifications enabled.
        </p>
        <p className="font-mono text-[10px]">
          © 2026 PlannerHQ Inc. Built natively. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

