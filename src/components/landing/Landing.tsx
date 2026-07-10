import {
  ArrowRight,
  ShieldCheck,
  Zap,
  LineChart as LineIcon,
  Wallet,
  Cable,
  ShieldAlert,
  CalendarDays,
  Newspaper,
  GraduationCap,
  Gift,
  Bot,
  Activity,
  BarChart3,
  Sparkles,
  Layers,
  KeyRound,
  Globe,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Twitter,
  Send,
  Github,
  Check,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ------------------------- Photography constants ---------------------- */
/* Real photographs from Unsplash — trading floors, financial districts.
 * All served with responsive width params for performance. */
const PHOTO = {
  tradingScreens:
    "https://images.unsplash.com/photo-1642790551116-18e150f248e3?auto=format&fit=crop&w=2000&q=80",
  wallStreet:
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=2000&q=80",
  nyseFacade:
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=2000&q=80",
  nyseColumns:
    "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=2000&q=80",
  manhattanNight:
    "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=2000&q=80",
  londonNight:
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=80",
  chartMonitors:
    "https://images.unsplash.com/photo-1620266757065-5814239881fd?auto=format&fit=crop&w=2000&q=80",
  nycSkyline:
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2000&q=80",
  bitcoinFinance:
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=2000&q=80",
  traderDesk:
    "https://images.unsplash.com/photo-1554260570-e9689a3418b8?auto=format&fit=crop&w=2000&q=80",
  cityLights:
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=80",
  manhattan:
    "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=2000&q=80",
};

/* -------------------- Scroll reveal (IntersectionObserver) ------------ */
function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------------------- Lightweight parallax (Y-shift) ----------------- */
function useParallax(ref: React.RefObject<HTMLElement | null>, intensity = 0.25) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const offset = (rect.top - window.innerHeight * 0.5) * intensity;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.12)`;
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, intensity]);
}

/* ------------------------------- Logo --------------------------------- */
function Logo({ size = 30 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
        <rect x="1" y="1" width="38" height="38" rx="10" fill="var(--elevated)" stroke="var(--border)" />
        <path d="M12 26 L17 15 L21 22 L25 12 L30 26" stroke="var(--gain)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="25" cy="12" r="2.4" fill="var(--gold)" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">Cryptvora</span>
    </div>
  );
}

/* ------------------------------- Nav --------------------------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["Platform", "#platform"],
    ["Features", "#features"],
    ["Risk", "#risk"],
    ["Rewards", "#rewards"],
    ["Academy", "#academy"],
    ["FAQ", "#faq"],
  ];
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="text-sm text-muted-foreground transition hover:text-foreground">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="/app"
            className="hidden rounded-lg px-3.5 py-2 text-sm font-medium text-foreground/90 transition hover:bg-elevated sm:inline-flex"
          >
            Sign in
          </a>
          <a
            href="/app"
            className="group inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Get started
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

/* ------------------------- Live ticker strip -------------------------- */
const TICKERS = [
  { s: "BTC", p: "68,412.20", c: +1.42 },
  { s: "ETH", p: "3,584.90", c: +2.11 },
  { s: "SOL", p: "184.32", c: +4.67 },
  { s: "BNB", p: "612.05", c: -0.82 },
  { s: "XRP", p: "0.5423", c: +0.31 },
  { s: "ADA", p: "0.4712", c: -1.14 },
  { s: "AVAX", p: "38.10", c: +3.02 },
  { s: "DOGE", p: "0.1584", c: +0.94 },
  { s: "LINK", p: "18.47", c: +1.55 },
  { s: "TON", p: "6.82", c: -0.44 },
  { s: "MATIC", p: "0.7211", c: +2.28 },
  { s: "DOT", p: "7.34", c: -0.62 },
];
function Ticker() {
  const row = [...TICKERS, ...TICKERS];
  return (
    <div className="relative overflow-hidden border-y border-border bg-panel/60 py-2.5">
      <div className="flex animate-ticker gap-8 whitespace-nowrap">
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-[13px]">
            <span className="font-semibold tracking-wide">{t.s}</span>
            <span className="font-mono text-muted-foreground">${t.p}</span>
            <span className={`font-mono ${t.c >= 0 ? "text-gain" : "text-loss"}`}>
              {t.c >= 0 ? "+" : ""}
              {t.c.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------- Mock chart / dashboard ------------------------ */
function AreaChart() {
  // Deterministic pseudo-random path
  const pts: number[] = [];
  let v = 60;
  for (let i = 0; i < 60; i++) {
    v += Math.sin(i / 3) * 3 + Math.cos(i / 7) * 4 + (i % 5 === 0 ? 2 : -1);
    pts.push(Math.max(20, Math.min(140, v + 40)));
  }
  const w = 600;
  const h = 180;
  const step = w / (pts.length - 1);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(h - p).toFixed(1)}`).join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
      <defs>
        <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.17 155)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="oklch(0.78 0.17 155)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" x2={w} y1={(h / 4) * i + 20} y2={(h / 4) * i + 20} stroke="oklch(1 0 0 / 0.05)" />
      ))}
      <path d={area} fill="url(#lg)" />
      <path d={path} fill="none" stroke="oklch(0.78 0.17 155)" strokeWidth="2" />
    </svg>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />
      <div className="panel-card overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border bg-elevated/40 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-loss/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-gain/70" />
          </div>
          <div className="hidden items-center gap-1.5 rounded-md border border-gain/25 bg-gain/[0.06] px-2 py-0.5 text-[10px] text-gain sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gain" />
            Markets Open · Real-time
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">cryptvora.app/dashboard</span>
        </div>

        <div className="grid gap-3 p-3 md:grid-cols-[1fr_180px]">
          {/* Main */}
          <div className="space-y-3">
            {/* KPI row */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { l: "Portfolio", v: "$124,586", d: "+8.42%", up: true },
                { l: "24h PnL", v: "+$3,241", d: "+2.68%", up: true },
                { l: "Win rate", v: "68.4%", d: "+1.2%", up: true },
                { l: "Exposure", v: "42%", d: "Low", up: true },
              ].map((k) => (
                <div key={k.l} className="rounded-lg border border-border bg-elevated/40 p-2.5">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{k.l}</div>
                  <div className="mt-1 font-mono text-sm font-semibold">{k.v}</div>
                  <div className={`mt-0.5 text-[10px] ${k.up ? "text-gain" : "text-loss"}`}>{k.d}</div>
                </div>
              ))}
            </div>

            {/* Chart card */}
            <div className="rounded-lg border border-border bg-elevated/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-muted-foreground">BTC / USDT · 1H</div>
                  <div className="font-mono text-lg font-semibold">
                    68,412.20 <span className="text-gain text-xs">+1.42%</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {["1H", "4H", "1D", "1W"].map((t, i) => (
                    <span
                      key={t}
                      className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                        i === 1 ? "bg-primary/20 text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="h-32">
                <AreaChart />
              </div>
            </div>

            {/* Positions */}
            <div className="rounded-lg border border-border bg-elevated/30">
              <div className="border-b border-border px-3 py-2 text-[11px] font-semibold text-muted-foreground">
                Open positions
              </div>
              <div className="divide-y divide-border text-[11px]">
                {[
                  { s: "ETH/USDT", side: "LONG", size: "2.4", pnl: "+$412", up: true },
                  { s: "SOL/USDT", side: "LONG", size: "18", pnl: "+$96", up: true },
                  { s: "BNB/USDT", side: "SHORT", size: "3", pnl: "-$28", up: false },
                ].map((p) => (
                  <div key={p.s} className="grid grid-cols-4 items-center px-3 py-1.5 font-mono">
                    <span>{p.s}</span>
                    <span className={p.side === "LONG" ? "text-gain" : "text-loss"}>{p.side}</span>
                    <span className="text-muted-foreground">{p.size}</span>
                    <span className={`text-right ${p.up ? "text-gain" : "text-loss"}`}>{p.pnl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="hidden space-y-3 md:block">
            <div className="rounded-lg border border-border bg-elevated/40 p-3">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Risk score</div>
              <div className="mt-2 flex items-end gap-1">
                <span className="font-mono text-2xl font-bold text-gain">A+</span>
                <span className="mb-1 text-[10px] text-muted-foreground">low exposure</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-elevated">
                <div className="h-full w-[24%] bg-gain" />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-elevated/40 p-3">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Allocation</div>
              <div className="mt-2 flex h-2 overflow-hidden rounded-full">
                <span className="bg-gain" style={{ width: "42%" }} />
                <span className="bg-gold" style={{ width: "26%" }} />
                <span className="bg-cyan" style={{ width: "18%" }} />
                <span className="bg-muted-foreground/60" style={{ width: "14%" }} />
              </div>
              <div className="mt-2 space-y-1 font-mono text-[10px] text-muted-foreground">
                <div className="flex justify-between"><span>BTC</span><span>42%</span></div>
                <div className="flex justify-between"><span>ETH</span><span>26%</span></div>
                <div className="flex justify-between"><span>SOL</span><span>18%</span></div>
                <div className="flex justify-between"><span>Others</span><span>14%</span></div>
              </div>
            </div>
            <div className="rounded-lg border border-gain/25 bg-gain/[0.05] p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gain">
                <Bot className="h-3 w-3" /> Bot · Active
              </div>
              <div className="mt-1 font-mono text-[11px] text-foreground/80">Grid · ETH/USDT</div>
              <div className="font-mono text-[10px] text-muted-foreground">7d ROI · +6.8%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute -left-4 top-24 hidden animate-float rounded-xl border border-border bg-panel/90 p-3 shadow-xl backdrop-blur lg:block">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gain/15 text-gain">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Risk alert</div>
            <div className="text-xs font-semibold">Stop-loss triggered · saved 2.1%</div>
          </div>
        </div>
      </div>
      <div
        className="absolute -right-4 bottom-16 hidden animate-float rounded-xl border border-border bg-panel/90 p-3 shadow-xl backdrop-blur lg:block"
        style={{ animationDelay: "1.2s" }}
      >
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gold/15 text-gold">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Signal</div>
            <div className="text-xs font-semibold">SOL breakout · 15m confirmed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Hero -------------------------------- */
function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  useParallax(bgRef, 0.15);
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-20 lg:pt-40 lg:pb-32">
      {/* Photographic backdrop — real trading floor */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-20 will-change-transform animate-kenburns"
        style={{
          backgroundImage: `url(${PHOTO.tradingScreens})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 photo-veil" aria-hidden />
      <div className="absolute inset-0 -z-10 hero-vignette" aria-hidden />
      <div className="absolute inset-0 -z-10 grid-lines opacity-70" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-panel/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gain" />
              Trusted by 128,000+ traders across 92 countries
            </div>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl [text-shadow:0_2px_20px_oklch(0_0_0/0.4)]">
              The command center for
              <br />
              <span className="bg-gradient-to-r from-[oklch(0.78_0.17_155)] via-[oklch(0.83_0.14_88)] to-[oklch(0.78_0.13_200)] bg-clip-text text-transparent">
                serious crypto traders.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Cryptvora unifies every exchange you use into one institutional-grade workspace — real-time markets,
              portfolio analytics, automated risk management, and a professional trading terminal.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="/app"
                className="btn-premium group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                Start trading free
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="/app"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel/60 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-elevated"
              >
                Sign in
              </a>
              <a
                href="#platform"
                className="inline-flex items-center gap-1.5 px-2 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                See the platform <ChevronDown className="h-4 w-4" />
              </a>
            </div>

            {/* mini trust row */}
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
              {[
                { k: "$4.2B+", v: "Volume analyzed" },
                { k: "12+", v: "Exchanges connected" },
                { k: "99.98%", v: "Uptime SLA" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-mono text-xl font-bold text-foreground">{s.k}</div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Exchanges row --------------------------- */
const EXCHANGES = ["Binance", "Bybit", "OKX", "Coinbase", "Kraken", "Bitget", "KuCoin", "Gate.io", "MEXC", "HTX"];
function ExchangesRow() {
  return (
    <section className="border-y border-border bg-panel/40 py-10">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Connect your accounts · read-only API keys
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {EXCHANGES.map((n) => (
            <span
              key={n}
              className="text-lg font-semibold tracking-tight text-muted-foreground/80 transition hover:text-foreground hover:-translate-y-0.5"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------- Global markets — photo parallax band ------------- */
function GlobalMarkets() {
  const bg = useRef<HTMLDivElement>(null);
  useParallax(bg, 0.18);
  return (
    <section className="relative isolate overflow-hidden py-28">
      <div
        ref={bg}
        className="absolute inset-0 -z-20 will-change-transform"
        style={{
          backgroundImage: `url(${PHOTO.wallStreet})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.16 0.006 265 / 0.92) 0%, oklch(0.16 0.006 265 / 0.75) 40%, oklch(0.16 0.006 265 / 0.92) 100%)",
        }}
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-panel/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Globe className="h-3.5 w-3.5 text-cyan" /> One workspace · every market
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl [text-shadow:0_2px_24px_oklch(0_0_0/0.55)]">
            From Wall Street to Wan Chai —
            <br />
            <span className="bg-gradient-to-r from-[oklch(0.83_0.14_88)] via-[oklch(0.78_0.17_155)] to-[oklch(0.78_0.13_200)] bg-clip-text text-transparent">
              your desk, in one screen.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Cryptvora streams live order books, prices and portfolio state from every exchange you connect — with the
            latency, uptime and discipline institutional desks demand.
          </p>
        </div>

        <div className="reveal reveal-delay-1 mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "9ms", v: "Median tick latency", i: Zap },
            { k: "24 / 7", v: "Server-side execution", i: ShieldCheck },
            { k: "128,000+", v: "Active traders", i: Activity },
            { k: "92", v: "Countries served", i: Globe },
          ].map(({ k, v, i: Ic }) => (
            <div key={v} className="luxury-card p-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-elevated text-primary">
                <Ic className="h-5 w-5" />
              </div>
              <div className="mt-4 font-mono text-3xl font-bold">{k}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Cinematic skyline divider band ----------------- */
function SkylineDivider() {
  const bg = useRef<HTMLDivElement>(null);
  useParallax(bg, 0.2);
  return (
    <section className="relative isolate h-[420px] overflow-hidden">
      <div
        ref={bg}
        className="absolute inset-0 -z-20 will-change-transform"
        style={{
          backgroundImage: `url(${PHOTO.manhattanNight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.16 0.006 265) 0%, oklch(0.16 0.006 265 / 0.35) 40%, oklch(0.16 0.006 265 / 0.35) 60%, oklch(0.16 0.006 265) 100%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex h-full max-w-5xl items-center justify-center px-4 text-center">
        <div className="reveal">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">
            Built for the professional
          </p>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground/90 sm:text-3xl [text-shadow:0_2px_24px_oklch(0_0_0/0.7)]">
            "The discipline of an institutional desk,
            <br className="hidden sm:block" /> the agility of a solo trader."
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Features ----------------------------- */
const FEATURES = [
  { icon: Wallet, title: "Unified Portfolio", desc: "Aggregate balances, PnL, ROI and allocation across every connected exchange in a single view." },
  { icon: LineIcon, title: "Live Markets", desc: "Real-time prices, heatmaps, movers and depth for thousands of pairs — with sub-second updates." },
  { icon: Activity, title: "Trading Terminal", desc: "Pro-grade terminal with advanced order types, hotkeys, DOM ladders and multi-chart layouts." },
  { icon: Cable, title: "Exchange Sync", desc: "Connect via secure read-only or trade-enabled API keys. IP-whitelisted and end-to-end encrypted." },
  { icon: ShieldAlert, title: "Risk Management", desc: "Automated stop-loss, exposure limits, drawdown alerts and per-position risk scoring." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Win rate, monthly ROI, weekly heatmaps, volume flow and daily calendars — always in context." },
  { icon: CalendarDays, title: "Economic Calendar", desc: "Macro events, token unlocks, listings and earnings — filtered to what actually moves markets." },
  { icon: Newspaper, title: "Curated News", desc: "Signal over noise. Sentiment-scored headlines from vetted sources, in your terminal." },
  { icon: GraduationCap, title: "Cryptvora Academy", desc: "Structured courses on price action, risk sizing, futures and on-chain reading — beginner to pro." },
  { icon: Bot, title: "Automated Bots", desc: "Deploy grid, DCA and signal bots with backtests, live PnL and one-click risk kill-switches." },
  { icon: KeyRound, title: "API Center", desc: "Programmatic access to your data and execution. Rotate keys, scope permissions, audit logs." },
  { icon: Gift, title: "Referral Program", desc: "Multi-tier rewards, revenue share and level-based perks that scale with your community." },
];
function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-panel/60 px-3 py-1 text-xs text-muted-foreground">
            <Layers className="h-3.5 w-3.5" /> One platform · every workflow
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything a modern trader needs, in one place.
          </h2>
          <p className="mt-3 text-muted-foreground">
            From portfolio aggregation to execution and risk — Cryptvora replaces a dozen tabs with a single,
            institutional-grade workspace.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden panel-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/0 blur-2xl transition group-hover:bg-primary/10" />
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-elevated text-primary ring-1 ring-border">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Platform preview ------------------------- */
function PlatformSection() {
  return (
    <section id="platform" className="relative border-y border-border bg-panel/30 py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-cyan" /> The Cryptvora terminal
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              A terminal built by traders,
              <br />
              <span className="text-primary">for the way markets actually move.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Multi-exchange charts, order flow, position management and analytics — laid out so decisions take seconds,
              not tabs. Every panel is composable, keyboard-driven and tuned for latency.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Advanced orders: OCO, trailing stop, iceberg, TWAP",
                "Multi-account switching with unified PnL",
                "Depth of market, footprint and volume profile",
                "Hotkeys and command palette for every action",
                "Institutional-grade market data with <100ms latency",
              ].map((l) => (
                <li key={l} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gain" />
                  <span className="text-foreground/85">{l}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/app"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                Open the terminal <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-5 py-3 text-sm font-semibold hover:bg-elevated"
              >
                Explore features
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[2rem] bg-cyan/10 blur-3xl" />
            <div className="panel-card overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1642790551116-18e150f248e3?auto=format&fit=crop&w=1400&q=80"
                alt="Real-time market screens on a professional trading desk"
                className="h-[420px] w-full object-cover opacity-90"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ How it works ------------------------- */
const STEPS = [
  { n: "01", icon: KeyRound, t: "Create your account", d: "Sign up in seconds. No setup fees, no credit card. Verify your email and you're in." },
  { n: "02", icon: Cable, t: "Connect your exchanges", d: "Link Binance, Bybit, OKX and 9 more via encrypted API keys. Read-only or trade-enabled — you choose." },
  { n: "03", icon: BarChart3, t: "Analyze everything", d: "Unified portfolio, live charts, risk scoring and analytics start populating instantly." },
  { n: "04", icon: Zap, t: "Trade & automate", d: "Execute from the terminal or deploy bots. Every action is guarded by your risk rules." },
];
function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">From signup to first trade in under 5 minutes.</h2>
          <p className="mt-3 text-muted-foreground">A workflow designed for professionals, accessible to beginners.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative panel-card p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-4 text-base font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
              {i < STEPS.length - 1 && (
                <div className="pointer-events-none absolute right-[-10px] top-1/2 hidden -translate-y-1/2 text-primary/40 lg:block">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Risk section -------------------------- */
function RiskSection() {
  const bg = useRef<HTMLDivElement>(null);
  useParallax(bg, 0.12);
  return (
    <section id="risk" className="relative isolate overflow-hidden py-24">
      <div
        ref={bg}
        className="absolute inset-0 -z-20 will-change-transform opacity-40"
        style={{
          backgroundImage: `url(${PHOTO.chartMonitors})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 photo-veil" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="reveal grid items-center gap-14 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-loss/10 blur-3xl" />
              <div className="luxury-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Portfolio risk score</div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-mono text-4xl font-bold text-gain">A+</span>
                      <span className="text-xs text-muted-foreground">/ low exposure</span>
                    </div>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gain/15 text-gain">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-elevated">
                  <div className="h-full w-[22%] bg-gradient-to-r from-gain to-cyan" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { l: "Max drawdown", v: "-4.2%", ok: true },
                    { l: "Exposure", v: "42%", ok: true },
                    { l: "Leverage avg", v: "1.8x", ok: true },
                    { l: "Correlation", v: "0.31", ok: true },
                  ].map((k) => (
                    <div key={k.l} className="rounded-lg border border-border bg-elevated/40 p-3">
                      <div className="text-[10px] uppercase text-muted-foreground">{k.l}</div>
                      <div className={`mt-1 font-mono text-lg ${k.ok ? "text-foreground" : "text-loss"}`}>{k.v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-gain/25 bg-gain/[0.06] p-3 text-[12px]">
                  <div className="flex items-center gap-2 text-gain">
                    <ShieldCheck className="h-4 w-4" /> Auto stop-loss on ETH/USDT triggered · saved 2.1% drawdown
                  </div>
                </div>
                <div className="mt-2 rounded-lg border border-gold/25 bg-gold/[0.05] p-3 text-[12px]">
                  <div className="flex items-center gap-2 text-gold">
                    <Sparkles className="h-4 w-4" /> Exposure to alt-L1s exceeds 30% — rebalance suggested
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-loss/30 bg-loss/[0.08] px-3 py-1 text-xs text-loss">
              <ShieldAlert className="h-3.5 w-3.5" /> Risk management
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Discipline, automated.
              <br />
              <span className="text-loss/90">Because the market never forgets.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Cryptvora scores every position and every portfolio in real-time — then enforces the rules you set.
              Stop-losses, exposure caps, drawdown circuit breakers and correlation alerts run 24/7 on your behalf.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { i: ShieldCheck, t: "Automated stop-loss", d: "Server-side execution — no reliance on a browser tab." },
                { i: TrendingDown, t: "Drawdown circuit breaker", d: "Halt new orders after your daily loss limit." },
                { i: Layers, t: "Exposure limits", d: "Per-asset, per-sector and per-exchange caps." },
                { i: Activity, t: "Real-time risk score", d: "A+ to F rating, updated every tick." },
              ].map((x) => (
                <div key={x.t} className="flex items-start gap-3 rounded-lg border border-border bg-panel/50 p-3.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-elevated text-primary">
                    <x.i className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{x.t}</div>
                    <div className="text-xs text-muted-foreground">{x.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Analytics stats -------------------------- */
function AnalyticsSection() {
  const bars = [40, 65, 48, 78, 55, 82, 70, 90, 68, 96, 74, 88];
  return (
    <section className="border-y border-border bg-panel/30 py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5 text-gold" /> Analytics that answer questions
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Know exactly what's working — and what isn't.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Win rate by pair, monthly ROI, weekly performance heatmaps, volume flow and PnL attribution. Cryptvora
              turns raw trades into a feedback loop that makes you better.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { k: "68.4%", v: "Win rate" },
                { k: "+24.6%", v: "Monthly ROI" },
                { k: "1.92", v: "Sharpe" },
                { k: "-4.2%", v: "Max DD" },
              ].map((s) => (
                <div key={s.v} className="rounded-lg border border-border bg-background/60 p-3">
                  <div className="font-mono text-xl font-bold">{s.k}</div>
                  <div className="text-[11px] uppercase text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Monthly ROI · 2025</div>
                <div className="font-mono text-2xl font-bold text-gain">+24.6%</div>
              </div>
              <div className="rounded-md border border-gain/25 bg-gain/[0.06] px-2 py-1 text-[10px] text-gain">
                <TrendingUp className="mr-1 inline h-3 w-3" /> outperforming BTC by +8.4%
              </div>
            </div>
            <div className="flex h-40 items-end gap-2">
              {bars.map((b, i) => (
                <div key={i} className="flex-1">
                  <div
                    className="rounded-t-sm bg-gradient-to-t from-primary/40 to-primary transition-all"
                    style={{ height: `${b}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
              {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => {
                const v = (Math.sin(i * 1.3) + Math.cos(i * 0.7)) * 0.5 + 0.5;
                const cls =
                  v > 0.75
                    ? "bg-gain"
                    : v > 0.55
                      ? "bg-gain/60"
                      : v > 0.4
                        ? "bg-gain/30"
                        : v > 0.25
                          ? "bg-loss/40"
                          : "bg-loss/70";
                return <div key={i} className={`h-6 rounded-sm ${cls}`} />;
              })}
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground">Daily PnL heatmap · last 5 weeks</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Rewards / levels ------------------------- */
const LEVELS = [
  { name: "Trader", perk: "10% referral rebate", vol: "$0+", color: "muted-foreground" },
  { name: "Silver", perk: "20% rebate · priority support", vol: "$50k", color: "cyan" },
  { name: "Gold", perk: "30% rebate · custom risk rules", vol: "$250k", color: "gold" },
  { name: "Diamond", perk: "40% rebate · dedicated PM · API boost", vol: "$1M+", color: "primary" },
];
function RewardsSection() {
  return (
    <section id="rewards" className="py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.06] px-3 py-1 text-xs text-gold">
            <Gift className="h-3.5 w-3.5" /> Levels & rewards
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Trade more. Earn more. Unlock more.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every trade progresses your Cryptvora level — unlocking better rebates, deeper analytics and multi-tier
            referral revenue share.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {LEVELS.map((lvl, i) => (
            <div
              key={lvl.name}
              className={`relative luxury-card p-6 ${
                i === 3 ? "border-primary/50 ring-1 ring-primary/30" : ""
              }`}
            >
              {i === 3 && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                  ELITE
                </span>
              )}
              <div className={`text-[11px] uppercase tracking-[0.2em] text-${lvl.color}`}>{lvl.name}</div>
              <div className="mt-3 font-mono text-2xl font-bold">{lvl.vol}</div>
              <div className="text-[11px] text-muted-foreground">30-day volume</div>
              <div className="my-4 h-px bg-border" />
              <p className="text-sm text-foreground/80">{lvl.perk}</p>
              <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex gap-1.5"><Check className="h-3.5 w-3.5 text-gain" /> Full analytics suite</li>
                <li className="flex gap-1.5"><Check className="h-3.5 w-3.5 text-gain" /> All exchanges connected</li>
                <li className="flex gap-1.5"><Check className="h-3.5 w-3.5 text-gain" /> Multi-tier referrals</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Academy section ------------------------- */
function AcademySection() {
  return (
    <section id="academy" className="border-y border-border bg-panel/30 py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gold/10 blur-3xl" />
            <div className="luxury-card img-hover-zoom overflow-hidden">
              <img
                src={PHOTO.traderDesk}
                alt="Professional trader analyzing multi-screen market data"
                className="h-[380px] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5 text-gold" /> Cryptvora Academy
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Learn from traders who actually trade.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Structured tracks on price action, risk sizing, futures, on-chain reading and market microstructure —
              taught by working traders, updated with real market events.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { t: "Foundations", d: "12 modules · beginner" },
                { t: "Risk & sizing", d: "8 modules · intermediate" },
                { t: "Futures & leverage", d: "10 modules · advanced" },
                { t: "On-chain reading", d: "6 modules · advanced" },
              ].map((c) => (
                <div key={c.t} className="rounded-lg border border-border bg-background/60 p-3.5">
                  <div className="text-sm font-semibold">{c.t}</div>
                  <div className="text-[11px] text-muted-foreground">{c.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Testimonials --------------------------- */
const TESTIMONIALS = [
  {
    q: "I replaced 6 open tabs with Cryptvora. The unified PnL alone paid for itself in a week.",
    n: "Marcus Weber",
    r: "Prop trader · Zurich",
  },
  {
    q: "The automated risk rules kept me alive during the March flash crash. That's not marketing — that's a fact.",
    n: "Priya S.",
    r: "Full-time trader · Singapore",
  },
  {
    q: "Cleanest terminal I've used since leaving the sell-side. The keyboard flow is genuinely institutional.",
    n: "David Karlsson",
    r: "Former FX desk · Stockholm",
  },
  {
    q: "The analytics finally told me why my strategy leaks money on Wednesdays. Fixed it in one week.",
    n: "Ana Ribeiro",
    r: "Quant hobbyist · Lisbon",
  },
];
function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Trusted by traders who take this seriously.</h2>
          <p className="mt-3 text-muted-foreground">
            From prop desks to serious retail — Cryptvora is where they trade.
          </p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure key={t.n} className="panel-card p-6 transition hover:border-primary/40">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground/90">"{t.q}"</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-elevated font-semibold text-primary">
                  {t.n.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- FAQ --------------------------------- */
const FAQS = [
  {
    q: "Is Cryptvora a custodian? Do you hold my funds?",
    a: "No. Cryptvora is non-custodial. Your funds stay on your exchanges. We connect via secure API keys — you can use read-only mode to only see analytics, or trade-enabled mode to execute from our terminal.",
  },
  {
    q: "Which exchanges are supported?",
    a: "Binance, Bybit, OKX, Coinbase, Kraken, Bitget, KuCoin, Gate.io, MEXC, HTX and more. New integrations ship monthly.",
  },
  {
    q: "How are my API keys protected?",
    a: "Keys are encrypted at rest with AES-256, scoped to the minimum permissions required, and can be IP-whitelisted. You can rotate or revoke any key at any time from the API Center.",
  },
  {
    q: "Do I need to be a professional trader to use Cryptvora?",
    a: "No. Beginners start with a unified portfolio view and Academy. Advanced traders unlock the terminal, bots and risk automation. The platform grows with you.",
  },
  {
    q: "How does the risk management system actually work?",
    a: "You define rules — stop-loss thresholds, exposure caps, daily loss limits — and Cryptvora enforces them server-side, 24/7. It doesn't matter if your browser is closed or your laptop is off.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Portfolio tracking, markets, news and Academy foundations are free forever. Advanced execution, bots and premium analytics unlock as you level up.",
  },
];
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-y border-border bg-panel/30 py-24">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked</h2>
          <p className="mt-3 text-muted-foreground">Straight answers on security, pricing and how the platform works.</p>
        </div>
        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="panel-card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-elevated/30"
                >
                  <span className="text-[15px] font-semibold">{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="animate-fade-up px-5 pb-5 text-sm text-muted-foreground">{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- CTA -------------------------------- */
function CTA() {
  const bg = useRef<HTMLDivElement>(null);
  useParallax(bg, 0.14);
  return (
    <section id="signup" className="relative isolate overflow-hidden py-28">
      <div
        ref={bg}
        className="absolute inset-0 -z-20 will-change-transform"
        style={{
          backgroundImage: `url(${PHOTO.londonNight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 photo-veil" aria-hidden />
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-panel/90 via-panel/80 to-elevated/80 p-10 text-center backdrop-blur-xl sm:p-16">
          <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
          <div className="relative">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Free forever plan · no credit card
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl [text-shadow:0_2px_20px_oklch(0_0_0/0.5)]">
              Ready to trade like a pro?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join 128,000+ traders using Cryptvora to unify their exchanges, master their risk and grow their edge.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/app"
                className="btn-premium group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-primary-foreground"
              >
                Create your account
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="/app"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/40 px-6 py-3.5 text-sm font-semibold hover:bg-elevated"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Footer ------------------------------- */
function Footer() {
  const cols = [
    { h: "Platform", l: ["Dashboard", "Portfolio", "Markets", "Trading Terminal", "Exchanges", "Risk Management"] },
    { h: "Resources", l: ["Academy", "News", "Economic Calendar", "API Docs", "Status", "Blog"] },
    { h: "Company", l: ["About", "Careers", "Press", "Security", "Contact", "Referral Program"] },
    { h: "Legal", l: ["Terms of Service", "Privacy Policy", "Cookies", "Risk Disclosure", "Compliance"] },
  ];
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The institutional-grade trading intelligence platform for professional and serious retail traders.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Twitter, Send, Github, Globe].map((Ic, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-panel/60 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  <Ic className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{c.h}</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {c.l.map((x) => (
                  <li key={x}>
                    <a href="#" className="text-foreground/75 transition hover:text-foreground">
                      {x}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} Cryptvora. All rights reserved.</div>
          <div className="text-center sm:text-right">
            Cryptocurrency trading involves significant risk. Past performance does not guarantee future results.
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------- Landing ------------------------------ */
export function Landing() {
  useScrollReveal();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="pt-16">
        <Hero />
        <Ticker />
        <ExchangesRow />
        <GlobalMarkets />
        <Features />
        <PlatformSection />
        <HowItWorks />
        <RiskSection />
        <AnalyticsSection />
        <SkylineDivider />
        <RewardsSection />
        <AcademySection />
        <Testimonials />
        <Faq />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}