import { Panel, PanelHeader, Chip } from "@/components/ui/panel";
import { ProgressRing } from "@/components/charts";
import { TierBadge } from "@/components/tier-badge";
import {
  CAPITAL_TIERS,
  getCapitalTier,
  getActivityLevel,
  ACTIVITY_REWARDS,
  WEEKLY_QUESTS,
} from "@/lib/tiers";
import { useI18n } from "@/lib/i18n";
import { Flame, Sparkles, TrendingUp, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

function fmt$(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

export function CapitalLevelCard({ capital }: { capital: number }) {
  const { current, next, progress } = getCapitalTier(capital);
  const { t, lang } = useI18n();
  const name = lang === "ar" ? current.nameAr : current.name;
  const nextName = next ? (lang === "ar" ? next.nameAr : next.name) : null;
  return (
    <Panel className="overflow-hidden">
      <PanelHeader
        title={t("levels.capital")}
        subtitle={fmt$(capital)}
        icon={<TrendingUp className="h-4 w-4" style={{ color: current.color }} />}
        action={<Chip tone="gold">{name}</Chip>}
      />
      <div className="flex items-center gap-4 p-4">
        <TierBadge tier={current} size={72} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-lg font-semibold text-foreground">{name}</p>
            {nextName && (
              <span className="text-[10px] text-muted-foreground">
                → {nextName} · {next && fmt$(next.min)}
              </span>
            )}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress * 100}%`, background: current.gradient }}
            />
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {next
              ? `${(progress * 100).toFixed(0)}% ${t("levels.progressToNext")}`
              : "Max tier reached"}
          </p>
        </div>
      </div>
    </Panel>
  );
}

export function ActivityLevelCard({ xp, streak = 7 }: { xp: number; streak?: number }) {
  const { level, currentThreshold, nextThreshold, progress } = getActivityLevel(xp);
  const { t } = useI18n();
  const upcoming = ACTIVITY_REWARDS.find((r) => r.level > level);
  return (
    <Panel className="overflow-hidden">
      <PanelHeader
        title={t("levels.activity")}
        subtitle={`${xp} ${t("levels.xp")}`}
        icon={<Sparkles className="h-4 w-4 text-cyan" />}
        action={
          <span className="inline-flex items-center gap-1 rounded-md bg-loss/12 px-1.5 py-0.5 text-[10px] font-semibold text-loss">
            <Flame className="h-3 w-3" />{streak}d
          </span>
        }
      />
      <div className="flex items-center gap-4 p-4">
        <ProgressRing value={Math.round(progress * 100)} color="var(--cyan)" label={`Lv ${level}`} size={104} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-muted-foreground">
            {t("levels.level")} <span className="font-semibold text-foreground">{level}</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {xp - currentThreshold} / {nextThreshold - currentThreshold} XP → Lv {level + 1}
          </p>
          {upcoming && (
            <div className="mt-2 rounded-md border border-border bg-elevated/50 p-2">
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{t("levels.rewards")}</p>
              <p className="mt-0.5 text-[11px] font-medium text-foreground">
                Lv {upcoming.level} · {upcoming.label}
              </p>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

export function CapitalLadder({ capital }: { capital: number }) {
  const { index } = getCapitalTier(capital);
  const { t, lang } = useI18n();
  return (
    <Panel>
      <PanelHeader
        title={t("profile.tierLadder")}
        subtitle="10 tiers · Bronze → Immortal"
        icon={<Trophy className="h-4 w-4 text-gold" />}
      />
      <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-5">
        {CAPITAL_TIERS.map((tier, i) => {
          const active = i <= index;
          const isCurrent = i === index;
          const name = lang === "ar" ? tier.nameAr : tier.name;
          return (
            <div
              key={tier.key}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-xl border p-3 transition",
                isCurrent ? "border-transparent bg-elevated/70" : "border-border/60",
                !active && "opacity-55",
              )}
              style={
                isCurrent
                  ? { boxShadow: `0 0 0 1px ${tier.color}88, ${tier.glow}` }
                  : undefined
              }
            >
              <TierBadge tier={tier} size={isCurrent ? 56 : 46} dim={!active} />
              <p className="text-[12px] font-semibold text-foreground">{name}</p>
              <p className="text-[10px] text-muted-foreground">${(tier.min / 1000).toFixed(0)}k+</p>
              {isCurrent && (
                <span className="absolute right-2 top-2 rounded-md bg-gold/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gold">
                  {t("levels.current")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export function ActivityPanel({ xp }: { xp: number }) {
  const { level, currentThreshold, nextThreshold, progress } = getActivityLevel(xp);
  const { t, lang } = useI18n();
  return (
    <Panel>
      <PanelHeader
        title={t("profile.activityPanel")}
        subtitle={`${xp} XP · Level ${level}`}
        icon={<Sparkles className="h-4 w-4 text-cyan" />}
      />
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div className="flex items-center gap-4">
          <ProgressRing value={Math.round(progress * 100)} color="var(--cyan)" label={`Lv ${level}`} size={140} />
          <div>
            <p className="text-[11px] text-muted-foreground">{t("levels.progressToNext")}</p>
            <p className="mt-1 text-lg font-semibold text-foreground tnum">
              {xp - currentThreshold} / {nextThreshold - currentThreshold}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">XP to Level {level + 1}</p>
          </div>
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("levels.quests")}
          </p>
          <ul className="space-y-2">
            {WEEKLY_QUESTS.map((q, i) => {
              // deterministic pseudo-progress
              const done = Math.min(q.target, ((i * 3 + 2) % (q.target + 1)));
              const pct = (done / q.target) * 100;
              return (
                <li key={q.id} className="rounded-md border border-border bg-elevated/40 p-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-foreground">{lang === "ar" ? q.labelAr : q.label}</span>
                    <span className="tnum text-cyan">+{q.xp} XP</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-cyan" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-0.5 text-[9px] text-muted-foreground tnum">{done}/{q.target}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Panel>
  );
}