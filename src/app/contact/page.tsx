"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import PageHero from "@/components/shared/PageHero";
import ContactForm from "@/components/shared/ContactForm";
import Header from "@/components/landingPage/header";
import Footer from "@/components/landingPage/footer";

export default function ContactPage() {
  return (
    <>
        <Header />
      <PageHero
        title="Get in touch"
        description="Have a question or ready to scale with PlannerHQ? Our team is here to help."
      />

      <Section>
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#4F46E5]" />
                  Sales
                </h3>
                <p className="mt-2 text-[#111111]/60">sales@plannerhq.com</p>
                <p className="text-sm text-[#111111]/40">Response within 24h</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#4F46E5]" />
                  Support
                </h3>
                <p className="mt-2 text-[#111111]/60">+91 9876543210</p>
                <p className="text-sm text-[#111111]/40">Mon-Fri, 9:30 AM-6:30 PM EST</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#4F46E5]" />
                  Headquarters
                </h3>
                <p className="mt-2 text-[#111111]/60">
                  Noida<br />Uttar Pradesh, India
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#4F46E5]" />
                  Hours
                </h3>
                <p className="mt-2 text-[#111111]/60">
                  Monday – Friday: 9:30 AM – 6:30 PM<br />
                  Weekend: Email support only
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
        <Footer />
    </>
  );
}