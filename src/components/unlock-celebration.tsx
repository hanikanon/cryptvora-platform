import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type { AnyTier } from "@/lib/tiers";
import { BadgeSVG } from "@/lib/badge-svg";
import { useI18n } from "@/lib/i18n";

type Ctx = { celebrate: (tier: AnyTier) => void };
const UnlockCtx = createContext<Ctx | null>(null);

export function UnlockCelebrationProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<AnyTier | null>(null);

  const celebrate = useCallback((t: AnyTier) => {
    setTier(t);
    // auto-close after 3.2s
    window.setTimeout(() => setTier(null), 3200);
    // play chime (safe-fail; browsers may block until user gesture)
    playChime(t);
  }, []);

  const ctx = useMemo(() => ({ celebrate }), [celebrate]);

  return (
    <UnlockCtx.Provider value={ctx}>
      {children}
      {tier && <CelebrationOverlay tier={tier} onClose={() => setTier(null)} />}
    </UnlockCtx.Provider>
  );
}

export function useUnlockCelebration() {
  const ctx = useContext(UnlockCtx);
  if (!ctx) return { celebrate: () => {} };
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Audio — synthesized triumphant chime, no asset needed              */
/* ------------------------------------------------------------------ */

function playChime(tier: AnyTier) {
  if (typeof window === "undefined") return;
  try {
    const Ctx = (window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext) as typeof AudioContext | undefined;
    if (!Ctx) return;
    const ac = new Ctx();
    const now = ac.currentTime;
    // three-note ascending arpeggio, richer for legendary
    const base = tier.bracket === 4 ? 523.25 : tier.bracket === 3 ? 466.16 : 392;
    const notes = [base, base * 1.25, base * 1.5, base * 2];
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = i === 3 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.0001, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.6);
      osc.connect(gain).connect(ac.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.65);
    });
    window.setTimeout(() => ac.close().catch(() => {}), 2500);
  } catch {
    /* noop — user gesture may be required */
  }
}

/* ------------------------------------------------------------------ */
/*  Overlay                                                            */
/* ------------------------------------------------------------------ */

function CelebrationOverlay({ tier, onClose }: { tier: AnyTier; onClose: () => void }) {
  const { t, lang } = useI18n();
  const mounted = useRef(false);
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    mounted.current = true;
    setTarget(document.body);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const confetti = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        left: (i * 137.5) % 100,
        delay: (i % 12) * 0.08,
        size: 4 + (i % 5) * 2,
        dur: 2.4 + (i % 6) * 0.3,
        color: i % 3 === 0 ? tier.color : i % 3 === 1 ? "#ffffff" : tier.color2,
        rot: (i * 37) % 360,
      })),
    [tier],
  );

  const name = lang === "ar" ? tier.nameAr : tier.name;
  const tagline = lang === "ar" ? tier.taglineAr : tier.tagline;

  if (!target) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* radial burst */}
      <div
        aria-hidden
        className="ceremony-burst pointer-events-none absolute h-[560px] w-[560px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${tier.color}80 0%, ${tier.color}22 40%, transparent 70%)`,
        }}
      />
      <div
        aria-hidden
        className="ceremony-flash pointer-events-none absolute h-[280px] w-[280px] rounded-full"
        style={{ background: `radial-gradient(circle, #ffffff 0%, transparent 70%)` }}
      />

      {/* rising particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((p, i) => (
          <span
            key={i}
            className="ceremony-particle absolute bottom-0 block rounded-sm"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.6,
              background: p.color,
              transform: `rotate(${p.rot}deg)`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              boxShadow: `0 0 8px ${p.color}`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        <p className="ceremony-line text-[11px] font-bold uppercase tracking-[0.4em] text-white/70">
          {t("levels.newLevel")}
        </p>
        <div className="ceremony-badge">
          <BadgeSVG tier={tier} size={220} />
        </div>
        <h2
          className="ceremony-title text-4xl font-black tracking-tight md:text-5xl"
          style={{
            background: tier.gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {name}
        </h2>
        <p className="ceremony-line text-sm italic text-white/80">{tagline}</p>
        <button
          onClick={onClose}
          className="ceremony-line mt-4 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-[12px] font-semibold uppercase tracking-wider text-white transition hover:bg-white/20"
        >
          {t("levels.continue")}
        </button>
      </div>
    </div>,
    target,
  );
}
