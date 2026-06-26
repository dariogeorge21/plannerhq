// app/forgot-password/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, Mail, Loader2, Send, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSuccess(true);
    };

    const resetForm = () => {
        setEmail("");
        setIsSuccess(false);
    };

    return (
        <div className="min-h-screen flex w-full bg-white font-sans selection:bg-indigo-500/30">
            {/* LEFT PANEL – Reset Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-1/2 xl:w-[45%] lg:px-20 xl:px-24 border-r border-neutral-200/50">
                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group w-fit mb-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl">
                            <Image
                                src="/logo.png"
                                alt="PlannerHQ"
                                width={48}
                                height={48}
                                className="select-none"
                                priority={true}
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
                            Forgot your password?
                        </h1>
                        <p className="mt-2.5 text-base text-neutral-500">
                            No worries, we’ll send you a reset link.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="mt-10"
                    >
                        <AnimatePresence mode="wait">
                            {!isSuccess ? (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="space-y-1">
                                        <label
                                            className="text-sm font-semibold text-neutral-900"
                                            htmlFor="email"
                                        >
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

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-neutral-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] disabled:opacity-70 disabled:pointer-events-none active:scale-[0.98] mt-2 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                Send Reset Link
                                                <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                        <p className="text-sm font-medium">
                                            If an account exists for {email}, you’ll receive a reset link shortly.
                                        </p>
                                    </div>

                                    <button
                                        onClick={resetForm}
                                        className="w-full text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors underline underline-offset-4"
                                    >
                                        Try another email
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

            {/* RIGHT PANEL – Visual Branding */}
            <div className="hidden lg:flex relative w-0 flex-1 bg-neutral-950 overflow-hidden items-center justify-center">
                {/* Abstract Dark Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[100px] rounded-full mix-blend-screen" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
                </div>

                {/* Floating Security Graphic */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-sm px-8"
                >
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-2xl text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-4">
                            <Mail className="w-7 h-7 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Secure Reset</h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                            We’ll send a magic link to your inbox. No passwords stored without your control.
                        </p>
                        <div className="mt-6 flex justify-center space-x-3">
                            <div className="h-1.5 w-8 rounded-full bg-indigo-500/50" />
                            <div className="h-1.5 w-8 rounded-full bg-white/20" />
                            <div className="h-1.5 w-8 rounded-full bg-white/20" />
                        </div>
                    </div>
                </motion.div>
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