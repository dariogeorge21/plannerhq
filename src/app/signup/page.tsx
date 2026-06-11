"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { FaGoogle } from "react-icons/fa";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkStrength = (val: string) => {
    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up", { name, email, password });
  };

  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  return (
    <>
    <Header />
    <div className="min-h-screen bg-white">
      <Container className="py-16 lg:py-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-[#111111]/60">Start collaborating with PlannerHQ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <div>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkStrength(e.target.value);
                }}
                required
                autoComplete="new-password"
              />
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-[#EAEAEA]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#111111]/50 mt-1">
                    Strength: {strengthLabels[passwordStrength - 1] || "None"}
                  </p>
                </div>
              )}
            </div>
            <Button type="submit" variant="link" className="w-full justify-center">
              Sign Up
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
            <FaGoogle />
            Sign up with Google
          </Button>

          <p className="mt-8 text-center text-sm text-[#111111]/60">
            Already have an account?{" "}
            <Link href="/signin" className="text-[#4F46E5] font-medium hover:underline">
              Sign in
            </Link>
          </p>

          <p className="mt-6 text-xs text-center text-[#111111]/40">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link> and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </Container>
    </div>
    </>
  );
}