"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CYAN = "#00CFFF";
const NAV_ITEMS = ["À propos", "Méthode", "Réalisations", "Contact", "Services"];

const ZONE_START = 1330;
const FADE_START = 1405;
const FADE_END = 1430;

type FrameCallback = ((frame: number) => void) | null;

const CLIP = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))";

export default function ZoneEContact({
  isActive,
  onFrameUpdate,
}: {
  isActive: boolean;
  onFrameUpdate: { current: FrameCallback };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const hasEnteredRef = useRef(false);
  const [sent, setSent] = useState(false);

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
      [navRef.current, titleRef.current, formRef.current, infoRef.current],
      { opacity: 0 }
    );

    gsap
      .timeline({ delay: 0.1 })
      .fromTo(
        navRef.current,
        { opacity: 0, y: -22 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
      .fromTo(
        titleRef.current,
        { opacity: 0, x: -52 },
        { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        infoRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
        "-=0.35"
      )
      .fromTo(
        formRef.current,
        { opacity: 0, x: 56 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
        "-=0.45"
      );
  }, [isActive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

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

      {/* Layout principal : titre gauche + formulaire droite */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          top: "clamp(60px, 10vh, 100px)",
          bottom: "clamp(60px, 10vh, 100px)",
          display: "flex",
          alignItems: "center",
          paddingInline: "clamp(24px, 6vw, 110px)",
          gap: "clamp(32px, 5vw, 80px)",
        }}
      >
        {/* Colonne gauche : titre + infos */}
        <div style={{ flex: "0 0 auto", maxWidth: "clamp(240px, 38vw, 520px)" }}>
          <div ref={titleRef}>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(32px, 5vw, 76px)",
                fontWeight: 900,
                lineHeight: 1.06,
                color: "#ffffff",
                letterSpacing: "-0.01em",
                textTransform: "lowercase",
              }}
            >
              Travaillons
              <br />
              ensemble<span style={{ color: CYAN }}>.</span>
            </p>
          </div>

          <div
            ref={infoRef}
            style={{ marginTop: "clamp(24px, 3.6vh, 44px)" }}
          >
            {/* Email direct */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(8px, 1vw, 14px)",
                marginBottom: "clamp(10px, 1.8vh, 18px)",
              }}
            >
              <span style={{ color: CYAN, fontSize: "clamp(12px, 1.1vw, 16px)", fontWeight: 700 }}>→</span>
              <a
                href="mailto:contact@fantinwebdesign.fr"
                style={{
                  color: "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                  fontSize: "clamp(10px, 1vw, 14px)",
                  letterSpacing: "0.04em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = CYAN)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    "rgba(255,255,255,0.85)")
                }
              >
                contact@fantinwebdesign.fr
              </a>
            </div>

            {/* Délai de réponse */}
            <p
              style={{
                margin: 0,
                marginTop: "clamp(14px, 2vh, 22px)",
                fontSize: "clamp(10px, 0.95vw, 13px)",
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.06em",
                lineHeight: 1.6,
              }}
            >
              Réponse sous 24&nbsp;h · Devis gratuit
            </p>

            {/* Ligne décorative */}
            <div
              style={{
                marginTop: "clamp(18px, 2.8vh, 32px)",
                height: "1px",
                width: "clamp(60px, 10vw, 140px)",
                background: `linear-gradient(to right, ${CYAN}, transparent)`,
              }}
            />
          </div>
        </div>

        {/* Colonne droite : formulaire */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            maxWidth: "clamp(260px, 44vw, 600px)",
            clipPath: CLIP,
            border: "1px solid rgba(255,255,255,0.62)",
            padding: "clamp(22px, 3.2vh, 42px) clamp(22px, 2.8vw, 40px)",
            background: "rgba(0,0,0,0.42)",
            backdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(14px, 2.2vh, 24px)",
          }}
        >
          {sent ? (
            <div
              style={{
                textAlign: "center",
                padding: "clamp(24px, 4vh, 48px) 0",
              }}
            >
              <p
                style={{
                  margin: 0,
                  marginBottom: "clamp(8px, 1.4vh, 14px)",
                  fontSize: "clamp(14px, 1.6vw, 22px)",
                  fontWeight: 700,
                  color: CYAN,
                  letterSpacing: "0.06em",
                }}
              >
                Message envoyé
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(10px, 0.95vw, 13px)",
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.6,
                }}
              >
                On vous recontacte sous 24&nbsp;h.
              </p>
            </div>
          ) : (
            <>
              {/* Nom */}
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(5px, 0.8vh, 8px)" }}>
                <label
                  style={{
                    fontSize: "clamp(8px, 0.8vw, 11px)",
                    letterSpacing: "0.18em",
                    color: CYAN,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Nom
                </label>
                <input
                  type="text"
                  required
                  placeholder="Votre nom"
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.35)",
                    color: "#ffffff",
                    fontSize: "clamp(11px, 1.05vw, 15px)",
                    fontFamily: "'Orbitron', sans-serif",
                    letterSpacing: "0.04em",
                    padding: "clamp(6px, 0.9vh, 10px) 0",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderBottomColor = CYAN)
                  }
                  onBlur={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderBottomColor =
                      "rgba(255,255,255,0.35)")
                  }
                />
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(5px, 0.8vh, 8px)" }}>
                <label
                  style={{
                    fontSize: "clamp(8px, 0.8vw, 11px)",
                    letterSpacing: "0.18em",
                    color: CYAN,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="votre@email.fr"
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.35)",
                    color: "#ffffff",
                    fontSize: "clamp(11px, 1.05vw, 15px)",
                    fontFamily: "'Orbitron', sans-serif",
                    letterSpacing: "0.04em",
                    padding: "clamp(6px, 0.9vh, 10px) 0",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderBottomColor = CYAN)
                  }
                  onBlur={(e) =>
                    ((e.currentTarget as HTMLInputElement).style.borderBottomColor =
                      "rgba(255,255,255,0.35)")
                  }
                />
              </div>

              {/* Message */}
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(5px, 0.8vh, 8px)" }}>
                <label
                  style={{
                    fontSize: "clamp(8px, 0.8vw, 11px)",
                    letterSpacing: "0.18em",
                    color: CYAN,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Message
                </label>
                <textarea
                  required
                  placeholder="Décrivez votre projet en quelques mots…"
                  rows={3}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.35)",
                    color: "#ffffff",
                    fontSize: "clamp(11px, 1.05vw, 15px)",
                    fontFamily: "'Orbitron', sans-serif",
                    letterSpacing: "0.04em",
                    padding: "clamp(6px, 0.9vh, 10px) 0",
                    outline: "none",
                    resize: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    ((e.currentTarget as HTMLTextAreaElement).style.borderBottomColor = CYAN)
                  }
                  onBlur={(e) =>
                    ((e.currentTarget as HTMLTextAreaElement).style.borderBottomColor =
                      "rgba(255,255,255,0.35)")
                  }
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  alignSelf: "flex-start",
                  marginTop: "clamp(4px, 0.8vh, 10px)",
                  padding: "clamp(10px, 1.3vh, 16px) clamp(26px, 3vw, 46px)",
                  background: CYAN,
                  color: "#000000",
                  border: "none",
                  fontSize: "clamp(8px, 0.85vw, 11px)",
                  fontWeight: 700,
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  clipPath:
                    "polygon(16px 0%, 100% 0%, calc(100% - 16px) 100%, 0% 100%)",
                  cursor: "pointer",
                  transition: "filter 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.filter =
                    "brightness(1.18)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.filter =
                    "brightness(1)")
                }
              >
                Envoyer
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
