# FantinWebSite

Site web d'agence / portfolio pour l'entreprise Fantin.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **GSAP + ScrollTrigger** — pour les animations au scroll et la vidéo scroll-driven

## Concept principal

Le site utilise une **vidéo contrôlée par le scroll** : la `currentTime` de la vidéo avance proportionnellement au scroll de l'utilisateur (via GSAP ScrollTrigger). Des éléments HTML apparaissent à des moments clés du scroll.

## Structure

```
src/
  app/
    layout.tsx       — RootLayout, métadonnées
    page.tsx         — Page d'accueil
  components/
    HeroSection.tsx      — Hero plein écran avec animation d'entrée GSAP
    ScrollVideoSection.tsx — Vidéo pilotée par le scroll
  styles/
    globals.css      — Tailwind v4 + variables CSS
public/
  video/
    showreel.mp4     — Vidéo principale (à ajouter)
```

## Commandes

```bash
npm run dev    # Démarrer en développement
npm run build  # Build de production
npm run lint   # Linter
```

## Vidéo

Placer la vidéo showreel dans `public/video/showreel.mp4`.  
Format recommandé : MP4 H.264, sans audio, optimisé web.
