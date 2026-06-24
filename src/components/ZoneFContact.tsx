"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CYAN = "#00CFFF";

const ZONE_START = 1950;
const FADE_START = 2028;
const FADE_END = 2053;
const MAX_CHARS = 1000;

const SUBJECTS = [
  "Création de site vitrine",
  "Refonte de site existant",
  "Optimisation SEO",
  "Maintenance et suivi",
  "Autre demande",
];

type FrameCallback = ((frame: number) => void) | null;

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 8,
  color: "#ffffff",
  fontSize: "clamp(10px, 1vw, 14px)",
  fontFamily: "'Orbitron', sans-serif",
  letterSpacing: "0.02em",
  padding: "clamp(9px, 1.3vh, 14px) clamp(10px, 1.2vw, 16px)",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

function focusInput(el: HTMLElement) {
  el.style.borderColor = CYAN;
  el.style.boxShadow = `0 0 0 2px rgba(0,207,255,0.18)`;
}
function blurInput(el: HTMLElement) {
  el.style.borderColor = "rgba(255,255,255,0.14)";
  el.style.boxShadow = "none";
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      margin: 0,
      marginBottom: "clamp(5px, 0.8vh, 8px)",
      fontSize: "clamp(9px, 0.85vw, 12px)",
      fontWeight: 600,
      color: "rgba(255,255,255,0.7)",
      letterSpacing: "0.06em",
      fontFamily: "'Orbitron', sans-serif",
    }}>
      {children}
    </p>
  );
}

export default function ZoneFContact({
  isActive,
  onFrameUpdate,
}: {
  isActive: boolean;
  onFrameUpdate: { current: FrameCallback };
}) {
  const [charCount, setCharCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [sent, setSent] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);
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
    gsap.set([titleRef.current, formWrapRef.current], { opacity: 0 });

    gsap
      .timeline({ delay: 0.1 })
      .fromTo(titleRef.current,
        { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" })
      .fromTo(formWrapRef.current,
        { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.35");
  }, [isActive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) return;
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
      {/* Titre */}
      <div
        ref={titleRef}
        style={{
          textAlign: "center",
          paddingTop: "clamp(8px, 1.4vh, 16px)",
        }}
      >
        <p style={{
          margin: 0,
          fontSize: "clamp(26px, 4.5vw, 68px)",
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "-0.01em",
          lineHeight: 1.1,
        }}>
          Parlons de{" "}
          <span style={{ color: CYAN }}>votre</span>{" "}
          projet
        </p>
      </div>

      {/* Conteneur principal du formulaire */}
      <div
        ref={formWrapRef}
        style={{
          position: "absolute",
          left: "clamp(14px, 3.5vw, 56px)",
          right: "clamp(14px, 3.5vw, 56px)",
          top: "clamp(100px, 18vh, 170px)",
          bottom: "clamp(14px, 2.5vh, 28px)",
          display: "flex",
          gap: "clamp(14px, 2vw, 26px)",
          background: "rgba(5, 9, 22, 0.88)",
          border: `1px solid rgba(0,207,255,0.2)`,
          borderRadius: 12,
          backdropFilter: "blur(14px)",
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
          padding: "clamp(16px, 2.6vh, 32px) clamp(18px, 2.6vw, 32px)",
          overflow: "auto",
        }}
      >
        {sent ? (
          /* État envoyé */
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(12px, 2vh, 20px)",
          }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ filter: `drop-shadow(0 0 12px ${CYAN})` }}>
              <circle cx="28" cy="28" r="26" stroke={CYAN} strokeWidth="2" />
              <path d="M16 28L24 36L40 20" stroke={CYAN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p style={{ margin: 0, fontSize: "clamp(16px, 2vw, 26px)", fontWeight: 900, color: "#ffffff" }}>
              Message envoyé !
            </p>
            <p style={{ margin: 0, fontSize: "clamp(11px, 1vw, 14px)", color: "rgba(255,255,255,0.6)", textAlign: "center", letterSpacing: "0.04em" }}>
              Je vous réponds sous 24 h.
            </p>
          </div>
        ) : (
          <>
            {/* ── Colonne gauche : formulaire ── */}
            <form
              onSubmit={handleSubmit}
              style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column" }}
            >
              {/* En-tête du formulaire */}
              <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1vw, 14px)", marginBottom: "clamp(4px, 0.8vh, 8px)" }}>
                {/* Icône fusée */}
                <svg width="clamp(20px,2.2vw,30px)" height="clamp(20px,2.2vw,30px)" viewBox="0 0 30 30" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M15 3C15 3 9 9 8 16H12L11 23L15 21L19 23L18 16H22C21 9 15 3 15 3Z" stroke={CYAN} strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M12 16L7 20L11 23" stroke={CYAN} strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M18 16L23 20L19 23" stroke={CYAN} strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="15" cy="13" r="2" stroke={CYAN} strokeWidth="1.4" />
                </svg>
                <p style={{ margin: 0, fontSize: "clamp(13px, 1.6vw, 22px)", fontWeight: 900, color: "#ffffff" }}>
                  Parlons de votre projet
                </p>
              </div>
              <p style={{
                margin: 0,
                marginBottom: "clamp(12px, 2vh, 22px)",
                fontSize: "clamp(9px, 0.9vw, 13px)",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.6,
                letterSpacing: "0.02em",
              }}>
                Vous avez une idée, un besoin, une question ?<br />
                Remplissez le formulaire, je vous réponds sous 24 h.
              </p>

              {/* Ligne 1 : Nom | Email */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "clamp(10px, 1.4vw, 18px)",
                marginBottom: "clamp(10px, 1.6vh, 18px)",
              }}>
                <div>
                  <FieldLabel>Nom complet *</FieldLabel>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom"
                    style={INPUT_STYLE}
                    onFocus={(e) => focusInput(e.currentTarget)}
                    onBlur={(e) => blurInput(e.currentTarget)}
                  />
                </div>
                <div>
                  <FieldLabel>Email *</FieldLabel>
                  <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    style={INPUT_STYLE}
                    onFocus={(e) => focusInput(e.currentTarget)}
                    onBlur={(e) => blurInput(e.currentTarget)}
                  />
                </div>
              </div>

              {/* Ligne 2 : Téléphone | Sujet */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "clamp(10px, 1.4vw, 18px)",
                marginBottom: "clamp(10px, 1.6vh, 18px)",
              }}>
                <div>
                  <FieldLabel>Téléphone</FieldLabel>
                  <input
                    type="tel"
                    placeholder="06 00 00 00 00"
                    style={INPUT_STYLE}
                    onFocus={(e) => focusInput(e.currentTarget)}
                    onBlur={(e) => blurInput(e.currentTarget)}
                  />
                </div>
                <div>
                  <FieldLabel>Sujet *</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <select
                      required
                      defaultValue=""
                      style={{
                        ...INPUT_STYLE,
                        appearance: "none",
                        cursor: "pointer",
                        paddingRight: "clamp(28px, 2.5vw, 36px)",
                      }}
                      onFocus={(e) => focusInput(e.currentTarget)}
                      onBlur={(e) => blurInput(e.currentTarget)}
                    >
                      <option value="" disabled style={{ background: "#0a0f1e" }}>
                        Sélectionnez un sujet
                      </option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s} style={{ background: "#0a0f1e" }}>{s}</option>
                      ))}
                    </select>
                    {/* Chevron */}
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      style={{ position: "absolute", right: "clamp(8px, 1vw, 12px)", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                    >
                      <path d="M2 4L6 8L10 4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Textarea */}
              <div style={{ flex: 1, marginBottom: "clamp(10px, 1.6vh, 16px)", display: "flex", flexDirection: "column" }}>
                <FieldLabel>Votre message *</FieldLabel>
                <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
                  <textarea
                    required
                    placeholder="Décrivez votre projet ou votre besoin..."
                    maxLength={MAX_CHARS}
                    onChange={(e) => setCharCount(e.target.value.length)}
                    style={{
                      ...INPUT_STYLE,
                      flex: 1,
                      resize: "none",
                      minHeight: "clamp(70px, 10vh, 120px)",
                      paddingBottom: "clamp(22px, 3vh, 28px)",
                    }}
                    onFocus={(e) => focusInput(e.currentTarget)}
                    onBlur={(e) => blurInput(e.currentTarget)}
                  />
                  <span style={{
                    position: "absolute",
                    bottom: "clamp(6px, 0.9vh, 10px)",
                    right: "clamp(8px, 1vw, 12px)",
                    fontSize: "clamp(8px, 0.75vw, 11px)",
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "'Orbitron', sans-serif",
                    pointerEvents: "none",
                  }}>
                    {charCount} / {MAX_CHARS}
                  </span>
                </div>
              </div>

              {/* Checkbox RGPD */}
              <label style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "clamp(8px, 0.9vw, 12px)",
                cursor: "pointer",
                marginBottom: "clamp(12px, 1.8vh, 20px)",
              }}>
                <div style={{ position: "relative", flexShrink: 0, marginTop: 2 }}>
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    style={{ appearance: "none", width: 15, height: 15, border: "1px solid rgba(255,255,255,0.3)", borderRadius: 3, background: accepted ? CYAN : "transparent", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}
                  />
                  {accepted && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <p style={{
                  margin: 0,
                  fontSize: "clamp(8px, 0.78vw, 11px)",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.55,
                  letterSpacing: "0.02em",
                }}>
                  J&apos;accepte que mes données soient utilisées pour répondre à ma demande.{" "}
                  <a href="#" style={{ color: CYAN, textDecoration: "underline" }}>
                    Voir notre politique de confidentialité
                  </a>.
                </p>
              </label>

              {/* Bouton envoyer */}
              <button
                type="submit"
                disabled={!accepted}
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(6px, 0.8vw, 10px)",
                  padding: "clamp(10px, 1.4vh, 16px) clamp(20px, 2.4vw, 34px)",
                  background: accepted ? CYAN : "rgba(0,207,255,0.25)",
                  color: accepted ? "#000000" : "rgba(255,255,255,0.35)",
                  border: "none",
                  borderRadius: 8,
                  fontSize: "clamp(9px, 0.9vw, 13px)",
                  fontWeight: 700,
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: "0.1em",
                  cursor: accepted ? "pointer" : "not-allowed",
                  transition: "filter 0.2s, background 0.25s, color 0.25s",
                }}
                onMouseEnter={(e) => { if (accepted) (e.currentTarget as HTMLElement).style.filter = "brightness(1.15)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = "brightness(1)"; }}
              >
                {/* Icône envoi */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M12.5 1.5L1.5 6.5L6 7.5L7 12.5L12.5 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Envoyer le message
              </button>
            </form>

            {/* ── Colonne droite : Salle de contrôle ── */}
            <div style={{
              width: "clamp(180px, 26vw, 340px)",
              flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "clamp(14px, 2vh, 24px) clamp(14px, 1.8vw, 22px)",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}>
              {/* Titre panneau */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(8px, 0.9vw, 12px)",
                paddingBottom: "clamp(12px, 1.8vh, 20px)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                marginBottom: "clamp(12px, 1.8vh, 20px)",
              }}>
                {/* Icône satellite */}
                <svg width="clamp(22px,2.4vw,32px)" height="clamp(22px,2.4vw,32px)" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="16" cy="16" r="4" stroke={CYAN} strokeWidth="1.5" />
                  <path d="M10 10L6 6" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M22 10L26 6" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M16 22V28" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" />
                  <ellipse cx="9" cy="9" rx="4" ry="4" transform="rotate(-45 9 9)" stroke={CYAN} strokeWidth="1.5" />
                  <path d="M20 12C22 10 26 10 28 12" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M4 20C6 22 10 22 12 20" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p style={{ margin: 0, fontSize: "clamp(12px, 1.3vw, 17px)", fontWeight: 700, color: "#ffffff" }}>
                  Salle de contrôle
                </p>
              </div>

              {/* Infos de contact */}
              {[
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="4" width="16" height="12" rx="2" stroke={CYAN} strokeWidth="1.4" />
                      <path d="M2 6L10 11L18 6" stroke={CYAN} strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  ),
                  main: "contact@fantinwebdesign.fr",
                  sub: "Réponse sous 24 h",
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 3H7L9 7L7 9C8 11 9 12 11 13L13 11L17 13V16C17 17 16 18 15 18C8 18 2 12 2 5C2 4 3 3 4 3Z" stroke={CYAN} strokeWidth="1.4" strokeLinejoin="round" />
                    </svg>
                  ),
                  main: "07 69 88 60 42",
                  sub: "Lun - Ven : 9h - 18h",
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2C7 2 4 4.7 4 8C4 12 10 18 10 18C10 18 16 12 16 8C16 4.7 13 2 10 2Z" stroke={CYAN} strokeWidth="1.4" />
                      <circle cx="10" cy="8" r="2" stroke={CYAN} strokeWidth="1.4" />
                    </svg>
                  ),
                  main: "Valence, Drôme (26)",
                  sub: "Interventions à distance",
                },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: "clamp(8px, 0.9vw, 12px)",
                  alignItems: "flex-start",
                  marginBottom: "clamp(12px, 1.8vh, 20px)",
                }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: "clamp(9px, 0.9vw, 13px)", fontWeight: 600, color: "#ffffff", lineHeight: 1.4 }}>
                      {item.main}
                    </p>
                    <p style={{ margin: 0, fontSize: "clamp(8px, 0.75vw, 11px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}

              {/* Séparateur + note sécurité */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "clamp(12px, 1.8vh, 20px)", marginTop: "auto" }}>
                <div style={{ display: "flex", gap: "clamp(8px, 0.9vw, 12px)", alignItems: "flex-start" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M10 2L3 5V10C3 14 6 17.5 10 18C14 17.5 17 14 17 10V5L10 2Z" stroke={CYAN} strokeWidth="1.4" strokeLinejoin="round" />
                    <path d="M7 10L9 12L13 8" stroke={CYAN} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p style={{ margin: 0, fontSize: "clamp(8px, 0.75vw, 11px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                    Vos données sont chiffrées<br />et ne seront jamais partagées.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
