// app/contact/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowRight, MessageSquare, WandSparkles, Building2 } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ContactForm from "@/components/shared/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-indigo-500/30 font-sans">
      <Header />
      
      <main className="flex-1 relative pt-24 pb-32">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="absolute top-0 right-0 w-200 h-150 bg-linear-to-bl from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl rounded-full opacity-60 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-150 h-125 bg-linear-to-tr from-emerald-500/5 to-transparent blur-3xl rounded-full opacity-60 -translate-x-1/3 translate-y-1/3" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 mt-12 md:mt-20">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            {/* Left Column - Content & Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-50/50 px-3 py-1 mb-6 shadow-sm backdrop-blur-md w-fit">
                <WandSparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
                  Contact Us
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 text-balance leading-[1.1]">
                Let's build the future of work, together.
              </h1>
              
              <p className="mt-6 text-lg text-neutral-500 max-w-lg leading-relaxed">
                Whether you're looking to scale your enterprise, need technical support, or just want to learn more about PlannerHQ, our team is ready to help.
              </p>

              <div className="mt-12 space-y-10">
                {/* Contact Method: Sales */}
                <div className="flex items-start gap-5 group">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:shadow-md">
                    <Mail className="w-5 h-5 text-neutral-600 transition-colors group-hover:text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 tracking-tight">Sales & General Inquiries</h3>
                    <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed max-w-sm">
                      Reach out to our team to explore custom enterprise plans or schedule a personalized demo.
                    </p>
                    <a href="mailto:sales@plannerhq.com" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 transition-colors hover:text-indigo-600 group/link">
                      sales@plannerhq.com 
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </a>
                  </div>
                </div>

                {/* Contact Method: Support */}
                <div className="flex items-start gap-5 group">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:shadow-md">
                    <MessageSquare className="w-5 h-5 text-neutral-600 transition-colors group-hover:text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 tracking-tight">Technical Support</h3>
                    <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed max-w-sm">
                      Current customers get priority access. Need immediate assistance? Check our help center or call us.
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <a href="tel:+919876543210" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 transition-colors hover:text-emerald-600 group/link">
                        +91 9876543210
                      </a>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-neutral-100 text-neutral-500">
                        24/7 Available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Method: HQ */}
                <div className="flex items-start gap-5 group">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-neutral-300 group-hover:bg-neutral-50 group-hover:shadow-md">
                    <Building2 className="w-5 h-5 text-neutral-600 transition-colors group-hover:text-neutral-900" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 tracking-tight">Global Headquarters</h3>
                    <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed max-w-sm">
                      PlannerHQ Technologies Inc.<br />
                      Noida, Uttar Pradesh<br />
                      India
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-sm text-neutral-400 font-medium">
                      <Clock className="w-4 h-4" /> Mon-Fri, 9:30 AM - 6:30 PM IST
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              className="relative"
            >
              {/* Decorative subtle glow behind form */}
              <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 to-transparent blur-2xl rounded-[3rem] -z-10" />
              
              <div className="rounded-[2.5rem] bg-white/80 border border-neutral-200/80 shadow-2xl shadow-neutral-200/50 backdrop-blur-xl p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-500" />
                
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Send us a message</h2>
                  <p className="text-sm text-neutral-500 mt-2">Fill out the form below and we'll get back to you within 24 hours.</p>
                </div>

                <ContactForm />
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}