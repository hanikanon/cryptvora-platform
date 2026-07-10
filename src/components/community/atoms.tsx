import { cn } from "@/lib/utils";
import type { Tier } from "./data";

const TIER_RING: Record<Tier, string> = {
  diamond: "ring-primary/70",
  gold: "ring-gold/70",
  silver: "ring-border",
};

const GRADIENTS = [
  "linear-gradient(135deg,oklch(0.62 0.2 292),oklch(0.66 0.18 330))",
  "linear-gradient(135deg,oklch(0.66 0.16 200),oklch(0.62 0.2 260))",
  "linear-gradient(135deg,oklch(0.72 0.15 150),oklch(0.7 0.16 190))",
  "linear-gradient(135deg,oklch(0.78 0.14 80),oklch(0.72 0.16 40))",
  "linear-gradient(135deg,oklch(0.66 0.2 20),oklch(0.66 0.18 350))",
];

function hashIndex(seed: string, mod: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % mod;
}

export function Avatar({
  name,
  size = 40,
  tier,
  status,
  className,
}: {
  name: string;
  size?: number;
  tier?: Tier;
  status?: "online" | "away" | "offline";
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const bg = GRADIENTS[hashIndex(name, GRADIENTS.length)];
  const dot =
    status === "online"
      ? "bg-gain"
      : status === "away"
        ? "bg-gold"
        : "bg-muted-foreground/50";
  return (
    <span className={cn("relative inline-grid shrink-0 place-items-center", className)} style={{ width: size, height: size }}>
      <span
        className={cn(
          "grid h-full w-full place-items-center rounded-full font-semibold text-white",
          tier && "ring-2 ring-offset-2 ring-offset-card",
          tier && TIER_RING[tier],
        )}
        style={{ background: bg, fontSize: size * 0.36 }}
      >
        {initials}
      </span>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-card",
            dot,
          )}
          style={{ width: size * 0.28, height: size * 0.28 }}
        />
      )}
    </span>
  );
}

export function TierChip({ tier }: { tier: Tier }) {
  const map: Record<Tier, { label: string; cls: string }> = {
    diamond: { label: "Diamond", cls: "text-primary bg-primary-soft" },
    gold: { label: "Gold", cls: "text-gold bg-gold/12" },
    silver: { label: "Silver", cls: "text-muted-foreground bg-muted" },
  };
  const m = map[tier];
  return (
    <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide", m.cls)}>
      {m.label}
    </span>
  );
}

export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-2xl gradient-primary shadow-glow"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 6.5C4 5.12 5.12 4 6.5 4h11C18.88 4 20 5.12 20 6.5v7c0 1.38-1.12 2.5-2.5 2.5H10l-4 3.5V16H6.5C5.12 16 4 14.88 4 13.5v-7Z"
          fill="white"
          fillOpacity="0.95"
        />
        <circle cx="9" cy="10" r="1.3" fill="oklch(0.57 0.235 291)" />
        <circle cx="12" cy="10" r="1.3" fill="oklch(0.57 0.235 291)" />
        <circle cx="15" cy="10" r="1.3" fill="oklch(0.57 0.235 291)" />
      </svg>
    </span>
  );
}

export function Sparkline({
  data,
  positive = true,
  width = 96,
  height = 34,
}: {
  data: number[];
  positive?: boolean;
  width?: number;
  height?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((d, i) => [i * step, height - ((d - min) / range) * (height - 4) - 2]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const color = positive ? "var(--gain)" : "var(--loss)";
  const id = `spark-${positive ? "up" : "dn"}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
