
import { Panel, PanelHeader, Chip } from "@/components/ui/panel"
import { Sparkline } from "@/components/charts"
import { COINS } from "@/lib/market-data"
import { fmtUsd, fmtPct, fmtCompact } from "@/lib/format"
import { cn } from "@/lib/utils"

export default function MarketsPage() {
  const gainers = [...COINS].sort((a, b) => b.change24h - a.change24h).slice(0, 5)
  const losers = [...COINS].sort((a, b) => a.change24h - b.change24h).slice(0, 5)

  return (
    <div className="flex flex-col gap-4 p-3 md:p-5">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Markets</h1>
        <p className="text-xs text-muted-foreground">Live spot & perpetual markets</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MoverList title="Top Gainers" coins={gainers} tone="gain" />
        <MoverList title="Top Losers" coins={losers} tone="loss" />
      </div>

      <Panel>
        <PanelHeader title="All Markets" subtitle={`${COINS.length} pairs`} />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-left text-[11px] text-muted-foreground">
                <th className="px-4 py-2 font-medium">Pair</th>
                <th className="px-4 py-2 text-right font-medium">Price</th>
                <th className="px-4 py-2 text-right font-medium">24h</th>
                <th className="px-4 py-2 text-right font-medium">Volume</th>
                <th className="px-4 py-2 text-right font-medium">Market Cap</th>
                <th className="px-4 py-2 text-right font-medium">Last 32</th>
              </tr>
            </thead>
            <tbody>
              {COINS.map((c) => (
                <tr key={c.symbol} className="border-b border-border/50 last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-gold">
                        {c.symbol}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{c.symbol}/USDT</p>
                        <p className="text-[10px] text-muted-foreground">{c.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right tnum text-foreground">{fmtUsd(c.price)}</td>
                  <td className={cn("px-4 py-2.5 text-right tnum font-medium", c.change24h >= 0 ? "text-gain" : "text-loss")}>
                    {fmtPct(c.change24h)}
                  </td>
                  <td className="px-4 py-2.5 text-right tnum text-muted-foreground">{fmtCompact(c.volume)}</td>
                  <td className="px-4 py-2.5 text-right tnum text-muted-foreground">{fmtCompact(c.marketCap)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end">
                      <Sparkline data={c.spark} color={c.change24h >= 0 ? "var(--gain)" : "var(--loss)"} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

function MoverList({ title, coins, tone }: { title: string; coins: typeof COINS; tone: "gain" | "loss" }) {
  return (
    <Panel>
      <PanelHeader title={title} action={<Chip tone={tone}>24h</Chip>} />
      <ul className="divide-y divide-border/60">
        {coins.map((c) => (
          <li key={c.symbol} className="flex items-center justify-between px-4 py-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-gold">{c.symbol}</span>
              <div>
                <p className="font-medium text-foreground">{c.symbol}/USDT</p>
                <p className="text-[10px] text-muted-foreground">{c.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkline data={c.spark} color={tone === "gain" ? "var(--gain)" : "var(--loss)"} width={64} height={24} />
              <div className="text-right">
                <p className="tnum text-foreground">{fmtUsd(c.price)}</p>
                <p className={cn("tnum font-medium", tone === "gain" ? "text-gain" : "text-loss")}>{fmtPct(c.change24h)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
