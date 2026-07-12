import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { fmtNum } from "@/lib/format"
import {
  Shield,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  Target,
  Award,
  Crown,
  Rocket,
  Star,
  Sparkles,
} from "lucide-react"

/* ----------------------------- Data helpers ----------------------------- */

// Deterministic pseudo-random for a given date so numbers are stable across renders.
function seededPnl(d: Date): number {
  const key = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  // simple LCG
  const x = (Math.sin(key) * 9973) % 1
  const magnitude = Math.floor(Math.abs(x) * 850) + 15
  // ~62% winning days
  const sign = (key % 13) > 4 ? 1 : -1
  // weekends flat
  const day = d.getDay()
  if (day === 0 || day === 6) return 0
  return sign * magnitude
}

const LEVELS = [
  { key: "novice",   label: "Novice",   icon: Sparkles, xp: 0,      color: "oklch(0.68 0.02 285)" },
  { key: "trader",   label: "Trader",   icon: Target,   xp: 500,    color: "oklch(0.72 0.13 210)" },
  { key: "pro",      label: "Pro",      icon: Flame,    xp: 1500,   color: "oklch(0.72 0.17 155)" },
  { key: "expert",   label: "Expert",   icon: Rocket,   xp: 3500,   color: "oklch(0.66 0.245 300)" },
  { key: "master",   label: "Master",   icon: Award,    xp: 6500,   color: "oklch(0.76 0.19 305)" },
  { key: "legend",   label: "Legend",   icon: Star,     xp: 10500,  color: "oklch(0.82 0.14 82)" },
  { key: "diamond",  label: "Diamond",  icon: Crown,    xp: 16000,  color: "oklch(0.85 0.12 200)" },
] as const

/* --------------------------------- Page --------------------------------- */

export default function RiskPage() {
  const [cursor, setCursor] = useState(() => {
    const t = new Date()
    return new Date(t.getFullYear(), t.getMonth(), 1)
  })

  // Level progression demo state
  const currentXp = 4820
  const currentIdx = LEVELS.reduce(
    (acc, lvl, i) => (currentXp >= lvl.xp ? i : acc),
    0,
  )
  const nextLevel = LEVELS[Math.min(currentIdx + 1, LEVELS.length - 1)]
  const currentLevel = LEVELS[currentIdx]
  const xpIntoLevel = currentXp - currentLevel.xp
  const xpToNext =
    nextLevel.xp === currentLevel.xp
      ? 1
      : nextLevel.xp - currentLevel.xp
  const levelProgress = Math.min(1, xpIntoLevel / xpToNext)

  // Calendar days for the given month
  const days = useMemo(() => buildMonthMatrix(cursor), [cursor])

  // Month stats
  const monthStats = useMemo(() => {
    let total = 0,
      wins = 0,
      losses = 0,
      best = 0,
      worst = 0
    for (const w of days) {
      for (const d of w) {
        if (!d) continue
        if (d.getMonth() !== cursor.getMonth()) continue
        const p = seededPnl(d)
        total += p
        if (p > 0) wins += 1
        if (p < 0) losses += 1
        if (p > best) best = p
        if (p < worst) worst = p
      }
    }
    return { total, wins, losses, best, worst }
  }, [days, cursor])

  const monthLabel = cursor.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-3 lg:p-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-3 animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Risk Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Position sizing, exposure limits, drawdown control &amp; trader progression.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-soft">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-[12px] font-semibold text-foreground">Low Risk</span>
          <span className="ml-1 rounded-md bg-gain/15 px-1.5 py-0.5 text-[10px] font-semibold text-gain">
            Score 82
          </span>
        </div>
      </div>

      {/* Risk KPI strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 animate-fade-up">
        <RiskKpi label="Portfolio Heat" value="14.2%" hint="max exposure allowed" tone="ok" />
        <RiskKpi label="Open Risk" value="$4,120" hint="if all SLs hit" tone="ok" />
        <RiskKpi label="Max Drawdown" value="-6.4%" hint="last 30 days" tone="warn" />
        <RiskKpi label="Win Rate" value="63%" hint="last 100 trades" tone="ok" />
      </div>

      {/* ============ PROFIT CALENDAR ============ */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-soft animate-fade-up">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-foreground">Profit Calendar</h2>
            <p className="text-[12px] text-muted-foreground">
              Green = profitable day · Red = losing day · shade = magnitude
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCursor(shiftMonth(cursor, -1))}
              className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground hover:text-foreground transition active:scale-95"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="min-w-[130px] rounded-xl border border-border bg-surface px-3 py-1.5 text-center text-[13px] font-semibold text-foreground">
              {monthLabel}
            </div>
            <button
              onClick={() => setCursor(shiftMonth(cursor, 1))}
              className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground hover:text-foreground transition active:scale-95"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Weekday labels */}
        <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {days.flat().map((d, i) => {
            if (!d)
              return (
                <div
                  key={i}
                  className="aspect-square rounded-xl border border-dashed border-border/60 bg-transparent"
                />
              )
            const inMonth = d.getMonth() === cursor.getMonth()
            const pnl = inMonth ? seededPnl(d) : 0
            const intensity = Math.min(1, Math.abs(pnl) / 700)
            const isToday =
              d.toDateString() === new Date().toDateString()

            const tone =
              pnl > 0
                ? "gain"
                : pnl < 0
                  ? "loss"
                  : "muted"

            return (
              <div
                key={i}
                className={cn(
                  "group relative aspect-square rounded-xl border p-1.5 text-left transition-transform hover:-translate-y-0.5",
                  !inMonth && "opacity-30",
                  isToday && "ring-2 ring-primary/60",
                  tone === "gain" && "border-gain/30",
                  tone === "loss" && "border-loss/30",
                  tone === "muted" && "border-border bg-surface",
                )}
                style={
                  tone === "gain"
                    ? {
                        backgroundColor: `color-mix(in oklch, var(--gain) ${8 + intensity * 32}%, transparent)`,
                      }
                    : tone === "loss"
                      ? {
                          backgroundColor: `color-mix(in oklch, var(--loss) ${8 + intensity * 32}%, transparent)`,
                        }
                      : undefined
                }
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      tone === "gain" && "text-gain",
                      tone === "loss" && "text-loss",
                      tone === "muted" && "text-muted-foreground",
                    )}
                  >
                    {d.getDate()}
                  </span>
                  {pnl !== 0 &&
                    (pnl > 0 ? (
                      <TrendingUp className="h-3 w-3 text-gain" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-loss" />
                    ))}
                </div>
                {pnl !== 0 && (
                  <div
                    className={cn(
                      "absolute inset-x-1.5 bottom-1 tnum text-[10px] font-semibold leading-none sm:text-[11px]",
                      pnl > 0 ? "text-gain" : "text-loss",
                    )}
                  >
                    {pnl > 0 ? "+" : ""}
                    {fmtNum(pnl, 0)}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Month stats */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          <MonthStat label="Net P&L" value={fmtNum(monthStats.total, 0)} tone={monthStats.total >= 0 ? "gain" : "loss"} prefix={monthStats.total >= 0 ? "+$" : "-$"} abs />
          <MonthStat label="Winning days" value={String(monthStats.wins)} tone="gain" />
          <MonthStat label="Losing days" value={String(monthStats.losses)} tone="loss" />
          <MonthStat label="Best day" value={"+$" + fmtNum(monthStats.best, 0)} tone="gain" />
          <MonthStat label="Worst day" value={"-$" + fmtNum(Math.abs(monthStats.worst), 0)} tone="loss" />
        </div>
      </section>

      {/* ============ LEVEL PROGRESSION ============ */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-soft animate-fade-up">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-foreground">Trader Level</h2>
            <p className="text-[12px] text-muted-foreground">
              Earn XP by trading, sharing signals and completing academy modules.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-1.5">
            <span
              className="grid h-6 w-6 place-items-center rounded-lg text-primary-foreground"
              style={{ background: `linear-gradient(135deg, ${currentLevel.color}, oklch(0.7 0.2 305))` }}
            >
              <currentLevel.icon className="h-3.5 w-3.5" />
            </span>
            <span className="text-[12px] font-semibold text-foreground">
              {currentLevel.label}
            </span>
            <span className="tnum text-[11px] text-muted-foreground">
              {fmtNum(currentXp, 0)} XP
            </span>
          </div>
        </div>

        {/* Progression path */}
        <div className="relative py-6">
          {/* base track */}
          <div className="absolute left-2 right-2 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-border/80" />
          {/* progress fill up to current */}
          <div
            className="absolute left-2 top-1/2 h-1.5 -translate-y-1/2 rounded-full gradient-primary shadow-glow transition-all"
            style={{
              width: `calc(${(currentIdx / (LEVELS.length - 1)) * 100}% + ${
                levelProgress * (100 / (LEVELS.length - 1))
              }%)`,
              maxWidth: "calc(100% - 1rem)",
            }}
          />

          {/* level nodes */}
          <ol className="relative flex items-center justify-between">
            {LEVELS.map((lvl, i) => {
              const reached = i <= currentIdx
              const isCurrent = i === currentIdx
              const Icon = lvl.icon
              return (
                <li key={lvl.key} className="flex flex-col items-center">
                  {/* current indicator arrow */}
                  {isCurrent && (
                    <div className="absolute -top-1 flex flex-col items-center">
                      <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground shadow-glow animate-pop">
                        You
                      </span>
                    </div>
                  )}
                  <span
                    className={cn(
                      "relative z-10 grid h-11 w-11 place-items-center rounded-full border-2 transition-all",
                      reached
                        ? "border-primary bg-background shadow-glow"
                        : "border-border bg-surface",
                      isCurrent && "animate-pulse-ring scale-110",
                    )}
                    style={
                      reached
                        ? { boxShadow: `0 0 0 4px color-mix(in oklch, ${lvl.color} 25%, transparent)` }
                        : undefined
                    }
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: reached ? lvl.color : "var(--muted-foreground)" }}
                    />
                  </span>
                  <span
                    className={cn(
                      "mt-2 text-[10px] font-semibold",
                      reached ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {lvl.label}
                  </span>
                  <span className="tnum text-[9px] text-muted-foreground">
                    {fmtNum(lvl.xp, 0)}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Next level progress bar */}
        <div className="mt-2 rounded-2xl border border-border bg-surface p-3">
          <div className="mb-1.5 flex items-center justify-between text-[12px]">
            <span className="font-semibold text-foreground">
              Next: {nextLevel.label}
            </span>
            <span className="tnum text-muted-foreground">
              {fmtNum(xpIntoLevel, 0)} / {fmtNum(xpToNext, 0)} XP
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full gradient-primary shadow-glow transition-all"
              style={{ width: `${levelProgress * 100}%` }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

/* ------------------------- Small building blocks ------------------------- */

function RiskKpi({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint: string
  tone: "ok" | "warn" | "bad"
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-soft transition hover:-translate-y-0.5">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "tnum mt-1 text-lg font-bold",
          tone === "ok" && "text-gain",
          tone === "warn" && "text-gold",
          tone === "bad" && "text-loss",
        )}
      >
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground">{hint}</div>
    </div>
  )
}

function MonthStat({
  label,
  value,
  tone,
  prefix,
  abs,
}: {
  label: string
  value: string
  tone: "gain" | "loss"
  prefix?: string
  abs?: boolean
}) {
  const display = prefix
    ? `${prefix}${abs ? value.replace(/^-/, "") : value}`
    : value
  return (
    <div className="rounded-2xl border border-border bg-surface p-2.5">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "tnum mt-0.5 text-sm font-bold",
          tone === "gain" ? "text-gain" : "text-loss",
        )}
      >
        {display}
      </div>
    </div>
  )
}

/* --------------------------- Calendar utilities --------------------------- */

function shiftMonth(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1)
}

function buildMonthMatrix(cursor: Date): (Date | null)[][] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const startDay = first.getDay() // 0=Sun
  const daysInMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0,
  ).getDate()

  const cells: (Date | null)[] = []
  // leading days from prev month for visual continuity
  for (let i = 0; i < startDay; i++) {
    const d = new Date(cursor.getFullYear(), cursor.getMonth(), 1 - (startDay - i))
    cells.push(d)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), i))
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]!
    cells.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1))
  }

  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}
