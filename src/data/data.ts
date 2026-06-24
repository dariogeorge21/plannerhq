// ─── BILLING_PLANS: Single source of truth for all pricing ───────────────────
// Pro:  Monthly ₹399/mo (₹4,788/yr)  |  Yearly ₹299/mo (₹3,588/yr) — save ₹1,200
// Plus: Monthly ₹899/mo (₹10,788/yr) |  Yearly ₹799/mo (₹9,588/yr) — save ₹1,200

export const BILLING_PLANS = [
  {
    key: "free" as const,
    name: "Free Starter",
    monthlyPricePaise: 0,
    yearlyPricePaise: 0,
    monthlyDisplay: "₹0",
    yearlyDisplay: "₹0",
    monthlyTotal: "₹0 per month",
    yearlyTotal: "₹0 / year",
    annualSaving: null,
    savingLabel: null,
    description: "For individuals getting started with personal projects.",
    features: [
      "Up to 3 workspaces",
      "Up to 2 collaborators",
      "100 MB storage",
      "200K AI tokens",
      "7-day version history",
    ],
    cta: "Get Started",
    href: "/signup",
    highlighted: false,
    ribbon: null,
  },
  {
    key: "pro" as const,
    name: "Pro",
    monthlyPricePaise: 39900,  // ₹399/mo
    yearlyPricePaise: 29900,   // ₹299/mo billed yearly
    monthlyDisplay: "₹399",
    yearlyDisplay: "₹299",
    monthlyTotal: "₹399 per month",
    yearlyTotal: "₹3,588 / year",
    annualSaving: 1200,
    savingLabel: "Save ₹1,200/yr",
    description: "Advanced collaboration for growing teams.",
    features: [
      "Up to 10 workspaces",
      "Up to 10 collaborators",
      "2 GB storage",
      "20 sections per workspace",
      "500K AI tokens / day",
      "30-day version history",
      "Email support",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    highlighted: true,
    ribbon: "Most popular",
  },
  {
    key: "ultra" as const,
    name: "Ultra",
    monthlyPricePaise: 89900,  // ₹899/mo
    yearlyPricePaise: 79900,   // ₹799/mo billed yearly
    monthlyDisplay: "₹899",
    yearlyDisplay: "₹799",
    monthlyTotal: "₹899 per month",
    yearlyTotal: "₹9,588 / year",
    annualSaving: 1200,
    savingLabel: "Save ₹1,200/yr",
    description: "All-in-one solution for large teams.",
    features: [
      "Up to 100 workspaces",
      "Unlimited collaborators",
      "10 GB storage",
      "300 sections per workspace",
      "20M AI tokens / day",
      "180-day version history",
      "Priority email support",
      "99.9% SLA",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    highlighted: false,
    ribbon: null,
  },
  {
    key: "enterprise" as const,
    name: "Enterprise",
    monthlyPricePaise: null,
    yearlyPricePaise: null,
    monthlyDisplay: "Custom",
    yearlyDisplay: "Custom",
    monthlyTotal: "Custom pricing",
    yearlyTotal: "Custom pricing",
    annualSaving: null,
    savingLabel: null,
    description: "For organizations that need scale, security, and custom support.",
    features: [
      "Unlimited workspaces",
      "Unlimited collaborators",
      "Custom storage",
      "Custom AI quota",
      "SSO & SAML",
      "Custom roles & permissions",
      "Audit logs",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
    ribbon: null,
  },
] as const;

export type BillingPlanKey = (typeof BILLING_PLANS)[number]["key"];

// ─── Legacy PricingPlans (kept for backwards compat with landing page) ─────────
export const PricingPlans = [
  {
    name: "Starter",
    monthlyPrice: "Free",
    yearlyPrice: "Free",
    description: "For personal use and getting started.",
    features: [
      "Up to 3 workspaces",
      "Up to 2 simultaneous collaborations",
      "100MB storage",
      "200K AI tokens",
    ],
    cta: "Get Started",
    highlighted: false,
    href: "/signup",
  },
  {
    name: "Pro",
    monthlyPrice: "₹399",
    yearlyPrice: "₹299",
    description: "Advanced collaboration for growing teams.",
    features: [
      "Up to 10 workspaces",
      "Up to 10 simultaneous collaborations",
      "Team workspaces",
      "2 GB storage",
      "20 sheets per workspace",
      "500K tokens per day",
    ],
    cta: "Start Free Trial",
    highlighted: true,
    href: "/signup",
  },
  {
    name: "Plus",
    monthlyPrice: "₹899",
    yearlyPrice: "₹799",
    description: "All-in-one solution for large teams and enterprises.",
    features: [
      "Up to 100 workspaces",
      "Unlimited simultaneous collaborations",
      "Team workspaces with advanced permissions",
      "10 GB storage",
      "Up to 300 sheets per workspace",
      "20M tokens per day",
    ],
    cta: "Start Free Trial",
    highlighted: false,
    href: "/signup",
  },
  {
    name: "Enterprise",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    description: "For organizations that need scale and security.",
    features: [
      "Unlimited scale",
      "SSO & SAML",
      "Advanced permissions",
      "Audit logs",
      "Dedicated support",
      "SLA agreement",
    ],
    cta: "Contact Sales",
    highlighted: false,
    href: "/contact",
  },
];

import { Plan, Group } from "@/types/types";

export const pricingPageContent = {
  title: "Plans and pricing designed for teams of all sizes.",
  subtitle:
    "Choose the plan that’s right for your team and start collaborating more effectively today.",
  plans: [
    {
      key: "free",
      name: "Free",
      monthlyPrice: "₹0",
      yearlyPrice: "₹0",
      monthlySuffix: "",
      yearlySuffix: "",
      description: "For individuals who want to organize their work and notes.",
      ctaLabel: "Sign up",
      href: "/signup",
    },
    {
      key: "pro",
      name: "Pro",
      monthlyPrice: "₹399",
      yearlyPrice: "₹299",
      monthlySuffix: "per month",
      yearlySuffix: "per month billed yearly",
      description: "For smaller teams that need stronger collaboration.",
      ctaLabel: "Get started",
      href: "/signup",
      featured: true,
      ribbon: "Most popular",
    },
    {
      key: "ultra",
      name: "Ultra",
      monthlyPrice: "₹899",
      yearlyPrice: "₹799",
      monthlySuffix: "per month",
      yearlySuffix: "per month billed yearly",
      description: "For growing teams that need more workspaces and storage.",
      ctaLabel: "Get started",
      href: "/signup",
    },
    {
      key: "enterprise",
      name: "Enterprise",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      monthlySuffix: "",
      yearlySuffix: "",
      description: "For organizations that need custom support and security.",
      ctaLabel: "Contact us",
      href: "/contact",
    },
  ] satisfies Plan[],
  groups: [
    {
      title: "Workspace & Usage Limits",
      rows: [
        {
          label: "Workspaces",
          values: {
            free: { kind: "text", lines: ["3"] },
            pro: { kind: "text", lines: ["10"] },
            ultra: { kind: "text", lines: ["100"] },
            enterprise: { kind: "text", lines: ["Unlimited"] },
          },
        },
        {
          label: "Sections",
          values: {
            free: { kind: "text", lines: ["2"] },
            pro: { kind: "text", lines: ["20"] },
            ultra: { kind: "text", lines: ["300"] },
            enterprise: { kind: "text", lines: ["Unlimited"] },
          },
        },
        {
          label: "Storage",
          values: {
            free: { kind: "text", lines: ["100 MB"] },
            pro: { kind: "text", lines: ["2 GB"] },
            ultra: { kind: "text", lines: ["10 GB"] },
            enterprise: { kind: "text", lines: ["Custom"] },
          },
        },
        {
          label: "AI Usage",
          values: {
            free: { kind: "text", lines: ["200K tokens"] },
            pro: { kind: "text", lines: ["500K/day"] },
            ultra: { kind: "text", lines: ["20M/day"] },
            enterprise: { kind: "text", lines: ["Custom"] },
          },
        },
        {
          label: "Active Collaborators",
          values: {
            free: { kind: "text", lines: ["2"] },
            pro: { kind: "text", lines: ["10"] },
            ultra: { kind: "text", lines: ["100"] },
            enterprise: { kind: "text", lines: ["Unlimited"] },
          },
        },
      ],
    },
    {
      title: "Documents & Collaboration",
      rows: [
        {
          label: "Version History",
          values: {
            free: { kind: "text", lines: ["7 Days"] },
            pro: { kind: "text", lines: ["30 Days"] },
            ultra: { kind: "text", lines: ["180 Days"] },
            enterprise: { kind: "text", lines: ["Unlimited"] },
          },
        },
        {
          label: "File Upload Size",
          values: {
            free: { kind: "text", lines: ["1 MB"] },
            pro: { kind: "text", lines: ["10 MB"] },
            ultra: { kind: "text", lines: ["100 MB"] },
            enterprise: { kind: "text", lines: ["Custom"] },
          },
        },
        {
          label: "Guest Viewers",
          values: {
            free: { kind: "text", lines: ["Unlimited"] },
            pro: { kind: "text", lines: ["Unlimited"] },
            ultra: { kind: "text", lines: ["Unlimited"] },
            enterprise: { kind: "text", lines: ["Unlimited"] },
          },
        },
        {
          label: "Real-time Collaboration",
          values: {
            free: { kind: "check" },
            pro: { kind: "check" },
            ultra: { kind: "check" },
            enterprise: { kind: "check" },
          },
        },
        {
          label: "Live Cursor Presence",
          values: {
            free: { kind: "check" },
            pro: { kind: "check" },
            ultra: { kind: "check" },
            enterprise: { kind: "check" },
          },
        },
      ],
    },
    {
      title: "Tasks, Calendar & AI",
      rows: [
        {
          label: "Tasks per Workspace",
          values: {
            free: { kind: "text", lines: ["100"] },
            pro: { kind: "text", lines: ["5,000"] },
            ultra: { kind: "text", lines: ["Unlimited"] },
            enterprise: { kind: "text", lines: ["Unlimited"] },
          },
        },
        {
          label: "Calendar Events / Month",
          values: {
            free: { kind: "text", lines: ["10"] },
            pro: { kind: "text", lines: ["50"] },
            ultra: { kind: "text", lines: ["200"] },
            enterprise: { kind: "text", lines: ["Unlimited"] },
          },
        },
        {
          label: "Google Calendar Sync",
          values: {
            free: { kind: "blank" },
            pro: { kind: "check" },
            ultra: { kind: "check" },
            enterprise: { kind: "check" },
          },
        },
        {
          label: "Google Meet Integration",
          values: {
            free: { kind: "blank" },
            pro: { kind: "check" },
            ultra: { kind: "check" },
            enterprise: { kind: "check" },
          },
        },
        {
          label: "AI Context Window",
          values: {
            free: { kind: "text", lines: ["16K"] },
            pro: { kind: "text", lines: ["64K"] },
            ultra: { kind: "text", lines: ["256K"] },
            enterprise: { kind: "text", lines: ["Custom"] },
          },
        },
      ],
    },
    {
      title: "Administration & Support",
      rows: [
        {
          label: "Workspace Admins",
          values: {
            free: { kind: "text", lines: ["0"] },
            pro: { kind: "text", lines: ["2"] },
            ultra: { kind: "text", lines: ["20"] },
            enterprise: { kind: "text", lines: ["Unlimited"] },
          },
        },
        {
          label: "Custom Roles",
          values: {
            free: { kind: "blank" },
            pro: { kind: "blank" },
            ultra: { kind: "blank" },
            enterprise: { kind: "check" },
          },
        },
        {
          label: "Audit Logs",
          values: {
            free: { kind: "blank" },
            pro: { kind: "blank" },
            ultra: { kind: "text", lines: ["90 Days"] },
            enterprise: { kind: "text", lines: ["Unlimited"] },
          },
        },
        {
          label: "Priority Support",
          values: {
            free: { kind: "blank" },
            pro: { kind: "text", lines: ["Email"] },
            ultra: { kind: "text", lines: ["Priority Email"] },
            enterprise: { kind: "text", lines: ["Dedicated Manager"] },
          },
        },
        {
          label: "SLA",
          values: {
            free: { kind: "blank" },
            pro: { kind: "blank" },
            ultra: { kind: "text", lines: ["99.9%"] },
            enterprise: { kind: "text", lines: ["Custom"] },
          },
        },
      ],
    },
  ] satisfies Group[],
} as const;