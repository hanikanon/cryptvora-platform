
import { useState } from "react"
import { Panel, PanelHeader, Chip } from "@/components/ui/panel"
import { CandlestickChart, DepthChart } from "@/components/charts"
import { generateCandles, buildOrderBook, recentTrades, openPositions, orderHistory, depthData } from "@/lib/market-data"
import { fmtUsd, fmtNum, fmtPct } from "@/lib/format"
import { cn } from "@/lib/utils"

const candles = generateCandles(7, 90, 94000)
const book = buildOrderBook(97432.5)
const maxTotal = Math.max(...book.asks.concat(book.bids).map((r) => r.total))

const MODES = ["Spot", "Margin", "Futures", "Convert"] as const
const ORDER_TYPES = ["Market", "Limit", "Stop Limit", "TP/SL"] as const

export default function TradingPage() {
  const [mode, setMode] = useState<(typeof MODES)[number]>("Futures")
  const [orderType, setOrderType] = useState<(typeof ORDER_TYPES)[number]>("Limit")
  const [leverage, setLeverage] = useState(10)
  const [tab, setTab] = useState<"positions" | "orders" | "history">("positions")

  return (
    <div className="flex flex-col gap-3 p-3 md:p-4">
      {/* Symbol bar */}
      <Panel className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold">₿</span>
          <div>
            <p className="text-sm font-semibold text-foreground">BTC/USDT</p>
            <p className="text-[10px] text-muted-foreground">Bitcoin · Perpetual</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
          <Stat label="Last Price" value="97,432.50" tone="gain" />
          <Stat label="24h Change" value="+2.41%" tone="gain" />
          <Stat label="24h High" value="98,120.00" />
          <Stat label="24h Low" value="94,880.00" />
          <Stat label="24h Volume" value="42.1B USDT" />
          <Stat label="Funding / 8h" value="0.0089%" tone="cyan" />
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_280px_300px]">
        {/* Chart + tools */}
        <div className="flex flex-col gap-3">
          <Panel>
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <div className="flex items-center gap-1">
                {["1m", "5m", "15m", "1H", "4H", "1D", "1W"].map((tf, i) => (
                  <button
                    key={tf}
                    className={cn(
                      "rounded px-2 py-1 text-[11px] font-medium",
                      i === 3 ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="text-gain">O 94,210</span>
                <span className="text-gain">H 98,120</span>
                <span className="text-loss">L 94,880</span>
                <span className="text-gain">C 97,432</span>
              </div>
            </div>
            <div className="p-2">
              <CandlestickChart data={candles} height={380} />
            </div>
          </Panel>

          {/* Positions / Orders / History */}
          <Panel>
            <div className="flex items-center gap-1 border-b border-border px-3 py-2">
              {(["positions", "orders", "history"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded px-3 py-1 text-[11px] font-medium capitalize",
                    tab === t ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t === "positions" ? "Open Positions" : t === "orders" ? "Open Orders" : "Trade History"}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              {tab === "positions" && (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-left text-[10px] text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Symbol</th>
                      <th className="px-3 py-2 font-medium">Side</th>
                      <th className="px-3 py-2 text-right font-medium">Size</th>
                      <th className="px-3 py-2 text-right font-medium">Entry</th>
                      <th className="px-3 py-2 text-right font-medium">Mark</th>
                      <th className="px-3 py-2 text-right font-medium">PnL (ROE)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openPositions.map((p) => (
                      <tr key={p.symbol} className="border-b border-border/50 last:border-0 hover:bg-muted/40">
                        <td className="px-3 py-2 font-medium text-foreground">
                          {p.symbol} <span className="text-[9px] text-muted-foreground">{p.leverage}x</span>
                        </td>
                        <td className="px-3 py-2">
                          <Chip tone={p.side === "LONG" ? "gain" : "loss"}>{p.side}</Chip>
                        </td>
                        <td className="px-3 py-2 text-right tnum text-foreground">{fmtNum(p.size, 2)}</td>
                        <td className="px-3 py-2 text-right tnum text-muted-foreground">{fmtNum(p.entry, 1)}</td>
                        <td className="px-3 py-2 text-right tnum text-foreground">{fmtNum(p.mark, 1)}</td>
                        <td className={cn("px-3 py-2 text-right tnum font-medium", p.pnl >= 0 ? "text-gain" : "text-loss")}>
                          {fmtUsd(p.pnl)} ({fmtPct(p.roe)})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {tab === "orders" && (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-left text-[10px] text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Order ID</th>
                      <th className="px-3 py-2 font-medium">Symbol</th>
                      <th className="px-3 py-2 font-medium">Type</th>
                      <th className="px-3 py-2 font-medium">Side</th>
                      <th className="px-3 py-2 text-right font-medium">Price</th>
                      <th className="px-3 py-2 text-right font-medium">Filled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((o) => (
                      <tr key={o.id} className="border-b border-border/50 last:border-0 hover:bg-muted/40">
                        <td className="px-3 py-2 tnum text-muted-foreground">{o.id}</td>
                        <td className="px-3 py-2 font-medium text-foreground">{o.symbol}</td>
                        <td className="px-3 py-2 text-muted-foreground">{o.type}</td>
                        <td className="px-3 py-2">
                          <span className={o.side === "BUY" ? "text-gain" : "text-loss"}>{o.side}</span>
                        </td>
                        <td className="px-3 py-2 text-right tnum text-foreground">{fmtNum(o.price, 2)}</td>
                        <td className="px-3 py-2 text-right tnum text-muted-foreground">{o.filled}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {tab === "history" && (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-left text-[10px] text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Time</th>
                      <th className="px-3 py-2 font-medium">Pair</th>
                      <th className="px-3 py-2 font-medium">Side</th>
                      <th className="px-3 py-2 text-right font-medium">Price</th>
                      <th className="px-3 py-2 text-right font-medium">Amount</th>
                      <th className="px-3 py-2 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTrades.map((t, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/40">
                        <td className="px-3 py-2 tnum text-muted-foreground">{t.time}</td>
                        <td className="px-3 py-2 text-foreground">{t.symbol}</td>
                        <td className="px-3 py-2">
                          <span className={t.side === "BUY" ? "text-gain" : "text-loss"}>{t.side}</span>
                        </td>
                        <td className="px-3 py-2 text-right tnum text-foreground">{fmtNum(t.price, 1)}</td>
                        <td className="px-3 py-2 text-right tnum text-muted-foreground">{fmtNum(t.amount, 3)}</td>
                        <td className="px-3 py-2 text-right tnum text-foreground">{fmtUsd(t.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Panel>
        </div>

        {/* Order book + market trades */}
        <div className="flex flex-col gap-3">
          <Panel>
            <PanelHeader title="Order Book" subtitle="BTC/USDT" />
            <div className="px-3 py-2">
              <div className="grid grid-cols-3 pb-1 text-[10px] text-muted-foreground">
                <span>Price</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Total</span>
              </div>
              <div className="flex flex-col">
                {book.asks.map((r, i) => (
                  <BookRow key={`a${i}`} row={r} max={maxTotal} tone="loss" />
                ))}
              </div>
              <div className="my-1.5 flex items-center justify-between border-y border-border py-1.5">
                <span className="text-sm font-semibold text-gain tnum">97,432.5</span>
                <span className="text-[10px] text-muted-foreground">≈ ${"97,432"}</span>
              </div>
              <div className="flex flex-col">
                {book.bids.map((r, i) => (
                  <BookRow key={`b${i}`} row={r} max={maxTotal} tone="gain" />
                ))}
              </div>
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Depth Chart" />
            <div className="p-2">
              <DepthChart data={depthData} height={140} />
            </div>
          </Panel>
        </div>

        {/* Order form */}
        <div className="flex flex-col gap-3">
          <Panel className="p-3">
            <div className="mb-3 flex items-center gap-1 rounded-lg bg-muted p-1">
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors",
                    mode === m ? "bg-card text-foreground panel-shadow" : "text-muted-foreground",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="mb-3 flex items-center gap-3 text-[11px]">
              {ORDER_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setOrderType(t)}
                  className={cn("font-medium", orderType === t ? "text-gold" : "text-muted-foreground")}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Leverage */}
            {(mode === "Futures" || mode === "Margin") && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Leverage</span>
                  <span className="tnum font-semibold text-gold">{leverage}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={125}
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--gold)]"
                />
              </div>
            )}

            <Field label="Price (USDT)" value="97,432.5" disabled={orderType === "Market"} />
            <Field label="Quantity (BTC)" value="0.00" />
            <div className="my-2 flex gap-1">
              {["25%", "50%", "75%", "100%"].map((p) => (
                <button key={p} className="flex-1 rounded border border-border py-1 text-[10px] text-muted-foreground hover:text-foreground">
                  {p}
                </button>
              ))}
            </div>
            <Field label="Take Profit" value="0.00" tone="gain" />
            <Field label="Stop Loss" value="0.00" tone="loss" />

            {mode === "Futures" ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="rounded-lg bg-gain py-2.5 text-xs font-bold text-[color:var(--gain-foreground,#04120a)]">Long / Buy</button>
                <button className="rounded-lg bg-loss py-2.5 text-xs font-bold text-[color:var(--loss-foreground,#150404)]">Short / Sell</button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="rounded-lg bg-gain py-2.5 text-xs font-bold text-[color:var(--gain-foreground,#04120a)]">Buy</button>
                <button className="rounded-lg bg-loss py-2.5 text-xs font-bold text-[color:var(--loss-foreground,#150404)]">Sell</button>
              </div>
            )}
          </Panel>

          {/* Risk calculator */}
          <Panel className="p-3">
            <p className="mb-2 text-[13px] font-semibold text-foreground">Risk Calculator</p>
            <div className="flex flex-col gap-1.5 text-[11px]">
              <Row label="Entry Price" value="97,432.5" />
              <Row label="Position Size" value="1.24 BTC" />
              <Row label="Risk %" value="2.0%" tone="gold" />
              <Row label="Liq. Price" value="88,120.0" tone="loss" />
              <Row label="Max Loss" value="-$2,415.6" tone="loss" />
              <Row label="R : R Ratio" value="1 : 3.2" tone="gain" />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

function BookRow({ row, max, tone }: { row: { price: number; amount: number; total: number }; max: number; tone: "gain" | "loss" }) {
  const w = (row.total / max) * 100
  return (
    <div className="relative grid grid-cols-3 py-[3px] text-[11px]">
      <div
        className={cn("absolute inset-y-0 right-0", tone === "gain" ? "bg-gain/10" : "bg-loss/10")}
        style={{ width: `${w}%` }}
      />
      <span className={cn("relative z-10 tnum", tone === "gain" ? "text-gain" : "text-loss")}>{fmtNum(row.price, 1)}</span>
      <span className="relative z-10 text-right tnum text-foreground">{fmtNum(row.amount, 3)}</span>
      <span className="relative z-10 text-right tnum text-muted-foreground">{row.total}</span>
    </div>
  )
}

function Field({ label, value, disabled, tone }: { label: string; value: string; disabled?: boolean; tone?: "gain" | "loss" }) {
  return (
    <label className="mb-2 block">
      <span className="mb-1 block text-[10px] text-muted-foreground">{label}</span>
      <input
        defaultValue={value}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg border border-border bg-input px-3 py-2 text-xs tnum text-foreground outline-none focus:border-gold/60 disabled:opacity-50",
          tone === "gain" && "focus:border-gain/60",
          tone === "loss" && "focus:border-loss/60",
        )}
      />
    </label>
  )
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "gain" | "loss" | "gold" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "tnum font-medium",
          tone === "gain" && "text-gain",
          tone === "loss" && "text-loss",
          tone === "gold" && "text-gold",
          !tone && "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "gain" | "loss" | "cyan" }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "tnum font-medium",
          tone === "gain" && "text-gain",
          tone === "loss" && "text-loss",
          tone === "cyan" && "text-cyan",
          !tone && "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  )
}
