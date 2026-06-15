"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    if (!email) {
      toast.error("Email is missing. Cannot resend confirmation link.");
      return;
    }

    setIsResending(true);
    const supabase = createClient();
    
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    setIsResending(false);
    if (error) {
      toast.error(error.message || "Failed to resend verification link.");
    } else {
      setResendCooldown(60); // 1 minute cooldown
      toast.success("Verification link resent successfully! Check your inbox.");
    }
  };

  // Cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  return (
    <div className="min-h-screen flex w-full bg-white font-sans selection:bg-indigo-500/30">
      
      {/* LEFT PANEL - Form Panel */}
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
            className="space-y-4"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-2">
              <Mail className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950">
              Check your email
            </h1>
            <p className="text-base text-neutral-500 leading-relaxed">
              We've sent a verification link to <strong className="text-neutral-900">{email || "your email address"}</strong>.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Please click the link in the email to confirm your account and access your workspace dashboard.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-8 space-y-6"
          >
            {/* Status alert box */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/50 flex gap-3 text-neutral-600">
              <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed font-medium">
                The link will expire in 24 hours. If you don't receive it within a few minutes, check your spam or junk folder.
              </div>
            </div>

            {/* Resend actions */}
            <div className="pt-2 flex flex-col gap-3">
              {resendCooldown > 0 ? (
                <p className="text-xs text-neutral-400 font-semibold text-center py-2.5">
                  You can request a new link in <span className="text-indigo-600 font-bold">{resendCooldown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white px-8 py-3.5 text-sm font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-75"
                >
                  {isResending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-45" />
                      <span>Resend Verification Link</span>
                    </>
                  )}
                </button>
              )}

              <Link
                href="/signin"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors py-2.5 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL - Graphic panel matching signup */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-neutral-50 overflow-hidden items-center justify-center">
        {/* Abstract Light Theme Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[10%] left-[20%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-multiply" />
          <div className="absolute bottom-[10%] right-[20%] w-[50%] h-[50%] bg-emerald-500/10 blur-[100px] rounded-full mix-blend-multiply" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)]" />
        </div>

        {/* Floating Mail box Graphics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-sm px-8"
        >
          <div className="rounded-3xl border border-neutral-200/60 bg-white/80 p-8 backdrop-blur-2xl shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Mail className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-950">Verify your address</h3>
              <p className="text-sm text-neutral-400 mt-2 leading-relaxed font-medium">
                To guarantee your workspace data security, we send a secure link to verify it's truly you.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  );
}
