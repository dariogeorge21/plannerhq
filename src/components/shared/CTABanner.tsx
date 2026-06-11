import Link from "next/link";
import Container from "./Container";
import { Button } from "../ui/button";

interface CTABannerProps {
  title: string;
  description: string;
  primaryText: string;
  primaryLink: string;
  secondaryText?: string;
  secondaryLink?: string;
}

export default function CTABanner({
  title,
  description,
  primaryText,
  primaryLink,
  secondaryText,
  secondaryLink,
}: CTABannerProps) {
  return (
    <div className="bg-gray-100 py-16 lg:py-24">
      <Container>
        <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-sm p-8 lg:p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#111111]">
            {title}
          </h2>
          <p className="mt-3 text-[#111111]/60">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="link">
              <Link href={primaryLink}>{primaryText}</Link>
            </Button>
            {secondaryText && secondaryLink && (
              <Button asChild variant="secondary">
                <Link href={secondaryLink}>{secondaryText}</Link>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}