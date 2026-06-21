import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Fantin — Agence créative",
  description: "Agence créative spécialisée en design et expériences digitales.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Précharge la 1ère frame avant que JS s'exécute → supprime le flash noir */}
        <link rel="preload" as="image" href="/frames/frame-001.webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
