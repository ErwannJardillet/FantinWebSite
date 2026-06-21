"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<ImageBitmap[]>([]);
  const totalRef = useRef(0);
  const rafRef = useRef<number>(0);
  const loopStartedRef = useRef(false);
  const [loadPct, setLoadPct] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastIndexRef = { current: -1 };

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Canvas cleared on resize — force redraw on next RAF tick
      lastIndexRef.current = -1;
    };
    setSize();
    window.addEventListener("resize", setSize);

    const startLoop = () => {
      if (loopStartedRef.current) return;
      loopStartedRef.current = true;

      const loop = () => {
        const available = framesRef.current.length;
        if (available > 0) {
          const scrollTop = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const p = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
          const index = Math.min(
            Math.round(p * (totalRef.current - 1)),
            available - 1
          );
          if (index !== lastIndexRef.current) {
            drawFrame(ctx, framesRef.current[index], canvas.width, canvas.height);
            lastIndexRef.current = index;
          }
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    };

    const run = async () => {
      // Charge le manifeste pour connaître le nombre de frames
      const manifest = await fetch("/frames/manifest.json").then((r) => r.json());
      const count: number = manifest.count;
      totalRef.current = count;

      for (let i = 0; i < count; i++) {
        const frameNum = String(i + 1).padStart(3, "0");
        const img = new Image();
        img.src = `/frames/frame-${frameNum}.webp`;
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // skip missing frames gracefully
        });
        const bitmap = await createImageBitmap(img);
        framesRef.current.push(bitmap);
        setLoadPct(Math.round(((i + 1) / count) * 100));

        if (i === 0) {
          drawFrame(ctx, bitmap, canvas.width, canvas.height);
          setFirstFrameReady(true);
          startLoop();
        }
      }
    };

    run();

    return () => {
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(rafRef.current);
      framesRef.current.forEach((f) => f.close());
    };
  }, []);

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 0 }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />

        {!firstFrameReady && (
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

        {firstFrameReady && loadPct < 100 && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 2,
              width: `${loadPct}%`,
              background: "rgba(255,255,255,0.3)",
              transition: "width 0.1s linear",
            }}
          />
        )}
      </div>

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
