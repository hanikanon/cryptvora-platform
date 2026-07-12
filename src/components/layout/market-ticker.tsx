
import { COINS } from "@/lib/market-data"
import { fmtNum, fmtPct } from "@/lib/format"
import { cn } from "@/lib/utils"

export function MarketTicker() {
  const items = [...COINS, ...COINS]
  return (
    <div className="relative overflow-hidden border-b border-border bg-panel/60">
      <div className="flex w-max animate-ticker gap-6 py-1.5 px-4">
        {items.map((c, i) => {
          const up = c.change24h >= 0
          return (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap text-[11px]">
              <span className="font-semibold text-foreground">{c.symbol}</span>
              <span className="tnum text-muted-foreground">
                ${fmtNum(c.price, c.price < 5 ? 4 : 2)}
              </span>
              <span className={cn("tnum font-medium", up ? "text-gain" : "text-loss")}>{fmtPct(c.change24h)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
