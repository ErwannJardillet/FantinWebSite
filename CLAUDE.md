# FantinWebSite

Site web d'agence / portfolio pour l'entreprise Fantin.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Lenis** (`^1.3.23`) — smooth scrolling, pilote la lecture des frames
- **GSAP** — animations de l'écran de chargement uniquement (split-panel exit)

## Concept principal

Le site affiche la vidéo showreel **frame par frame sur un `<canvas>`**, pilotée par le scroll via Lenis.  
La vidéo MP4 est au préalable exportée en 2054 frames WebP (`scripts/extract-frames.mjs` → `ffmpeg`).  
Au chargement, les frames sont préchargées en parallèle (concurrence = 6) comme `ImageBitmap`.

### Zones de scroll lentes (`SCROLL_ZONES` dans `ScrollVideo.tsx`)

6 plages de frames définissent des zones où le scroll est ralenti (facteur × 5) et où du contenu HTML overlay est affiché. Modifier `SCROLL_ZONES` pour ajuster les timings et le contenu de chaque zone.

### Écran de chargement (`LoadingScreen.tsx`)

Affiché tant que < 50 % des frames sont chargées. Comprend :
- Particules interactives canvas (répulsion souris)
- Barre de progression
- Animation de sortie split-panel GSAP (slide haut/bas)

## Structure

```
src/
  app/
    layout.tsx            — RootLayout, métadonnées
    page.tsx              — Orchestre LoadingScreen + ScrollVideo
  components/
    ScrollVideo.tsx       — Canvas + Lenis + zones lentes + chargement des frames  ← composant principal
    LoadingScreen.tsx     — Écran de chargement avec particules et animation GSAP
    HeroSection.tsx       — (non utilisé en prod, conservé)
    ScrollVideoSection.tsx — (legacy : vidéo HTML + GSAP ScrollTrigger, non utilisé)
  styles/
    globals.css           — Tailwind v4 + variables CSS
public/
  frames/
    frame-0001.webp … frame-2054.webp
    manifest.json         — { count: 2054, pad: 4 }
  video/
    showreel.mp4          — Source pour extract-frames
scripts/
  extract-frames.mjs      — Extrait les frames WebP depuis showreel.mp4 via ffmpeg
```

## Commandes

```bash
npm run dev             # Démarrer en développement
npm run build           # Build de production
npm run lint            # Type-check TypeScript (tsc --noEmit)
npm run extract-frames  # (Re)générer les frames WebP depuis public/video/showreel.mp4
```

## Régénérer les frames

Nécessite `ffmpeg` installé. Remplacer `public/video/showreel.mp4` puis :

```bash
npm run extract-frames
```

Paramètres dans `scripts/extract-frames.mjs` : `FPS=24`, `WIDTH=1920`, `QUALITY=80`.  
Le script écrase `public/frames/` et met à jour `manifest.json`.
