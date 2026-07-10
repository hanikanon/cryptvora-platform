import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Check,
  GraduationCap,
  Send,
  Sparkles,
  Users,
  Gift,
  TrendingUp,
  Activity,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Panel, PanelHeader, Chip } from "@/components/ui/panel";
import { ProgressRing } from "@/components/charts";
import { TierBadge } from "@/components/tier-badge";
import { LevelProgress } from "@/components/level-progress";
import {
  CAPITAL_TIERS,
  TRADER_TIERS,
  getCapitalTier,
  getTraderTier,
  fmtCapital,
  fmtXP,
  type AnyTier,
} from "@/lib/tiers";
import { useI18n } from "@/lib/i18n";
import { useUnlockCelebration } from "@/components/unlock-celebration";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Cryptvora" },
      { name: "description", content: "Trader profile with dual 20-tier progression: Portfolio and Trader tracks." },
      { property: "og:title", content: "Trader Profile — Cryptvora" },
      { property: "og:description", content: "Dual-track progression across 40 luxury tiers." },
    ],
  }),
  component: ProfilePage,
});

const DEMO_CAPITAL = 68_000;
const DEMO_XP = 6_800;

const academy = [
  { title: "Crypto Fundamentals", done: true },
  { title: "Technical Analysis 101", done: true },
  { title: "Risk & Position Sizing", done: true },
  { title: "Futures & Leverage", done: false },
  { title: "Advanced Order Flow", done: false },
];

function ProfilePage() {
  const { t, lang } = useI18n();
  const { celebrate } = useUnlockCelebration();
  const cap = getCapitalTier(DEMO_CAPITAL);
  const trd = getTraderTier(DEMO_XP);

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        {/* Hero */}
        <Panel className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background: `radial-gradient(620px 240px at 15% 15%, ${cap.current.color}33, transparent 60%), radial-gradient(520px 220px at 92% 85%, ${trd.current.color}44, transparent 60%)`,
            }}
          />
          <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <TierBadge tier={cap.current} size={96} float />
              <div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-gold" /> {t("profile.title")}
                </div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  hanibadji
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
                  <Send className="h-3.5 w-3.5 text-cyan" />
                  @hanibadji · Telegram verified
                  <Chip tone="gain">Active</Chip>
                  <Chip tone="gold">
                    {lang === "ar" ? cap.current.nameAr : cap.current.name}
                  </Chip>
                </div>
              </div>
            </div>

            <a
              href="https://t.me/CryptvoraBot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 px-4 py-2.5 text-[12px] font-semibold text-cyan transition hover:bg-cyan/20"
            >
              <Send className="h-4 w-4" />
              Manage via Crypto Bot
            </a>
          </div>
        </Panel>

        {/* Dual-track progression */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TrackPanel
            icon={<TrendingUp className="h-4 w-4" style={{ color: cap.current.color }} />}
            title={t("levels.portfolio")}
            subtitle={t("levels.portfolioDesc")}
            tiers={CAPITAL_TIERS as AnyTier[]}
            state={cap}
            value={DEMO_CAPITAL}
            fmt={fmtCapital}
            onCelebrate={celebrate}
          />
          <TrackPanel
            icon={<Activity className="h-4 w-4" style={{ color: trd.current.color }} />}
            title={t("levels.trader")}
            subtitle={t("levels.traderDesc")}
            tiers={TRADER_TIERS as AnyTier[]}
            state={trd}
            value={DEMO_XP}
            fmt={fmtXP}
            onCelebrate={celebrate}
          />
        </div>

        {/* Referral + rewards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2">
            <PanelHeader
              title="Referral Statistics"
              subtitle="Invite via your Telegram link"
              icon={<Users className="h-4 w-4 text-cyan" />}
            />
            <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
              <MiniStat label="Total Referrals" value="248" tone="cyan" />
              <MiniStat label="Active Traders" value="176" tone="gain" />
              <MiniStat label="Commission" value="$12,480" tone="gold" />
              <MiniStat label="This Month" value="$1,920" tone="gain" />
            </div>
            <div className="border-t border-border p-4">
              <p className="mb-2 text-[11px] text-muted-foreground">Your referral link</p>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-2">
                <code className="flex-1 truncate text-[11px] text-foreground">
                  https://t.me/CryptvoraBot?start=ref_hanibadji
                </code>
                <button className="rounded-md bg-gradient-to-r from-gold to-cyan px-3 py-1 text-[11px] font-semibold text-[color:var(--background)]">
                  Copy
                </button>
              </div>
            </div>
          </Panel>

          <Panel className="flex flex-col items-center justify-center gap-2 p-5">
            <p className="text-[13px] font-semibold text-foreground">Rewards Earned</p>
            <ProgressRing value={74} color="var(--gold)" label="Claimed" size={160} />
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Gift className="h-3.5 w-3.5 text-gold" />
              3 rewards available
            </div>
          </Panel>
        </div>

        {/* Academy */}
        <Panel>
          <PanelHeader
            title="Completed Academy"
            subtitle="3 of 5 modules complete"
            icon={<GraduationCap className="h-4 w-4 text-gain" />}
          />
          <ul className="divide-y divide-border/60">
            {academy.map((m, i) => (
              <li key={i} className="flex items-center justify-between px-4 py-3 text-[12px]">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full",
                      m.done ? "bg-gain/15 text-gain" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {m.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className={m.done ? "text-foreground" : "text-muted-foreground"}>{m.title}</span>
                </div>
                <Chip tone={m.done ? "gain" : "muted"}>{m.done ? "Completed" : "Locked"}</Chip>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */

function TrackPanel({
  icon, title, subtitle, tiers, state, value, fmt, onCelebrate,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tiers: AnyTier[];
  state: { current: AnyTier; next?: AnyTier; index: number; progress: number; remaining: number };
  value: number;
  fmt: (n: number) => string;
  onCelebrate: (t: AnyTier) => void;
}) {
  const { t, lang } = useI18n();
  const { current, next, index, progress, remaining } = state;
  const name = lang === "ar" ? current.nameAr : current.name;

  return (
    <Panel className="relative overflow-hidden">
      <PanelHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        action={<Chip tone="gold">{fmt(value)} · {name}</Chip>}
      />

      <div className="relative flex flex-col items-center gap-4 border-b border-border/60 px-5 pb-6 pt-4 md:flex-row md:gap-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-70"
          style={{ background: `radial-gradient(500px 160px at 50% 0%, ${current.color}22, transparent 70%)` }}
        />
        <TierBadge tier={current} size={112} float />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-xl font-semibold tracking-tight md:text-2xl" style={{ color: current.color }}>
                {name}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {lang === "ar" ? current.taglineAr : current.tagline}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <LevelProgress
              tier={current}
              next={next}
              value={value}
              progress={progress}
              remaining={remaining}
              format={fmt}
            />
          </div>
        </div>
      </div>

      {/* Horizontal 20-tier rail */}
      <div className="relative overflow-x-auto px-5 pb-6 pt-6 [scrollbar-width:thin]">
        <div className="relative min-w-max">
          <div className="absolute left-8 right-8 top-[46px] h-[2px] rounded bg-border" />
          <div
            className="absolute left-8 top-[46px] h-[2px] rounded transition-all"
            style={{
              width: `calc((100% - 64px) * ${(index + progress) / (tiers.length - 1)})`,
              background: `linear-gradient(90deg, ${tiers[0].color}, ${current.color}, ${tiers[tiers.length - 1].color})`,
              boxShadow: `0 0 12px ${current.color}88`,
            }}
          />
          <ol className="relative z-10 flex items-start gap-4 md:gap-6">
            {tiers.map((tier, i) => {
              const active = i <= index;
              const isCurrent = i === index;
              return (
                <li key={tier.key} className="flex w-[72px] shrink-0 flex-col items-center gap-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => onCelebrate(tier)}
                    className={cn(
                      "rounded-full p-1 transition focus:outline-none",
                      isCurrent && "ring-2 ring-offset-2 ring-offset-background",
                    )}
                    style={isCurrent ? { boxShadow: tier.glow, ["--tw-ring-color" as never]: tier.color } : undefined}
                  >
                    <TierBadge tier={tier} size={isCurrent ? 68 : 48} dim={!active} float={isCurrent} />
                  </button>
                  <span
                    className={cn("text-[10px] font-semibold leading-tight", active ? "text-foreground" : "text-muted-foreground")}
                    style={isCurrent ? { color: tier.color } : undefined}
                  >
                    {lang === "ar" ? tier.nameAr : tier.name}
                  </span>
                  <span className="text-[9px] text-muted-foreground tnum">{fmt(tier.min)}+</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {next && (
        <div className="border-t border-border/60 p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <Gift className="h-3 w-3" style={{ color: next.color }} />
            {t("levels.nextRewards")}
          </div>
          <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
            {(lang === "ar" ? next.rewardsAr : next.rewards).map((r) => (
              <li key={r} className="flex items-center gap-1.5 text-[11px] text-foreground/90">
                <span className="h-1 w-1 rounded-full" style={{ background: next.color }} />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}

function MiniStat({
  label, value, tone,
}: { label: string; value: string; tone?: "gain" | "cyan" | "gold" }) {
  return (
    <div className="rounded-lg border border-border bg-elevated/40 p-3">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-lg font-semibold tnum",
          tone === "gain" && "text-gain",
          tone === "cyan" && "text-cyan",
          tone === "gold" && "text-gold",
        )}
      >
        {value}
      </p>
    </div>
  );
}
