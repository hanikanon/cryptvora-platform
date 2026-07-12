
import { useMemo, useState } from "react"
import { Panel, PanelHeader, Chip } from "@/components/ui/panel"
import {
  CandlestickChart,
  GradientArea,
  SignedBars,
  VolumeBars,
  DonutChart,
  RiskGauge,
  ProgressRing,
} from "@/components/charts"
import {
  generateCandles,
  portfolioGrowth,
  pnlData,
  volumeData,
  monthlyRoi,
  weeklyPerf,
  allocation,
  monthPnl,
} from "@/lib/market-data"
import { fmtUsd, fmtPct } from "@/lib/format"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Wallet, Percent, BarChart3, ShieldAlert, TrendingUp } from "lucide-react"

/* ---------- KPI Strip ---------- */
const kpis = [
  { label: "Total Balance", value: 244731.13, change: 8.4, icon: Wallet, prefix: "$", tone: "gain" as const },
  { label: "24h PnL", value: 12841.5, change: 5.2, icon: TrendingUp, prefix: "$", tone: "gain" as const },
  { label: "Win Rate", value: 68, change: 2.1, icon: Percent, prefix: "", suffix: "%", tone: "gold" as const },
  { label: "30d Volume", value: 4210000, change: 14.7, icon: BarChart3, prefix: "$", compact: true, tone: "cyan" as const },
  { label: "Open Risk", value: 42, change: -3.4, icon: ShieldAlert, prefix: "", suffix: "%", tone: "loss" as const },
]

export function KpiStrip() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {kpis.map((k) => {
        const up = k.change >= 0
        return (
          <Panel key={k.label} className="p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{k.label}</span>
              <span className={cn("flex h-6 w-6 items-center justify-center rounded-md",
                k.tone === "gain" && "bg-gain/12 text-gain",
                k.tone === "gold" && "bg-gold/12 text-gold",
                k.tone === "cyan" && "bg-cyan/12 text-cyan",
                k.tone === "loss" && "bg-loss/12 text-loss",
              )}>
                <k.icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-1.5 text-xl font-bold tracking-tight text-foreground tnum">
              {k.prefix}
              {k.compact
                ? fmtUsd(k.value, { compact: true }).replace("$", "")
                : k.value.toLocaleString("en-US", { maximumFractionDigits: k.suffix ? 0 : 2 })}
              {k.suffix}
            </p>
            <p className={cn("mt-0.5 flex items-center gap-0.5 text-[11px] tnum", up ? "text-gain" : "text-loss")}>
              {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {fmtPct(k.change)} <span className="text-muted-foreground">vs 24h</span>
            </p>
          </Panel>
        )
      })}
    </div>
  )
}

/* ---------- Main candlestick chart ---------- */
const timeframes = ["15m", "1H", "4H", "1D", "1W"]
export function MainChart() {
  const [tf, setTf] = useState("1H")
  const candles = useMemo(() => generateCandles(tf.length * 13 + 20, 90, 92000), [tf])
  const last = candles[candles.length - 1]
  const first = candles[0]
  const change = ((last.c - first.o) / first.o) * 100
  const up = change >= 0

  return (
    <Panel className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/12 text-[11px] font-bold text-gold">BTC</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-foreground">BTC / USDT</h3>
              <Chip tone={up ? "gain" : "loss"}>{fmtPct(change)}</Chip>
            </div>
            <p className="text-[11px] text-muted-foreground">Perpetual · Cross · Binance</p>
          </div>
          <div className="ml-2 hidden sm:block">
            <p className="text-xl font-bold text-foreground tnum">${last.c.toLocaleString("en-US", { maximumFractionDigits: 1 })}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/40 p-0.5">
          {timeframes.map((t) => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                tf === t ? "bg-elevated text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
        {[
          { l: "24h High", v: `$${last.h.toLocaleString("en-US", { maximumFractionDigits: 0 })}` },
          { l: "24h Low", v: `$${last.l.toLocaleString("en-US", { maximumFractionDigits: 0 })}` },
          { l: "24h Vol", v: "42.1B" },
          { l: "Funding", v: "0.0102%" },
        ].map((s) => (
          <div key={s.l} className="bg-card px-4 py-2">
            <p className="text-[10px] text-muted-foreground">{s.l}</p>
            <p className="text-[12px] font-medium text-foreground tnum">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="p-2">
        <CandlestickChart data={candles} height={340} />
      </div>
    </Panel>
  )
}

/* ---------- Generic chart cards ---------- */
export function PortfolioGrowthCard() {
  return (
    <Panel>
      <PanelHeader title="Portfolio Growth" subtitle="30-day equity" action={<Chip tone="gain">+35.9%</Chip>} />
      <div className="p-3">
        <GradientArea data={portfolioGrowth} dataKey="value" xKey="day" color="var(--gain)" height={180} />
      </div>
    </Panel>
  )
}

export function PnlCard() {
  return (
    <Panel>
      <PanelHeader title="PnL" subtitle="Hourly realized" action={<Chip tone="gain">+$12.8k</Chip>} />
      <div className="p-3">
        <SignedBars data={pnlData} dataKey="pnl" xKey="h" height={180} />
      </div>
    </Panel>
  )
}

export function VolumeCard() {
  return (
    <Panel>
      <PanelHeader title="Volume" subtitle="Trading activity" icon={<BarChart3 className="h-4 w-4" />} />
      <div className="p-3">
        <VolumeBars data={volumeData} height={180} />
      </div>
    </Panel>
  )
}

export function AllocationCard() {
  return (
    <Panel>
      <PanelHeader title="Asset Allocation" subtitle="By portfolio weight" />
      <div className="flex items-center gap-2 p-3">
        <div className="relative flex-1">
          <DonutChart data={allocation} height={168} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] text-muted-foreground">Assets</span>
            <span className="text-lg font-bold text-foreground">{allocation.length}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          {allocation.map((a) => (
            <div key={a.name} className="flex items-center gap-2 text-[11px]">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: a.color }} />
              <span className="text-muted-foreground">{a.name}</span>
              <span className="ml-auto tnum font-medium text-foreground">{a.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

export function RiskCard() {
  return (
    <Panel className="flex flex-col items-center">
      <PanelHeader className="w-full" title="Risk Gauge" subtitle="Portfolio exposure" icon={<ShieldAlert className="h-4 w-4" />} />
      <div className="flex flex-col items-center gap-2 p-4">
        <RiskGauge value={42} />
        <p className="text-[11px] text-muted-foreground">Moderate — within limits</p>
      </div>
    </Panel>
  )
}

export function WinRateCard() {
  return (
    <Panel className="flex flex-col items-center">
      <PanelHeader className="w-full" title="Win Rate" subtitle="Last 200 trades" />
      <div className="flex flex-col items-center gap-2 p-4">
        <ProgressRing value={68} color="var(--gold)" label="Win Rate" />
        <div className="flex gap-4 text-center text-[11px]">
          <div><p className="font-semibold text-gain">136</p><p className="text-muted-foreground">Wins</p></div>
          <div><p className="font-semibold text-loss">64</p><p className="text-muted-foreground">Losses</p></div>
        </div>
      </div>
    </Panel>
  )
}

export function MonthlyRoiCard() {
  return (
    <Panel>
      <PanelHeader title="Monthly ROI" subtitle="Trailing 12 months" action={<Chip tone="gain">+11.4% avg</Chip>} />
      <div className="p-3">
        <SignedBars data={monthlyRoi} dataKey="roi" xKey="m" height={180} />
      </div>
    </Panel>
  )
}

export function WeeklyPerfCard() {
  return (
    <Panel>
      <PanelHeader title="Weekly Performance" subtitle="This week" />
      <div className="p-3">
        <SignedBars data={weeklyPerf} dataKey="value" xKey="d" height={180} />
      </div>
    </Panel>
  )
}

export function DailyCalendarCard() {
  const days = monthPnl()
  const labels = ["S", "M", "T", "W", "T", "F", "S"]
  return (
    <Panel>
      <PanelHeader title="Daily Performance" subtitle="July · PnL heatmap" />
      <div className="p-3">
        <div className="mb-1.5 grid grid-cols-7 gap-1 text-center text-[9px] text-muted-foreground">
          {labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            if (d.day === null) return <div key={i} className="aspect-square rounded-sm" />
            const pnl = d.pnl ?? 0
            const up = pnl >= 0
            const intensity = Math.min(1, Math.abs(pnl) / 5000)
            return (
              <div
                key={i}
                title={`Day ${d.day + 1}: ${fmtUsd(pnl)}`}
                className="flex aspect-square items-center justify-center rounded-sm text-[9px] font-medium text-foreground/70"
                style={{
                  background: `color-mix(in oklch, ${up ? "var(--gain)" : "var(--loss)"} ${12 + intensity * 40}%, var(--secondary))`,
                }}
              >
                {d.day + 1}
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-loss/50" /> Loss</span>
          <span>Green profit · Red loss</span>
          <span className="flex items-center gap-1">Profit <span className="h-2 w-2 rounded-sm bg-gain/50" /></span>
        </div>
      </div>
    </Panel>
  )
}
