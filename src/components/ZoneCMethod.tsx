"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const CYAN = "#00CFFF";

const ZONE_START = 650;
const FADE_START = 725;
const FADE_END = 750;

type FrameCallback = ((frame: number) => void) | null;

// Disposition en cascade : top-left → top-center → right-mid → right-low
const STEPS = [
  {
    step: 1,
    title: "Écoute",
    desc: "On commence par comprendre votre activité, vos clients et vos objectifs. Pas de site sans brief.",
    pos: {
      left: "clamp(16px, 3vw, 52px)",
      top: "clamp(60px, 13vh, 130px)",
    },
    from: { x: -56, y: 0 },
  },
  {
    step: 2,
    title: "Conception",
    desc: "On conçoit la structure et le design avant de coder. Vous validez, on ajuste.",
    pos: {
      left: "clamp(180px, 34vw, 560px)",
      top: "clamp(40px, 8vh, 90px)",
    },
    from: { x: 0, y: -44 },
  },
  {
    step: 3,
    title: "Développement",
    desc: "Le site est développé proprement, optimisé pour le mobile et les moteurs de recherche.",
    pos: {
      right: "clamp(16px, 3vw, 52px)",
      top: "clamp(180px, 38vh, 370px)",
    },
    from: { x: 56, y: 0 },
  },
  {
    step: 4,
    title: "Livraison et accompagnement",
    desc: "On vous livre le site, on vous explique comment l'utiliser, et on reste disponibles.",
    pos: {
      right: "clamp(16px, 3vw, 52px)",
      top: "clamp(330px, 58vh, 560px)",
    },
    from: { x: 56, y: 0 },
  },
];

// Coins coupés (top-right + bottom-left) — esthétique sci-fi cohérente avec les zones précédentes
const CLIP = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))";

export default function ZoneCMethod({
  isActive,
  onFrameUpdate,
}: {
  isActive: boolean;
  onFrameUpdate: { current: FrameCallback };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    onFrameUpdate.current = (frame: number) => {
      if (!hasEnteredRef.current || !containerRef.current) return;

      let opacity: number;
      if (frame < ZONE_START || frame >= FADE_END) {
        opacity = 0;
      } else if (frame >= FADE_START) {
        opacity = 1 - (frame - FADE_START) / (FADE_END - FADE_START);
      } else {
        opacity = 1;
      }

      gsap.set(containerRef.current, { opacity });
    };

    return () => {
      onFrameUpdate.current = null;
    };
  }, [onFrameUpdate]);

  useEffect(() => {
    if (!isActive || hasEnteredRef.current) return;
    hasEnteredRef.current = true;

    gsap.set(containerRef.current, { opacity: 1 });
    gsap.set(
      [titleRef.current, ...cardRefs.current.filter(Boolean)],
      { opacity: 0 }
    );

    const tl = gsap.timeline({ delay: 0.1 });

    // Cascade : chaque carte entre depuis sa direction naturelle
    STEPS.forEach((s, i) => {
      tl.fromTo(
        cardRefs.current[i],
        { opacity: 0, x: s.from.x, y: s.from.y },
        { opacity: 1, x: 0, y: 0, duration: 0.65, ease: "power3.out" },
        i === 0 ? undefined : "-=0.35"
      );
    });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      "-=0.3"
    );
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0,
        fontFamily: "'Orbitron', sans-serif",
        pointerEvents: isActive ? "auto" : "none",
        zIndex: 10,
      }}
    >
      {/* Cartes en cascade */}
      {STEPS.map((s, i) => (
        <div
          key={s.step}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          style={{
            position: "absolute",
            ...s.pos,
            width: "clamp(200px, 27vw, 380px)",
            clipPath: CLIP,
            border: "1px solid rgba(255,255,255,0.62)",
            padding: "clamp(14px, 1.8vh, 22px) clamp(14px, 1.6vw, 22px)",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(3px)",
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: "clamp(8px, 1.2vh, 14px)",
              fontSize: "clamp(11px, 1.25vw, 17px)",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.04em",
              lineHeight: 1.2,
            }}
          >
            Étape {s.step} – {s.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "clamp(10px, 1vw, 14px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.65,
              letterSpacing: "0.01em",
            }}
          >
            {s.desc}
          </p>
        </div>
      ))}

      {/* Titre bas-gauche */}
      <div
        ref={titleRef}
        style={{
          position: "absolute",
          bottom: "clamp(18px, 4vh, 48px)",
          left: "clamp(16px, 3vw, 52px)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "clamp(24px, 4.2vw, 64px)",
            fontWeight: 900,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            color: "#ffffff",
          }}
        >
          Notre façon de{" "}
          <span style={{ color: CYAN }}>travailler</span>
        </p>
      </div>
    </div>
  );
}
