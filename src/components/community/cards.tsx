import {
  ArrowUpRight,
  TrendingUp,
  ExternalLink,
  FileText,
  Download,
  ImageIcon,
  Target,
  ShieldAlert,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sparkline } from "./atoms";
import { CRYPTO, NEWS, TRADE, PORTFOLIO } from "./data";

const cardBase =
  "overflow-hidden rounded-2xl border border-border bg-card shadow-soft";

export function CryptoCard() {
  const up = CRYPTO.change >= 0;
  return (
    <div className={cn(cardBase, "w-[300px] max-w-full")}>
      <div className="flex items-center gap-3 p-3.5">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/12 text-gold">
          <span className="text-lg font-bold">₿</span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-bold text-foreground">{CRYPTO.name}</p>
            <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
              {CRYPTO.symbol}
            </span>
          </div>
          <p className="font-mono text-lg font-bold tabular-nums text-foreground">
            ${CRYPTO.price.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <Sparkline data={CRYPTO.spark} positive={up} />
          <span
            className={cn(
              "mt-0.5 inline-flex items-center gap-0.5 text-xs font-bold tabular-nums",
              up ? "text-gain" : "text-loss",
            )}
          >
            <TrendingUp className="h-3 w-3" />
            +{CRYPTO.change}%
          </span>
        </div>
      </div>
      <button className="flex w-full items-center justify-center gap-1 border-t border-border bg-surface py-2 text-xs font-semibold text-primary transition hover:bg-primary-soft">
        View market <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function NewsCard() {
  return (
    <div className={cn(cardBase, "w-[340px] max-w-full")}>
      <div className="flex h-28 items-center justify-center gradient-primary">
        <Newspaper className="h-9 w-9 text-primary-foreground/90" />
      </div>
      <div className="p-3.5">
        <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
          <span className="text-primary">{NEWS.source}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{NEWS.time}</span>
        </div>
        <p className="text-sm font-bold leading-snug text-foreground">{NEWS.title}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{NEWS.excerpt}</p>
        <button className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
          Read article <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export function TradeCard() {
  const long = TRADE.side === "LONG";
  return (
    <div className={cn(cardBase, "w-[300px] max-w-full")}>
      <div className="flex items-center justify-between p-3.5 pb-2.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-lg px-2 py-1 text-[11px] font-extrabold tracking-wide",
              long ? "bg-gain/12 text-gain" : "bg-loss/12 text-loss",
            )}
          >
            {TRADE.side}
          </span>
          <span className="font-mono text-sm font-bold text-foreground">{TRADE.pair}</span>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
            {TRADE.leverage}
          </span>
        </div>
        <span className="font-mono text-sm font-bold text-gain">+{TRADE.pnl}%</span>
      </div>
      <div className="grid grid-cols-3 gap-px bg-border">
        {[
          { label: "Entry", val: TRADE.entry, icon: null },
          { label: "Target", val: TRADE.target, icon: Target, cls: "text-gain" },
          { label: "Stop", val: TRADE.stop, icon: ShieldAlert, cls: "text-loss" },
        ].map((c) => (
          <div key={c.label} className="bg-card px-3 py-2.5">
            <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {c.icon && <c.icon className={cn("h-3 w-3", c.cls)} />}
              {c.label}
            </div>
            <p className="mt-0.5 font-mono text-xs font-bold tabular-nums text-foreground">
              ${c.val.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortfolioCard() {
  return (
    <div className={cn(cardBase, "w-[300px] max-w-full")}>
      <div className="p-3.5 pb-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Portfolio Snapshot
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="font-mono text-xl font-bold tabular-nums text-foreground">
            ${PORTFOLIO.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <span className="text-xs font-bold text-gain">+{PORTFOLIO.change}%</span>
        </div>
      </div>
      <div className="flex h-2 overflow-hidden">
        {PORTFOLIO.allocation.map((a) => (
          <div
            key={a.sym}
            className={cn(
              a.tint === "gold" && "bg-gold",
              a.tint === "primary" && "bg-primary",
              a.tint === "gain" && "bg-gain",
              a.tint === "muted" && "bg-muted-foreground/40",
            )}
            style={{ width: `${a.pct}%` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 p-3.5">
        {PORTFOLIO.allocation.map((a) => (
          <div key={a.sym} className="flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                a.tint === "gold" && "bg-gold",
                a.tint === "primary" && "bg-primary",
                a.tint === "gain" && "bg-gain",
                a.tint === "muted" && "bg-muted-foreground/40",
              )}
            />
            <span className="font-semibold text-foreground">{a.sym}</span>
            <span className="ml-auto font-mono tabular-nums text-muted-foreground">{a.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ImageCard({ caption }: { caption?: string }) {
  return (
    <div className={cn(cardBase, "w-[300px] max-w-full")}>
      <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-surface-2 to-primary-soft">
        <div className="absolute inset-0 opacity-40 mesh-bg" />
        <ImageIcon className="relative h-10 w-10 text-primary/50" />
        <span className="absolute bottom-2 right-2 rounded-md bg-foreground/60 px-1.5 py-0.5 text-[10px] font-semibold text-background">
          IMG_4821.png
        </span>
      </div>
      {caption && <p className="px-3.5 py-2.5 text-xs text-muted-foreground">{caption}</p>}
    </div>
  );
}

export function FileCard() {
  return (
    <div className={cn(cardBase, "flex w-[300px] max-w-full items-center gap-3 p-3")}>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
        <FileText className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">Q3-Market-Outlook.pdf</p>
        <p className="text-xs text-muted-foreground">2.4 MB · PDF document</p>
      </div>
      <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface text-muted-foreground transition hover:bg-primary-soft hover:text-primary">
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}
