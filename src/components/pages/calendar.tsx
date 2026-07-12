
import { useState } from "react"
import { CalendarDays, TrendingUp, TrendingDown } from "lucide-react"
import { Panel, PanelHeader, Chip } from "@/components/ui/panel"
import { monthPnl, economicEvents } from "@/lib/market-data"
import { fmtUsd } from "@/lib/format"
import { cn } from "@/lib/utils"

const days = monthPnl(321)
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const VIEWS = ["Daily", "Weekly", "Monthly"] as const

export default function CalendarPage() {
  const [view, setView] = useState<(typeof VIEWS)[number]>("Monthly")

  const valid = days.filter((d) => d.pnl !== null) as { day: number; pnl: number }[]
  const total = valid.reduce((s, d) => s + d.pnl, 0)
  const winDays = valid.filter((d) => d.pnl >= 0).length
  const lossDays = valid.length - winDays
  const best = Math.max(...valid.map((d) => d.pnl))
  const worst = Math.min(...valid.map((d) => d.pnl))

  return (
    <div className="flex flex-col gap-4 p-3 md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Trading Calendar</h1>
          <p className="text-xs text-muted-foreground">July 2026 · Performance & economic events</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors",
                view === v ? "bg-card text-foreground panel-shadow" : "text-muted-foreground",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Monthly Net PnL" value={fmtUsd(total)} tone={total >= 0 ? "gain" : "loss"} />
        <StatCard label="Profit Days" value={`${winDays}`} tone="gain" sub={`${lossDays} loss days`} />
        <StatCard label="Best Day" value={fmtUsd(best)} tone="gain" />
        <StatCard label="Worst Day" value={fmtUsd(worst)} tone="loss" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <Panel>
          <PanelHeader title="Daily Performance" subtitle="Green = profit · Red = loss" icon={<CalendarDays className="h-4 w-4" />} />
          <div className="p-3">
            <div className="mb-2 grid grid-cols-7 gap-1.5">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((d, i) => {
                if (d.pnl === null) return <div key={i} className="aspect-square rounded-md bg-muted/30" />
                const pos = d.pnl >= 0
                const intensity = Math.min(1, Math.abs(d.pnl) / 5000)
                return (
                  <div
                    key={i}
                    className="group relative flex aspect-square flex-col items-center justify-center rounded-md border border-border/60 text-[10px]"
                    style={{
                      background: pos
                        ? `color-mix(in oklab, var(--gain) ${10 + intensity * 45}%, var(--card))`
                        : `color-mix(in oklab, var(--loss) ${10 + intensity * 45}%, var(--card))`,
                    }}
                  >
                    <span className="text-muted-foreground">{d.day}</span>
                    <span className={cn("tnum font-semibold", pos ? "text-gain" : "text-loss")}>
                      {pos ? "+" : ""}
                      {(d.pnl / 1000).toFixed(1)}k
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Economic Events" subtitle="CPI · FOMC · Token Unlocks" />
          <ul className="divide-y divide-border/60">
            {economicEvents.map((e, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-3">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-medium text-muted-foreground">{e.date.split(" ")[0]}</span>
                  <span className="text-sm font-bold text-foreground">{e.date.split(" ")[1]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground">{e.title}</p>
                  <p className="text-[10px] text-muted-foreground">{e.time} UTC</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Chip tone={e.tag === "Unlock" ? "cyan" : e.tag === "ETF" ? "gold" : "muted"}>{e.tag}</Chip>
                  <span
                    className={cn(
                      "text-[9px] font-semibold uppercase",
                      e.impact === "high" && "text-loss",
                      e.impact === "medium" && "text-gold",
                      e.impact === "low" && "text-muted-foreground",
                    )}
                  >
                    {e.impact}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}

function StatCard({ label, value, tone, sub }: { label: string; value: string; tone?: "gain" | "loss"; sub?: string }) {
  return (
    <Panel className="p-4">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        {tone === "gain" ? <TrendingUp className="h-3.5 w-3.5 text-gain" /> : tone === "loss" ? <TrendingDown className="h-3.5 w-3.5 text-loss" /> : null}
        {label}
      </div>
      <p className={cn("mt-1 text-xl font-semibold tnum", tone === "gain" && "text-gain", tone === "loss" && "text-loss", !tone && "text-foreground")}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
    </Panel>
  )
}
