import { cn } from "@/lib/utils";
import type { AnyTier } from "@/lib/tiers";
import { BadgeSVG } from "@/lib/badge-svg";

/**
 * Wrapper that adds hover-lift, aura, dim (locked), and float animation
 * around the pure <BadgeSVG /> renderer.
 */
export function TierBadge({
  tier,
  size = 64,
  dim = false,
  float = false,
  className,
}: {
  tier: AnyTier;
  size?: number;
  dim?: boolean;
  float?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group/badge relative grid place-items-center transition-transform duration-300",
        !dim && "hover:scale-110",
        float && "badge-float",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {!dim && (
        <div
          aria-hidden
          className="absolute inset-[8%] rounded-full opacity-70 blur-xl transition-opacity duration-300 group-hover/badge:opacity-100"
          style={{
            background: `radial-gradient(circle, ${tier.color}66 0%, ${tier.color}22 55%, transparent 75%)`,
          }}
        />
      )}
      <div
        className={cn(
          "relative transition-all duration-300",
          dim && "opacity-45 saturate-0 blur-[1px]",
        )}
      >
        <BadgeSVG tier={tier} size={size} animated={!dim} />
      </div>
    </div>
  );
}
