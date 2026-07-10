import type { AnyTier } from "@/lib/tiers";
import { cn } from "@/lib/utils";

/**
 * Premium animated progress bar with shine sweep + tier gradient.
 */
export function LevelProgress({
  tier,
  next,
  value,
  format = (n) => String(Math.round(n)),
  progress,
  remaining,
  labelCurrent,
  labelNext,
  className,
}: {
  tier: AnyTier;
  next?: AnyTier;
  value: number;
  format?: (n: number) => string;
  progress: number;
  remaining: number;
  labelCurrent?: string;
  labelNext?: string;
  className?: string;
}) {
  const pct = Math.round(progress * 100);
  const target = next ? next.min : tier.min;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between text-[11px]">
        <span className="font-semibold text-foreground tnum">
          {labelCurrent ?? tier.name}
        </span>
        {next && (
          <span className="text-muted-foreground tnum">
            → {labelNext ?? next.name}
          </span>
        )}
      </div>

      <div className="mt-1 flex items-baseline justify-between text-[12px]">
        <span className="tnum font-bold text-foreground">
          {format(value)} <span className="text-muted-foreground font-normal">/ {format(target)}</span>
        </span>
        <span className="tnum font-bold" style={{ color: tier.color }}>
          {pct}%
        </span>
      </div>

      <div className="progress-track mt-2 h-3.5 rounded-full">
        <div
          className="progress-fill relative h-full rounded-full"
          style={{
            width: `${Math.max(3, pct)}%`,
            background: tier.gradient,
            boxShadow: `0 0 14px -2px ${tier.color}aa, inset 0 1px 0 rgba(255,255,255,0.35)`,
          }}
        >
          <span aria-hidden className="progress-shine" />
        </div>
      </div>

      {next && (
        <p className="mt-1.5 text-end text-[10px] text-muted-foreground tnum">
          {format(remaining)} remaining
        </p>
      )}
    </div>
  );
}
