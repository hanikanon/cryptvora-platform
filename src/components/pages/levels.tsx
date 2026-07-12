import { useMemo, useState } from "react";

import { ChevronRight, Gift, Lock, MapPin, Sparkles, Trophy, Zap, TrendingUp, Activity } from "lucide-react";

import { useLanguage } from "@/components/providers";
import { TierBadge } from "@/components/tier-badge";
import { LevelProgress } from "@/components/level-progress";
import { Panel, PanelHeader, Chip } from "@/components/ui/panel";
import {
  CAPITAL_TIERS,
  TRADER_TIERS,
  getCapitalTier,
  getTraderTier,
  fmtCapital,
  fmtXP,
  type AnyTier,
  type CapitalTier,
  type TraderTier,
} from "@/lib/tiers";

import { cn } from "@/lib/utils";
import { useUnlockCelebration } from "@/components/unlock-celebration";


const DEMO_CAPITAL = 68_000;
const DEMO_XP = 6_800;

type TrackKey = "capital" | "trader";

export default function LevelsPage() {
  const { lang } = useLanguage();
  const [track, setTrack] = useState<TrackKey>("capital");
  const { celebrate } = useUnlockCelebration();

  const cap = getCapitalTier(DEMO_CAPITAL);
  const trd = getTraderTier(DEMO_XP);

  const state = track === "capital"
    ? { tiers: CAPITAL_TIERS as AnyTier[], value: DEMO_CAPITAL, fmt: fmtCapital, ...cap }
    : { tiers: TRADER_TIERS as AnyTier[], value: DEMO_XP, fmt: fmtXP, ...trd };

  return (
    <div className="space-y-6 p-3 lg:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              {"Progression System"}
            </h1>
            <p className="mt-1 text-[12px] text-muted-foreground">{"Two parallel 20-tier progression tracks: Portfolio and Trader."}</p>
          </div>
          {state.next && (
            <button
              onClick={() => celebrate(state.next!)}
              className="inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/12 px-3 py-2 text-[12px] font-semibold text-gold transition hover:bg-gold/20 hover:shadow-[0_0_24px_-6px_var(--gold)]"
            >
              <Zap className="h-3.5 w-3.5" />
              {"Preview upgrade"}
            </button>
          )}
        </div>

        {/* Track summary cards — both visible */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TrackSummary
            track="capital"
            active={track === "capital"}
            onClick={() => setTrack("capital")}
            tier={cap.current}
            next={cap.next}
            value={DEMO_CAPITAL}
            progress={cap.progress}
            remaining={cap.remaining}
            fmt={fmtCapital}
          />
          <TrackSummary
            track="trader"
            active={track === "trader"}
            onClick={() => setTrack("trader")}
            tier={trd.current}
            next={trd.next}
            value={DEMO_XP}
            progress={trd.progress}
            remaining={trd.remaining}
            fmt={fmtXP}
          />
        </div>

        <CurrentLevelHero
          tier={state.current}
          next={state.next}
          value={state.value}
          progress={state.progress}
          remaining={state.remaining}
          fmt={state.fmt}
        />

        <JourneyBar
          tiers={state.tiers}
          index={state.index}
          progress={state.progress}
          value={state.value}
          fmt={state.fmt}
        />

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold" />
            <h2 className="text-sm font-semibold text-foreground">{"All Levels"}</h2>
            <span className="text-[10px] text-muted-foreground">
              {state.tiers.length} · {lang === "ar" ? state.tiers[0].nameAr : state.tiers[0].name} → {lang === "ar" ? state.tiers[state.tiers.length - 1].nameAr : state.tiers[state.tiers.length - 1].name}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {state.tiers.map((tier, i) => (
              <TierCard
                key={tier.key}
                tier={tier}
                state={i < state.index ? "unlocked" : i === state.index ? "current" : "locked"}
                progress={i < state.index ? 1 : i === state.index ? state.progress : 0}
                fmt={state.fmt}
                lang={lang}
                onCelebrate={() => celebrate(tier)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Track summary                                                      */
/* ------------------------------------------------------------------ */

function TrackSummary({
  track, active, onClick, tier, next, value, progress, remaining, fmt,
}: {
  track: TrackKey;
  active: boolean;
  onClick: () => void;
  tier: AnyTier;
  next?: AnyTier;
  value: number;
  progress: number;
  remaining: number;
  fmt: (n: number) => string;
}) {
  const { lang } = useLanguage();
  const name = lang === "ar" ? tier.nameAr : tier.name;
  const nextName = next ? (lang === "ar" ? next.nameAr : next.name) : null;
  const Icon = track === "capital" ? TrendingUp : Activity;
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-4 text-start transition",
        active ? "border-transparent" : "border-border/60 hover:border-border",
      )}
      style={active ? { boxShadow: `0 0 0 1.5px ${tier.color}99, ${tier.glow}` } : undefined}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: `radial-gradient(80% 60% at 0% 0%, ${tier.color}22, transparent 60%)` }}
      />
      <div className="relative">
        <TierBadge tier={tier} size={72} />
      </div>
      <div className="relative min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          <Icon className="h-3 w-3" />
          {track === "capital" ? "Portfolio Track" : "Trader Track"}
        </div>
        <p className="mt-1 truncate text-lg font-black" style={{ color: tier.color }}>{name}</p>
        <p className="tnum text-[11px] text-muted-foreground">{fmt(value)}{nextName && ` → ${nextName}`}</p>
        <div className="mt-2">
          <LevelProgress
            tier={tier}
            next={next}
            value={value}
            progress={progress}
            remaining={remaining}
            format={fmt}
          />
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function CurrentLevelHero({
  tier, next, value, progress, remaining, fmt,
}: {
  tier: AnyTier;
  next?: AnyTier;
  value: number;
  progress: number;
  remaining: number;
  fmt: (n: number) => string;
}) {
  const { lang } = useLanguage();
  const name = lang === "ar" ? tier.nameAr : tier.name;
  const tagline = lang === "ar" ? tier.taglineAr : tier.tagline;
  const nextName = next ? (lang === "ar" ? next.nameAr : next.name) : null;

  return (
    <Panel className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(60% 90% at 25% 20%, ${tier.color}2e 0%, transparent 60%), radial-gradient(50% 80% at 85% 90%, ${tier.color}1f 0%, transparent 60%)`,
        }}
      />
      <div className="relative grid grid-cols-1 gap-6 p-5 md:grid-cols-[auto_1fr_auto] md:items-center md:p-7">
        <div className="mx-auto md:mx-0">
          <div className="relative">
            <div
              aria-hidden
              className="glow-pulse absolute inset-[-14%] rounded-full"
              style={{ background: `radial-gradient(circle, ${tier.color}40 0%, transparent 70%)` }}
            />
            <TierBadge tier={tier} size={190} float />
          </div>
        </div>

        <div className="min-w-0 text-center md:text-start">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {"Current Level"}
          </p>
          <h2
            className="mt-1 text-3xl font-black tracking-tight md:text-4xl"
            style={{
              background: tier.gradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {name}
          </h2>
          <p className="mt-1 text-[12px] italic text-muted-foreground">{tagline}</p>
          <div className="mt-5">
            <LevelProgress
              tier={tier}
              next={next}
              value={value}
              progress={progress}
              remaining={remaining}
              format={fmt}
              labelCurrent={name}
              labelNext={nextName ?? undefined}
            />
          </div>
        </div>

        {next && (
          <div className="w-full rounded-xl border border-border/70 bg-elevated/50 p-4 backdrop-blur md:w-64">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4" style={{ color: next.color }} />
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {"Next rewards"}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <TierBadge tier={next} size={52} />
              <div>
                <p className="text-[13px] font-bold text-foreground">{nextName}</p>
                <p className="tnum text-[10px] text-muted-foreground">{fmt(next.min)}+</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5">
              {(lang === "ar" ? next.rewardsAr : next.rewards).map((p) => (
                <li key={p} className="flex items-center gap-1.5 text-[11px] text-foreground/90">
                  <ChevronRight className="h-3 w-3 shrink-0 flip-rtl" style={{ color: next.color }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  Journey bar                                                        */
/* ------------------------------------------------------------------ */

function JourneyBar({
  tiers, index, progress, value, fmt,
}: {
  tiers: AnyTier[];
  index: number;
  progress: number;
  value: number;
  fmt: (n: number) => string;
}) {
  const { lang } = useLanguage();
  const n = tiers.length;
  const overall = ((index + progress) / (n - 1)) * 100;

  return (
    <Panel>
      <PanelHeader
        title={"Your Journey"}
        subtitle={`${fmt(value)} · ${"Progress to next tier"}`}
        icon={<MapPin className="h-4 w-4 text-cyan" />}
      />
      <div className="overflow-x-auto px-5 pb-6 pt-10">
        <div className="relative mx-auto min-w-[900px] max-w-6xl">
          <div className="progress-track absolute left-0 right-0 top-[42px] h-3 -translate-y-1/2 rounded-full" />
          <div
            className="absolute left-0 top-[42px] h-3 -translate-y-1/2 rounded-full"
            style={{
              width: `${Math.min(100, overall)}%`,
              background: `linear-gradient(90deg, ${tiers[0].color}, ${tiers[Math.min(index + 1, n - 1)].color})`,
              boxShadow: `0 0 16px -3px ${tiers[index].color}aa`,
            }}
          >
            <span aria-hidden className="progress-shine" />
          </div>
          <div
            className="absolute z-10 -translate-x-1/2"
            style={{ left: `${Math.min(100, overall)}%`, top: 42 }}
          >
            <div
              className="glow-pulse h-5 w-5 -translate-y-1/2 rounded-full border-2 border-background"
              style={{
                background: tiers[index].gradient,
                boxShadow: `0 0 16px ${tiers[index].color}`,
              }}
            />
            <span
              className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[9px] font-bold text-background"
              style={{ background: tiers[index].color }}
            >
              {"You"}
            </span>
          </div>
          <div className="relative flex justify-between pt-16">
            {tiers.map((tier, i) => {
              const reached = i <= index;
              return (
                <div key={tier.key} className="flex w-[52px] flex-col items-center gap-1.5">
                  <TierBadge tier={tier} size={i === index ? 52 : 36} dim={!reached} />
                  <p
                    className={cn(
                      "text-center text-[9px] font-semibold leading-tight",
                      reached ? "text-foreground" : "text-muted-foreground/60",
                    )}
                    style={i === index ? { color: tier.color } : undefined}
                  >
                    {lang === "ar" ? tier.nameAr : tier.name}
                  </p>
                  <p className="tnum text-[8px] text-muted-foreground/70">{fmt(tier.min)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  Tier card                                                          */
/* ------------------------------------------------------------------ */

function TierCard({
  tier, state, progress, fmt, lang, onCelebrate,
}: {
  tier: AnyTier;
  state: "unlocked" | "current" | "locked";
  progress: number;
  fmt: (n: number) => string;
  lang: string;
  onCelebrate: () => void;
}) {
  const name = lang === "ar" ? tier.nameAr : tier.name;
  const tagline = lang === "ar" ? tier.taglineAr : tier.tagline;
  const perks = lang === "ar" ? tier.perksAr : tier.perks;
  const rewards = lang === "ar" ? tier.rewardsAr : tier.rewards;
  const locked = state === "locked";

  return (
    <div
      className={cn(
        "tier-card group relative flex flex-col overflow-hidden rounded-2xl border bg-panel p-4 transition-all duration-300",
        state === "current" ? "border-transparent" : locked ? "border-border/50" : "border-border/70",
        !locked && "hover:-translate-y-1.5",
      )}
      style={state === "current" ? { boxShadow: `0 0 0 1.5px ${tier.color}99, ${tier.glow}` } : undefined}
    >
      {!locked && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `radial-gradient(70% 50% at 50% 0%, ${tier.color}22 0%, transparent 70%)` }}
        />
      )}
      <div className="relative mb-2 flex items-center justify-between">
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
            locked ? "bg-muted text-muted-foreground" : "text-background",
          )}
          style={!locked ? { background: tier.color } : undefined}
        >
          {state === "current" ? "Current" : locked ? "Locked" : "Unlocked"}
        </span>
        {locked && <Lock className="h-3.5 w-3.5 text-muted-foreground/70" />}
        {state === "current" && <Sparkles className="h-3.5 w-3.5" style={{ color: tier.color }} />}
      </div>

      <button
        type="button"
        onClick={onCelebrate}
        className="relative mx-auto py-1 focus:outline-none"
        aria-label={`Preview ${name} celebration`}
      >
        <TierBadge tier={tier} size={state === "current" ? 104 : 88} dim={locked} />
      </button>

      <div className="relative mt-2 text-center">
        <p
          className={cn("text-[15px] font-bold", locked ? "text-muted-foreground" : "text-foreground")}
          style={state !== "locked" ? { color: tier.color } : undefined}
        >
          {name}
        </p>
        <p className="mt-0.5 text-[10px] italic text-muted-foreground">{tagline}</p>
        <p className="tnum mt-1 text-[10px] text-muted-foreground">
          {"Requires"}: {fmt(tier.min)}+
        </p>
      </div>

      <div className="relative mt-3">
        <div className="progress-track h-2 rounded-full">
          <div
            className="relative h-full rounded-full"
            style={{
              width: `${Math.round(progress * 100)}%`,
              background: tier.gradient,
              boxShadow: progress > 0 ? `0 0 8px -1px ${tier.color}99` : undefined,
            }}
          >
            {state === "current" && <span aria-hidden className="progress-shine" />}
          </div>
        </div>
        <p className="tnum mt-1 text-end text-[9px] text-muted-foreground">
          {Math.round(progress * 100)}%
        </p>
      </div>

      <div className="relative mt-3 border-t border-border/60 pt-2">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          {"Perks"}
        </p>
        <ul className="space-y-1">
          {perks.map((p) => (
            <li key={p} className={cn("flex items-center gap-1.5 text-[10.5px]", locked ? "text-muted-foreground/60" : "text-foreground/85")}>
              <ChevronRight className="h-3 w-3 shrink-0 flip-rtl" style={{ color: locked ? undefined : tier.color }} />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-2 rounded-lg border border-border/50 bg-elevated/50 p-2">
        <p className="mb-1 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          <Gift className="h-2.5 w-2.5" style={{ color: tier.color }} />
          {"Tier rewards"}
        </p>
        <ul className="space-y-0.5">
          {rewards.map((r) => (
            <li key={r} className={cn("text-[10.5px]", locked ? "text-muted-foreground/60" : "text-foreground/85")}>
              · {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Re-export for other files
export type { CapitalTier, TraderTier };
