import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Activity, Flame, TrendingUp, Wallet } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader, Chip } from "@/components/ui/panel";
import { EquityLine, SignedBars } from "@/components/charts";
import { CapitalLevelCard, ActivityLevelCard } from "@/components/level-cards";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Cryptvora — Institutional Trading Suite" },
      { name: "description", content: "Risk management and trader profile with Gold, Platinum and Diamond tiers." },
    ],
  }),
  component: Index,
});

const DEMO_CAPITAL = 68_000;
const DEMO_XP = 1240;

function Index() {
  const { t } = useI18n();
  const [range, setRange] = useState<"1D" | "1W" | "1M">("1M");
  const equity = useMemo(() => genEquity(range), [range]);
  const monthly = useMemo(() => genMonthly(), []);
  const kpis = useMemo(() => computeKpis(equity), [equity]);

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {t("brand.tag")}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("dash.welcome")}, hanibadji
          </h1>
          <p className="max-w-2xl text-[12px] text-muted-foreground">{t("dash.subtitle")}</p>
        </header>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
          <Kpi label={t("kpi.equity")} value={fmt$(kpis.equity)} sub="Portfolio" tone="gold" icon={<Wallet className="h-3.5 w-3.5" />} />
          <Kpi label={t("kpi.dailyPnl")} value={fmtSigned(kpis.day)} tone={kpis.day >= 0 ? "gain" : "loss"} icon={<TrendingUp className="h-3.5 w-3.5" />} sub={pct(kpis.dayPct)} />
          <Kpi label={t("kpi.weeklyPnl")} value={fmtSigned(kpis.week)} tone={kpis.week >= 0 ? "gain" : "loss"} icon={<Activity className="h-3.5 w-3.5" />} sub={pct(kpis.weekPct)} />
          <Kpi label={t("kpi.monthlyPnl")} value={fmtSigned(kpis.month)} tone={kpis.month >= 0 ? "gain" : "loss"} icon={<Flame className="h-3.5 w-3.5" />} sub={pct(kpis.monthPct)} />
          <Kpi label={t("kpi.winRate")} value={`${kpis.winRate}%`} tone="cyan" icon={<Activity className="h-3.5 w-3.5" />} sub={`${kpis.trades} ${t("kpi.trades")}`} />
          <Kpi label={t("kpi.bestTrade")} value={fmtSigned(kpis.best)} tone="gain" icon={<ArrowUpRight className="h-3.5 w-3.5" />} sub="ETHUSDT" />
        </div>

        {/* Equity + Levels */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel className="lg:col-span-8">
            <PanelHeader
              title="Equity Curve"
              subtitle="Cumulative performance"
              icon={<TrendingUp className="h-4 w-4 text-gold" />}
              action={
                <div className="inline-flex rounded-md border border-border bg-elevated/40 p-0.5 text-[10px]">
                  {(["1D", "1W", "1M"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={cn(
                        "rounded px-2 py-1 font-medium transition",
                        r === range ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              }
            />
            <div className="p-4">
              <EquityLine data={equity} height={240} />
            </div>
          </Panel>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <CapitalLevelCard capital={DEMO_CAPITAL} />
            <ActivityLevelCard xp={DEMO_XP} streak={12} />
          </div>
        </div>

        {/* Monthly PnL + Achievements */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel className="lg:col-span-7">
            <PanelHeader
              title="Monthly PnL"
              subtitle="Trailing 12 months"
              icon={<TrendingUp className="h-4 w-4 text-gold" />}
              action={<Chip tone="gain">+18.4%</Chip>}
            />
            <div className="p-4">
              <SignedBars data={monthly} dataKey="pnl" xKey="m" height={220} />
            </div>
          </Panel>

          <Panel className="lg:col-span-5">
            <PanelHeader
              title="Recent Achievements"
              subtitle="Milestones this month"
              icon={<Flame className="h-4 w-4 text-gold" />}
            />
            <ul className="divide-y divide-border/60">
              {ACHIEVEMENTS.map((a, i) => (
                <li key={i} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[11px]"
                      style={{ background: `color-mix(in oklch, ${a.color} 20%, transparent)`, color: a.color }}
                    >
                      {a.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium text-foreground">{a.title}</p>
                      <p className="text-[10px] text-muted-foreground">{a.when}</p>
                    </div>
                  </div>
                  <Chip tone="cyan">+{a.xp} XP</Chip>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

/* -------------------- KPI -------------------- */

function Kpi({
  label,
  value,
  sub,
  tone,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  tone: "gain" | "loss" | "gold" | "cyan";
  icon?: React.ReactNode;
}) {
  const toneClass = { gain: "text-gain", loss: "text-loss", gold: "text-gold", cyan: "text-cyan" }[tone];
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-3 panel-shadow">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span className="truncate">{label}</span>
        <span className={toneClass}>{icon}</span>
      </div>
      <p className={cn("mt-2 text-lg font-semibold tnum md:text-xl", toneClass)}>{value}</p>
      {sub && <p className="mt-0.5 text-[10px] text-muted-foreground tnum">{sub}</p>}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -right-8 h-20 w-20 rounded-full opacity-25 blur-2xl"
        style={{ background: `var(--${tone})` }}
      />
    </div>
  );
}

/* -------------------- demo data -------------------- */

const ACHIEVEMENTS = [
  { emoji: "🔥", color: "#f97316", title: "10-day trading streak", when: "2h ago", xp: 80 },
  { emoji: "🎯", color: "#22c55e", title: "Perfect risk day", when: "yesterday", xp: 50 },
  { emoji: "🏆", color: "#eab308", title: "Best monthly return", when: "3d ago", xp: 200 },
  { emoji: "📚", color: "#38bdf8", title: "Completed Risk 101", when: "5d ago", xp: 60 },
];

function genEquity(range: "1D" | "1W" | "1M") {
  const n = range === "1D" ? 24 : range === "1W" ? 28 : 30;
  let eq = 62000;
  // deterministic pseudo-noise for stable SSR
  const rand = (i: number) => {
    const x = Math.sin(i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  return Array.from({ length: n }, (_, i) => {
    eq += (Math.sin(i / 3) + rand(i) - 0.4) * 400;
    return { t: range === "1D" ? `${i}h` : `D${i + 1}`, equity: Math.round(eq) };
  });
}

function genMonthly() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const vals = [1200, -800, 2400, 3100, -1400, 4200, 1800, 2900, -600, 3600, 2100, 4800];
  return months.map((m, i) => ({ m, pnl: vals[i] }));
}

function computeKpis(equity: { equity: number }[]) {
  const eq = equity[equity.length - 1].equity;
  const start = equity[0].equity;
  const day = Math.round((eq - equity[equity.length - 2].equity) * 1.2);
  const week = Math.round((eq - start) * 0.4);
  const month = eq - start;
  const equityBase = 60_000;
  return {
    equity: eq,
    day,
    dayPct: (day / eq) * 100,
    week,
    weekPct: (week / eq) * 100,
    month,
    monthPct: ((eq - equityBase) / equityBase) * 100,
    winRate: 62,
    trades: 148,
    best: 4820,
    worst: -1240,
  };
}

function fmt$(v: number) {
  return `$${Math.round(v).toLocaleString("en-US")}`;
}
function fmtSigned(v: number) {
  return `${v >= 0 ? "+" : "−"}$${Math.abs(Math.round(v)).toLocaleString("en-US")}`;
}
function pct(v: number) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}
