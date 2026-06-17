// app/verify-otp/page.tsx
"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import Image from "next/image";
import { verifyOtp } from "@/app/api/auth";
import { createClient } from "@/lib/supabase/client";
import { setCookie } from "@/utils/session";
import { toast } from "sonner";

const ACTIVITY_COOKIE = "plannerhq_last_activity";
const INACTIVITY_TIMEOUT = 24 * 60 * 60; // 24 hours in seconds

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Handle individual box input
    const handleChange = (index: number, value: string) => {
        if (isLoading || isVerified) return;
        setError(null);

        const newOtp = [...otp];
        // Allow only single digit
        const digit = value.replace(/[^0-9]/g, "").slice(-1);
        newOtp[index] = digit;
        setOtp(newOtp);

        // Auto‑focus next box
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").replace(/\s/g, "").slice(0, 6);
        if (!/^\d+$/.test(paste)) return;
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
            newOtp[i] = paste[i] || "";
        }
        setOtp(newOtp);
        // Focus last filled or first empty
        const lastFilled = paste.length < 6 ? paste.length : 5;
        inputRefs.current[lastFilled]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.some((d) => d === "")) return;
        if (!email) {
            setError("Email is missing. Please sign up again.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const res = await verifyOtp(email, otp.join(""));

        setIsLoading(false);
        if (res.success) {
            // Set initial activity cookie upon successful verification
            setCookie(ACTIVITY_COOKIE, Date.now().toString(), INACTIVITY_TIMEOUT);
            setIsVerified(true);
            toast.success("Account verified successfully!");
        } else {
            setError(res.message || "Invalid OTP code. Please try again.");
            toast.error(res.message || "Verification failed.");
        }
    };

    // Auto-redirect on successful verification
    useEffect(() => {
        if (isVerified) {
            const timeout = setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [isVerified, router]);

    const handleResend = async () => {
        if (resendCooldown > 0 || isLoading) return;
        if (!email) {
            toast.error("Email is missing. Cannot resend code.");
            return;
        }

        setIsLoading(true);
        const supabase = createClient();

        const { error: resendError } = await supabase.auth.resend({
            type: "signup",
            email: email,
        });

        setIsLoading(false);
        if (resendError) {
            toast.error(resendError.message || "Failed to resend code.");
        } else {
            setResendCooldown(30);
            toast.success("A new verification code has been sent!");
        }
    };

    // Countdown for resend
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Reset form
    const resetForm = () => {
        setOtp(Array(6).fill(""));
        setIsVerified(false);
        setError(null);
    };

    return (
        <div className="min-h-screen flex w-full bg-white font-sans selection:bg-indigo-500/30">
            {/* LEFT PANEL – OTP Form */}
            <div className="hidden lg:flex relative w-0 flex-1 bg-neutral-950 overflow-hidden items-center justify-center">
                {/* Abstract Dark Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[100px] rounded-full mix-blend-screen" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
                </div>

                {/* Floating Security Illustration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-sm px-8"
                >
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-2xl text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-4">
                            <ShieldCheck className="w-7 h-7 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Account Protection</h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                            Two‑factor authentication ensures only you can access your workspace.
                        </p>
                        <div className="mt-6 flex justify-center space-x-3">
                            <div className="h-1.5 w-8 rounded-full bg-indigo-500/50" />
                            <div className="h-1.5 w-8 rounded-full bg-white/20" />
                            <div className="h-1.5 w-8 rounded-full bg-white/20" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* RIGHT PANEL – Visual Branding */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-1/2 xl:w-[45%] lg:px-20 xl:px-24 border-r border-neutral-200/50">
                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group w-fit mb-10">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white transition-transform group-hover:scale-105 group-hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                            <Image
                                src="/logo.png"
                                alt="PlannerHQ Logo"
                                width={50}
                                height={50}
                                className="object-contain"
                            />
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
                            Check your inbox
                        </h1>
                        <p className="mt-2.5 text-base text-neutral-500">
                            We sent a 6‑digit code to{" "}
                            <span className="font-semibold text-neutral-900">{email || "your email"}</span>.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="mt-10"
                    >
                        <AnimatePresence mode="wait">
                            {!isVerified ? (
                                <motion.form
                                    key="otp-form"
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {/* OTP Input */}
                                    <div>
                                        <label className="text-sm font-semibold text-neutral-900 block mb-3">
                                            Verification Code
                                        </label>
                                        <div className="flex gap-2 sm:gap-3 justify-between">
                                            {otp.map((digit, idx) => (
                                                <div key={idx} className="relative w-full max-w-[52px] aspect-[3/4]">
                                                    <input
                                                        ref={(el) => { inputRefs.current[idx] = el; }}
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={1}
                                                        value={digit}
                                                        onChange={(e) => handleChange(idx, e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(idx, e)}
                                                        onPaste={idx === 0 ? handlePaste : undefined}
                                                        disabled={isLoading}
                                                        className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                                        aria-label={`Digit ${idx + 1}`}
                                                    />
                                                    <motion.div
                                                        className={`w-full h-full rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-colors ${digit
                                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                            : error
                                                                ? "border-red-300 bg-red-50"
                                                                : "border-neutral-200/80 bg-neutral-50/50 text-neutral-900"
                                                            }`}
                                                        animate={{ scale: digit ? [1, 1.1, 1] : 1 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {digit || ""}
                                                    </motion.div>
                                                </div>
                                            ))}
                                        </div>
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2 text-sm text-red-600 font-medium"
                                            >
                                                {error}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Resend Link */}
                                    <div className="text-center">
                                        {resendCooldown > 0 ? (
                                            <span className="text-sm text-neutral-400">
                                                Resend code in {resendCooldown}s
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResend}
                                                disabled={isLoading}
                                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors disabled:opacity-50"
                                            >
                                                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                                                Resend code
                                            </button>
                                        )}
                                    </div>

                                    {/* Verify Button */}
                                    <button
                                        type="submit"
                                        disabled={otp.some((d) => d === "") || isLoading}
                                        className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-neutral-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] disabled:opacity-70 disabled:pointer-events-none active:scale-[0.98] mt-2 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                Verify Email
                                                <ShieldCheck className="w-4 h-4 transition-transform group-hover:scale-110" />
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold">Email verified successfully!</p>
                                            <p className="text-xs text-emerald-700 mt-1">
                                                You’ll be redirected to your dashboard shortly.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="w-full text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors underline underline-offset-4"
                                    >
                                        Verify another email
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Back to Sign In */}
                        <Link
                            href="/signin"
                            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to sign in
                        </Link>
                    </motion.div>
                </div>
            </div>


            {/* Global shimmer keyframes (reused from sign‑in) */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
            </div>
        }>
            <VerifyOtpContent />
        </Suspense>
    );
}