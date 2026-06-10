// components/Testimonials.tsx
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
  ];
  
  export default function Testimonials() {
    return (
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-[#111111]">
              Trusted by modern teams.
            </h2>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5] font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[#111111]">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-[#111111]/50">
                      {testimonial.role} · {testimonial.company}
                    </div>
                  </div>
                </div>
                <p className="text-[#111111]/70 leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }