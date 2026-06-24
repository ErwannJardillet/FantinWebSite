"use client";

const CYAN = "#00CFFF";
const NAV_ITEMS = ["Accueil", "Services", "Méthode", "Réalisations", "À propos", "Contact"];

export default function Breadcrumb({ activeZone }: { activeZone: number | null }) {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "wrap",
        paddingTop: "clamp(14px, 2.8vh, 26px)",
        paddingInline: "clamp(20px, 5vw, 80px)",
        gap: 0,
        zIndex: 50,
        fontFamily: "'Orbitron', sans-serif",
        pointerEvents: "none",
      }}
    >
      {NAV_ITEMS.map((item, i) => {
        const isActive = i === activeZone;
        return (
          <span key={item} style={{ display: "flex", alignItems: "center" }}>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <a
                href="#"
                style={{
                  color: isActive ? CYAN : "rgba(255,255,255,0.45)",
                  textDecoration: "none",
                  fontSize: "clamp(9px, 1vw, 13px)",
                  letterSpacing: "0.13em",
                  fontWeight: isActive ? 700 : 400,
                  transition: "color 0.25s, font-weight 0.25s",
                  pointerEvents: "auto",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
                }}
              >
                {item}
              </a>
              <span
                style={{
                  display: "block",
                  width: "100%",
                  height: "2px",
                  background: CYAN,
                  borderRadius: "1px",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.35s",
                }}
              />
            </span>
            {i < NAV_ITEMS.length - 1 && (
              <span
                style={{
                  color: "rgba(255,255,255,0.25)",
                  fontSize: "clamp(9px, 1vw, 13px)",
                  fontWeight: 400,
                  marginInline: "clamp(6px, 1vw, 16px)",
                  lineHeight: 1,
                  paddingBottom: "5px",
                }}
              >
                /
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
