
import { Panel, PanelHeader, Chip } from "@/components/ui/panel"
import { Sparkline } from "@/components/charts"
import {
  COINS,
  openPositions,
  recentTrades,
  orderHistory,
  heatmap,
  transactions,
} from "@/lib/market-data"
import { fmtUsd, fmtNum, fmtPct } from "@/lib/format"
import { TELEGRAM_URL } from "@/lib/nav"
import { cn } from "@/lib/utils"
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Send,
  Bell,
  BookOpen,
  Ticket,
  Radio,
  KeyRound,
  ArrowLeftRight,
} from "lucide-react"

/* ---------- Market Heatmap ---------- */
export function MarketHeatmap() {
  const max = Math.max(...heatmap.map((h) => Math.abs(h.change)))
  return (
    <Panel>
      <PanelHeader title="Market Heatmap" subtitle="24h performance by cap" icon={<TrendingUp className="h-4 w-4" />} />
      <div className="grid grid-cols-3 gap-1.5 p-3 sm:grid-cols-4 md:grid-cols-6">
        {heatmap.map((h) => {
          const up = h.change >= 0
          const intensity = Math.min(1, Math.abs(h.change) / max)
          return (
            <div
              key={h.symbol}
              className="flex flex-col items-center justify-center rounded-lg p-3 text-center transition-transform hover:scale-[1.03]"
              style={{
                background: `color-mix(in oklch, ${up ? "var(--gain)" : "var(--loss)"} ${8 + intensity * 26}%, var(--secondary))`,
              }}
            >
              <span className="text-[12px] font-bold text-foreground">{h.symbol}</span>
              <span className={cn("text-[11px] font-medium tnum", up ? "text-gain" : "text-loss")}>
                {fmtPct(h.change)}
              </span>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

/* ---------- Open Positions ---------- */
export function OpenPositions() {
  return (
    <Panel>
      <PanelHeader
        title="Open Positions"
        subtitle={`${openPositions.length} active`}
        action={<Chip tone="gain">Live</Chip>}
      />
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[560px] text-[12px]">
          <thead>
            <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 font-medium">Symbol</th>
              <th className="px-2 py-2 font-medium">Side</th>
              <th className="px-2 py-2 text-right font-medium">Size</th>
              <th className="px-2 py-2 text-right font-medium">Entry</th>
              <th className="px-2 py-2 text-right font-medium">Mark</th>
              <th className="px-4 py-2 text-right font-medium">PnL (ROE)</th>
            </tr>
          </thead>
          <tbody>
            {openPositions.map((p) => {
              const up = p.pnl >= 0
              return (
                <tr key={p.symbol} className="border-b border-border/60 last:border-0 hover:bg-secondary/40">
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {p.symbol}
                    <span className="ml-1 rounded bg-muted px-1 text-[9px] text-muted-foreground">{p.leverage}x</span>
                  </td>
                  <td className="px-2 py-2.5">
                    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", p.side === "LONG" ? "bg-gain/12 text-gain" : "bg-loss/12 text-loss")}>
                      {p.side}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-right tnum text-muted-foreground">{p.size}</td>
                  <td className="px-2 py-2.5 text-right tnum text-muted-foreground">{fmtNum(p.entry, 0)}</td>
                  <td className="px-2 py-2.5 text-right tnum text-foreground">{fmtNum(p.mark, 0)}</td>
                  <td className={cn("px-4 py-2.5 text-right tnum font-medium", up ? "text-gain" : "text-loss")}>
                    {up ? "+" : ""}{fmtUsd(p.pnl)}
                    <span className="ml-1 text-[10px] opacity-80">({fmtPct(p.roe)})</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

/* ---------- Recent Trades ---------- */
export function RecentTrades() {
  return (
    <Panel className="flex flex-col">
      <PanelHeader title="Recent Trades" subtitle="BTC/USDT" />
      <div className="flex items-center justify-between px-4 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>Price</span>
        <span>Amount</span>
        <span>Time</span>
      </div>
      <div className="max-h-[280px] overflow-y-auto no-scrollbar">
        {recentTrades.map((t, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-1 text-[12px] hover:bg-secondary/40">
            <span className={cn("tnum font-medium", t.side === "BUY" ? "text-gain" : "text-loss")}>{fmtNum(t.price, 1)}</span>
            <span className="tnum text-muted-foreground">{t.amount}</span>
            <span className="tnum text-muted-foreground">{t.time}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

/* ---------- Order History ---------- */
export function OrderHistory() {
  return (
    <Panel>
      <PanelHeader title="Order History" subtitle="Last 10 orders" />
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[520px] text-[12px]">
          <thead>
            <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-2 font-medium">Pair</th>
              <th className="px-2 py-2 font-medium">Type</th>
              <th className="px-2 py-2 font-medium">Side</th>
              <th className="px-2 py-2 text-right font-medium">Price</th>
              <th className="px-2 py-2 text-right font-medium">Filled</th>
              <th className="px-4 py-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((o) => (
              <tr key={o.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40">
                <td className="px-4 py-2.5 font-medium text-foreground">{o.symbol}</td>
                <td className="px-2 py-2.5 text-muted-foreground">{o.type}</td>
                <td className="px-2 py-2.5">
                  <span className={o.side === "BUY" ? "text-gain" : "text-loss"}>{o.side}</span>
                </td>
                <td className="px-2 py-2.5 text-right tnum text-muted-foreground">{fmtNum(o.price, 2)}</td>
                <td className="px-2 py-2.5 text-right tnum text-muted-foreground">{o.filled}</td>
                <td className="px-4 py-2.5 text-right">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-medium",
                      o.status === "Filled" && "bg-gain/12 text-gain",
                      o.status === "Partial" && "bg-gold/12 text-gold",
                      o.status === "Canceled" && "bg-muted text-muted-foreground",
                    )}
                  >
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

/* ---------- Watchlist ---------- */
export function Watchlist() {
  return (
    <Panel>
      <PanelHeader title="Watchlist" subtitle="Tracked assets" action={<Chip tone="cyan">8 pairs</Chip>} />
      <div className="divide-y divide-border/60">
        {COINS.slice(0, 8).map((c) => {
          const up = c.change24h >= 0
          return (
            <div key={c.symbol} className="flex items-center gap-3 px-4 py-2 hover:bg-secondary/40">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-foreground">
                {c.symbol.slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-foreground">{c.symbol}/USDT</p>
                <p className="truncate text-[10px] text-muted-foreground">{c.name}</p>
              </div>
              <Sparkline data={c.spark} color={up ? "var(--gain)" : "var(--loss)"} width={64} height={22} />
              <div className="text-right">
                <p className="text-[12px] tnum text-foreground">${fmtNum(c.price, c.price < 5 ? 3 : 0)}</p>
                <p className={cn("text-[10px] tnum", up ? "text-gain" : "text-loss")}>{fmtPct(c.change24h)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

/* ---------- Top Gainers / Losers ---------- */
export function MoversList({ mode }: { mode: "gainers" | "losers" }) {
  const sorted = [...COINS].sort((a, b) => (mode === "gainers" ? b.change24h - a.change24h : a.change24h - b.change24h)).slice(0, 5)
  const up = mode === "gainers"
  return (
    <Panel>
      <PanelHeader
        title={up ? "Top Gainers" : "Top Losers"}
        icon={up ? <TrendingUp className="h-4 w-4 text-gain" /> : <TrendingDown className="h-4 w-4 text-loss" />}
      />
      <div className="divide-y divide-border/60">
        {sorted.map((c) => (
          <div key={c.symbol} className="flex items-center justify-between px-4 py-2 hover:bg-secondary/40">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-[9px] font-bold text-foreground">
                {c.symbol.slice(0, 2)}
              </span>
              <span className="text-[12px] font-medium text-foreground">{c.symbol}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[12px] tnum text-muted-foreground">${fmtNum(c.price, c.price < 5 ? 3 : 0)}</span>
              <span className={cn("flex items-center text-[11px] tnum font-medium", up ? "text-gain" : "text-loss")}>
                {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {fmtPct(c.change24h)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

/* ---------- Transactions (deposits / withdrawals / transfers) ---------- */
export function TransactionsPanel() {
  return (
    <Panel>
      <PanelHeader title="Recent Transactions" subtitle="Deposits · Withdrawals · Transfers" icon={<ArrowLeftRight className="h-4 w-4" />} />
      <div className="divide-y divide-border/60">
        {transactions.map((t, i) => {
          const isDeposit = t.type === "Deposit"
          const isWithdraw = t.type === "Withdraw"
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/40">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  isDeposit && "bg-gain/12 text-gain",
                  isWithdraw && "bg-loss/12 text-loss",
                  !isDeposit && !isWithdraw && "bg-cyan/12 text-cyan",
                )}
              >
                {isDeposit ? <ArrowDownRight className="h-4 w-4" /> : isWithdraw ? <ArrowUpRight className="h-4 w-4" /> : <ArrowLeftRight className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-foreground">
                  {t.type} {t.asset}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t.time} · {t.network}
                </p>
              </div>
              <div className="text-right">
                <p className={cn("text-[12px] tnum font-medium", isWithdraw ? "text-loss" : "text-foreground")}>
                  {isWithdraw ? "-" : "+"}
                  {t.amount} {t.asset}
                </p>
                <p className={cn("text-[10px]", t.status === "Pending" ? "text-gold" : "text-muted-foreground")}>{t.status}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

/* ---------- Crypto Bot Panel ---------- */
export function BotPanel() {
  const features = [
    { icon: Radio, label: "Trading Alerts" },
    { icon: TrendingUp, label: "Signals" },
    { icon: Bell, label: "Notifications" },
    { icon: Ticket, label: "Coupons" },
    { icon: BookOpen, label: "Education" },
    { icon: KeyRound, label: "Account Access" },
  ]
  return (
    <Panel className="overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex items-center gap-3 border-b border-border p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/15 text-cyan">
            <Send className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">Crypto Bot</h3>
            <p className="text-[11px] text-muted-foreground">Your trading co-pilot on Telegram</p>
          </div>
          <Chip tone="cyan" className="ml-auto">Online</Chip>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        {features.map((f) => (
          <div key={f.label} className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-secondary/40 p-2.5 text-center">
            <f.icon className="h-4 w-4 text-cyan" />
            <span className="text-[10px] leading-tight text-muted-foreground">{f.label}</span>
          </div>
        ))}
      </div>
      <div className="p-3 pt-0">
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-cyan/40 bg-cyan/10 text-[13px] font-semibold text-cyan hover:bg-cyan/15"
        >
          <Send className="h-4 w-4" /> Connect @CryptvoraBot
        </a>
      </div>
    </Panel>
  )
}
