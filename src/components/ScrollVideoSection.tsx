"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // Attend que les métadonnées soient chargées pour connaître la durée
    const onLoaded = () => {
      const ctx = gsap.context(() => {
        // Contrôle la currentTime de la vidéo via le scroll
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            video.currentTime = self.progress * video.duration;
          },
        });

        // Apparition de l'overlay texte au milieu du scroll
        gsap.from(overlayRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "40% center",
            end: "60% center",
            toggleActions: "play none none reverse",
          },
        });
      }, section);

      return () => ctx.revert();
    };

    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  return (
    // Section haute = durée du scroll pour l'effet vidéo
    <div ref={sectionRef} className="relative h-[400vh] bg-black">
      {/* Vidéo sticky qui reste à l'écran pendant le scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          // Remplace par l'URL de ta vidéo
          src="/video/showreel.mp4"
        />

        {/* Overlay texte qui apparaît au scroll */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Nous créons l'extraordinaire
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-xl">
            Des expériences digitales qui marquent les esprits.
          </p>
        </div>
      </div>
    </div>
  );
}
