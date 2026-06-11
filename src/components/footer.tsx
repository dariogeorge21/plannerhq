// footer.tsx
import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";

const footerNav = {
  product: [
    { name: "Features", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Enterprise", href: "/pricing" },
    { name: "Changelog", href: "/changelog" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Partners", href: "/partners" },
  ],
  resources: [
    { name: "Documentation", href: "/documentation" },
    { name: "Help Center", href: "/help" },
    { name: "Community", href: "/community" },
    { name: "API Reference", href: "/api" },
    { name: "Status", href: "/status" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Security", href: "/security" },
    { name: "Cookie Policy", href: "/cookie" },
    { name: "GDPR", href: "/gdpr" },
  ],
};

const SocialIcons = {
  Twitter: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  LinkedIn: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  GitHub: (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  ),
};

export default function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 relative">
      {/* Decorative Top Border */}
      <div className="absolute top-0 inset-x-0 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent opacity-50" />
      
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-250 h-100 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8 mb-16">
          {/* Brand & Mission */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-950 text-white transition-all group-hover:scale-105 group-hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <Image src="/logo.png" alt="PlannerHQ Logo" width={36} height={36} />
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-indigo-600">
                PlannerHQ
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-500 max-w-xs">
              The unified workspace where ambitious teams think, write, and execute together with unparalleled velocity.
            </p>
            
            {/* Status Indicator */}
            {/* <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 transition-colors hover:bg-white hover:border-neutral-300 w-fit cursor-pointer">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-neutral-600">All systems operational</span>
              </div>
            </div> */}
          </div>

          {/* Navigation Grid */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Product</h3>
              <ul className="mt-6 space-y-4">
                {footerNav.product.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-neutral-500 hover:text-indigo-600 transition-colors group flex items-center gap-1.5 w-fit">
                      {item.name}
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Company</h3>
              <ul className="mt-6 space-y-4">
                {footerNav.company.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-neutral-500 hover:text-indigo-600 transition-colors group flex items-center gap-1.5 w-fit">
                      {item.name}
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Resources</h3>
              <ul className="mt-6 space-y-4">
                {footerNav.resources.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-neutral-500 hover:text-indigo-600 transition-colors group flex items-center gap-1.5 w-fit">
                      {item.name}
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">Legal</h3>
              <ul className="mt-6 space-y-4">
                {footerNav.legal.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-neutral-500 hover:text-indigo-600 transition-colors group flex items-center gap-1.5 w-fit">
                      {item.name}
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200/80 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} PlannerHQ Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-indigo-600">
              <span className="sr-only">Twitter</span>
              <SocialIcons.Twitter className="h-4 w-4" />
            </Link>
            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-indigo-600">
              <span className="sr-only">LinkedIn</span>
              <SocialIcons.LinkedIn className="h-4 w-4" />
            </Link>
            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-indigo-600">
              <span className="sr-only">GitHub</span>
              <SocialIcons.GitHub className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}