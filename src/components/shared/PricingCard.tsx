import { Button } from "../ui/button";
import Link from "next/link";

interface PricingCardProps {
  name: string;
  price: number | string;
  period?: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  highlighted?: boolean;
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  ctaText,
  ctaLink,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl border p-6 lg:p-8 transition-all hover:shadow-md ${
        highlighted
          ? "border-[#4F46E5] shadow-xl ring-1 ring-[#4F46E5]/20 relative bg-white"
          : "border-[#EAEAEA] bg-white"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white text-xs font-semibold px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-semibold">{name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold">
          {typeof price === "number" ? `$${price}` : price}
        </span>
        {period && <span className="text-sm text-[#111111]/40">{period}</span>}
      </div>
      <p className="mt-2 text-sm text-[#111111]/50">{description}</p>
      <ul className="mt-6 space-y-2">
        {features.map((feat) => (
          <li key={feat} className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-[#111111]/70">{feat}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button className="w-full justify-center">
          <Link href={ctaLink} passHref>
            {ctaText}
          </Link>
        </Button>
      </div>
    </div>
  );
}