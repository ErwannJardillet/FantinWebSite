"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const CYAN = "#00CFFF";
const NAV_ITEMS = ["À propos", "Méthode", "Réalisations", "Contact", "Services"];

// Plage de frames sur laquelle l'opacité descend de 1 → 0 en fin de zone A
const FADE_START = 75;
const FADE_END = 100;

type FrameCallback = ((frame: number) => void) | null;

export default function ZoneAHero({
  isActive,
  onFrameUpdate,
}: {
  isActive: boolean;
  onFrameUpdate: { current: FrameCallback };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const hasEnteredRef = useRef(false);

  // Callback appelé à chaque frame RAF — pilote l'opacité en fonction du scroll
  useEffect(() => {
    onFrameUpdate.current = (frame: number) => {
      if (!hasEnteredRef.current || !containerRef.current) return;

      let opacity: number;
      if (frame >= FADE_END) {
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

  // Animation d'entrée GSAP (une seule fois, au premier passage en Zone A)
  useEffect(() => {
    if (!isActive || hasEnteredRef.current) return;
    hasEnteredRef.current = true;

    gsap.set(containerRef.current, { opacity: 1 });
    gsap.set(
      [navRef.current, headingRef.current, descRef.current, btnRef.current],
      { opacity: 0 }
    );

    gsap
      .timeline({ delay: 0.15 })
      .fromTo(
        navRef.current,
        { opacity: 0, y: -22 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      )
      .fromTo(
        headingRef.current,
        { opacity: 0, x: -52 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        "-=0.25"
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
        "-=0.35"
      )
      .fromTo(
        btnRef.current,
        { opacity: 0, scale: 0.86, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.6)" },
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
      {/* Navigation */}
      <nav
        ref={navRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          paddingTop: "clamp(14px, 2.8vh, 26px)",
          paddingInline: "clamp(20px, 5vw, 80px)",
          gap: 0,
        }}
      >
        {NAV_ITEMS.map((item, i) => (
          <span key={item} style={{ display: "flex", alignItems: "center" }}>
            <a
              href="#"
              style={{
                color: "rgba(255,255,255,0.9)",
                textDecoration: "none",
                fontSize: "clamp(9px, 1vw, 13px)",
                letterSpacing: "0.13em",
                fontWeight: 400,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#fff")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.9)")
              }
            >
              {item}
            </a>
            {i < NAV_ITEMS.length - 1 && (
              <span
                style={{
                  color: CYAN,
                  fontSize: "clamp(9px, 1vw, 13px)",
                  fontWeight: 700,
                  marginInline: "clamp(6px, 1vw, 16px)",
                  lineHeight: 1,
                }}
              >
                →
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* Bloc texte gauche */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "clamp(28px, 6.5vw, 110px)",
          transform: "translateY(-54%)",
          maxWidth: "clamp(300px, 46vw, 660px)",
        }}
      >
        {/* Headline */}
        <div ref={headingRef}>
          <p
            style={{
              margin: 0,
              fontSize: "clamp(34px, 5.2vw, 78px)",
              fontWeight: 900,
              lineHeight: 1.06,
              color: "#ffffff",
              letterSpacing: "-0.01em",
              textTransform: "lowercase",
            }}
          >
            On propulse votre
            <br />
            commerce
            <br />
            et{" "}
            <span style={{ color: CYAN }}>votre site</span>
            <span style={{ color: "#ffffff" }}>.</span>
          </p>
        </div>

        {/* Description */}
        <p
          ref={descRef}
          style={{
            margin: 0,
            marginTop: "clamp(14px, 2.4vh, 26px)",
            fontSize: "clamp(12px, 1.25vw, 17px)",
            fontWeight: 700,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.01em",
            maxWidth: "min(500px, 90%)",
          }}
        >
          FantinWebDesign conçoit des sites web professionnels,
          {" "}rapides et sur mesure, pour les artisans, commerçants
          {" "}et TPE qui veulent une vraie présence en ligne
        </p>

        {/* CTA */}
        <a
          ref={btnRef}
          href="#contact"
          style={{
            display: "inline-block",
            marginTop: "clamp(22px, 3.8vh, 40px)",
            padding: "clamp(11px, 1.4vh, 17px) clamp(28px, 3.2vw, 48px)",
            background: CYAN,
            color: "#000000",
            textDecoration: "none",
            fontSize: "clamp(9px, 1vw, 12px)",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            clipPath:
              "polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)",
            cursor: "pointer",
            transition: "filter 0.2s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.filter = "brightness(1.18)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.filter = "brightness(1)";
          }}
        >
          Discutons de votre projet
        </a>
      </div>
    </div>
  );
}
