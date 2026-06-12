// app/about/page.tsx
"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { MissionWorkspaceMockup } from "@/components/about/MissionWorkspaceMockup";

import {
  Globe,
  Users,
  FileText,
  Sparkles,
  Calendar,
  MessageCircle,
  Video,
  Shield,
  Zap,
  Lock,
  CheckCircle,
  ArrowRight,
  Star,
  Cpu,
} from "lucide-react";

export default function About() {
  return (
    <><Header />
    <div className="relative bg-background">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-linear-to-b from-background via-background to-muted/20 pt-24 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-linear-to-r from-transparent via-border to-transparent" />
          <div className="absolute top-40 -left-40 w-125 h-125 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-20 -right-40 w-125 h-125 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Redefining team collaboration</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              Your ideas deserve a{" "}
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                better workspace
              </span>
        </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              PlannerHQ combines documents, tasks, calendars, and AI into one seamless platform. 
              Built for teams who value clarity, speed, and real‑time collaboration.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-8 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted hover:border-primary/20"
              >
                Contact sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Globe className="w-4 h-4" />
                <span>Our mission</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-6">
                Uncomplicate teamwork without sacrificing control
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We believe collaboration should feel effortless—not chaotic. PlannerHQ was born from the 
                frustration of juggling documents, tasks, calendars, and endless chat threads. 
                Our platform brings everything into a single, structured workspace inspired by the 
                familiarity of notebooks but powered by real‑time technology and AI.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you are a startup, a remote team, or an enterprise, you deserve a secure, 
                scalable, and intuitive environment where every idea finds its home.
              </p>
            </div>
            <MissionWorkspaceMockup />
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-4">
              Everything you need, beautifully integrated
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              PlannerHQ is not just a document editor—it's a complete collaboration ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-lg hover:border-primary/20"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Collaboration Deep Dive */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Zap className="w-4 h-4" />
                <span>Real‑time by design</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-6">
                See changes as they happen, together
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Our conflict-safe synchronization engine ensures every edit, comment, and cursor movement 
                is broadcasted in milliseconds. Multiple team members can edit the same document simultaneously 
                without overwriting each other's work.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                From tasks and calendar events to workspace chat, all updates are live. No refreshing, 
                no merging conflicts—just seamless teamwork.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium text-primary">
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Live cursors & presence for every collaborator
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-l from-primary/5 to-transparent rounded-3xl" />
              <div className="relative rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 text-xs">JD</div>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-3 text-sm">Adding the Q3 roadmap table...</div>
                      <div className="h-1 w-24 bg-primary/30 rounded-full mt-2 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">MK</div>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-3 text-sm">Updating task deadlines</div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3 mt-2">
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>2 people editing · Last saved just now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Shield className="w-4 h-4" />
              <span>Enterprise‑grade security</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-4">
              Your data is protected like it's our own
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We apply least‑privilege principles, encryption at rest and in transit, and strict AI privacy policies.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {securityItems.map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-border bg-card p-6 text-center">
                <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3 text-primary">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> AES‑256 at rest</span>
              <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> TLS 1.3 in transit</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> SOC 2 Type II compliant</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> GDPR ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers & Trust */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-60">
            {["Forbes", "TechCrunch", "Product Hunt", "G2"].map((brand) => (
              <span key={brand} className="text-xl font-semibold text-muted-foreground/50">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-4">
              Seamless integrations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect the tools you already love. Google Meet and Calendar integration come built‑in.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3 shadow-sm">
              <Video className="w-5 h-5 text-primary" />
              <span className="font-medium">Google Meet</span>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3 shadow-sm">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">Google Calendar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-4">
              Built by builders, for builders
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We are a global team of engineers, designers, and product thinkers obsessed with collaboration.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-32 h-32 mx-auto rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 text-4xl font-bold text-primary">
                  {member.initials}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative isolate">
        <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-primary/10 -z-10" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-border bg-card p-8 lg:p-12 shadow-lg">
            <Star className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to transform how your team works?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of teams who use PlannerHQ to centralize documents, tasks, and communication.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-8 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted"
              >
                Talk to sales
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-6">No credit card required. Free plan available.</p>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}

// Data arrays
const features = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Rich‑text documents",
    description: "Block‑based editor with headings, tables, checklists, and version history. Multiple users edit together with live cursors.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Workspace roles",
    description: "Owner, Admin, Editor, Viewer, Guest – fine‑grained permissions following least‑privilege principles.",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Tasks & calendar",
    description: "Assign tasks, set due dates, manage events, and sync with Google Calendar.",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Workspace chat",
    description: "Real‑time messaging with mentions and in‑app notifications, built right into each workspace.",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI assistance",
    description: "Generate, rewrite, and improve content with AI – your data is never used for training.",
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Google Meet integration",
    description: "Generate Meet links and sync events with Google Calendar in one click.",
  },
];

export const securityItems = [
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Encryption at rest & transit",
    description: "AES‑256 for stored data, TLS 1.3 for data in motion.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Least privilege access",
    description: "Roles and permissions prevent unauthorized data exposure.",
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "AI privacy guarantee",
    description: "No customer data is used to train AI models. Period.",
  },
];

export const stats = [
  { value: "50k+", label: "Active teams" },
  { value: "1M+", label: "Documents created" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<100ms", label: "Avg sync latency" },
];

export const team = [
  { initials: "DG", name: "Dario George", role: "CEO & Co‑founder", bio: "Former Google Workspace lead." },
  { initials: "MJ", name: "Michael Jordan", role: "CTO", bio: "Real‑time systems expert, ex‑Figma." },
  { initials: "RS", name: "Reebok Smith", role: "Head of Design", bio: "Award‑winning product designer." },
];