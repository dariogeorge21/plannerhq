"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGoogle } from 'react-icons/fa';
import Header from "@/components/header";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth logic would go here
    console.log("Sign in", { email, password });
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-white">
      <Container className="py-16 lg:py-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-[#111111]/60">Sign in to your PlannerHQ account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-[#EAEAEA]" />
                <span className="text-[#111111]/60">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[#4F46E5] hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" variant="default" className="w-full justify-center">
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EAEAEA]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-[#111111]/40">or</span>
            </div>
          </div>

          <Button variant="secondary" className="w-full justify-center gap-2">
            <FaGoogle className="w-4 h-4" />
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-sm text-[#111111]/60">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#4F46E5] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </Container>
    </div>
    </>
  );
}