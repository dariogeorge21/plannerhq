"use client";

import { motion } from "framer-motion";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import PageHero from "@/components/shared/PageHero";
import CTABanner from "@/components/shared/CTABanner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Users, Sparkles, Shield, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stats = [
  { value: "50k+", label: "Active teams" },
  { value: "2M+", label: "Documents created" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Support" },
];

const team = [
  { name: "Alex Morgan", role: "CEO & Co-founder", avatar: "AM" },
  { name: "Jordan Lee", role: "CTO", avatar: "JL" },
  { name: "Casey Kim", role: "Head of Product", avatar: "CK" },
  { name: "Taylor Chen", role: "Lead Engineer", avatar: "TC" },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <PageHero
        title="We're building the future of collaborative work"
        description="PlannerHQ started with a simple belief: teams deserve a workspace that's as intuitive as it is powerful."
      />

      {/* Mission */}
      <Section background="gray">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Our mission
            </h2>
            <p className="mt-6 text-lg text-[#111111]/60">
              To eliminate friction in team collaboration by combining documents,
              tasks, AI, and communication into one seamless experience.
            </p>
          </div>
        </Container>
      </Section>

      {/* Why PlannerHQ Exists */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-6 h-6 text-[#4F46E5]" />,
                title: "Built for hybrid teams",
                desc: "Remote or in-office, PlannerHQ keeps everyone aligned.",
              },
              {
                icon: <Sparkles className="w-6 h-6 text-[#4F46E5]" />,
                title: "AI-native from day one",
                desc: "We designed AI assistance into every feature, not as an afterthought.",
              },
              {
                icon: <Shield className="w-6 h-6 text-[#4F46E5]" />,
                title: "Enterprise-grade security",
                desc: "SOC 2 Type II, GDPR, and SSO ready.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-[#EAEAEA] p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-[#111111]/60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Stats */}
      <Section background="gray">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-[#111111]">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-[#111111]/50">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Team */}
      <Section>
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold">The people behind PlannerHQ</h2>
            <p className="mt-4 text-[#111111]/60">
              A diverse team of builders, designers, and problem-solvers.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-2xl font-semibold text-[#4F46E5]">
                  {member.avatar}
                </div>
                <h3 className="mt-4 font-semibold">{member.name}</h3>
                <p className="text-sm text-[#111111]/50">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <CTABanner
        title="Ready to transform your team's workflow?"
        description="Join thousands of teams using PlannerHQ to collaborate smarter."
        primaryText="Start Free"
        primaryLink="/signup"
        secondaryText="Contact Sales"
        secondaryLink="/contact"
      />
        <Footer />
    </>
  );
}