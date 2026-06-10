// components/Footer.tsx
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const footerNav = {
  product: [
    { name: "Features", href: "#" },
    { name: "AI Assistant", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Enterprise", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    { name: "API Reference", href: "#" },
    { name: "Status", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Security", href: "#" },
    { name: "GDPR", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#EAEAEA]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <span className="text-xl font-semibold tracking-tight text-[#111111]">
              PlannerHQ
            </span>
            <p className="mt-4 text-sm text-[#111111]/50 max-w-xs">
              The workspace where teams think, write, and build together.
            </p>
          </div>

          {/* Navigation columns */}
          <div>
            <h3 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              {footerNav.product.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-[#111111]/50 hover:text-[#111111] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {footerNav.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-[#111111]/50 hover:text-[#111111] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {footerNav.resources.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-[#111111]/50 hover:text-[#111111] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              {footerNav.legal.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-[#111111]/50 hover:text-[#111111] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#EAEAEA] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#111111]/40">
            © 2025 PlannerHQ. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[#111111]/40 hover:text-[#111111] transition-colors">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#111111]/40 hover:text-[#111111] transition-colors">
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#111111]/40 hover:text-[#111111] transition-colors">
              <FaGithub className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}