"use client";

import React, { useEffect, useState } from "react";
import { TemplateId } from "../../hooks/useTemplateCreator";
import { FileText, Clock, Zap, CheckCircle2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TemplateGeneratingModalProps {
  isOpen: boolean;
  templateId: TemplateId | null;
}

// ── Static config ─────────────────────────────────────────────────────────────

const TEMPLATE_CONFIG = {
  blank: {
    icon: FileText,
    label: "Blank Document",
    color: "hsl(var(--primary))",
    gradient: "from-primary/20 via-primary/5 to-transparent",
    accentGlow: "rgba(var(--primary-rgb, 99,102,241), 0.35)",
    steps: [
      "Initializing workspace...",
      "Creating blank canvas...",
      "Preparing editor...",
      "Almost ready!",
    ],
  },
  meeting: {
    icon: Clock,
    label: "Meeting Notes",
    color: "#f59e0b",
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    accentGlow: "rgba(245, 158, 11, 0.35)",
    steps: [
      "Setting up meeting template...",
      "Formatting header & date...",
      "Building note structure...",
      "Opening your notes!",
    ],
  },
  prd: {
    icon: Zap,
    label: "Product Specifications",
    color: "#6366f1",
    gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    accentGlow: "rgba(99, 102, 241, 0.35)",
    steps: [
      "Loading spec template...",
      "Structuring product sections...",
      "Applying formatting...",
      "Launching your document!",
    ],
  },
} as const;

const STEP_DURATION = 500; // ms per step

// ── Particle ──────────────────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function generateParticles(color: string, count = 18): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
    opacity: Math.random() * 0.6 + 0.2,
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TemplateGeneratingModal({
  isOpen,
  templateId,
}: TemplateGeneratingModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [particles] = useState<Particle[]>(() => generateParticles("", 18));
  const [isVisible, setIsVisible] = useState(false);

  const config = templateId ? TEMPLATE_CONFIG[templateId] : null;
  const Icon = config?.icon ?? FileText;

  // Visibility transition
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
      setStepIndex(0);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Step cycling
  useEffect(() => {
    if (!isOpen || !config) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= config.steps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, STEP_DURATION);

    return () => clearInterval(interval);
  }, [isOpen, config]);

  if (!isOpen && !isVisible) return null;

  const color = config?.color ?? "hsl(var(--primary))";
  const steps = config?.steps ?? [];
  const currentStep = steps[stepIndex] ?? "";
  const progress = steps.length > 1 ? (stepIndex / (steps.length - 1)) * 100 : 0;

  return (
    <>
      {/* ── Custom keyframes injected once ──────────────────────────────── */}
      <style>{`
        @keyframes tmpl-orbit {
          0% { transform: rotate(0deg) translateX(48px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(48px) rotate(-360deg); }
        }
        @keyframes tmpl-orbit-rev {
          0% { transform: rotate(0deg) translateX(36px) rotate(0deg); }
          100% { transform: rotate(-360deg) translateX(36px) rotate(360deg); }
        }
        @keyframes tmpl-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes tmpl-glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        @keyframes tmpl-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes tmpl-particle-rise {
          0% { transform: translateY(0) scale(1); opacity: var(--p-opacity); }
          100% { transform: translateY(-60px) scale(0.3); opacity: 0; }
        }
        @keyframes tmpl-slide-up {
          0% { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes tmpl-backdrop-in {
          0% { opacity: 0; backdrop-filter: blur(0px); }
          100% { opacity: 1; backdrop-filter: blur(12px); }
        }
        @keyframes tmpl-modal-in {
          0% { opacity: 0; transform: scale(0.88) translateY(24px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes tmpl-ring-expand {
          0% { transform: scale(0.8); opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes tmpl-progress-fill {
          from { width: 0%; }
        }
        @keyframes tmpl-dot-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0,0,0,0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "tmpl-backdrop-in 0.35s ease forwards",
        }}
      >
        {/* ── Modal card ────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            width: "min(420px, 92vw)",
            borderRadius: "28px",
            overflow: "hidden",
            background: "var(--card, #18181b)",
            border: `1px solid ${color}33`,
            boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${color}22, inset 0 1px 0 ${color}22`,
            animation: "tmpl-modal-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
            padding: "40px 36px",
          }}
        >
          {/* ── Gradient background ────────────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${color}18, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* ── Floating particles ─────────────────────────────────────── */}
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: "50%",
                background: color,
                opacity: p.opacity,
                "--p-opacity": p.opacity,
                animation: `tmpl-particle-rise ${p.duration}s ${p.delay}s ease-in infinite`,
                pointerEvents: "none",
              } as React.CSSProperties}
            />
          ))}

          {/* ── Content ────────────────────────────────────────────────── */}
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>

            {/* ── Animated icon cluster ─────────────────────────────── */}
            <div
              style={{
                position: "relative",
                width: 110,
                height: 110,
                margin: "0 auto 28px",
              }}
            >
              {/* Expanding ring 1 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `1.5px solid ${color}`,
                  animation: "tmpl-ring-expand 2s ease-out infinite",
                  animationDelay: "0s",
                }}
              />
              {/* Expanding ring 2 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `1.5px solid ${color}`,
                  animation: "tmpl-ring-expand 2s ease-out infinite",
                  animationDelay: "0.65s",
                }}
              />
              {/* Expanding ring 3 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `1.5px solid ${color}`,
                  animation: "tmpl-ring-expand 2s ease-out infinite",
                  animationDelay: "1.3s",
                }}
              />

              {/* Glow core */}
              <div
                style={{
                  position: "absolute",
                  inset: "18px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${color}40, ${color}10)`,
                  animation: "tmpl-glow-pulse 2.4s ease-in-out infinite",
                }}
              />

              {/* Orbiting dot 1 */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-5px",
                  marginLeft: "-5px",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 8px ${color}`,
                  animation: "tmpl-orbit 2.8s linear infinite",
                }}
              />
              {/* Orbiting dot 2 */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-4px",
                  marginLeft: "-4px",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: `${color}99`,
                  animation: "tmpl-orbit-rev 2s linear infinite",
                  animationDelay: "0.4s",
                }}
              />

              {/* Central icon */}
              <div
                style={{
                  position: "absolute",
                  inset: "22px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${color}22, ${color}0a)`,
                  border: `1px solid ${color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "tmpl-float 3s ease-in-out infinite",
                  backdropFilter: "blur(4px)",
                }}
              >
                <Icon
                  style={{
                    width: 26,
                    height: 26,
                    color,
                    filter: `drop-shadow(0 0 8px ${color})`,
                  }}
                />
              </div>
            </div>

            {/* ── Title ─────────────────────────────────────────────── */}
            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 6,
                background: `linear-gradient(135deg, var(--foreground, #fff) 30%, ${color})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Generating Template
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--muted-foreground, #888)",
                marginBottom: 28,
                letterSpacing: "0.01em",
              }}
            >
              {config?.label ?? ""}
            </p>

            {/* ── Step message ───────────────────────────────────────── */}
            <div
              key={stepIndex}
              style={{
                minHeight: 28,
                marginBottom: 20,
                animation: "tmpl-slide-up 0.35s ease forwards",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.84rem",
                  color: "var(--muted-foreground, #888)",
                  fontWeight: 500,
                }}
              >
                {stepIndex < steps.length - 1 ? (
                  <>
                    <span
                      style={{ color, animation: "tmpl-dot-bounce 1.4s infinite" }}
                    >●</span>
                    {currentStep}
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      style={{
                        width: 16,
                        height: 16,
                        color: "#22c55e",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: "#22c55e" }}>{currentStep}</span>
                  </>
                )}
              </span>
            </div>

            {/* ── Progress bar ───────────────────────────────────────── */}
            <div
              style={{
                width: "100%",
                height: 5,
                borderRadius: 99,
                background: `${color}18`,
                overflow: "hidden",
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  borderRadius: 99,
                  background: `linear-gradient(90deg, ${color}aa, ${color})`,
                  boxShadow: `0 0 10px ${color}88`,
                  transition: "width 0.45s cubic-bezier(0.16,1,0.3,1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Shimmer */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                    backgroundSize: "200% 100%",
                    animation: "tmpl-shimmer 1.5s linear infinite",
                  }}
                />
              </div>
            </div>

            {/* ── Loading dots ───────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: color,
                    animation: `tmpl-dot-bounce 1.4s ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
