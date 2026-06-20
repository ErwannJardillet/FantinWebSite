"use client";

import { useEffect, useRef, useState } from "react";

const MAX_FRAMES = 300;
const TARGET_FPS = 30;

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<ImageBitmap[]>([]);
  const rafRef = useRef<number>(0);
  const [loadPct, setLoadPct] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    // --- Extraction des frames ---
    const video = document.createElement("video");
    video.src = "/video/showreel.mp4";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    video.addEventListener(
      "loadedmetadata",
      async () => {
        const duration = video.duration;
        const count = Math.min(Math.ceil(duration * TARGET_FPS), MAX_FRAMES);
        const frames: ImageBitmap[] = [];

        for (let i = 0; i < count; i++) {
          video.currentTime = (i / (count - 1)) * duration;
          await new Promise<void>((resolve) => {
            video.addEventListener("seeked", () => resolve(), { once: true });
          });
          frames.push(await createImageBitmap(video));
          setLoadPct(Math.round(((i + 1) / count) * 100));
        }

        framesRef.current = frames;
        drawFrame(ctx, frames[0], canvas.width, canvas.height);
        setReady(true);

        // --- Boucle de rendu synchronisée avec le scroll ---
        let lastIndex = -1;
        const loop = () => {
          const scrollTop = window.scrollY;
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          const p = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
          const index = Math.round(p * (frames.length - 1));

          if (index !== lastIndex) {
            drawFrame(ctx, frames[index], canvas.width, canvas.height);
            lastIndex = index;
          }

          rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
      },
      { once: true }
    );

    video.load();

    return () => {
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(rafRef.current);
      framesRef.current.forEach((f) => f.close());
    };
  }, []);

  return (
    <>
      {/* Canvas fixé en permanence plein écran */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          zIndex: 0,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />

        {!ready && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: 13,
              fontFamily: "sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            {loadPct}%
          </div>
        )}
      </div>

      {/* Zone scrollable qui détermine la progression */}
      <div style={{ height: "500vh", position: "relative", zIndex: 1 }} />
    </>
  );
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  frame: ImageBitmap,
  cw: number,
  ch: number
) {
  const scale = Math.max(cw / frame.width, ch / frame.height);
  const w = frame.width * scale;
  const h = frame.height * scale;
  ctx.drawImage(frame, (cw - w) / 2, (ch - h) / 2, w, h);
}
