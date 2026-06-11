// app/signup/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { ProductShowcase } from "@/components/ProductShowcase";

// Helper SVG for Google Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    let strength = 0;
    if (val.length >= 8) strength += 1;
    if (/[A-Z]/.test(val)) strength += 1;
    if (/[0-9]/.test(val)) strength += 1;
    if (/[^A-Za-z0-9]/.test(val)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock registration delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const strengthConfig = [
    { label: "Weak", colors: "bg-red-500", threshold: 1 },
    { label: "Fair", colors: "bg-amber-500", threshold: 2 },
    { label: "Good", colors: "bg-emerald-400", threshold: 3 },
    { label: "Strong", colors: "bg-emerald-600", threshold: 4 },
  ];

  const currentStrength = passwordStrength > 0 ? strengthConfig[passwordStrength - 1] : null;

  return (
    <div className="min-h-screen flex w-full bg-white font-sans selection:bg-indigo-500/30">
      
      {/* LEFT PANEL - Form */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-neutral-50 overflow-hidden items-center justify-center">
        {/* Abstract Light Theme Background Gradients */}
        <div className="absolute inset-0 z-0">
          <ProductShowcase theme="light" />
          <div className="absolute top-[0%] left-[10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-multiply" />
          <div className="absolute bottom-[0%] right-[10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[100px] rounded-full mix-blend-multiply" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)]" />
        </div>

        
      </div>


      {/* RIGHT PANEL - Visual Branding */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-1/2 xl:w-[45%] lg:px-20 xl:px-24 border-r border-neutral-200/50">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group w-fit mb-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white transition-transform group-hover:scale-105 group-hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-indigo-600">
              PlannerHQ
            </span>
          </Link>

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950">
              Create your account
            </h1>
            <p className="mt-2.5 text-base text-neutral-500">
              Join thousands of teams shipping faster with PlannerHQ.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-8"
          >
            {/* OAuth */}
            <button className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:shadow-md hover:border-neutral-300 active:scale-[0.98]">
              <GoogleIcon className="w-5 h-5" />
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-neutral-200/80" />
              </div>
              <div className="relative flex justify-center text-xs font-medium">
                <span className="bg-white px-4 text-neutral-400 uppercase tracking-widest">or sign up with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-neutral-900" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-neutral-200/80 bg-neutral-50/50 px-4 py-3.5 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 hover:bg-white hover:border-neutral-300 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-neutral-900" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-neutral-200/80 bg-neutral-50/50 px-4 py-3.5 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 hover:bg-white hover:border-neutral-300 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                  placeholder="you@company.com"
                />
              </div>

              <div className="space-y-1 pb-2">
                <label className="text-sm font-semibold text-neutral-900" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="block w-full rounded-xl border border-neutral-200/80 bg-neutral-50/50 px-4 py-3.5 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 hover:bg-white hover:border-neutral-300 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 pr-10"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center gap-1.5 h-1.5 mb-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                            passwordStrength >= level
                              ? currentStrength?.colors
                              : "bg-neutral-200"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500 font-medium">
                        Password strength:{" "}
                        <span className={`font-semibold ${currentStrength ? currentStrength.colors.replace('bg-', 'text-') : 'text-neutral-900'}`}>
                          {currentStrength?.label || "None"}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-neutral-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] disabled:opacity-70 disabled:pointer-events-none active:scale-[0.98] mt-4 overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-neutral-500">
              Already have an account?{" "}
              <Link href="/signin" className="font-semibold text-neutral-900 hover:text-indigo-600 transition-colors">
                Sign in
              </Link>
            </p>

            <p className="mt-6 text-center text-[11px] text-neutral-400 font-medium leading-relaxed">
              By continuing, you agree to PlannerHQ's <br />
              <Link href="/terms" className="underline hover:text-neutral-600 transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-neutral-600 transition-colors">Privacy Policy</Link>.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Global CSS for shimmer effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}