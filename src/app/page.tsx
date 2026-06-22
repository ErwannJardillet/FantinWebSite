"use client";

import { useState, useCallback } from "react";
import ScrollVideo from "@/components/ScrollVideo";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [loadPct, setLoadPct] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isGone, setIsGone] = useState(false);

  const handleComplete = useCallback(() => {
    setTimeout(() => setIsExiting(true), 500);
  }, []);

  const handleExitComplete = useCallback(() => {
    setIsGone(true);
  }, []);

  return (
    <main>
      {!isGone && (
        <LoadingScreen
          progress={Math.min(loadPct * 2, 100)}
          isExiting={isExiting}
          onExitComplete={handleExitComplete}
        />
      )}
      <ScrollVideo onProgress={setLoadPct} onComplete={handleComplete} />
    </main>
  );
}
