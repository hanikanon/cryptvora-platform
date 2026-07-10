import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Trophy, TrendingUp, Activity, Crown } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { TierBadge } from "@/components/tier-badge";
import {
  CAPITAL_TIERS,
  TRADER_TIERS,
  getCapitalTier,
  getTraderTier,
  fmtCapital,
  fmtXP,
  type AnyTier,
} from "@/lib/tiers";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/leaderboards")({
  head: () => ({
    meta: [
      { title: "Leaderboards — Cryptvora" },
      { name: "description", content: "Live global rankings across the Portfolio and Trader progression tracks." },
      { property: "og:title", content: "Leaderboards — Cryptvora" },
      { property: "og:description", content: "Live global rankings across the Portfolio and Trader progression tracks." },
    ],
  }),
  component: LeaderboardsPage,
});

/* ------------------------------------------------------------------ */
/*  Deterministic pseudo-random data                                   */
/* ------------------------------------------------------------------ */

const ALIASES = [
  "hanibadji", "alpha_wolf", "sats_stacker", "midas.eth", "iron_hands",
  "night_trader", "ronin", "aurelius", "wave_hunter", "silvermoon",
  "orionx", "kairos", "zenith", "vantage", "quantum.k",
  "pyrrho", "seraph", "helios", "kyoto", "vela",
  "cyrus", "meridian", "atlas", "raven", "tempest",
  "phoenix.r", "solstice", "arcane", "cinder", "north_star",
];

function pseudoCapitalBoard() {
  const arr = ALIASES.map((name, i) => {
    const seed = Math.sin((i + 1) * 91.13) * 43758.5453;
    const rand = seed - Math.floor(seed);
    const bracket = i < 3 ? 3 : i < 8 ? 2 : 1;
    const base = bracket === 3 ? 400_000_000 : bracket === 2 ? 12_000_000 : 400_000;
    const value = Math.round(base * (0.4 + rand * 3.5));
    return { name, value };
  });
  arr.sort((a, b) => b.value - a.value);
  return arr;
}

function pseudoTraderBoard() {
  const arr = ALIASES.map((name, i) => {
    const seed = Math.sin((i + 7) * 12.9898) * 43758.5453;
    const rand = seed - Math.floor(seed);
    const bracket = i < 3 ? 4 : i < 8 ? 3 : 2;
    const base = bracket === 4 ? 200_000 : bracket === 3 ? 40_000 : 6_000;
    const xp = Math.round(base * (0.6 + rand * 3));
    return { name, xp };
  });
  arr.sort((a, b) => b.xp - a.xp);
  return arr;
}

/* ------------------------------------------------------------------ */

function LeaderboardsPage() {
  const { t } = useI18n();
  const youLabel = t("lb.you");
  const [track, setTrack] = useState<"capital" | "trader">("capital");

  const capitalRows = useMemo(pseudoCapitalBoard, []);
  const traderRows = useMemo(pseudoTraderBoard, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">{t("lb.title")}</h1>
          <p className="mt-1 text-[12px] text-muted-foreground">{t("lb.subtitle")}</p>
        </div>

        <div className="inline-flex rounded-lg border border-border bg-elevated/60 p-1">
          <button
            onClick={() => setTrack("capital")}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold transition",
              track === "capital" ? "bg-panel text-foreground shadow" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            {t("lb.portfolio")}
          </button>
          <button
            onClick={() => setTrack("trader")}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold transition",
              track === "trader" ? "bg-panel text-foreground shadow" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Activity className="h-3.5 w-3.5" />
            {t("lb.traders")}
          </button>
        </div>

        {track === "capital" ? (
          <Podium
            rows={capitalRows.slice(0, 3).map((r) => ({
              label: r.name,
              value: fmtCapital(r.value),
              tier: getCapitalTier(r.value).current,
            }))}
          />
        ) : (
          <Podium
            rows={traderRows.slice(0, 3).map((r) => ({
              label: r.name,
              value: `${fmtXP(r.xp)} XP`,
              tier: getTraderTier(r.xp).current,
            }))}
          />
        )}

        <Panel>
          <PanelHeader
            title={track === "capital" ? t("lb.portfolio") : t("lb.traders")}
            subtitle={`Top ${track === "capital" ? capitalRows.length : traderRows.length}`}
            icon={<Trophy className="h-4 w-4 text-gold" />}
          />
          <div className="divide-y divide-border/60">
            {(track === "capital" ? capitalRows : traderRows).map((row, i) => {
              const tier = track === "capital"
                ? getCapitalTier((row as { value: number }).value).current
                : getTraderTier((row as { xp: number }).xp).current;
              const value = track === "capital"
                ? fmtCapital((row as { value: number }).value)
                : `${fmtXP((row as { xp: number }).xp)} XP`;
              const isYou = row.name === "hanibadji";
              return (
                <div
                  key={row.name}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    isYou && "bg-elevated/60",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-md tnum text-[12px] font-bold",
                      i === 0 ? "bg-gold/20 text-gold"
                        : i === 1 ? "bg-white/10 text-foreground"
                        : i === 2 ? "bg-[color-mix(in_oklch,var(--gold)_20%,transparent)] text-gold/80"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {i + 1}
                  </span>
                  <TierBadge tier={tier} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-foreground">
                      {row.name}
                      {isYou && (
                        <span className="ms-2 rounded bg-cyan/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-cyan">
                          {youLabel}
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{tier.name}</p>
                  </div>
                  <p className="tnum text-[13px] font-bold" style={{ color: tier.color }}>
                    {value}
                  </p>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

function Podium({ rows }: { rows: { label: string; value: string; tier: AnyTier }[] }) {
  const [second, first, third] = [rows[1], rows[0], rows[2]];
  return (
    <div className="grid grid-cols-3 items-end gap-3 md:gap-6">
      <PodiumSpot rank={2} row={second} height="h-40" />
      <PodiumSpot rank={1} row={first} height="h-52" crown />
      <PodiumSpot rank={3} row={third} height="h-32" />
    </div>
  );
}

function PodiumSpot({
  rank, row, height, crown = false,
}: {
  rank: 1 | 2 | 3;
  row: { label: string; value: string; tier: AnyTier };
  height: string;
  crown?: boolean;
}) {
  if (!row) return <div />;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {crown && <Crown className="absolute -top-6 left-1/2 h-5 w-5 -translate-x-1/2 text-gold" />}
        <TierBadge tier={row.tier} size={rank === 1 ? 96 : 72} float={rank === 1} />
      </div>
      <p className="text-[13px] font-semibold text-foreground">{row.label}</p>
      <p className="tnum text-[11px]" style={{ color: row.tier.color }}>{row.value}</p>
      <div
        className={cn("w-full rounded-t-xl border border-border/60", height)}
        style={{
          background: `linear-gradient(180deg, ${row.tier.color}33, ${row.tier.color}0a)`,
          boxShadow: `inset 0 1px 0 ${row.tier.color}55`,
        }}
      >
        <div className="grid h-full place-items-center text-2xl font-black" style={{ color: row.tier.color }}>
          #{rank}
        </div>
      </div>
    </div>
  );
}
