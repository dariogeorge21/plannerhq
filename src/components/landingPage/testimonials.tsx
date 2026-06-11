"use client";

import { motion } from "framer-motion";
import { Star, Sparkles, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Product",
    company: "Vellum",
    quote:
      "PlannerHQ has completely transformed how our distributed team works. The AI assistant alone saves us 10+ hours per week on meeting notes and documentation. It's truly revolutionary.",
    avatar: "SC",
    color: "from-indigo-100 to-indigo-50 border-indigo-200 text-indigo-700",
  },
  {
    name: "Marcus Rodriguez",
    role: "Chief Technology Officer",
    company: "Aether Labs",
    quote:
      "Finally, a workspace that combines docs, tasks, and calendars without feeling bloated or sluggish. The real-time collaboration is buttery smooth, even with 50+ people in a document.",
    avatar: "MR",
    color: "from-emerald-100 to-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    name: "Priya Kapoor",
    role: "Design Lead",
    company: "Studio Mosaic",
    quote:
      "The clean UI and thoughtful collaboration features make it an absolute joy to use every day. Our entire team adopted it instantly — zero training or onboarding sessions required.",
    avatar: "PK",
    color: "from-rose-100 to-rose-50 border-rose-200 text-rose-700",
  },
  {
    name: "Daniel Foster",
    role: "VP of Engineering",
    company: "Northstar",
    quote:
      "Our shipping velocity improved noticeably within the very first week. The way it bridges the gap between high-level roadmaps and granular daily tasks is unmatched.",
    avatar: "DF",
    color: "from-amber-100 to-amber-50 border-amber-200 text-amber-700",
  },
  {
    name: "Emily Watson",
    role: "Founder & CEO",
    company: "Lumen",
    quote:
      "The delicate balance between simplicity and immense power is incredible. It hasn't just replaced three of our tools; it's become the fundamental operating system for our company.",
    avatar: "EW",
    color: "from-blue-100 to-blue-50 border-blue-200 text-blue-700",
  },
  {
    name: "James Wilson",
    role: "Operations Director",
    company: "Velocity",
    quote:
      "We audited half a dozen platforms before landing on PlannerHQ. The enterprise-grade security combined with a consumer-grade user experience made it the easiest decision we've made all year.",
    avatar: "JW",
    color: "from-purple-100 to-purple-50 border-purple-200 text-purple-700",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAFAFA] py-24 sm:py-32 selection:bg-indigo-500/30">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute top-0 w-200 h-150 bg-linear-to-b from-neutral-200/40 to-transparent blur-3xl rounded-full opacity-50 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white px-3 py-1 mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-600 tracking-wide uppercase">
              Wall of Love
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 text-balance mb-6"
          >
            Trusted by teams building the future.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-neutral-500 leading-relaxed text-balance max-w-2xl mx-auto"
          >
            Join thousands of forward-thinking companies that have chosen PlannerHQ as their singular hub for thinking, creating, and executing.
          </motion.p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 lg:gap-8 space-y-6 lg:space-y-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="break-inside-avoid relative group"
            >
              <div className="relative flex flex-col rounded-4xl border border-neutral-200/80 bg-white/60 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 hover:bg-white hover:-translate-y-1">
                
                {/* Subtle top glare */}
                <div className="absolute inset-x-0 top-0 h-px w-full bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <div className="relative mb-8 flex-1">
                  <Quote className="absolute -top-3 -left-3 w-8 h-8 text-neutral-100 -z-10 rotate-180" />
                  <p className="text-[1.05rem] text-neutral-700 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 mt-auto border-t border-neutral-100 pt-6">
                  <div 
                    className={`w-12 h-12 rounded-full bg-linear-to-br border flex items-center justify-center font-bold tracking-tight shadow-sm ${testimonial.color}`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 tracking-tight">
                      {testimonial.name}
                    </div>
                    <div className="text-sm font-medium text-neutral-500">
                      {testimonial.role} at <span className="text-neutral-900">{testimonial.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}