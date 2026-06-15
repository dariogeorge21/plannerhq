// app/signin/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { ProductShowcase } from "@/components/ProductShowcase";
import Image from "next/image";
import { signIn, signOut } from "@/api/auth";
import { setCookie } from "@/utils/session";
import { toast } from "sonner";
import { useSession } from "@/features/auth/providers/SessionProvider";

const ACTIVITY_COOKIE = "plannerhq_last_activity";
const INACTIVITY_TIMEOUT = 24 * 60 * 60; // 24 hours in seconds

// Helper SVG for Google Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: sessionLoading } = useSession();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const expired = searchParams.get("expired");

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!sessionLoading && user) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [user, sessionLoading, router]);

  // Handle session expiration warning
  useEffect(() => {
    if (expired === "true") {
      const handleExpiredSession = async () => {
        await signOut();
        toast.warning("Your session has expired due to inactivity. Please sign in again.", {
          id: "session-expired", // Avoid rendering duplicate toasts
        });
        // Remove the query parameter without reloading the page
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      };
      
      handleExpiredSession();
    }
  }, [expired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn(email, password);

    setIsLoading(false);
    if (res.success) {
      // Set the last activity cookie to start the 24 hour inactivity timer
      setCookie(ACTIVITY_COOKIE, Date.now().toString(), INACTIVITY_TIMEOUT);
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } else {
      toast.error(res.message || "Invalid email or password. Please try again.");
    }
  };

  // Render loader if session is loading or if we are redirecting an active user
  if (sessionLoading || (user && !isLoading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <span className="text-sm text-neutral-400 font-semibold">Resuming session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-white font-sans selection:bg-indigo-500/30">

      {/* LEFT PANEL - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-1/2 xl:w-[45%] lg:px-20 xl:px-24 border-r border-neutral-200/50">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group w-fit mb-12">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white transition-transform group-hover:scale-105 group-hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              <Image src="/logo.png" alt="PlannerHQ Logo" width={36} height={36} />
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
              Welcome back
            </h1>
            <p className="mt-2.5 text-base text-neutral-500">
              Sign in to your PlannerHQ account to continue.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-10"
          >
            {/* OAuth */}
            <button className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200/80 bg-white px-4 py-3.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:shadow-md hover:border-neutral-300 active:scale-[0.98]">
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-neutral-200/80" />
              </div>
              <div className="relative flex justify-center text-xs font-medium">
                <span className="bg-white px-4 text-neutral-400 uppercase tracking-widest">or sign in with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-neutral-900" htmlFor="password">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-neutral-200/80 bg-neutral-50/50 px-4 py-3.5 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 hover:bg-white hover:border-neutral-300 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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
                    Sign In
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-neutral-500">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-neutral-900 hover:text-indigo-600 transition-colors">
                Start for free
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL - Visual Branding */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-neutral-950 overflow-hidden items-center justify-center">
        <ProductShowcase theme="dark" />
      </div>

      {/* Global CSS for shimmer effect */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}