import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Flame,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader, Chip } from "@/components/ui/panel";
import {
  DonutChart,
  EquityLine,
  ProgressRing,
  RiskGauge,
  SignedBars,
} from "@/components/charts";
import { RiskRulesPanel, SmartRecommendations } from "@/components/risk-rules";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/risk")({
  head: () => ({
    meta: [
      { title: "Risk Management — Cryptvora" },
      {
        name: "description",
        content:
          "Log trades manually, monitor drawdown, win rate, exposure and live Binance data with a professional institutional dashboard.",
      },
      { property: "og:title", content: "Risk Management — Cryptvora" },
      {
        property: "og:description",
        content:
          "Manual trade journal, PnL calendar, exposure rings and live market data.",
      },
    ],
  }),
  component: RiskPage,
});

type Side = "LONG" | "SHORT";
type Trade = {
  id: string;
  date: string; // yyyy-mm-dd
  symbol: string;
  side: Side;
  size: number;
  entry: number;
  exit: number;
  fees: number;
  note?: string;
};

const SEED: Trade[] = seedTrades();
const STORAGE_KEY = "cryptvora.trades.v1";

function RiskPage() {
  const [trades, setTrades] = useState<Trade[]>(SEED);
  const [view, setView] = useState<"month" | "week">("month");
  const [cursor, setCursor] = useState(() => new Date());

  // hydrate from localStorage (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Trade[];
        if (Array.isArray(parsed) && parsed.length) setTrades(parsed);
      }
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(trades)); } catch { /* noop */ }
  }, [trades]);

  const stats = useMemo(() => computeStats(trades), [trades]);

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-panel p-5 panel-shadow md:p-6">
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-cyan/10 blur-3xl" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                <ShieldAlert className="h-3 w-3" /> Risk Desk
              </div>
              <h1 className="mt-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-[32px]">
                Risk Management
              </h1>
              <p className="mt-1.5 max-w-xl text-[12px] leading-relaxed text-muted-foreground">
                Position sizing, drawdown control and exposure limits — powered by your journal
                and synced with live Binance market feeds.
              </p>
            </div>
            <LiveTickers />
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Kpi label="Account Equity" value={fmt$(stats.equity)} tone="gold" icon={<Wallet className="h-3.5 w-3.5" />} sub="Starting 100,000" />
          <Kpi label="Net PnL" value={fmtSigned(stats.pnl)} tone={stats.pnl >= 0 ? "gain" : "loss"} icon={<TrendingUp className="h-3.5 w-3.5" />} sub={`${stats.trades} trades`} />
          <Kpi label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} tone="cyan" icon={<Activity className="h-3.5 w-3.5" />} sub={`${stats.wins}W · ${stats.losses}L`} />
          <Kpi label="Profit Factor" value={stats.profitFactor.toFixed(2)} tone="gain" icon={<Flame className="h-3.5 w-3.5" />} sub={`Avg R ${stats.avgR.toFixed(2)}`} />
          <Kpi label="Max Drawdown" value={`${stats.maxDD.toFixed(2)}%`} tone="loss" icon={<ArrowDownRight className="h-3.5 w-3.5" />} sub="Peak-to-trough" />
        </div>

        {/* Row 1: Risk gauge + Equity curve + Exposure donut */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel className="lg:col-span-3">
            <PanelHeader title="Portfolio Risk" subtitle="Composite exposure score" icon={<ShieldAlert className="h-4 w-4 text-gold" />} />
            <div className="flex flex-col items-center gap-3 p-5">
              <RiskGauge value={Math.round(stats.riskScore)} />
              <div className="grid w-full grid-cols-3 gap-2 text-center text-[10px]">
                <MiniStat label="Leverage" value={`${stats.leverage.toFixed(1)}x`} />
                <MiniStat label="Exposure" value={`${stats.exposurePct.toFixed(0)}%`} />
                <MiniStat label="Vol σ" value={`${stats.vol.toFixed(1)}%`} />
              </div>
            </div>
          </Panel>

          <Panel className="lg:col-span-6">
            <PanelHeader
              title="Equity Curve"
              subtitle="Cumulative PnL after fees"
              icon={<TrendingUp className="h-4 w-4 text-gold" />}
              action={<Chip tone={stats.pnl >= 0 ? "gain" : "loss"}>{fmtSigned(stats.pnl)}</Chip>}
            />
            <div className="p-4">
              <EquityLine data={stats.equityCurve} height={240} />
            </div>
          </Panel>

          <Panel className="lg:col-span-3">
            <PanelHeader title="Exposure Split" subtitle="By symbol" icon={<Wallet className="h-4 w-4 text-cyan" />} />
            <div className="p-3">
              <DonutChart data={stats.exposure} height={180} />
              <ul className="mt-2 space-y-1.5">
                {stats.exposure.map((e) => (
                  <li key={e.name} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
                      {e.name}
                    </span>
                    <span className="tnum font-semibold text-foreground">
                      {e.value.toFixed(0)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>

        {/* Row 2: PnL Calendar + Manual entry */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel className="lg:col-span-8">
            <PanelHeader
              title="PnL Calendar"
              subtitle="Daily wins & losses"
              icon={<CalendarDays className="h-4 w-4 text-gold" />}
              action={
                <div className="flex items-center gap-1">
                  <ViewToggle value={view} onChange={setView} />
                  <button
                    onClick={() => setCursor(shift(cursor, view, -1))}
                    className="grid h-7 w-7 place-items-center rounded-md border border-border text-muted-foreground hover:bg-muted"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-24 px-1 text-center text-[11px] font-medium text-foreground">
                    {view === "month" ? monthLabel(cursor) : weekLabel(cursor)}
                  </span>
                  <button
                    onClick={() => setCursor(shift(cursor, view, 1))}
                    className="grid h-7 w-7 place-items-center rounded-md border border-border text-muted-foreground hover:bg-muted"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              }
            />
            <div className="p-4">
              <PnlCalendar trades={trades} cursor={cursor} view={view} />
            </div>
          </Panel>

          <Panel className="lg:col-span-4">
            <PanelHeader title="Log New Trade" subtitle="Manual entry" icon={<Plus className="h-4 w-4 text-gain" />} />
            <TradeForm onAdd={(t) => setTrades((prev) => [t, ...prev])} />
          </Panel>
        </div>

        {/* Row 3: Monthly PnL bars + Win rate ring + Weekly performance */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel className="lg:col-span-5">
            <PanelHeader title="Monthly PnL" subtitle="Trailing 12 months" icon={<TrendingUp className="h-4 w-4 text-gold" />} />
            <div className="p-4">
              <SignedBars data={stats.monthly} dataKey="pnl" xKey="m" height={220} />
            </div>
          </Panel>

          <Panel className="lg:col-span-3 flex flex-col items-center justify-center gap-2 p-5">
            <p className="text-[12px] font-semibold text-foreground">Win / Loss Split</p>
            <ProgressRing value={Math.round(stats.winRate)} color="var(--gain)" label="Wins" />
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-[10px] text-muted-foreground">Winners</p>
                <p className="text-sm font-semibold text-gain tnum">{stats.wins}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Losers</p>
                <p className="text-sm font-semibold text-loss tnum">{stats.losses}</p>
              </div>
            </div>
          </Panel>

          <Panel className="lg:col-span-4">
            <PanelHeader title="Weekly Performance" subtitle="Last 8 weeks" icon={<Activity className="h-4 w-4 text-cyan" />} />
            <div className="p-4">
              <SignedBars data={stats.weekly} dataKey="pnl" xKey="w" height={220} />
            </div>
          </Panel>
        </div>

        {/* Row 3b: Risk rules + smart recos */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <RiskRulesPanel
              usage={{
                dailyLoss: Math.max(0, -Math.min(0, stats.pnl / stats.equity * 100)),
                monthlyLoss: Math.max(0, stats.maxDD),
                lastRiskPct: 1.2,
                openPositions: 3,
                winRateRecent: stats.winRate,
              }}
            />
          </div>
          <div className="lg:col-span-7">
            <SmartRecommendations
              usage={{
                dailyLoss: Math.max(0, -Math.min(0, stats.pnl / stats.equity * 100)),
                monthlyLoss: Math.max(0, stats.maxDD),
                lastRiskPct: 1.2,
                openPositions: 3,
                winRateRecent: stats.winRate,
              }}
            />
          </div>
        </div>

        {/* Row 4: Trade journal */}
        <TradeJournal trades={trades} onDelete={(id) => setTrades((prev) => prev.filter((x) => x.id !== id))} />
      </div>
    </AppShell>
  );
}

/* ---------------- helpers & subcomponents ---------------- */

function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("px-3 py-2 text-left font-medium", className)}>{children}</th>;
}
function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-3 py-2", className)}>{children}</td>;
}

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
  const toneClass = {
    gain: "text-gain",
    loss: "text-loss",
    gold: "text-gold",
    cyan: "text-cyan",
  }[tone];
  const toneBg = {
    gain: "bg-gain/12",
    loss: "bg-loss/12",
    gold: "bg-gold/12",
    cyan: "bg-cyan/12",
  }[tone];
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-panel p-4 panel-shadow transition hover:border-foreground/15 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
          <p className={cn("mt-2 text-xl font-bold tnum md:text-[22px]", toneClass)}>{value}</p>
          {sub && <p className="mt-1 text-[10px] text-muted-foreground">{sub}</p>}
        </div>
        <span className={cn("grid h-8 w-8 place-items-center rounded-lg", toneBg, toneClass)}>
          {icon}
        </span>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ background: `var(--${tone})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, var(--${tone}), transparent)` }}
      />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-elevated/50 px-2 py-1.5">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-[12px] font-semibold text-foreground tnum">{value}</p>
    </div>
  );
}

function ViewToggle({ value, onChange }: { value: "month" | "week"; onChange: (v: "month" | "week") => void }) {
  return (
    <div className="inline-flex rounded-md border border-border bg-elevated/40 p-0.5 text-[10px]">
      {(["month", "week"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            "rounded px-2 py-1 font-medium capitalize transition",
            value === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

function TradeForm({ onAdd }: { onAdd: (t: Trade) => void }) {
  const [f, setF] = useState({
    symbol: "BTCUSDT",
    side: "LONG" as Side,
    size: 0.1,
    entry: 65000,
    exit: 66200,
    fees: 12,
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });
  return (
    <form
      className="grid grid-cols-2 gap-2 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd({ id: crypto.randomUUID(), ...f });
      }}
    >
      <Field label="Symbol">
        <select
          value={f.symbol}
          onChange={(e) => setF({ ...f, symbol: e.target.value })}
          className="input"
        >
          {["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "DOGEUSDT"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Side">
        <div className="grid grid-cols-2 gap-1">
          {(["LONG", "SHORT"] as Side[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setF({ ...f, side: s })}
              className={cn(
                "rounded-md border px-2 py-1.5 text-[11px] font-semibold transition",
                f.side === s
                  ? s === "LONG"
                    ? "border-gain/40 bg-gain/15 text-gain"
                    : "border-loss/40 bg-loss/15 text-loss"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {s === "LONG" ? <ArrowUpRight className="mr-1 inline h-3 w-3" /> : <ArrowDownRight className="mr-1 inline h-3 w-3" />}
              {s}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Entry">
        <input
          type="number"
          step="0.01"
          value={f.entry}
          onChange={(e) => setF({ ...f, entry: +e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Exit">
        <input
          type="number"
          step="0.01"
          value={f.exit}
          onChange={(e) => setF({ ...f, exit: +e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Size">
        <input
          type="number"
          step="0.0001"
          value={f.size}
          onChange={(e) => setF({ ...f, size: +e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Fees">
        <input
          type="number"
          step="0.01"
          value={f.fees}
          onChange={(e) => setF({ ...f, fees: +e.target.value })}
          className="input"
        />
      </Field>
      <Field label="Date" className="col-span-2">
        <input
          type="date"
          value={f.date}
          onChange={(e) => setF({ ...f, date: e.target.value })}
          className="input"
        />
      </Field>
      <button
        type="submit"
        className="col-span-2 mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-gold to-cyan px-3 py-2 text-[12px] font-semibold text-[color:var(--background)] shadow transition hover:brightness-110"
      >
        <Plus className="h-3.5 w-3.5" /> Add trade to journal
      </button>
      <style>{`
        .input {
          width: 100%;
          background: var(--input);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 6px 8px;
          font-size: 12px;
          color: var(--foreground);
          font-variant-numeric: tabular-nums;
          outline: none;
        }
        .input:focus { border-color: var(--ring); box-shadow: 0 0 0 3px color-mix(in oklch, var(--ring) 25%, transparent); }
      `}</style>
    </form>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function PnlCalendar({ trades, cursor, view }: { trades: Trade[]; cursor: Date; view: "month" | "week" }) {
  const days = view === "month" ? buildMonthGrid(cursor) : buildWeekGrid(cursor);
  const byDay = new Map<string, number>();
  for (const t of trades) {
    byDay.set(t.date, (byDay.get(t.date) ?? 0) + tradePnl(t));
  }
  const activeMonth = cursor.getMonth();

  const max = Math.max(1, ...Array.from(byDay.values()).map(Math.abs));

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className={cn("grid grid-cols-7 gap-1.5", view === "week" && "grid-cols-7")}>
        {days.map((d) => {
          const key = d.toISOString().slice(0, 10);
          const pnl = byDay.get(key) ?? 0;
          const intensity = Math.min(1, Math.abs(pnl) / max);
          const inMonth = view === "week" ? true : d.getMonth() === activeMonth;
          const color =
            pnl === 0
              ? "transparent"
              : pnl > 0
                ? `color-mix(in oklch, var(--gain) ${20 + intensity * 55}%, transparent)`
                : `color-mix(in oklch, var(--loss) ${20 + intensity * 55}%, transparent)`;
          return (
            <div
              key={key}
              className={cn(
                "relative flex aspect-square flex-col justify-between rounded-md border border-border/60 p-1.5 text-[10px] transition",
                !inMonth && "opacity-30",
                pnl !== 0 && "border-transparent",
              )}
              style={{ background: color || undefined }}
              title={pnl ? `${key}: ${fmtSigned(pnl)}` : key}
            >
              <span className={cn("tnum font-medium", pnl !== 0 ? "text-foreground" : "text-muted-foreground")}>
                {d.getDate()}
              </span>
              {pnl !== 0 && (
                <span
                  className={cn(
                    "tnum text-[10px] font-semibold",
                    pnl > 0 ? "text-gain" : "text-loss",
                  )}
                >
                  {pnl > 0 ? "+" : ""}
                  {pnl >= 1000 || pnl <= -1000
                    ? (pnl / 1000).toFixed(1) + "k"
                    : pnl.toFixed(0)}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm bg-gain/60" /> Win day
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm bg-loss/60" /> Loss day
        </span>
        <span className="ml-auto">Intensity ∝ |PnL|</span>
      </div>
    </div>
  );
}

function LiveTickers() {
  const [data, setData] = useState<Record<string, { price: number; change: number }>>({});
  useEffect(() => {
    let alive = true;
    const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
    async function fetchNow() {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}`,
        );
        if (!res.ok) return;
        const json = (await res.json()) as { symbol: string; lastPrice: string; priceChangePercent: string }[];
        if (!alive) return;
        const next: Record<string, { price: number; change: number }> = {};
        for (const r of json) {
          next[r.symbol] = { price: +r.lastPrice, change: +r.priceChangePercent };
        }
        setData(next);
      } catch {
        /* offline is fine */
      }
    }
    fetchNow();
    const id = setInterval(fetchNow, 8000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const rows = [
    { s: "BTCUSDT", label: "BTC" },
    { s: "ETHUSDT", label: "ETH" },
    { s: "SOLUSDT", label: "SOL" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card/70 px-3 py-2 panel-shadow">
      {rows.map((r) => {
        const d = data[r.s];
        const up = (d?.change ?? 0) >= 0;
        return (
          <div key={r.s} className="flex items-center gap-2 pr-3 last:pr-0">
            <span className="text-[10px] font-semibold text-muted-foreground">{r.label}</span>
            <span className="tnum text-[12px] font-semibold text-foreground">
              {d ? `$${d.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—"}
            </span>
            {d && (
              <span className={cn("tnum text-[10px] font-semibold", up ? "text-gain" : "text-loss")}>
                {up ? "▲" : "▼"} {Math.abs(d.change).toFixed(2)}%
              </span>
            )}
          </div>
        );
      })}
      <span className="ml-1 rounded-md border border-cyan/25 bg-cyan/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan">
        Binance
      </span>
    </div>
  );
}

/* ---------------- computations ---------------- */

function tradePnl(t: Trade) {
  const dir = t.side === "LONG" ? 1 : -1;
  return (t.exit - t.entry) * t.size * dir - t.fees;
}

function computeStats(trades: Trade[]) {
  const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date));
  const pnls = sorted.map(tradePnl);
  const pnl = pnls.reduce((a, b) => a + b, 0);
  const wins = pnls.filter((p) => p > 0);
  const losses = pnls.filter((p) => p < 0);
  const winRate = trades.length ? (wins.length / trades.length) * 100 : 0;
  const grossW = wins.reduce((a, b) => a + b, 0);
  const grossL = Math.abs(losses.reduce((a, b) => a + b, 0));
  const profitFactor = grossL === 0 ? grossW : grossW / grossL;
  const avgR = pnls.length ? pnl / pnls.length / 100 : 0;

  // equity curve
  let eq = 100000;
  let peak = eq;
  let maxDD = 0;
  const equityCurve: { t: string; equity: number }[] = [];
  for (const t of sorted) {
    eq += tradePnl(t);
    peak = Math.max(peak, eq);
    maxDD = Math.max(maxDD, ((peak - eq) / peak) * 100);
    equityCurve.push({ t: t.date.slice(5), equity: Math.round(eq) });
  }
  if (!equityCurve.length) equityCurve.push({ t: "start", equity: eq });

  // monthly / weekly
  const monthMap = new Map<string, number>();
  for (const t of sorted) {
    const m = t.date.slice(0, 7);
    monthMap.set(m, (monthMap.get(m) ?? 0) + tradePnl(t));
  }
  const monthly = Array.from(monthMap.entries())
    .slice(-12)
    .map(([m, v]) => ({ m: m.slice(5), pnl: Math.round(v) }));

  const weekMap = new Map<string, number>();
  for (const t of sorted) {
    const w = weekKey(new Date(t.date));
    weekMap.set(w, (weekMap.get(w) ?? 0) + tradePnl(t));
  }
  const weekly = Array.from(weekMap.entries())
    .slice(-8)
    .map(([w, v]) => ({ w: w.slice(5), pnl: Math.round(v) }));

  // exposure by symbol
  const symMap = new Map<string, number>();
  for (const t of trades) {
    symMap.set(t.symbol, (symMap.get(t.symbol) ?? 0) + Math.abs(t.entry * t.size));
  }
  const totalExp = Array.from(symMap.values()).reduce((a, b) => a + b, 0) || 1;
  const palette = ["var(--gold)", "var(--cyan)", "var(--gain)", "var(--loss)", "var(--platinum)", "var(--diamond)"];
  const exposure = Array.from(symMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, v], i) => ({ name: name.replace("USDT", ""), value: (v / totalExp) * 100, color: palette[i % palette.length] }));

  return {
    equity: eq,
    pnl,
    trades: trades.length,
    wins: wins.length,
    losses: losses.length,
    winRate,
    profitFactor,
    avgR,
    maxDD,
    riskScore: Math.min(100, 20 + maxDD * 2 + (100 - winRate) * 0.4),
    leverage: 2.4,
    exposurePct: Math.min(100, totalExp / 1000),
    vol: 12 + Math.random() * 4,
    equityCurve,
    monthly,
    weekly,
    exposure,
  };
}

function fmt$(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}
function fmtSigned(n: number) {
  const s = n >= 0 ? "+" : "-";
  return `${s}$${Math.abs(Math.round(n)).toLocaleString()}`;
}

/* --------------- calendar utils --------------- */

function shift(d: Date, view: "month" | "week", by: number) {
  const nd = new Date(d);
  if (view === "month") nd.setMonth(nd.getMonth() + by);
  else nd.setDate(nd.getDate() + 7 * by);
  return nd;
}
function monthLabel(d: Date) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}
function weekLabel(d: Date) {
  const start = startOfWeek(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${end.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}
function startOfWeek(d: Date) {
  const nd = new Date(d);
  const day = (nd.getDay() + 6) % 7; // Monday=0
  nd.setDate(nd.getDate() - day);
  nd.setHours(0, 0, 0, 0);
  return nd;
}
function buildMonthGrid(cursor: Date) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}
function buildWeekGrid(cursor: Date) {
  const start = startOfWeek(cursor);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}
function weekKey(d: Date) {
  const s = startOfWeek(d);
  return s.toISOString().slice(0, 10);
}

/* --------------- seed data --------------- */

function TradeJournal({
  trades,
  onDelete,
}: {
  trades: Trade[];
  onDelete: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<"date" | "symbol" | "side" | "pnl" | "r">("date");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const perPage = 10;

  const enriched = useMemo(() => {
    return trades.map((t) => {
      const pnl = tradePnl(t);
      const r = pnl / Math.max(1, Math.abs(t.entry) * t.size * 0.01);
      return { ...t, pnl, r };
    });
  }, [trades]);

  const filtered = useMemo(() => {
    const needle = q.trim().toUpperCase();
    const rows = needle
      ? enriched.filter((t) => t.symbol.toUpperCase().includes(needle) || t.side.includes(needle) || t.date.includes(needle))
      : enriched;
    const sorted = [...rows].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp = typeof va === "number" && typeof vb === "number"
        ? va - vb
        : String(va).localeCompare(String(vb));
      return dir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [enriched, q, sortKey, dir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice(page * perPage, page * perPage + perPage);

  const totalPnl = filtered.reduce((a, t) => a + t.pnl, 0);
  const wins = filtered.filter((t) => t.pnl > 0).length;

  const setSort = (k: typeof sortKey) => {
    if (k === sortKey) setDir(dir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setDir("desc"); }
    setPage(0);
  };

  const SortTh = ({ k, children, right }: { k: typeof sortKey; children: React.ReactNode; right?: boolean }) => (
    <th className={cn("px-3 py-2.5 font-semibold", right ? "text-right" : "text-left")}>
      <button
        onClick={() => setSort(k)}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition hover:text-foreground",
          sortKey === k ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {children}
        <ChevronsUpDown className={cn("h-3 w-3 transition", sortKey === k ? "opacity-100" : "opacity-40")} />
      </button>
    </th>
  );

  return (
    <Panel>
      <PanelHeader
        title="Trade Journal"
        subtitle={`${filtered.length} of ${trades.length} trades · ${wins}W · net ${fmtSigned(totalPnl)}`}
        icon={<Activity className="h-4 w-4 text-gold" />}
        action={
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(0); }}
              placeholder="Search symbol, side, date…"
              className="h-8 w-56 rounded-md border border-border bg-input pl-7 pr-2 text-[11px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="border-b border-border bg-elevated/40 text-[10px] uppercase tracking-wider">
            <tr>
              <SortTh k="date">Date</SortTh>
              <SortTh k="symbol">Symbol</SortTh>
              <SortTh k="side">Side</SortTh>
              <th className="px-3 py-2.5 text-right font-semibold text-muted-foreground">Size</th>
              <th className="px-3 py-2.5 text-right font-semibold text-muted-foreground">Entry</th>
              <th className="px-3 py-2.5 text-right font-semibold text-muted-foreground">Exit</th>
              <th className="px-3 py-2.5 text-right font-semibold text-muted-foreground">Fees</th>
              <SortTh k="pnl" right>PnL</SortTh>
              <SortTh k="r" right>R</SortTh>
              <th />
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-[12px] text-muted-foreground">
                  No trades match your search.
                </td>
              </tr>
            )}
            {pageRows.map((t) => (
              <tr key={t.id} className="border-b border-border/40 transition hover:bg-elevated/40">
                <Td className="text-muted-foreground">{t.date}</Td>
                <Td className="font-medium text-foreground">{t.symbol.replace("USDT", "/USDT")}</Td>
                <Td>
                  <Chip tone={t.side === "LONG" ? "gain" : "loss"}>
                    {t.side === "LONG" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {t.side}
                  </Chip>
                </Td>
                <Td className="text-right tnum">{t.size}</Td>
                <Td className="text-right tnum">{t.entry.toLocaleString()}</Td>
                <Td className="text-right tnum">{t.exit.toLocaleString()}</Td>
                <Td className="text-right tnum text-muted-foreground">{t.fees.toFixed(2)}</Td>
                <Td className={cn("text-right tnum font-semibold", t.pnl >= 0 ? "text-gain" : "text-loss")}>{fmtSigned(t.pnl)}</Td>
                <Td className={cn("text-right tnum", t.r >= 0 ? "text-gain" : "text-loss")}>{t.r.toFixed(2)}</Td>
                <Td className="text-right">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="rounded-md p-1 text-muted-foreground transition hover:bg-loss/10 hover:text-loss"
                    aria-label="Delete trade"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
          <span>Page {page + 1} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="grid h-7 w-7 place-items-center rounded-md border border-border transition hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="grid h-7 w-7 place-items-center rounded-md border border-border transition hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}

function seedTrades(): Trade[] {
  const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"];
  const now = new Date();
  const out: Trade[] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 90; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - Math.floor(rand() * 340));
    const sym = symbols[Math.floor(rand() * symbols.length)];
    const side: Side = rand() > 0.42 ? "LONG" : "SHORT";
    const base = sym.startsWith("BTC") ? 62000 : sym.startsWith("ETH") ? 3200 : sym.startsWith("SOL") ? 145 : sym.startsWith("BNB") ? 560 : 0.6;
    const drift = (rand() - 0.45) * 0.04;
    const entry = base * (1 + (rand() - 0.5) * 0.05);
    const exit = entry * (1 + drift);
    const size = sym.startsWith("BTC") ? 0.05 + rand() * 0.15 : sym.startsWith("ETH") ? 0.5 + rand() * 1.5 : 5 + rand() * 15;
    out.push({
      id: crypto.randomUUID(),
      date: d.toISOString().slice(0, 10),
      symbol: sym,
      side,
      size: +size.toFixed(4),
      entry: +entry.toFixed(2),
      exit: +exit.toFixed(2),
      fees: +(entry * size * 0.0004).toFixed(2),
    });
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}