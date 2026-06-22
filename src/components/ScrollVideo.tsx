"use client";

import { useEffect, useRef, useState } from "react";

const CONCURRENCY = 6;

// Zones où le scroll est ralenti. Modifier start/end/factor pour ajuster.
// Ces plages déterminent aussi où afficher du contenu HTML.
export const SCROLL_ZONES: {
  start: number;
  end: number;
  factor: number;
  content: React.ReactNode;
}[] = [
  {
    start: 0,
    end: 100,
    factor: 5,
    content: (
      <div style={{ color: "white", fontSize: 48, fontWeight: 700 }}>
        Zone A — frames 0–100
      </div>
    ),
  },
  {
    start: 250,
    end: 350,
    factor: 5,
    content: (
      <div style={{ color: "white", fontSize: 48, fontWeight: 700 }}>
        Zone B — frames 250–350
      </div>
    ),
  },
  {
    start: 650,
    end: 750,
    factor: 5,
    content: (
      <div style={{ color: "white", fontSize: 48, fontWeight: 700 }}>
        Zone C — frames 650–750
      </div>
    ),
  },
  {
    start: 990,
    end: 1090,
    factor: 5,
    content: (
      <div style={{ color: "white", fontSize: 48, fontWeight: 700 }}>
        Zone D — frames 990–1090
      </div>
    ),
  },
  {
    start: 1330,
    end: 1430,
    factor: 5,
    content: (
      <div style={{ color: "white", fontSize: 48, fontWeight: 700 }}>
        Zone E — frames 1330–1430
      </div>
    ),
  },
  {
    start: 1950,
    end: 2053,
    factor: 5,
    content: (
      <div style={{ color: "white", fontSize: 48, fontWeight: 700 }}>
        Zone F — frames 1950–2053
      </div>
    ),
  },
];

// Construit la table cumulative scroll-units → frame.
// Chaque frame vaut `factor` unités de scroll dans les zones lentes, 1 ailleurs.
function buildScrollMap(total: number): Float32Array {
  const cumul = new Float32Array(total + 1);
  for (let i = 0; i < total; i++) {
    const zone = SCROLL_ZONES.find((z) => i >= z.start && i < z.end);
    cumul[i + 1] = cumul[i] + (zone ? zone.factor : 1);
  }
  return cumul;
}

// Dichotomie : retrouve la frame correspondant à un ratio de scroll p ∈ [0,1].
function scrollPctToFrame(p: number, scrollMap: Float32Array): number {
  const total = scrollMap.length - 1;
  const target = p * scrollMap[total];
  let lo = 0,
    hi = total;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (scrollMap[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return Math.min(lo, total - 1);
}

export default function ScrollVideo({
  onProgress,
  onComplete,
}: {
  onProgress?: (pct: number) => void;
  onComplete?: () => void;
} = {}) {
  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);
  onProgressRef.current = onProgress;
  onCompleteRef.current = onComplete;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(ImageBitmap | null)[]>([]);
  const totalRef = useRef(0);
  const scrollMapRef = useRef<Float32Array | null>(null);
  const rafRef = useRef<number>(0);
  const loopStartedRef = useRef(false);
  const lastIndexRef = useRef(-1);
  const scrollDirtyRef = useRef(true);
  const loadPctRef = useRef(0);
  const loadPctTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedRef = useRef(false);
  const activeZoneRef = useRef<number | null>(null);
  const [loadPct, setLoadPct] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [activeZone, setActiveZone] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const dpr = window.devicePixelRatio || 1;

    const setSize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      lastIndexRef.current = -1;
      scrollDirtyRef.current = true;
    };
    setSize();

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setSize, 150);
    };
    window.addEventListener("resize", onResize);

    const onScroll = () => {
      scrollDirtyRef.current = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const startLoop = () => {
      if (loopStartedRef.current) return;
      loopStartedRef.current = true;

      const loop = () => {
        if (scrollDirtyRef.current && framesRef.current.length > 0) {
          scrollDirtyRef.current = false;
          const scrollTop = window.scrollY;
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          const p = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

          const map = scrollMapRef.current;
          const index = map
            ? scrollPctToFrame(p, map)
            : Math.min(
                Math.round(p * (totalRef.current - 1)),
                framesRef.current.length - 1
              );

          const frame = framesRef.current[index];
          if (index !== lastIndexRef.current && frame) {
            drawFrame(ctx, frame, window.innerWidth, window.innerHeight);
            lastIndexRef.current = index;
          }

          // Met à jour la zone active uniquement au changement
          const zoneIdx = SCROLL_ZONES.findIndex(
            (z) => index >= z.start && index < z.end
          );
          const zone = zoneIdx === -1 ? null : zoneIdx;
          if (zone !== activeZoneRef.current) {
            activeZoneRef.current = zone;
            setActiveZone(zone);
          }
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    };

    const loadOne = async (
      i: number,
      pad: number
    ): Promise<ImageBitmap | null> => {
      const frameNum = String(i + 1).padStart(pad, "0");
      try {
        const res = await fetch(`/frames/frame-${frameNum}.webp`);
        if (!res.ok) return null;
        const blob = await res.blob();
        return createImageBitmap(blob);
      } catch {
        return null;
      }
    };

    const updatePct = (loaded: number, total: number) => {
      loadPctRef.current = Math.round((loaded / total) * 100);
      if (!loadPctTimerRef.current) {
        loadPctTimerRef.current = setTimeout(() => {
          setLoadPct(loadPctRef.current);
          onProgressRef.current?.(loadPctRef.current);
          if (!completedRef.current && loadPctRef.current >= 50) {
            completedRef.current = true;
            onCompleteRef.current?.();
          }
          loadPctTimerRef.current = null;
        }, 50);
      }
    };

    const run = async () => {
      const manifest = await fetch("/frames/manifest.json").then((r) =>
        r.json()
      );
      const count: number = manifest.count;
      const pad: number = manifest.pad ?? 4;
      totalRef.current = count;
      framesRef.current = new Array(count).fill(null);
      scrollMapRef.current = buildScrollMap(count);

      let loaded = 0;

      const firstFrame = await loadOne(0, pad);
      if (firstFrame) {
        framesRef.current[0] = firstFrame;
        drawFrame(ctx, firstFrame, window.innerWidth, window.innerHeight);
        setFirstFrameReady(true);
        startLoop();
      }
      loaded = 1;
      updatePct(loaded, count);

      const queue = Array.from({ length: count - 1 }, (_, j) => j + 1);
      const worker = async () => {
        while (queue.length > 0) {
          const i = queue.shift()!;
          const bitmap = await loadOne(i, pad);
          framesRef.current[i] = bitmap;
          loaded++;
          updatePct(loaded, count);
        }
      };
      await Promise.all(Array.from({ length: CONCURRENCY }, worker));

      setLoadPct(100);
      onProgressRef.current?.(100);
    };

    run();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (loadPctTimerRef.current) clearTimeout(loadPctTimerRef.current);
      framesRef.current.forEach((f) => f?.close());
    };
  }, []);

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 0 }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />

        {/* Contenu HTML des zones lentes */}
        {activeZone !== null && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {SCROLL_ZONES[activeZone].content}
          </div>
        )}

      </div>

      <div style={{ height: "1800vh", position: "relative", zIndex: 1 }} />
    </>
  );
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  frame: ImageBitmap,
  cw: number,
  ch: number
) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const scale = Math.max(cw / frame.width, ch / frame.height);
  const w = frame.width * scale;
  const h = frame.height * scale;
  ctx.drawImage(frame, (cw - w) / 2, (ch - h) / 2, w, h);
}
