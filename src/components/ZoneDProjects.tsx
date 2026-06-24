"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CYAN = "#00CFFF";

const ZONE_START = 990;
const FADE_START = 1065;
const FADE_END = 1090;

type FrameCallback = ((frame: number) => void) | null;

const PROJECTS = [
  { name: "Boulangerie Martin", type: "Site vitrine", year: "2024" },
  { name: "Cabinet Dupont", type: "Refonte", year: "2024" },
  { name: "Boutique Éclat", type: "E-commerce", year: "2025" },
];

export default function ZoneDProjects({
  isActive,
  onFrameUpdate,
}: {
  isActive: boolean;
  onFrameUpdate: { current: FrameCallback };
}) {
  const [slide, setSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselWrapRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLButtonElement>(null);
  const rightArrowRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const slideContentRef = useRef<HTMLDivElement>(null);
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
      [carouselWrapRef.current, leftArrowRef.current, rightArrowRef.current, titleRef.current],
      { opacity: 0 }
    );

    gsap
      .timeline({ delay: 0.1 })
      .fromTo(
        carouselWrapRef.current,
        { opacity: 0, scale: 0.93 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(
        leftArrowRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        "-=0.45"
      )
      .fromTo(
        rightArrowRef.current,
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        "<"
      )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.3"
      );
  }, [isActive]);

  const goTo = (dir: 1 | -1) => {
    const el = slideContentRef.current;
    if (!el) return;
    gsap.to(el, {
      opacity: 0,
      x: -dir * 28,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        setSlide((prev) => (prev + dir + PROJECTS.length) % PROJECTS.length);
        gsap.fromTo(el, { opacity: 0, x: dir * 28 }, { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" });
      },
    });
  };

  const project = PROJECTS[slide];

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
      {/* Zone centrale : flèche gauche + double cadre + flèche droite */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: "30%",
          top: "clamp(60px, 11vh, 110px)",
          bottom: "clamp(100px, 20vh, 200px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: "clamp(8px, 2vw, 28px)",
        }}
      >
        {/* Flèche gauche */}
        <button
          ref={leftArrowRef}
          onClick={() => goTo(-1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: CYAN,
            fontSize: "clamp(28px, 4vw, 56px)",
            fontWeight: 700,
            lineHeight: 1,
            padding: "0 clamp(4px, 0.8vw, 12px)",
            flexShrink: 0,
            transition: "filter 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.filter = "brightness(1.4)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.filter = "brightness(1)")}
          aria-label="Projet précédent"
        >
          ❮
        </button>

        {/* Double cadre */}
        <div
          ref={carouselWrapRef}
          style={{
            position: "relative",
            flex: 1,
            maxWidth: "clamp(260px, 54vw, 760px)",
            height: "clamp(170px, 40vh, 420px)",
            margin: "0 clamp(8px, 1.2vw, 20px)",
          }}
        >
          {/* Cadre extérieur (décalé bas-droite, plus sombre) */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              right: "-12px",
              bottom: "-12px",
              border: "2px solid rgba(0,160,220,0.45)",
              pointerEvents: "none",
            }}
          />

          {/* Cadre intérieur principal */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: `2px solid ${CYAN}`,
              background: "rgba(0,8,18,0.32)",
              backdropFilter: "blur(3px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            {/* Contenu du slide */}
            <div
              ref={slideContentRef}
              style={{ textAlign: "center", padding: "clamp(16px, 2vw, 28px)" }}
            >
              <p
                style={{
                  margin: 0,
                  marginBottom: "clamp(6px, 1.2vh, 12px)",
                  fontSize: "clamp(9px, 0.9vw, 12px)",
                  letterSpacing: "0.2em",
                  color: CYAN,
                  fontWeight: 400,
                }}
              >
                {String(slide + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
              </p>
              <h2
                style={{
                  margin: 0,
                  marginBottom: "clamp(6px, 1vh, 10px)",
                  fontSize: "clamp(18px, 2.8vw, 40px)",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "0.03em",
                  lineHeight: 1.15,
                  textTransform: "lowercase",
                }}
              >
                {project.name}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(9px, 0.95vw, 13px)",
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.12em",
                  fontWeight: 400,
                }}
              >
                {project.type} — {project.year}
              </p>
            </div>
          </div>
        </div>

        {/* Flèche droite */}
        <button
          ref={rightArrowRef}
          onClick={() => goTo(1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: CYAN,
            fontSize: "clamp(28px, 4vw, 56px)",
            fontWeight: 700,
            lineHeight: 1,
            padding: "0 clamp(4px, 0.8vw, 12px)",
            flexShrink: 0,
            transition: "filter 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.filter = "brightness(1.4)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.filter = "brightness(1)")}
          aria-label="Projet suivant"
        >
          ❯
        </button>
      </div>

      {/* Titre bas-gauche */}
      <div
        ref={titleRef}
        style={{
          position: "absolute",
          bottom: "clamp(18px, 4vh, 52px)",
          left: "clamp(16px, 3vw, 52px)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "clamp(26px, 4.5vw, 68px)",
            fontWeight: 900,
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
            color: "#ffffff",
          }}
        >
          Quelques
          <br />
          <span style={{ color: CYAN }}>projets</span> réalisés
        </p>
      </div>
    </div>
  );
}
