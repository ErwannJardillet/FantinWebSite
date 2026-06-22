"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  progress: number;
  isExiting: boolean;
  onExitComplete: () => void;
}

const PARTICLE_COUNT = 65;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  homeX: number;
  homeY: number;
};

export default function LoadingScreen({ progress, isExiting, onExitComplete }: Props) {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

  // Scroll lock sur html + body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Système de particules
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.5 + 0.4,
        opacity: Math.random() * 0.35 + 0.1,
        homeX: x,
        homeY: y,
      };
    });

    let mouseX = -9999;
    let mouseY = -9999;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    let raf = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distSq = dx * dx + dy * dy;
        const REPEL_RADIUS = 130;

        if (distSq < REPEL_RADIUS * REPEL_RADIUS) {
          const dist = Math.sqrt(distSq);
          const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * 0.7;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Retour vers position d'origine (ressort léger)
        p.vx += (p.homeX - p.x) * 0.0025;
        p.vy += (p.homeY - p.y) * 0.0025;

        // Amortissement
        p.vx *= 0.95;
        p.vy *= 0.95;

        p.x += p.vx;
        p.y += p.vy;

        // Point principal
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 108, 255, ${p.opacity})`;
        ctx.fill();

        // Halo discret
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 108, 255, ${p.opacity * 0.18})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Animation de sortie : split vertical
  useEffect(() => {
    if (!isExiting) return;
    gsap.timeline({ onComplete: () => onExitCompleteRef.current() })
      .to(contentRef.current, { opacity: 0, scale: 0.94, duration: 0.35, ease: "power2.in" }, 0)
      .to(topRef.current, { y: "-100%", duration: 0.85, ease: "power4.inOut" }, 0.15)
      .to(bottomRef.current, { y: "100%", duration: 0.85, ease: "power4.inOut" }, 0.15);
  }, [isExiting]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, fontFamily: "'Orbitron', sans-serif" }}>
      <style>{`
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 18px rgba(20,108,255,0.65), 0 0 36px rgba(20,108,255,0.3); }
          50% { text-shadow: 0 0 28px rgba(20,108,255,0.95), 0 0 55px rgba(20,108,255,0.5), 0 0 80px rgba(56,189,248,0.25); }
        }
        @keyframes scanLine {
          0% { left: -18%; }
          100% { left: 112%; }
        }
      `}</style>

      {/* Panneau haut */}
      <div ref={topRef} style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "50%",
        background: "#0B1020", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(20,108,255,0.11) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 120% at 50% 100%, rgba(20,108,255,0.09) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(20,108,255,0.35), transparent)",
        }} />
      </div>

      {/* Panneau bas */}
      <div ref={bottomRef} style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
        background: "#0B1020", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(20,108,255,0.11) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 120% at 50% 0%, rgba(20,108,255,0.09) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(20,108,255,0.35), transparent)",
        }} />
      </div>

      {/* Contenu + particules */}
      <div ref={contentRef} style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 36,
      }}>
        {/* Canvas particules (derrière le contenu) */}
        <canvas
          ref={particleCanvasRef}
          style={{
            position: "absolute", inset: 0,
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div style={{ position: "relative", textAlign: "center" }}>
          <h1 style={{
            fontSize: "clamp(48px, 9.5vw, 96px)",
            fontWeight: 900,
            letterSpacing: "0.38em",
            color: "#fff",
            margin: 0,
            lineHeight: 1,
            animation: "titleGlow 2.6s ease-in-out infinite",
          }}>
            FANTIN
          </h1>
          <p style={{
            fontSize: "clamp(8px, 1.1vw, 11px)",
            fontWeight: 400,
            letterSpacing: "0.58em",
            color: "rgba(20,108,255,0.55)",
            margin: "13px 0 0",
          }}>
            AGENCE CRÉATIVE
          </p>
        </div>

        {/* Barre de chargement */}
        <div style={{ position: "relative", width: "min(420px, 80vw)" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginBottom: 6,
          }}>
            <span style={{ fontSize: 8, letterSpacing: "0.3em", color: "rgba(20,108,255,0.65)" }}>
              LOADING...
            </span>
            <span style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(20,108,255,0.5)" }}>
              {progress}%
            </span>
          </div>
          <div style={{
            height: 8,
            background: "rgba(20,108,255,0.06)",
            border: "1px solid rgba(20,108,255,0.16)",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #0D3BA8, #146CFF 50%, #38BDF8)",
              boxShadow: "0 0 10px rgba(20,108,255,0.8), 0 0 22px rgba(20,108,255,0.4)",
              borderRadius: 2,
              transition: "width 0.15s ease-out",
            }} />
            <div style={{
              position: "absolute", top: 0, height: "100%", width: "15%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
              animation: "scanLine 1.9s linear infinite",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
