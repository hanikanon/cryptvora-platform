import {
  TrendingUp,
  TrendingDown,
  Target,
  ShieldAlert,
  Wallet,
  Brain,
  Sparkles,
  Activity,
  Gauge,
  CalendarClock,
  ArrowUpRight,
  ArrowRight,
  Flame,
  Copy,
  Star,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sparkline } from "./atoms";
import {
  COINS,
  SIGNAL,
  TRADE_IDEA,
  PNL,
  WALLET,
  TA,
  MARKET,
  AI_ANALYSIS,
  CALENDAR,
  EXCHANGES,
  WATCHLIST,
  COMPARE,
  FEAR_GREED,
  DOMINANCE,
  TRENDING,
  GAINERS,
  LOSERS,
  type CoinInfo,
} from "./data";

const card = "overflow-hidden rounded-2xl border border-border bg-card shadow-soft";
const tintText: Record<string, string> = {
  gold: "text-gold",
  primary: "text-primary",
  gain: "text-gain",
  loss: "text-loss",
};
const tintBg: Record<string, string> = {
  gold: "bg-gold/12 text-gold",
  primary: "bg-primary-soft text-primary",
  gain: "bg-gain/12 text-gain",
  loss: "bg-loss/12 text-loss",
};

function Delta({ v }: { v: number }) {
  const up = v >= 0;
  return (
    <span className={cn("inline-flex items-center gap-0.5 font-mono text-xs font-bold tabular-nums", up ? "text-gain" : "text-loss")}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? "+" : ""}{v}%
    </span>
  );
}

function fmt(n: number) {
  return n < 1 ? n.toPrecision(3) : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

/* ---------- Coin / Token preview ---------- */
export function CoinCard({ coin, compact }: { coin: CoinInfo; compact?: boolean }) {
  const up = coin.change >= 0;
  return (
    <div className={cn(card, compact ? "w-[260px]" : "w-[300px]", "max-w-full")}>
      <div className="flex items-center gap-3 p-3.5">
        <span className={cn("grid h-10 w-10 place-items-center rounded-full text-lg font-bold", tintBg[coin.tint])}>
          {coin.glyph}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-bold text-foreground">{coin.name}</p>
            <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">{coin.symbol}</span>
            <span className="rounded-md bg-surface px-1 py-0.5 text-[9px] font-bold text-muted-foreground">#{coin.rank}</span>
          </div>
          <p className="font-mono text-lg font-bold tabular-nums text-foreground">${coin.price.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <Sparkline data={coin.spark} positive={up} width={72} height={30} />
          <div className="mt-0.5"><Delta v={coin.change} /></div>
        </div>
      </div>
      {!compact && (
        <div className="grid grid-cols-2 gap-px bg-border">
          <div className="bg-card px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Mkt Cap</p>
            <p className="font-mono text-xs font-bold text-foreground">{coin.cap}</p>
          </div>
          <div className="bg-card px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Vol 24h</p>
            <p className="font-mono text-xs font-bold text-foreground">{coin.vol}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Trading Signal ---------- */
export function SignalCard() {
  return (
    <div className={cn(card, "w-[320px] max-w-full")}>
      <div className="flex items-center justify-between gradient-primary px-3.5 py-2.5">
        <div className="flex items-center gap-2 text-primary-foreground">
          <Target className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wide">Trading Signal</span>
        </div>
        <span className="rounded-lg bg-white/20 px-2 py-0.5 text-[11px] font-extrabold text-primary-foreground">{SIGNAL.side}</span>
      </div>
      <div className="p-3.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-foreground">{SIGNAL.pair}</span>
          <span className="text-xs font-semibold text-muted-foreground">R:R {SIGNAL.rr}</span>
        </div>
        <div className="mt-2.5">
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-muted-foreground">Confidence</span>
            <span className="font-bold text-primary">{SIGNAL.confidence}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full gradient-primary" style={{ width: `${SIGNAL.confidence}%` }} />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-surface py-2">
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">Entry</p>
            <p className="font-mono text-xs font-bold text-foreground">{SIGNAL.entry}</p>
          </div>
          <div className="rounded-xl bg-gain/10 py-2">
            <p className="text-[10px] font-semibold uppercase text-gain">Targets</p>
            <p className="font-mono text-xs font-bold text-gain">{SIGNAL.targets.length}</p>
          </div>
          <div className="rounded-xl bg-loss/10 py-2">
            <p className="text-[10px] font-semibold uppercase text-loss">Stop</p>
            <p className="font-mono text-xs font-bold text-loss">{SIGNAL.stop}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Trade Idea ---------- */
export function TradeIdeaCard() {
  return (
    <div className={cn(card, "w-[320px] max-w-full p-3.5")}>
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary"><Sparkles className="h-4 w-4" /></span>
        <div>
          <p className="text-sm font-bold text-foreground">{TRADE_IDEA.title}</p>
          <p className="text-[11px] text-muted-foreground">Idea · {TRADE_IDEA.timeframe} · {TRADE_IDEA.by}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{TRADE_IDEA.thesis}</p>
      <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-gain/12 px-2 py-0.5 text-[11px] font-bold text-gain">
        <TrendingUp className="h-3 w-3" /> {TRADE_IDEA.bias}
      </span>
    </div>
  );
}

/* ---------- PnL ---------- */
export function PnlCard() {
  const up = PNL.roi >= 0;
  return (
    <div className={cn(card, "w-[300px] max-w-full")}>
      <div className={cn("p-4 text-center", up ? "bg-gain/10" : "bg-loss/10")}>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{PNL.pair} · {PNL.leverage} · {PNL.side}</p>
        <p className={cn("mt-1 font-mono text-3xl font-extrabold tabular-nums", up ? "text-gain" : "text-loss")}>
          {up ? "+" : ""}{PNL.roi}%
        </p>
        <p className="mt-0.5 font-mono text-sm font-bold text-foreground">{up ? "+" : ""}${PNL.pnl.toLocaleString()}</p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border">
        <div className="bg-card px-3 py-2 text-center">
          <p className="text-[10px] uppercase text-muted-foreground">Entry</p>
          <p className="font-mono text-xs font-bold text-foreground">${PNL.entry.toLocaleString()}</p>
        </div>
        <div className="bg-card px-3 py-2 text-center">
          <p className="text-[10px] uppercase text-muted-foreground">Exit</p>
          <p className="font-mono text-xs font-bold text-foreground">${PNL.exit.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Wallet preview ---------- */
export function WalletCard() {
  return (
    <div className={cn(card, "w-[300px] max-w-full p-3.5")}>
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary"><Wallet className="h-4 w-4" /></span>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">{WALLET.label}</p>
          <p className="font-mono text-[11px] text-muted-foreground">{WALLET.address}</p>
        </div>
        <button className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-surface hover:text-primary"><Copy className="h-3.5 w-3.5" /></button>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <p className="font-mono text-xl font-bold tabular-nums text-foreground">${WALLET.total.toLocaleString()}</p>
        <Delta v={WALLET.change} />
      </div>
      <div className="mt-2 flex h-2 overflow-hidden rounded-full">
        {WALLET.chains.map((c) => (
          <div key={c.name} className={cn(c.tint === "primary" && "bg-primary", c.tint === "gain" && "bg-gain", c.tint === "gold" && "bg-gold")} style={{ width: `${c.pct}%` }} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {WALLET.chains.map((c) => (
          <span key={c.name} className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className={cn("h-2 w-2 rounded-full", c.tint === "primary" && "bg-primary", c.tint === "gain" && "bg-gain", c.tint === "gold" && "bg-gold")} />
            {c.name} {c.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Technical Analysis ---------- */
export function TechnicalCard() {
  return (
    <div className={cn(card, "w-[300px] max-w-full p-3.5")}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary"><Activity className="h-4 w-4" /></span>
          <p className="text-sm font-bold text-foreground">{TA.pair} · TA</p>
        </div>
        <span className="rounded-full bg-gain/12 px-2 py-0.5 text-[11px] font-bold text-gain">{TA.summary}</span>
      </div>
      <div className="space-y-1.5">
        {TA.indicators.map((i) => (
          <div key={i.name} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{i.name}</span>
            <span className="flex items-center gap-2">
              <span className="font-mono font-semibold text-foreground">{i.val}</span>
              <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold", i.sig === "Buy" ? "bg-gain/12 text-gain" : i.sig === "Neutral" ? "bg-muted text-muted-foreground" : "bg-loss/12 text-loss")}>{i.sig}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Market Analysis ---------- */
export function MarketCard() {
  return (
    <div className={cn(card, "w-[300px] max-w-full p-3.5")}>
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary"><BarChart3 className="h-4 w-4" /></span>
        <p className="text-sm font-bold text-foreground">{MARKET.title}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-surface p-2.5">
          <p className="text-[10px] uppercase text-muted-foreground">Total Cap</p>
          <p className="font-mono text-sm font-bold text-foreground">{MARKET.cap}</p>
          <Delta v={MARKET.capChange} />
        </div>
        <div className="rounded-xl bg-surface p-2.5">
          <p className="text-[10px] uppercase text-muted-foreground">Volume</p>
          <p className="font-mono text-sm font-bold text-foreground">{MARKET.vol}</p>
          <span className="text-[11px] font-bold text-primary">{MARKET.sentiment}</span>
        </div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{MARKET.note}</p>
    </div>
  );
}

/* ---------- AI Analysis ---------- */
export function AiCard() {
  return (
    <div className={cn(card, "w-[300px] max-w-full")}>
      <div className="flex items-center justify-between gradient-primary px-3.5 py-2.5 text-primary-foreground">
        <div className="flex items-center gap-2"><Brain className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-wide">AI Analysis</span></div>
        <span className="rounded-lg bg-white/20 px-2 py-0.5 text-[11px] font-extrabold">{AI_ANALYSIS.verdict}</span>
      </div>
      <div className="p-3.5">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="font-semibold text-muted-foreground">{AI_ANALYSIS.pair} · Confidence</span>
          <span className="font-bold text-primary">{AI_ANALYSIS.confidence}%</span>
        </div>
        <ul className="space-y-1.5">
          {AI_ANALYSIS.points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />{p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Economic Calendar ---------- */
export function CalendarCard() {
  const impactCls = CALENDAR.impact === "High" ? "bg-loss/12 text-loss" : "bg-gold/12 text-gold";
  return (
    <div className={cn(card, "w-[300px] max-w-full p-3.5")}>
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary"><CalendarClock className="h-4 w-4" /></span>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">{CALENDAR.event}</p>
          <p className="text-[11px] text-muted-foreground">{CALENDAR.when}</p>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", impactCls)}>{CALENDAR.impact}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-surface p-2 text-center">
          <p className="text-[10px] uppercase text-muted-foreground">Forecast</p>
          <p className="font-mono text-sm font-bold text-foreground">{CALENDAR.forecast}</p>
        </div>
        <div className="rounded-xl bg-surface p-2 text-center">
          <p className="text-[10px] uppercase text-muted-foreground">Previous</p>
          <p className="font-mono text-sm font-bold text-foreground">{CALENDAR.previous}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Exchange Link ---------- */
export function ExchangeCard() {
  return (
    <div className={cn(card, "w-[300px] max-w-full p-3.5")}>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Trade on exchange</p>
      <div className="space-y-1.5">
        {EXCHANGES.map((e) => (
          <button key={e.name} className="flex w-full items-center gap-2.5 rounded-xl bg-surface p-2 text-left transition hover:bg-primary-soft">
            <span className={cn("grid h-8 w-8 place-items-center rounded-lg text-sm", tintBg[e.tint])}>{e.glyph}</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">{e.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{e.pair}</p>
            </div>
            <span className="font-mono text-xs font-bold text-foreground">${fmt(e.price)}</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Watchlist ---------- */
export function WatchlistCard() {
  return (
    <div className={cn(card, "w-[280px] max-w-full p-3.5")}>
      <div className="mb-2 flex items-center gap-2">
        <Star className="h-4 w-4 text-gold" /><p className="text-sm font-bold text-foreground">Watchlist</p>
      </div>
      <div className="space-y-1">
        {WATCHLIST.map((w) => (
          <div key={w.sym} className="flex items-center justify-between rounded-lg px-1.5 py-1.5 hover:bg-surface">
            <span className="font-mono text-xs font-bold text-foreground">{w.sym}</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">${fmt(w.price)}</span>
              <Delta v={w.change} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Coin Comparison ---------- */
export function CompareCard() {
  const rows = [
    { label: "24h", a: `${COMPARE.a.change}%`, b: `${COMPARE.b.change}%` },
    { label: "Mkt Cap", a: COMPARE.a.cap, b: COMPARE.b.cap },
    { label: "Dominance", a: COMPARE.a.dom, b: COMPARE.b.dom },
    { label: "Volume", a: COMPARE.a.vol, b: COMPARE.b.vol },
  ];
  return (
    <div className={cn(card, "w-[300px] max-w-full p-3.5")}>
      <div className="mb-2 grid grid-cols-3 items-center text-center">
        <span className="font-mono text-sm font-extrabold text-primary">{COMPARE.a.sym}</span>
        <span className="text-[11px] font-semibold uppercase text-muted-foreground">vs</span>
        <span className="font-mono text-sm font-extrabold text-gold">{COMPARE.b.sym}</span>
      </div>
      <div className="space-y-1">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-3 items-center rounded-lg px-1 py-1 text-center text-xs hover:bg-surface">
            <span className="font-mono font-semibold text-foreground">{r.a}</span>
            <span className="text-[10px] uppercase text-muted-foreground">{r.label}</span>
            <span className="font-mono font-semibold text-foreground">{r.b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Fear & Greed ---------- */
export function FearGreedCard() {
  const v = FEAR_GREED.value;
  const angle = (v / 100) * 180;
  return (
    <div className={cn(card, "w-[260px] max-w-full p-3.5 text-center")}>
      <div className="mb-1 flex items-center justify-center gap-2">
        <Gauge className="h-4 w-4 text-primary" /><p className="text-sm font-bold text-foreground">Fear &amp; Greed</p>
      </div>
      <div className="relative mx-auto h-16 w-32 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-32 w-32 rounded-full" style={{ background: "conic-gradient(from 270deg, var(--loss), var(--gold), var(--gain))" }} />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-24 w-24 translate-y-0 rounded-full bg-card" style={{ left: 16 }} />
        <div className="absolute bottom-0 left-1/2 h-14 w-0.5 origin-bottom bg-foreground" style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }} />
      </div>
      <p className="font-mono text-2xl font-extrabold text-foreground">{v}</p>
      <p className="text-xs font-bold text-gain">{FEAR_GREED.label}</p>
      <div className="mt-1 flex justify-center gap-3 text-[10px] text-muted-foreground">
        <span>Yesterday {FEAR_GREED.yesterday}</span>
        <span>Week {FEAR_GREED.week}</span>
      </div>
    </div>
  );
}

/* ---------- BTC Dominance ---------- */
export function DominanceCard() {
  return (
    <div className={cn(card, "w-[280px] max-w-full p-3.5")}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">BTC Dominance</p>
        <Delta v={DOMINANCE.change} />
      </div>
      <p className="font-mono text-2xl font-extrabold text-gold">{DOMINANCE.btc}%</p>
      <div className="mt-2 flex h-2.5 overflow-hidden rounded-full">
        <div className="bg-gold" style={{ width: `${DOMINANCE.btc}%` }} />
        <div className="bg-primary" style={{ width: `${DOMINANCE.eth}%` }} />
        <div className="bg-muted-foreground/40" style={{ width: `${DOMINANCE.others}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gold" />BTC</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" />ETH {DOMINANCE.eth}%</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground/40" />Others</span>
      </div>
    </div>
  );
}

/* ---------- Trending ---------- */
export function TrendingCard() {
  return (
    <div className={cn(card, "w-[260px] max-w-full p-3.5")}>
      <div className="mb-2 flex items-center gap-2"><Flame className="h-4 w-4 text-loss" /><p className="text-sm font-bold text-foreground">Trending</p></div>
      <div className="space-y-1">
        {TRENDING.map((t, i) => (
          <div key={t.sym} className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 hover:bg-surface">
            <span className="w-4 text-center font-mono text-xs font-bold text-muted-foreground">{i + 1}</span>
            <span className="flex-1 text-xs font-bold text-foreground">{t.sym} <span className="font-normal text-muted-foreground">{t.name}</span></span>
            <Delta v={t.change} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Gainers / Losers ---------- */
function Movers({ title, data, positive }: { title: string; data: { sym: string; price: number; change: number }[]; positive: boolean }) {
  return (
    <div className={cn(card, "w-[240px] max-w-full p-3.5")}>
      <div className="mb-2 flex items-center gap-2">
        {positive ? <TrendingUp className="h-4 w-4 text-gain" /> : <TrendingDown className="h-4 w-4 text-loss" />}
        <p className="text-sm font-bold text-foreground">{title}</p>
      </div>
      <div className="space-y-1">
        {data.map((d) => (
          <div key={d.sym} className="flex items-center justify-between rounded-lg px-1.5 py-1.5 hover:bg-surface">
            <span className="font-mono text-xs font-bold text-foreground">{d.sym}</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-muted-foreground">${fmt(d.price)}</span>
              <Delta v={d.change} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export function GainersCard() { return <Movers title="Top Gainers" data={GAINERS} positive />; }
export function LosersCard() { return <Movers title="Top Losers" data={LOSERS} positive={false} />; }

/* ---------- Gallery ---------- */
export const CARD_GALLERY: { label: string; node: React.ReactNode }[] = [
  { label: "Cryptocurrency", node: <CoinCard coin={COINS.BTC} /> },
  { label: "Token", node: <CoinCard coin={COINS.SOL} /> },
  { label: "Trading Signal", node: <SignalCard /> },
  { label: "Trade Idea", node: <TradeIdeaCard /> },
  { label: "Profit & Loss", node: <PnlCard /> },
  { label: "Wallet Preview", node: <WalletCard /> },
  { label: "Technical Analysis", node: <TechnicalCard /> },
  { label: "Market Analysis", node: <MarketCard /> },
  { label: "AI Analysis", node: <AiCard /> },
  { label: "Economic Calendar", node: <CalendarCard /> },
  { label: "Exchange Link", node: <ExchangeCard /> },
  { label: "Watchlist", node: <WatchlistCard /> },
  { label: "Coin Comparison", node: <CompareCard /> },
  { label: "Fear & Greed", node: <FearGreedCard /> },
  { label: "BTC Dominance", node: <DominanceCard /> },
  { label: "Trending Coins", node: <TrendingCard /> },
  { label: "Top Gainers", node: <GainersCard /> },
  { label: "Top Losers", node: <LosersCard /> },
];

export { ArrowRight };
