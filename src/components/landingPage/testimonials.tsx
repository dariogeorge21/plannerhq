"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Product",
    company: "Vellum",
    quote:
      "PlannerHQ has transformed how our distributed team works. The AI assistant alone saves us 10+ hours per week on meeting notes and documentation.",
    avatar: "SC",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO",
    company: "Aether Labs",
    quote:
      "Finally, a workspace that combines docs, tasks, and calendars without feeling bloated. The real-time collaboration is buttery smooth.",
    avatar: "MR",
  },
  {
    name: "Priya Kapoor",
    role: "Design Lead",
    company: "Studio Mosaic",
    quote:
      "The clean UI and thoughtful collaboration features make it a joy to use. Our team adopted it instantly — no training required.",
    avatar: "PK",
  },
  {
    name: "Daniel Foster",
    role: "Engineering Manager",
    company: "Northstar",
    quote:
      "Our productivity improved noticeably within the first week. The collaborative workspace feels incredibly polished.",
    avatar: "DF",
  },
  {
    name: "Emily Watson",
    role: "Founder",
    company: "Lumen",
    quote:
      "The balance between simplicity and power is unmatched. It's become the operating system for our company.",
    avatar: "EW",
  },
  {
    name: "Alex Kim",
    role: "Operations Lead",
    company: "Nimbus",
    quote:
      "Everything feels fast and intuitive. We replaced three separate tools with PlannerHQ.",
    avatar: "AK",
  },
  {
    name: "Sofia Martinez",
    role: "Product Manager",
    company: "Echo",
    quote:
      "The AI features are a game-changer. It helps us stay organized and focused without adding overhead.",
    avatar: "SM",
  }
];

const CARDS_VISIBLE = 2;

export default function Testimonials() {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(
    testimonials.length / CARDS_VISIBLE
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const next = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  const prev = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="bg-white py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center rounded-full border border-[#EAEAEA] px-4 py-1.5 text-sm text-[#111111]/60 mb-5">
            Customer Stories
          </span>

          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-[#111111]">
            Trusted by modern teams.
          </h2>

          <p className="mt-5 text-lg text-[#111111]/50">
            Thousands of teams use PlannerHQ to plan, collaborate
            and ship faster.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-[-3rem] top-1/2 z-20 -translate-y-1/2 -translate-x-4 bg-white border border-[#EAEAEA] rounded-full p-3 shadow-md hover:shadow-lg transition"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={next}
            className="absolute right-[-3rem] top-1/2 z-20 translate-x-4 -translate-y-1/2 bg-white border border-[#EAEAEA] rounded-full p-3 shadow-md hover:shadow-lg transition"
          >
            <ChevronRight size={18} />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${page * 100}%)`,
              }}
            >
              {Array.from({ length: totalPages }).map((_, index) => (
                <div
                  key={index}
                  className="min-w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-6"
                >
                  {testimonials
                    .slice(
                      index * CARDS_VISIBLE,
                      index * CARDS_VISIBLE + CARDS_VISIBLE
                    )
                    .map((testimonial) => (
                      <div
                        key={testimonial.name}
                        className="
                          group
                          relative
                          rounded-3xl
                          border
                          border-[#EAEAEA]
                          bg-white
                          p-8
                          shadow-sm
                          hover:shadow-xl
                          transition-all
                          duration-300
                        "
                      >
                        {/* Glow */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4F46E5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <Quote
                          size={22}
                          className="text-[#4F46E5]/25 mb-5"
                        />

                        <p className="relative text-[#111111]/70 leading-relaxed text-[15px] mb-8">
                          "{testimonial.quote}"
                        </p>

                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#4F46E5]/10 flex items-center justify-center font-semibold text-[#4F46E5]">
                            {testimonial.avatar}
                          </div>

                          <div>
                            <div className="font-semibold text-[#111111]">
                              {testimonial.name}
                            </div>

                            <div className="text-sm text-[#111111]/50">
                              {testimonial.role}
                            </div>

                            <div className="text-xs text-[#111111]/40">
                              {testimonial.company}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-10">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                page === index
                  ? "w-8 bg-[#4F46E5]"
                  : "w-2 bg-[#D1D5DB]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}