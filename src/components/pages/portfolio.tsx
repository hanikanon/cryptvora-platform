
import { useState } from "react"
import { ChevronDown, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Wallet } from "lucide-react"
import { Panel, PanelHeader, Chip } from "@/components/ui/panel"
import { GradientArea, DonutChart, SignedBars } from "@/components/charts"
import {
  wallets,
  walletAssets,
  transactions,
  allocation,
  portfolioGrowth,
  weeklyPerf,
  type WalletKey,
} from "@/lib/market-data"
import { fmtUsd, fmtPct, fmtNum } from "@/lib/format"
import { cn } from "@/lib/utils"

const WALLET_LABELS: Record<WalletKey, string> = {
  spot: "Spot Wallet",
  futures: "Futures Wallet",
  funding: "Funding Wallet",
  margin: "Margin Wallet",
}

export default function PortfolioPage() {
  const [active, setActive] = useState<WalletKey>("spot")
  const [open, setOpen] = useState(false)
  const w = wallets[active]

  return (
    <div className="flex flex-col gap-4 p-3 md:p-5">
      {/* Header row: wallet selector + actions */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Portfolio</h1>
          <p className="text-xs text-muted-foreground">Unified balances across all wallet types</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground panel-shadow"
            >
              <Wallet className="h-3.5 w-3.5 text-gold" />
              {WALLET_LABELS[active]}
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {open && (
              <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-popover panel-shadow">
                {(Object.keys(wallets) as WalletKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      setActive(k)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-muted",
                      k === active ? "text-gold" : "text-foreground",
                    )}
                  >
                    {WALLET_LABELS[k]}
                    <span className="tnum text-muted-foreground">{fmtUsd(wallets[k].total, { compact: true })}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <ActionButton icon={<ArrowDownToLine className="h-3.5 w-3.5" />} label="Deposit" tone="gain" />
          <ActionButton icon={<ArrowUpFromLine className="h-3.5 w-3.5" />} label="Withdraw" tone="loss" />
          <ActionButton icon={<ArrowLeftRight className="h-3.5 w-3.5" />} label="Transfer" tone="cyan" />
        </div>
      </div>

      {/* Balance stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <BalanceCard label="Total Balance" value={fmtUsd(w.total)} sub="Estimated value" accent="gold" />
        <BalanceCard label="Available" value={fmtUsd(w.available)} sub="Ready to trade" />
        <BalanceCard label="Locked" value={fmtUsd(w.locked)} sub="In open orders" />
        <BalanceCard
          label="Unrealized PnL"
          value={fmtUsd(w.pnl)}
          sub={fmtPct((w.pnl / w.total) * 100)}
          accent={w.pnl >= 0 ? "gain" : "loss"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Portfolio growth */}
        <Panel className="xl:col-span-2">
          <PanelHeader title="Portfolio Growth" subtitle="30-day equity curve" action={<Chip tone="gain">{fmtPct(18.4)}</Chip>} />
          <div className="p-2">
            <GradientArea data={portfolioGrowth} dataKey="value" xKey="day" color="var(--gold)" height={260} />
          </div>
        </Panel>

        {/* Allocation donut */}
        <Panel>
          <PanelHeader title="Asset Allocation" subtitle="By market value" />
          <div className="flex items-center gap-2 p-4">
            <div className="relative flex-1">
              <DonutChart data={allocation} height={180} />
            </div>
            <ul className="flex flex-1 flex-col gap-2">
              {allocation.map((a) => (
                <li key={a.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: a.color }} />
                    {a.name}
                  </span>
                  <span className="tnum font-medium text-foreground">{a.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Assets table */}
        <Panel className="xl:col-span-2">
          <PanelHeader title="Balance History" subtitle={`${WALLET_LABELS[active]} holdings`} />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-left text-[11px] text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Asset</th>
                  <th className="px-4 py-2 text-right font-medium">Amount</th>
                  <th className="px-4 py-2 text-right font-medium">Value</th>
                  <th className="px-4 py-2 text-right font-medium">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {walletAssets.map((a) => (
                  <tr key={a.asset} className="border-b border-border/50 last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-gold">
                          {a.asset}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{a.asset}</p>
                          <p className="text-[10px] text-muted-foreground">{a.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right tnum text-foreground">{fmtNum(a.amount, 3)}</td>
                    <td className="px-4 py-2.5 text-right tnum text-foreground">{fmtUsd(a.value)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-gold" style={{ width: `${a.alloc}%` }} />
                        </div>
                        <span className="tnum w-8 text-right text-muted-foreground">{a.alloc}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Recent transactions + weekly perf */}
        <div className="flex flex-col gap-4">
          <Panel>
            <PanelHeader title="Weekly Performance" subtitle="Realized PnL by day" />
            <div className="p-2">
              <SignedBars data={weeklyPerf} dataKey="value" xKey="d" height={150} />
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Recent Transactions" />
            <ul className="divide-y divide-border/60">
              {transactions.slice(0, 5).map((t, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg",
                        t.type === "Deposit" && "bg-gain/12 text-gain",
                        t.type === "Withdraw" && "bg-loss/12 text-loss",
                        t.type === "Transfer" && "bg-cyan/12 text-cyan",
                      )}
                    >
                      {t.type === "Deposit" ? (
                        <ArrowDownToLine className="h-3.5 w-3.5" />
                      ) : t.type === "Withdraw" ? (
                        <ArrowUpFromLine className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowLeftRight className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">
                        {t.type} {t.asset}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {t.time} · {t.network}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="tnum font-medium text-foreground">
                      {fmtNum(t.amount, 2)} {t.asset}
                    </p>
                    <Chip tone={t.status === "Completed" ? "gain" : "gold"}>{t.status}</Chip>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}

function ActionButton({
  icon,
  label,
  tone = "muted",
}: {
  icon: React.ReactNode
  label: string
  tone?: "gain" | "loss" | "cyan" | "muted"
}) {
  const tones: Record<string, string> = {
    gain: "border-gain/30 text-gain hover:bg-gain/10",
    loss: "border-loss/30 text-loss hover:bg-loss/10",
    cyan: "border-cyan/30 text-cyan hover:bg-cyan/10",
    muted: "border-border text-foreground hover:bg-muted",
  }
  return (
    <button className={cn("flex items-center gap-1.5 rounded-lg border bg-card px-3 py-2 text-xs font-medium transition-colors", tones[tone])}>
      {icon}
      {label}
    </button>
  )
}

function BalanceCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub: string
  accent?: "gold" | "gain" | "loss"
}) {
  return (
    <Panel className="p-4">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-xl font-semibold tnum",
          accent === "gold" && "text-gold",
          accent === "gain" && "text-gain",
          accent === "loss" && "text-loss",
          !accent && "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>
    </Panel>
  )
}
