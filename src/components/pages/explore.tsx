import { Link } from "@tanstack/react-router"
import { Search, Flame, TrendingUp, TrendingDown, Sparkles } from "lucide-react"
import { COINS } from "@/lib/market-data"
import { fmtNum, fmtPct } from "@/lib/format"
import { cn } from "@/lib/utils"

const TRENDERS = [
  { user: "solqueen", tier: "DIAMOND", winrate: 78, roi: 42.1 },
  { user: "hanibadji", tier: "GOLD", winrate: 71, roi: 28.4 },
  { user: "quantfox", tier: "PLATINUM", winrate: 74, roi: 33.6 },
  { user: "alphaowl", tier: "SILVER", winrate: 66, roi: 18.2 },
  { user: "btcmax", tier: "GOLD", winrate: 69, roi: 24.9 },
  { user: "trendrun", tier: "PLATINUM", winrate: 72, roi: 30.1 },
]

const TAGS = ["#BTC", "#ETH", "#Altseason", "#Longs", "#Scalping", "#Macro", "#DeFi", "#AI"]

export default function ExplorePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-3">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search assets, traders, hashtags…"
          className="h-11 w-full rounded-2xl border border-border bg-secondary/60 pl-10 pr-4 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Tags */}
      <div className="flex gap-2 overflow-x-auto thin-scroll">
        {TAGS.map((t) => (
          <button
            key={t}
            className="shrink-0 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-[12px] font-semibold text-foreground hover:bg-accent"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Trending traders */}
      <section>
        <h2 className="mb-2 flex items-center gap-2 px-1 text-[13px] font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> Top traders this week
        </h2>
        <div className="flex gap-3 overflow-x-auto thin-scroll pb-1">
          {TRENDERS.map((t) => (
            <div
              key={t.user}
              className="w-40 shrink-0 rounded-2xl border border-border bg-card p-3 panel-shadow transition hover:border-primary/40"
            >
              <Link to="/u/$username" params={{ username: t.user }} className="block">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-gain text-lg font-black text-white">
                  {t.user[0].toUpperCase()}
                </div>
                <p className="mt-2 text-center text-[13px] font-semibold text-foreground">{t.user}</p>
                <p className="text-center text-[10px] font-black tracking-wider text-gold">{t.tier}</p>
                <div className="mt-2 flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Win {t.winrate}%</span>
                  <span className="tnum font-semibold text-gain">{fmtPct(t.roi)}</span>
                </div>
              </Link>
              <button className="mt-2 w-full rounded-lg bg-primary py-1.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90">
                Follow
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trending markets grid — instagram explore vibe */}
      <section>
        <h2 className="mb-2 flex items-center gap-2 px-1 text-[13px] font-semibold text-foreground">
          <Flame className="h-4 w-4 text-loss" /> Trending markets
        </h2>
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
          {COINS.slice(0, 9).map((c, i) => {
            const up = c.change24h >= 0
            const big = i === 0
            return (
              <div
                key={c.symbol}
                className={cn(
                  "relative overflow-hidden rounded-md border border-border bg-card",
                  big && "col-span-2 row-span-2",
                )}
                style={{ aspectRatio: "1 / 1" }}
              >
                <MiniChart coin={c} />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
                  <span className="rounded-md bg-background/70 px-1.5 py-0.5 text-[10px] font-black text-foreground backdrop-blur-md ring-1 ring-border">
                    {c.symbol}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold tnum ring-1 backdrop-blur-md",
                      up ? "bg-gain/15 text-gain ring-gain/30" : "bg-loss/15 text-loss ring-loss/30",
                    )}
                  >
                    {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {fmtPct(c.change24h)}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-2">
                  <p className="tnum text-[11px] font-semibold text-foreground">
                    ${fmtNum(c.price, c.price < 5 ? 3 : 0)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function MiniChart({ coin }: { coin: (typeof COINS)[number] }) {
  const s = coin.spark
  const min = Math.min(...s)
  const max = Math.max(...s)
  const pts = s
    .map((v, i) => {
      const x = (i / (s.length - 1)) * 100
      const y = 100 - ((v - min) / (max - min || 1)) * 100
      return `${x},${y}`
    })
    .join(" ")
  const up = coin.change24h >= 0
  const stroke = up ? "var(--gain)" : "var(--loss)"
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id={`grad-${coin.symbol}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.4" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,100 ${pts} 100,100`} fill={`url(#grad-${coin.symbol})`} />
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.2" />
    </svg>
  )
}