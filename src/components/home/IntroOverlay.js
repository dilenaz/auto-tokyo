"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const INTRO_DURATION = 4800;

export default function IntroOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("autoTokyoIntroSeen")) return;

    // Browser storage is intentionally read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    sessionStorage.setItem("autoTokyoIntroSeen", "1");
    const timer = setTimeout(() => setVisible(false), INTRO_DURATION);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Auto Tokyo açılış animasyonu"
      className="intro-overlay fixed inset-0 z-[100] overflow-hidden bg-black"
    >
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="intro-skip absolute right-5 top-5 z-20 rounded-full border border-white/25 bg-black/30 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/60"
      >
        Geç
      </button>

      <div className="intro-stage" aria-hidden="true">
        <div className="intro-smoke intro-smoke-one" />
        <div className="intro-smoke intro-smoke-two" />
        <div className="intro-smoke intro-smoke-three" />
        <div className="intro-smoke intro-smoke-four" />
        <div className="intro-smoke intro-smoke-five" />
        <div className="intro-smoke intro-smoke-six" />
        <div className="intro-smoke intro-smoke-seven" />

        <div className="intro-smoke-copy">
          <span>AUTO TOKYO</span>
          <small>Güven • Kalite • Performans</small>
        </div>

        <div className="intro-vehicle">
          <Image
            src="/images/intro/auto-tokyo-sports-car.png"
            alt=""
            width={1456}
            height={1080}
            priority
            sizes="(max-width: 640px) 80vw, 640px"
          />
        </div>
      </div>
    </div>
  );
}
