// components/Header.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#EAEAEA]">
      <nav className="max-w-[1280px] mx-auto px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="text-xl font-semibold tracking-tight text-[#111111]">
                PlannerHQ
              </span>
            </a>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-[#111111]/70 hover:text-[#111111] transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
            <a
              href="/login"
              className="text-sm font-medium text-[#111111]/70 hover:text-[#111111] transition-colors"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="rounded-full bg-[#111111] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#111111]/90 transition-all"
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#111111]"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white">
            <div className="flex items-center justify-between p-6 border-b border-[#EAEAEA]">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="text-xl font-semibold tracking-tight text-[#111111]">
                  PlannerHQ
                </span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-[#111111]"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flow-root">
              <div className="space-y-2 p-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-[#111111]/70 hover:text-[#111111] hover:bg-[#FAFAFA]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 flex flex-col gap-3">
                  <a
                    href="/login"
                    className="text-base font-semibold text-[#111111]/70 hover:text-[#111111]"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="inline-flex justify-center rounded-full bg-[#111111] px-5 py-2 text-base font-semibold text-white shadow-sm"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}