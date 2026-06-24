"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const CYAN = "#00CFFF";

const ZONE_START = 250;
const FADE_START = 325;
const FADE_END = 350;

type FrameCallback = ((frame: number) => void) | null;

const SERVICES = [
  {
    title: "Création de site vitrine",
    desc: "Un site clair, rapide et responsive pour présenter votre activité et convaincre vos clients dès la première visite.",
    side: "left" as const,
    row: "top" as const,
  },
  {
    title: "Optimisation et SEO",
    desc: "Un site bien référencé, c'est des clients qui vous trouvent sans payer la publicité. On optimise votre visibilité sur Google.",
    side: "right" as const,
    row: "top" as const,
  },
  {
    title: "Refonte de site existant",
    desc: "Votre site est vieillissant ou peu performant ? On le modernise en gardant ce qui fonctionne.",
    side: "left" as const,
    row: "bottom" as const,
  },
  {
    title: "Maintenance et suivi",
    desc: "Mises à jour, corrections, ajouts de contenu : on reste disponibles après la livraison.",
    side: "right" as const,
    row: "bottom" as const,
  },
];

export default function ZoneBServices({
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

    const leftCards = cardRefs.current.filter((_, i) => SERVICES[i].side === "left");
    const rightCards = cardRefs.current.filter((_, i) => SERVICES[i].side === "right");

    gsap.set(containerRef.current, { opacity: 1 });
    gsap.set(
      [titleRef.current, ...cardRefs.current.filter(Boolean)],
      { opacity: 0 }
    );

    gsap
      .timeline({ delay: 0.1 })
      .fromTo(
        leftCards,
        { opacity: 0, x: -56 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", stagger: 0.15 }
      )
      .fromTo(
        rightCards,
        { opacity: 0, x: 56 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", stagger: 0.15 },
        "<"
      )
      .fromTo(
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
      {/* Service cards */}
      {SERVICES.map((service, i) => (
        <div
          key={service.title}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          style={{
            position: "absolute",
            ...(service.side === "left"
              ? { left: "clamp(16px, 3vw, 52px)" }
              : { right: "clamp(16px, 3vw, 52px)" }),
            ...(service.row === "top"
              ? { top: "clamp(64px, 17vh, 170px)" }
              : { bottom: "clamp(90px, 22vh, 200px)" }),
            width: "clamp(200px, 27vw, 390px)",
            border: "1px solid rgba(255,255,255,0.65)",
            padding:
              "clamp(14px, 1.8vh, 22px) clamp(14px, 1.6vw, 22px)",
            background: "rgba(0,0,0,0.38)",
            backdropFilter: "blur(3px)",
          }}
        >
          <h3
            style={{
              margin: 0,
              marginBottom: "clamp(8px, 1.2vh, 14px)",
              fontSize: "clamp(11px, 1.3vw, 18px)",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.04em",
              lineHeight: 1.2,
            }}
          >
            {service.title}
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
            {service.desc}
          </p>
        </div>
      ))}

      {/* Titre principal */}
      <div
        ref={titleRef}
        style={{
          position: "absolute",
          bottom: "clamp(18px, 4vh, 48px)",
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(12px, 2vw, 28px)",
        }}
      >
        {/* Ligne décorative gauche */}
        <span
          style={{
            flex: 1,
            maxWidth: "clamp(40px, 8vw, 100px)",
            height: "1px",
            background: `linear-gradient(to left, ${CYAN}, transparent)`,
            display: "block",
          }}
        />

        <p
          style={{
            margin: 0,
            fontSize: "clamp(22px, 4vw, 62px)",
            fontWeight: 900,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            whiteSpace: "nowrap",
            color: "#ffffff",
          }}
        >
          Ce qu&apos;on fait pour{" "}
          <span style={{ color: CYAN }}>vous</span>
        </p>

        {/* Ligne décorative droite */}
        <span
          style={{
            flex: 1,
            maxWidth: "clamp(40px, 8vw, 100px)",
            height: "1px",
            background: `linear-gradient(to right, ${CYAN}, transparent)`,
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
