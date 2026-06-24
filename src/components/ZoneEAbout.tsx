"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const CYAN = "#00CFFF";
const NAV_ITEMS = ["À propos", "Méthode", "Réalisations", "Contact", "Services"];

const ZONE_START = 1330;
const FADE_START = 1405;
const FADE_END = 1430;

type FrameCallback = ((frame: number) => void) | null;


export default function ZoneEAbout({
  isActive,
  onFrameUpdate,
}: {
  isActive: boolean;
  onFrameUpdate: { current: FrameCallback };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);
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
    return () => { onFrameUpdate.current = null; };
  }, [onFrameUpdate]);

  useEffect(() => {
    if (!isActive || hasEnteredRef.current) return;
    hasEnteredRef.current = true;

    gsap.set(containerRef.current, { opacity: 1 });
    gsap.set(
      [navRef.current, titleRef.current, textBoxRef.current],
      { opacity: 0 }
    );

    gsap
      .timeline({ delay: 0.1 })
      .fromTo(navRef.current,
        { opacity: 0, y: -22 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .fromTo(titleRef.current,
        { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" }, "-=0.2")
      .fromTo(textBoxRef.current,
        { opacity: 0, x: -48 }, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, "-=0.4");
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
        overflow: "hidden",
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
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)")}
            >
              {item}
            </a>
            {i < NAV_ITEMS.length - 1 && (
              <span style={{
                color: CYAN,
                fontSize: "clamp(9px, 1vw, 13px)",
                fontWeight: 700,
                marginInline: "clamp(6px, 1vw, 16px)",
                lineHeight: 1,
              }}>→</span>
            )}
          </span>
        ))}
      </nav>

      {/* Titre principal */}
      <div
        ref={titleRef}
        style={{
          position: "absolute",
          top: "clamp(56px, 11vh, 110px)",
          left: "clamp(24px, 4.5vw, 72px)",
          maxWidth: "clamp(300px, 54vw, 760px)",
        }}
      >
        <p style={{
          margin: 0,
          fontSize: "clamp(26px, 4.2vw, 64px)",
          fontWeight: 900,
          lineHeight: 1.1,
          color: "#ffffff",
          letterSpacing: "-0.01em",
        }}>
          Qui est derrière{" "}
          <span style={{ color: CYAN }}>FantinWebDesign</span>{" "}?
        </p>
      </div>

      {/* Bloc texte avec bordure géométrique cyan */}
      <div
        ref={textBoxRef}
        style={{
          position: "absolute",
          top: "clamp(140px, 26vh, 260px)",
          left: "clamp(24px, 4.5vw, 72px)",
          width: "clamp(260px, 38vw, 540px)",
          border: `2px solid ${CYAN}`,
          padding: "clamp(16px, 2.4vh, 30px) clamp(18px, 2.2vw, 30px)",
          background: "rgba(0, 8, 20, 0.5)",
          backdropFilter: "blur(5px)",
          clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
          boxShadow: `0 0 24px rgba(0,207,255,0.12), inset 0 0 20px rgba(0,207,255,0.04)`,
        }}
      >
        <p style={{
          margin: 0,
          fontSize: "clamp(11px, 1.2vw, 17px)",
          fontWeight: 700,
          lineHeight: 1.72,
          color: "rgba(255,255,255,0.92)",
          letterSpacing: "0.01em",
        }}>
          FantinWebDesign, c&apos;est une agence web à taille humaine, spécialisée dans la création de sites pour les professionnels locaux et les petites structures. On croit qu&apos;un bon site, ce n&apos;est pas forcément un site complexe&nbsp;: c&apos;est un site qui sert vos objectifs.
        </p>
      </div>

    </div>
  );
}
