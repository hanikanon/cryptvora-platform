import { useState } from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type RiskRules = {
  maxDailyLoss: number;
  maxMonthlyLoss: number;
  maxRiskPerTrade: number;
  maxConcurrent: number;
};

export type RiskUsage = {
  dailyLoss: number;
  monthlyLoss: number;
  lastRiskPct: number;
  openPositions: number;
  winRateRecent: number;
};

const DEFAULT_RULES: RiskRules = {
  maxDailyLoss: 3,
  maxMonthlyLoss: 10,
  maxRiskPerTrade: 1.5,
  maxConcurrent: 4,
};

export function RiskRulesPanel({ usage }: { usage: RiskUsage }) {
  const { t } = useI18n();
  const [rules, setRules] = useState<RiskRules>(DEFAULT_RULES);

  const rows = [
    { key: "maxDailyLoss", label: t("risk.maxDaily"), suffix: "%", used: usage.dailyLoss, limit: rules.maxDailyLoss },
    { key: "maxMonthlyLoss", label: t("risk.maxMonthly"), suffix: "%", used: usage.monthlyLoss, limit: rules.maxMonthlyLoss },
    { key: "maxRiskPerTrade", label: t("risk.maxRisk"), suffix: "%", used: usage.lastRiskPct, limit: rules.maxRiskPerTrade },
    { key: "maxConcurrent", label: t("risk.maxPos"), suffix: "", used: usage.openPositions, limit: rules.maxConcurrent },
  ] as const;

  return (
    <Panel>
      <PanelHeader
        title={t("risk.rules")}
        subtitle={t("risk.rules.desc")}
        icon={<ShieldCheck className="h-4 w-4 text-gain" />}
      />
      <div className="space-y-3 p-4">
        {rows.map((r) => {
          const pct = Math.min(100, (r.used / r.limit) * 100);
          const breach = r.used >= r.limit;
          const warn = !breach && pct >= 75;
          const color = breach ? "var(--loss)" : warn ? "var(--gold)" : "var(--gain)";
          return (
            <div key={r.key}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-foreground">{r.label}</span>
                <span className={cn("tnum font-semibold", breach ? "text-loss" : warn ? "text-gold" : "text-muted-foreground")}>
                  {r.used}{r.suffix} / {r.limit}{r.suffix}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          );
        })}

        <details className="mt-2 rounded-md border border-border bg-elevated/30 p-2 text-[11px]">
          <summary className="cursor-pointer text-muted-foreground">Edit limits</summary>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(Object.keys(rules) as (keyof RiskRules)[]).map((k) => (
              <label key={k} className="text-[10px] text-muted-foreground">
                {k}
                <input
                  type="number"
                  value={rules[k]}
                  step="0.5"
                  onChange={(e) => setRules({ ...rules, [k]: +e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-input px-2 py-1 text-[11px] text-foreground"
                />
              </label>
            ))}
          </div>
        </details>
      </div>
    </Panel>
  );
}

export function SmartRecommendations({ usage, rules = DEFAULT_RULES }: { usage: RiskUsage; rules?: RiskRules }) {
  const { t } = useI18n();
  const alerts: { tone: "loss" | "gold"; msg: string }[] = [];
  if (usage.dailyLoss >= rules.maxDailyLoss) alerts.push({ tone: "loss", msg: "Daily loss limit breached — stop trading for today." });
  else if (usage.dailyLoss >= rules.maxDailyLoss * 0.75)
    alerts.push({ tone: "gold", msg: "You're near your daily loss limit — reduce size." });
  if (usage.monthlyLoss >= rules.maxMonthlyLoss)
    alerts.push({ tone: "loss", msg: "Monthly drawdown exceeded — pause and review your plan." });
  if (usage.lastRiskPct > rules.maxRiskPerTrade)
    alerts.push({ tone: "gold", msg: `Last trade risked ${usage.lastRiskPct}% — above your ${rules.maxRiskPerTrade}% cap.` });
  if (usage.openPositions > rules.maxConcurrent)
    alerts.push({ tone: "gold", msg: `${usage.openPositions} open positions — cap is ${rules.maxConcurrent}.` });
  if (usage.winRateRecent < 40)
    alerts.push({ tone: "gold", msg: `Recent win rate ${usage.winRateRecent}% — consider journaling and reducing size.` });

  return (
    <Panel>
      <PanelHeader
        title={t("risk.recos")}
        subtitle={alerts.length ? `${alerts.length} alerts` : "All clear"}
        icon={<ShieldAlert className="h-4 w-4 text-gold" />}
      />
      <ul className="divide-y divide-border/60">
        {alerts.length === 0 ? (
          <li className="flex items-center gap-2 p-4 text-[12px] text-gain">
            <CheckCircle2 className="h-4 w-4" /> {t("risk.allGood")}
          </li>
        ) : (
          alerts.map((a, i) => (
            <li key={i} className="flex items-start gap-2 p-3 text-[12px]">
              <AlertTriangle className={cn("mt-0.5 h-4 w-4 shrink-0", a.tone === "loss" ? "text-loss" : "text-gold")} />
              <span className="text-foreground">{a.msg}</span>
            </li>
          ))
        )}
      </ul>
    </Panel>
  );
}