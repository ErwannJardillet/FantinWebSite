"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
      });
      gsap.from(subtitleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex h-screen items-center justify-center bg-black text-white overflow-hidden">
      <div className="text-center px-6 max-w-4xl">
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-6"
        >
          Fantin
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-white/60 font-light"
        >
          Agence créative — Design & Expériences digitales
        </p>
      </div>
    </section>
  );
}
