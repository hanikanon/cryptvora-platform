
import { Panel, PanelHeader, Chip } from "@/components/ui/panel"
import { exchanges, wallets } from "@/lib/market-data"
import { fmtUsd } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Lock, ArrowDown, Cable, Wallet, CheckCircle2, RefreshCw, XCircle, ShieldCheck } from "lucide-react"

const statusMap = {
  connected: { label: "Connected", cls: "text-gain", dot: "bg-gain", icon: CheckCircle2 },
  syncing: { label: "Syncing", cls: "text-gold", dot: "bg-gold", icon: RefreshCw },
  disconnected: { label: "Connect", cls: "text-muted-foreground", dot: "bg-muted-foreground", icon: XCircle },
} as const

export function ApiCenter() {
  return (
    <Panel className="flex flex-col">
      <PanelHeader
        title="API Connection Center"
        subtitle="Encrypted multi-exchange sync"
        icon={<Cable className="h-4 w-4" />}
        action={<Chip tone="gain"><ShieldCheck className="h-3 w-3" /> Encrypted</Chip>}
      />

      <div className="grid gap-2 p-3">
        {exchanges.map((ex) => {
          const s = statusMap[ex.status]
          return (
            <div
              key={ex.name}
              className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2.5 transition-colors hover:border-cyan/30"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-bold"
                style={{ background: `color-mix(in oklch, ${ex.color} 16%, transparent)`, color: ex.color }}
              >
                {ex.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-foreground">{ex.name}</span>
                  <span className="rounded bg-muted px-1 py-0.5 text-[9px] font-medium text-muted-foreground">
                    API v3
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px]">
                  <span className={cn("h-1.5 w-1.5 rounded-full", s.dot, ex.status === "syncing" && "animate-pulse")} />
                  <span className={s.cls}>{s.label}</span>
                  {ex.latency > 0 && <span className="text-muted-foreground tnum">· {ex.latency}ms</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[10px] text-gain">
                  <Lock className="h-2.5 w-2.5" /> Wallet sync
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Animated connection pipeline */}
      <div className="mx-3 mb-3 rounded-lg border border-border bg-secondary/30 p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Secure route
        </p>
        <div className="flex flex-col items-center gap-1.5">
          <PipeNode label="Exchange" tone="gold" />
          <Connector />
          <PipeNode label="Encrypted API" tone="cyan" icon={<Lock className="h-3 w-3" />} />
          <Connector />
          <PipeNode label="Cryptvora Platform" tone="gain" icon={<ShieldCheck className="h-3 w-3" />} />
        </div>
      </div>

      {/* Wallet preview */}
      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
          <Wallet className="h-3.5 w-3.5 text-muted-foreground" /> Wallet Preview
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Spot", v: wallets.spot.total },
            { label: "Futures", v: wallets.futures.total },
            { label: "Funding", v: wallets.funding.total },
          ].map((w) => (
            <div key={w.label} className="rounded-lg border border-border bg-secondary/40 p-2.5 text-center">
              <p className="text-[10px] text-muted-foreground">{w.label}</p>
              <p className="mt-0.5 text-[13px] font-semibold text-foreground tnum">{fmtUsd(w.v, { compact: true })}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 rounded-lg border border-gain/25 bg-gain/[0.06] px-3 py-2 text-center">
          <p className="text-[10px] text-muted-foreground">Total Balance</p>
          <p className="text-lg font-bold text-foreground tnum">
            {fmtUsd(wallets.spot.total + wallets.futures.total + wallets.funding.total)}
          </p>
        </div>
      </div>
    </Panel>
  )
}

function PipeNode({
  label,
  tone,
  icon,
}: {
  label: string
  tone: "gold" | "cyan" | "gain"
  icon?: React.ReactNode
}) {
  const map = {
    gold: "border-gold/40 text-gold bg-gold/10",
    cyan: "border-cyan/40 text-cyan bg-cyan/10",
    gain: "border-gain/40 text-gain bg-gain/10",
  }
  return (
    <div className={cn("flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium", map[tone])}>
      {icon}
      {label}
    </div>
  )
}

function Connector() {
  return (
    <div className="relative h-5 w-px bg-border">
      <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan animate-flow" />
      <ArrowDown className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 text-muted-foreground" />
    </div>
  )
}
