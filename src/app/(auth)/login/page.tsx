import { Metadata } from "next"
import Link from "next/link"
import { UserAuthForm } from "@/components/auth/user-auth-form"
export const metadata: Metadata = {
  title: "Login — PlannerHQ",
  description: "Sign in to your PlannerHQ workspace.",
}

export default function LoginPage() {
  return (
    <div className="container relative min-h-[100svh] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-white">
      
      {/* --- Left Side: Brand/Aesthetic Panel (Hidden on Mobile) --- */}
      <div className="relative hidden h-full flex-col p-10 lg:flex border-r border-slate-100 overflow-hidden bg-slate-50/50">
        {/* Soft Aurora / Noise Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-80" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] mix-blend-overlay" />
        
        {/* Logo */}
        <div className="relative z-20 flex items-center gap-2.5 font-display text-xl text-slate-900">
          <div className="relative h-7 w-7 rounded-md bg-gradient-to-br from-primary to-accent shadow-[0_0_20px_rgba(124,58,237,0.15)]">
            <div className="absolute inset-1 rounded-sm bg-white/40 backdrop-blur" />
          </div>
          Planner<span className="italic text-accent">HQ</span>.
        </div>

        {/* Testimonial / Brand Text */}
        <div className="relative z-20 mt-auto">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400 mb-6">
            <span className="h-px w-8 inline-block align-middle bg-slate-300 mr-3" />
            The Workspace
          </div>
          <blockquote className="space-y-4">
            <p className="font-display text-4xl leading-[1.1] text-slate-900">
              "It feels less like a tool and more like a{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                spatial extension
              </span>{" "}
              of our team's mind."
            </p>
            <footer className="text-sm font-medium text-slate-500">
              Sofia Davis — Head of Product, Lumen
            </footer>
          </blockquote>
        </div>
      </div>

      {/* --- Right Side: Auth Form --- */}
      <div className="lg:p-8 p-6 relative z-10 flex h-screen items-center justify-center bg-white">
        
        {/* Mobile Logo Fallback */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2 font-display text-lg text-slate-900">
          <div className="relative h-6 w-6 rounded-md bg-gradient-to-br from-primary to-accent">
            <div className="absolute inset-0.5 rounded-sm bg-white/40 backdrop-blur" />
          </div>
          PlannerHQ
        </div>

        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[360px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-display tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500">
              Enter your credentials to access your workspace
            </p>
          </div>
          
          <UserAuthForm />
          
          <p className="px-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link 
              href="/signup" 
              className="font-medium text-slate-900 hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
    </div>
  )
}