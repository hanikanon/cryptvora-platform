import { memo } from "react";
import type { AnyTier, CapitalTierKey, TraderTierKey } from "./tiers";

/**
 * Premium inline SVG badge renderer — one canonical design per tier key,
 * used everywhere on the platform (Profile / Levels / Leaderboards / header).
 *
 *  Portfolio track — heraldic luxury:
 *    Bracket 1  Metallic shield + gem      (bronze..diamond)
 *    Bracket 2  Laurel medallion + rays    (master..immortal)
 *    Bracket 3  Winged crest + crown       (titan..eternal)
 *    Bracket 4  Cosmic orb + orbital rings (cosmic..genesis)
 *  Every tier layers unique ornaments (extra gems, crown spires, wing spans,
 *  prismatic bursts) so no two tiers look alike.
 *
 *  Trader track — AAA military ranks (original, not derivative of any game):
 *    Bracket 1  Chevron rank patch     (beginner..professional)
 *    Bracket 2  Crossed swords + star  (elite..master)
 *    Bracket 3  Eagle wings + stars    (grandmaster..immortal)
 *    Bracket 4  Crown of stars + wings (supreme..legend)
 *  Each of the 20 trader tiers gets a unique combination of ornaments —
 *  stripes, stars, wreaths, wings, eagles — growing in prestige.
 *
 *  All pure SVG. Gradients + filters. GPU-only animations.
 */
export const BadgeSVG = memo(function BadgeSVG({
  tier,
  size = 96,
  animated = true,
}: {
  tier: AnyTier;
  size?: number;
  animated?: boolean;
}) {
  const id = `bd-${tier.track}-${tier.key}`;
  const legendary = tier.bracket === 4;
  const showAnim = animated || legendary;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label={`${tier.name} badge`}
      className="select-none overflow-visible"
      style={{ filter: `drop-shadow(0 8px 22px ${tier.color}66)` }}
    >
      <BadgeDefs id={id} tier={tier} legendary={legendary} />

      {/* aura */}
      <circle cx="100" cy="100" r="96" fill={`url(#${id}-aura)`} />

      {legendary && (
        <g opacity="0.85" filter={`url(#${id}-glow)`}>
          <ellipse cx="100" cy="100" rx="88" ry="30" fill="none" stroke={tier.color} strokeWidth="1.4" opacity="0.55" transform="rotate(-20 100 100)" />
          <ellipse cx="100" cy="100" rx="92" ry="24" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.35" transform="rotate(35 100 100)" />
          {showAnim && (
            <>
              <circle r="2.8" fill="#ffffff">
                <animateMotion dur="6s" repeatCount="indefinite"
                  path="M 100 100 m -88 0 a 88 30 -20 1 0 176 0 a 88 30 -20 1 0 -176 0" />
              </circle>
              <circle r="2" fill={tier.color}>
                <animateMotion dur="9s" repeatCount="indefinite"
                  path="M 100 100 m -92 0 a 92 24 35 1 0 184 0 a 92 24 35 1 0 -184 0" />
              </circle>
            </>
          )}
        </g>
      )}

      {tier.track === "capital" ? (
        <CapitalBadge tierKey={tier.key as CapitalTierKey} id={id} tier={tier} />
      ) : (
        <TraderBadge tierKey={tier.key as TraderTierKey} id={id} tier={tier} />
      )}
    </svg>
  );
});

/* ================================================================== */
/*  Shared defs                                                        */
/* ================================================================== */

function BadgeDefs({ id, tier, legendary }: { id: string; tier: AnyTier; legendary: boolean }) {
  return (
    <defs>
      <radialGradient id={`${id}-core`} cx="50%" cy="42%" r="65%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="38%" stopColor={tier.color} />
        <stop offset="100%" stopColor={tier.color2} />
      </radialGradient>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="35%" stopColor={tier.color} />
        <stop offset="100%" stopColor={tier.color2} />
      </linearGradient>
      <linearGradient id={`${id}-metal2`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={tier.color} />
        <stop offset="55%" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="100%" stopColor={tier.color2} />
      </linearGradient>
      <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="45%" stopColor="#ffffff" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}-aura`} cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor={tier.color} stopOpacity="0.55" />
        <stop offset="65%" stopColor={tier.color} stopOpacity="0.1" />
        <stop offset="100%" stopColor={tier.color} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-gem`} cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor={tier.color} />
        <stop offset="100%" stopColor={tier.color2} />
      </radialGradient>
      <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation={legendary ? 4 : 2.2} result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={`${id}-inner`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.2" />
      </filter>
    </defs>
  );
}

/* ================================================================== */
/*  Portfolio (Capital) badges — 20 unique heraldic designs            */
/* ================================================================== */

function CapitalBadge({ tierKey, id, tier }: { tierKey: CapitalTierKey; id: string; tier: AnyTier }) {
  // Bracket 1: heraldic shield with progressively richer engraving
  if (tier.bracket === 1) return <HeraldicShield id={id} tier={tier} tierKey={tierKey} />;
  // Bracket 2: laurel medallion
  if (tier.bracket === 2) return <LaurelMedallion id={id} tier={tier} tierKey={tierKey} />;
  // Bracket 3: winged crest
  if (tier.bracket === 3) return <WingedCrest id={id} tier={tier} tierKey={tierKey} />;
  // Bracket 4: cosmic orb
  return <CosmicOrb id={id} tier={tier} tierKey={tierKey} />;
}

function HeraldicShield({ id, tier, tierKey }: { id: string; tier: AnyTier; tierKey: CapitalTierKey }) {
  // Per-tier ornaments
  const ornaments: Record<string, { crown: number; sideJewels: number; centerGem: "none" | "round" | "diamond" | "star" }> = {
    bronze:   { crown: 0, sideJewels: 0, centerGem: "none" },
    silver:   { crown: 0, sideJewels: 0, centerGem: "round" },
    gold:     { crown: 1, sideJewels: 0, centerGem: "diamond" },
    platinum: { crown: 1, sideJewels: 2, centerGem: "diamond" },
    diamond:  { crown: 2, sideJewels: 2, centerGem: "star" },
  };
  const orn = ornaments[tierKey] || ornaments.bronze;

  return (
    <g filter={`url(#${id}-glow)`}>
      {/* outer decorative frame */}
      <path
        d="M100 18 L168 40 V96 C168 134 136 162 100 178 C64 162 32 134 32 96 V40 Z"
        fill={`url(#${id}-metal)`}
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="2"
      />
      {/* inner shield */}
      <path
        d="M100 30 L156 48 V96 C156 128 130 152 100 166 C70 152 44 128 44 96 V48 Z"
        fill={`url(#${id}-core)`}
        stroke={tier.color2}
        strokeOpacity="0.6"
        strokeWidth="1"
      />
      {/* engraved bevel */}
      <path
        d="M100 40 L146 54 V96 C146 122 124 144 100 156 C76 144 54 122 54 96 V54 Z"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="0.8"
      />
      {/* shine */}
      <path
        d="M100 30 L156 48 V90 C156 108 148 122 136 132 L100 108 Z"
        fill={`url(#${id}-shine)`}
        opacity="0.55"
      />
      {/* central chevron stack */}
      <path d="M100 66 L128 96 L114 96 L100 82 L86 96 L72 96 Z" fill="#ffffff" fillOpacity="0.95" />
      <path d="M100 96 L124 122 L112 122 L100 110 L88 122 L76 122 Z" fill="#ffffff" fillOpacity="0.7" />

      {/* center gem */}
      {orn.centerGem === "round" && <circle cx="100" cy="130" r="7" fill={`url(#${id}-gem)`} stroke="#ffffff" strokeWidth="1" />}
      {orn.centerGem === "diamond" && (
        <>
          <path d="M100 122 L112 132 L100 144 L88 132 Z" fill={`url(#${id}-gem)`} stroke="#ffffff" strokeWidth="1" />
          <path d="M100 122 L100 144 M88 132 L112 132" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.5" />
        </>
      )}
      {orn.centerGem === "star" && (
        <path
          d="M100 118 L104 130 L116 130 L106 138 L110 150 L100 142 L90 150 L94 138 L84 130 L96 130 Z"
          fill={`url(#${id}-gem)`}
          stroke="#ffffff"
          strokeWidth="0.9"
        />
      )}

      {/* side jewels */}
      {orn.sideJewels > 0 && (
        <>
          <circle cx="60" cy="70" r="3.2" fill={tier.color} stroke="#ffffff" strokeWidth="0.7" />
          <circle cx="140" cy="70" r="3.2" fill={tier.color} stroke="#ffffff" strokeWidth="0.7" />
        </>
      )}
      {orn.sideJewels > 1 && (
        <>
          <circle cx="66" cy="118" r="2.6" fill={tier.color} />
          <circle cx="134" cy="118" r="2.6" fill={tier.color} />
        </>
      )}

      {/* crown notches on top */}
      {orn.crown >= 1 && (
        <path
          d="M64 40 L74 24 L86 38 L100 20 L114 38 L126 24 L136 40 Z"
          fill={`url(#${id}-metal)`}
          stroke="#ffffff"
          strokeOpacity="0.7"
          strokeWidth="1"
        />
      )}
      {orn.crown >= 2 && (
        <>
          <circle cx="74" cy="26" r="2.6" fill={tier.color} stroke="#ffffff" strokeWidth="0.6" />
          <circle cx="126" cy="26" r="2.6" fill={tier.color} stroke="#ffffff" strokeWidth="0.6" />
          <circle cx="100" cy="20" r="3.2" fill={`url(#${id}-gem)`} stroke="#ffffff" strokeWidth="0.8" />
        </>
      )}
    </g>
  );
}

function LaurelMedallion({ id, tier, tierKey }: { id: string; tier: AnyTier; tierKey: CapitalTierKey }) {
  const ornaments: Record<string, { rays: number; laurels: boolean; crown: number; gemPoints: number }> = {
    master:      { rays: 16, laurels: true,  crown: 0, gemPoints: 4 },
    grandmaster: { rays: 20, laurels: true,  crown: 1, gemPoints: 4 },
    legend:      { rays: 24, laurels: true,  crown: 1, gemPoints: 6 },
    mythic:      { rays: 28, laurels: true,  crown: 2, gemPoints: 6 },
    immortal:    { rays: 32, laurels: true,  crown: 2, gemPoints: 8 },
  };
  const orn = ornaments[tierKey] || ornaments.master;

  return (
    <g filter={`url(#${id}-glow)`}>
      {/* rays */}
      <g opacity="0.55">
        {Array.from({ length: orn.rays }).map((_, i) => (
          <rect
            key={i}
            x="99"
            y="18"
            width="2"
            height="24"
            fill={tier.color}
            opacity={i % 2 === 0 ? 0.75 : 0.35}
            transform={`rotate(${(i * 360) / orn.rays} 100 100)`}
          />
        ))}
      </g>
      {/* outer metal ring */}
      <circle cx="100" cy="100" r="72" fill="none" stroke={`url(#${id}-metal)`} strokeWidth="7" />
      <circle cx="100" cy="100" r="72" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
      {/* laurels */}
      {orn.laurels && (
        <>
          <path d="M40 108 C50 148 82 168 100 168 C118 168 150 148 160 108" fill="none" stroke={tier.color} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
          {[-42, -28, -14, 14, 28, 42].map((deg) => (
            <ellipse
              key={deg}
              cx={100 + Math.sin((deg * Math.PI) / 180) * 66}
              cy={100 + Math.cos((deg * Math.PI) / 180) * 66}
              rx="6.5"
              ry="11"
              fill={`url(#${id}-metal2)`}
              opacity="0.95"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}
        </>
      )}
      {/* medallion core */}
      <circle cx="100" cy="100" r="48" fill={`url(#${id}-core)`} stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="36" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="0.8" />
      {/* central gemstone star */}
      <g>
        <path
          d="M100 74 L108 94 L130 94 L112 106 L120 128 L100 114 L80 128 L88 106 L70 94 L92 94 Z"
          fill={`url(#${id}-gem)`}
          stroke="#ffffff"
          strokeOpacity="0.85"
          strokeWidth="1"
        />
        <circle cx="100" cy="102" r="4" fill="#ffffff" opacity="0.8" />
      </g>
      {/* orbit gem points */}
      {Array.from({ length: orn.gemPoints }).map((_, i) => {
        const a = (i / orn.gemPoints) * Math.PI * 2 - Math.PI / 2;
        const x = 100 + Math.cos(a) * 82;
        const y = 100 + Math.sin(a) * 82;
        return <circle key={i} cx={x} cy={y} r="3.4" fill={tier.color} stroke="#ffffff" strokeWidth="0.8" />;
      })}
      {/* crown on top */}
      {orn.crown >= 1 && (
        <path
          d="M68 34 L80 20 L92 32 L100 14 L108 32 L120 20 L132 34 Z"
          fill={`url(#${id}-metal)`}
          stroke="#ffffff"
          strokeOpacity="0.75"
          strokeWidth="1"
        />
      )}
      {orn.crown >= 2 && (
        <>
          <circle cx="80" cy="22" r="2.8" fill={tier.color} stroke="#ffffff" strokeWidth="0.6" />
          <circle cx="120" cy="22" r="2.8" fill={tier.color} stroke="#ffffff" strokeWidth="0.6" />
          <circle cx="100" cy="16" r="3.4" fill={`url(#${id}-gem)`} stroke="#ffffff" strokeWidth="0.8" />
        </>
      )}
    </g>
  );
}

function WingedCrest({ id, tier, tierKey }: { id: string; tier: AnyTier; tierKey: CapitalTierKey }) {
  const ornaments: Record<string, { wings: number; crown: number; jewels: number; halo: boolean }> = {
    titan:     { wings: 4, crown: 1, jewels: 2, halo: false },
    celestial: { wings: 5, crown: 1, jewels: 4, halo: true  },
    sovereign: { wings: 5, crown: 2, jewels: 4, halo: true  },
    ascendant: { wings: 6, crown: 2, jewels: 6, halo: true  },
    eternal:   { wings: 7, crown: 3, jewels: 8, halo: true  },
  };
  const orn = ornaments[tierKey] || ornaments.titan;

  return (
    <g filter={`url(#${id}-glow)`}>
      {orn.halo && (
        <circle cx="100" cy="100" r="88" fill="none" stroke={tier.color} strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="2 5" />
      )}
      {/* wings */}
      <g opacity="0.95">
        <path
          d="M100 100 C68 82 40 88 16 108 C46 100 72 108 96 122 Z"
          fill={`url(#${id}-metal)`}
          stroke="#ffffff"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        <path
          d="M100 100 C132 82 160 88 184 108 C154 100 128 108 104 122 Z"
          fill={`url(#${id}-metal)`}
          stroke="#ffffff"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        {Array.from({ length: orn.wings }).map((_, i) => (
          <g key={i} opacity="0.65">
            <path d={`M${88 - i * 12} ${102 + i * 3} L${60 - i * 10} ${100 + i * 5}`} stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.9" />
            <path d={`M${112 + i * 12} ${102 + i * 3} L${140 + i * 10} ${100 + i * 5}`} stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.9" />
          </g>
        ))}
      </g>
      {/* central crest */}
      <path
        d="M100 44 L138 60 V104 C138 130 120 148 100 158 C80 148 62 130 62 104 V60 Z"
        fill={`url(#${id}-core)`}
        stroke="#ffffff"
        strokeOpacity="0.6"
        strokeWidth="1.4"
      />
      <path
        d="M100 44 L138 60 V96 C138 112 130 124 118 132 L100 116 Z"
        fill={`url(#${id}-shine)`}
        opacity="0.55"
      />
      {/* diamond gem */}
      <path d="M100 70 L124 100 L100 134 L76 100 Z" fill={`url(#${id}-gem)`} stroke="#ffffff" strokeOpacity="0.9" strokeWidth="1" />
      <path d="M100 70 L100 134 M76 100 L124 100" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.6" />
      <circle cx="100" cy="100" r="4" fill="#ffffff" opacity="0.85" />
      {/* crown */}
      {orn.crown >= 1 && (
        <path
          d="M72 48 L82 30 L92 44 L100 26 L108 44 L118 30 L128 48 Z"
          fill={`url(#${id}-metal)`}
          stroke="#ffffff"
          strokeOpacity="0.75"
          strokeWidth="1"
        />
      )}
      {orn.crown >= 2 && (
        <>
          <circle cx="82" cy="32" r="2.6" fill={tier.color} stroke="#ffffff" strokeWidth="0.6" />
          <circle cx="118" cy="32" r="2.6" fill={tier.color} stroke="#ffffff" strokeWidth="0.6" />
          <circle cx="100" cy="28" r="3.2" fill={`url(#${id}-gem)`} stroke="#ffffff" strokeWidth="0.8" />
        </>
      )}
      {orn.crown >= 3 && (
        <path d="M60 50 L100 12 L140 50" fill="none" stroke={tier.color} strokeOpacity="0.6" strokeWidth="1" />
      )}
      {/* jewels on wings */}
      {orn.jewels > 0 &&
        Array.from({ length: orn.jewels }).map((_, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          const row = Math.floor(i / 2);
          const x = 100 + side * (46 + row * 14);
          const y = 108 + row * 6;
          return <circle key={i} cx={x} cy={y} r="2.6" fill={tier.color} stroke="#ffffff" strokeWidth="0.6" />;
        })}
    </g>
  );
}

function CosmicOrb({ id, tier, tierKey }: { id: string; tier: AnyTier; tierKey: CapitalTierKey }) {
  const ornaments: Record<string, { runes: number; beams: number; crownSpires: number; prism: boolean }> = {
    cosmic:     { runes: 6,  beams: 0,  crownSpires: 5, prism: false },
    universal:  { runes: 8,  beams: 12, crownSpires: 5, prism: false },
    infinity:   { runes: 10, beams: 12, crownSpires: 7, prism: false },
    omniversal: { runes: 12, beams: 16, crownSpires: 7, prism: true  },
    genesis:    { runes: 12, beams: 20, crownSpires: 9, prism: true  },
  };
  const orn = ornaments[tierKey] || ornaments.cosmic;

  return (
    <g filter={`url(#${id}-glow)`}>
      {/* celestial crown */}
      <path
        d={crownPath(orn.crownSpires)}
        fill={`url(#${id}-metal)`}
        stroke="#ffffff"
        strokeOpacity="0.65"
        strokeWidth="1"
      />
      {Array.from({ length: orn.crownSpires }).map((_, i) => {
        const step = 160 / (orn.crownSpires - 1);
        return (
          <circle
            key={i}
            cx={20 + i * step}
            cy={i === Math.floor(orn.crownSpires / 2) ? 32 : 44}
            r={i === Math.floor(orn.crownSpires / 2) ? 3.6 : 2.6}
            fill={tier.color}
            stroke="#ffffff"
            strokeWidth="0.7"
          />
        );
      })}
      {/* orb */}
      <circle cx="100" cy="118" r="54" fill={`url(#${id}-core)`} stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.6" />
      <ellipse cx="100" cy="118" rx="50" ry="18" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="0.8" transform="rotate(-15 100 118)" />
      <ellipse cx="100" cy="118" rx="48" ry="14" fill="none" stroke={tier.color} strokeOpacity="0.8" strokeWidth="0.9" transform="rotate(28 100 118)" />
      {/* nucleus */}
      <circle cx="100" cy="118" r="14" fill="#ffffff" opacity="0.9" />
      <circle cx="100" cy="118" r="7" fill={tier.color} />
      {/* highlight */}
      <ellipse cx="84" cy="98" rx="18" ry="8" fill="#ffffff" opacity="0.35" transform="rotate(-25 84 98)" />
      {/* runes */}
      {Array.from({ length: orn.runes }).map((_, i) => {
        const a = (i / orn.runes) * Math.PI * 2 - Math.PI / 2;
        const x = 100 + Math.cos(a) * 68;
        const y = 118 + Math.sin(a) * 68;
        return (
          <path
            key={i}
            d={`M${x} ${y - 4} L${x + 4} ${y} L${x} ${y + 4} L${x - 4} ${y} Z`}
            fill={tier.color}
            stroke="#ffffff"
            strokeWidth="0.7"
          />
        );
      })}
      {/* beams */}
      {orn.beams > 0 && (
        <g opacity="0.85">
          {Array.from({ length: orn.beams }).map((_, i) => {
            const a = (i / orn.beams) * Math.PI * 2;
            const x1 = 100 + Math.cos(a) * 76;
            const y1 = 118 + Math.sin(a) * 76;
            const x2 = 100 + Math.cos(a) * 84;
            const y2 = 118 + Math.sin(a) * 84;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={tier.color} strokeWidth="1.2" />;
          })}
        </g>
      )}
      {/* prismatic star burst */}
      {orn.prism && (
        <g>
          {Array.from({ length: 8 }).map((_, i) => (
            <path
              key={i}
              d="M100 118 L100 26 L104 100 Z"
              fill={`url(#${id}-shine)`}
              opacity="0.5"
              transform={`rotate(${i * 45} 100 118)`}
            />
          ))}
          <circle cx="100" cy="118" r="4" fill="#ffffff" />
        </g>
      )}
    </g>
  );
}

function crownPath(spires: number) {
  const step = 160 / (spires - 1);
  const points: [number, number][] = [];
  points.push([20, 60]);
  for (let i = 0; i < spires; i++) {
    const cx = 20 + i * step;
    const midIndex = Math.floor(spires / 2);
    const peak = i === midIndex ? 22 : 34;
    points.push([cx - step / 3, 50]);
    points.push([cx, peak]);
  }
  points.push([180, 60]);
  return "M" + points.map(([x, y]) => `${x} ${y}`).join(" L") + " Z";
}

/* ================================================================== */
/*  Trader badges — 20 unique military/tactical ranks                  */
/* ================================================================== */

type TraderRecipe = {
  /** chevron count (0-5) */
  chevrons?: number;
  /** horizontal stripe count (0-4) — sits above chevrons */
  stripes?: number;
  /** small stars floating on the patch */
  stars?: number;
  /** big center star */
  centerStar?: "none" | "small" | "big" | "burst";
  /** crossed swords behind the patch */
  swords?: boolean;
  /** laurel wreath around the patch */
  laurel?: boolean;
  /** eagle wings behind the patch */
  wings?: 0 | 1 | 2;
  /** eagle silhouette on top */
  eagle?: boolean;
  /** crown on top of eagle/patch */
  crown?: 0 | 1 | 2 | 3;
  /** center emblem color scheme uses gem */
  gem?: boolean;
};

const TRADER_RECIPES: Record<TraderTierKey, TraderRecipe> = {
  // Bracket 1 — enlisted ranks: chevrons
  beginner:     { chevrons: 1 },
  explorer:     { chevrons: 2 },
  skilled:      { chevrons: 3 },
  advanced:     { chevrons: 3, stripes: 1 },
  professional: { chevrons: 3, stripes: 2, centerStar: "small" },

  // Bracket 2 — NCO/Elite: crossed swords + stars
  elite:        { swords: true, centerStar: "small",  stars: 0 },
  expert:       { swords: true, centerStar: "big",    stars: 0 },
  veteran:      { swords: true, centerStar: "big",    stars: 2 },
  strategist:   { swords: true, centerStar: "big",    stars: 4, laurel: true },
  masterTrader: { swords: true, centerStar: "burst",  stars: 4, laurel: true },

  // Bracket 3 — Officers: wings, laurels, stars
  grandmasterTrader: { wings: 1, laurel: true, centerStar: "big",   stars: 3, crown: 1 },
  legendaryTrader:   { wings: 1, laurel: true, centerStar: "burst", stars: 4, crown: 1, gem: true },
  mythicTrader:      { wings: 2, laurel: true, centerStar: "burst", stars: 5, crown: 1, gem: true },
  titanTrader:       { wings: 2, laurel: true, centerStar: "burst", stars: 5, crown: 2, eagle: true, gem: true },
  immortalTrader:    { wings: 2, laurel: true, centerStar: "burst", stars: 6, crown: 2, eagle: true, gem: true },

  // Bracket 4 — Generals / Legend: crowns + eagle + max
  supremeTrader:  { wings: 2, laurel: true, centerStar: "burst", stars: 5, crown: 2, eagle: true, gem: true, swords: true },
  apexTrader:     { wings: 2, laurel: true, centerStar: "burst", stars: 6, crown: 2, eagle: true, gem: true, swords: true },
  quantumTrader:  { wings: 2, laurel: true, centerStar: "burst", stars: 7, crown: 3, eagle: true, gem: true, swords: true },
  infiniteTrader: { wings: 2, laurel: true, centerStar: "burst", stars: 8, crown: 3, eagle: true, gem: true, swords: true },
  tradingLegend:  { wings: 2, laurel: true, centerStar: "burst", stars: 9, crown: 3, eagle: true, gem: true, swords: true },
};

function TraderBadge({ tierKey, id, tier }: { tierKey: TraderTierKey; id: string; tier: AnyTier }) {
  const r = TRADER_RECIPES[tierKey] || { chevrons: 1 };

  return (
    <g filter={`url(#${id}-glow)`}>
      {/* wings (behind everything) */}
      {r.wings === 1 && <EagleWings id={id} tier={tier} span={70} feather={4} />}
      {r.wings === 2 && <EagleWings id={id} tier={tier} span={82} feather={5} />}

      {/* crossed swords behind patch */}
      {r.swords && <CrossedSwords id={id} tier={tier} />}

      {/* laurel wreath */}
      {r.laurel && <Laurel id={id} tier={tier} />}

      {/* central medal patch */}
      <MedalPatch id={id} tier={tier} />

      {/* stripes across upper patch */}
      {r.stripes ? <Stripes id={id} tier={tier} count={r.stripes} /> : null}

      {/* chevrons on the patch */}
      {r.chevrons ? <Chevrons id={id} tier={tier} count={r.chevrons} /> : null}

      {/* center star */}
      {r.centerStar === "small" && <CenterStar id={id} tier={tier} scale={0.55} gem={r.gem} />}
      {r.centerStar === "big" && <CenterStar id={id} tier={tier} scale={0.9} gem={r.gem} />}
      {r.centerStar === "burst" && <StarBurst id={id} tier={tier} gem={r.gem} />}

      {/* floating stars around the patch */}
      {r.stars ? <FloatingStars id={id} tier={tier} count={r.stars} /> : null}

      {/* eagle silhouette on top */}
      {r.eagle && <Eagle id={id} tier={tier} />}

      {/* crown on top */}
      {r.crown === 1 && <RankCrown id={id} tier={tier} level={1} />}
      {r.crown === 2 && <RankCrown id={id} tier={tier} level={2} />}
      {r.crown === 3 && <RankCrown id={id} tier={tier} level={3} />}
    </g>
  );
}

/* --- trader primitives --- */

function MedalPatch({ id, tier }: { id: string; tier: AnyTier }) {
  return (
    <g>
      {/* metallic outer ring */}
      <circle cx="100" cy="104" r="52" fill={`url(#${id}-metal)`} stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2" />
      {/* inner core */}
      <circle cx="100" cy="104" r="44" fill={`url(#${id}-core)`} stroke={tier.color2} strokeOpacity="0.6" strokeWidth="1" />
      {/* engraved ring */}
      <circle cx="100" cy="104" r="42" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="0.6" strokeDasharray="1 3" />
      {/* top-left specular highlight */}
      <path d="M64 84 A44 44 0 0 1 100 60" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* bottom ribbon tails */}
      <path d="M74 148 L64 178 L82 168 L92 178 L100 150 Z" fill={tier.color2} stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.8" />
      <path d="M126 148 L136 178 L118 168 L108 178 L100 150 Z" fill={tier.color2} stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.8" />
      <path d="M78 152 L82 172 M122 152 L118 172" stroke={tier.color} strokeWidth="1" opacity="0.8" />
    </g>
  );
}

function Chevrons({ id: _id, tier, count }: { id: string; tier: AnyTier; count: number }) {
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const y = 118 + i * 10;
        return (
          <g key={i}>
            <path
              d={`M76 ${y} L100 ${y - 12} L124 ${y} L120 ${y + 4} L100 ${y - 6} L80 ${y + 4} Z`}
              fill="#ffffff"
              opacity={1 - i * 0.08}
            />
            <path
              d={`M76 ${y} L100 ${y - 12} L124 ${y}`}
              fill="none"
              stroke={tier.color}
              strokeOpacity="0.7"
              strokeWidth="0.9"
            />
          </g>
        );
      })}
    </g>
  );
}

function Stripes({ id: _id, tier, count }: { id: string; tier: AnyTier; count: number }) {
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => (
        <rect key={i} x="68" y={82 + i * 6} width="64" height="3" rx="1.5" fill={tier.color} stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.4" />
      ))}
    </g>
  );
}

function CenterStar({ id, tier, scale = 1, gem = false }: { id: string; tier: AnyTier; scale?: number; gem?: boolean }) {
  const s = scale;
  const d = `M100 ${104 - 22 * s} L${100 + 6 * s} ${104 - 6 * s} L${100 + 22 * s} ${104 - 6 * s} L${100 + 10 * s} ${104 + 4 * s} L${100 + 14 * s} ${104 + 20 * s} L100 ${104 + 10 * s} L${100 - 14 * s} ${104 + 20 * s} L${100 - 10 * s} ${104 + 4 * s} L${100 - 22 * s} ${104 - 6 * s} L${100 - 6 * s} ${104 - 6 * s} Z`;
  return (
    <g>
      <path d={d} fill={gem ? `url(#${id}-gem)` : "#ffffff"} stroke={tier.color2} strokeWidth="1" />
      <path d={d} fill="none" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="0.6" />
    </g>
  );
}

function StarBurst({ id, tier, gem = false }: { id: string; tier: AnyTier; gem?: boolean }) {
  return (
    <g>
      {/* 8-point radiant star */}
      {[0, 45, 90, 135].map((rot) => (
        <path
          key={rot}
          d="M100 104 L104 78 L100 60 L96 78 Z"
          fill={`url(#${id}-metal2)`}
          transform={`rotate(${rot} 100 104)`}
          opacity="0.9"
        />
      ))}
      <CenterStar id={id} tier={tier} scale={0.75} gem={gem} />
      <circle cx="100" cy="104" r="4" fill="#ffffff" />
    </g>
  );
}

function FloatingStars({ id: _id, tier, count }: { id: string; tier: AnyTier; count: number }) {
  const positions = starRingPositions(count);
  return (
    <g>
      {positions.map(([x, y], i) => (
        <path
          key={i}
          d={smallStarPath(x, y, 4)}
          fill={tier.color}
          stroke="#ffffff"
          strokeOpacity="0.8"
          strokeWidth="0.5"
        />
      ))}
    </g>
  );
}

function starRingPositions(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    out.push([100 + Math.cos(a) * 62, 104 + Math.sin(a) * 62]);
  }
  return out;
}

function smallStarPath(cx: number, cy: number, r: number) {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    p.push(`${cx + Math.cos(a) * rad} ${cy + Math.sin(a) * rad}`);
  }
  return "M" + p.join(" L") + " Z";
}

function CrossedSwords({ id, tier }: { id: string; tier: AnyTier }) {
  return (
    <g opacity="0.95">
      {[45, -45].map((rot) => (
        <g key={rot} transform={`rotate(${rot} 100 104)`}>
          {/* blade */}
          <path
            d="M100 22 L104 100 L100 110 L96 100 Z"
            fill={`url(#${id}-metal2)`}
            stroke="#ffffff"
            strokeOpacity="0.7"
            strokeWidth="0.8"
          />
          {/* guard */}
          <rect x="86" y="106" width="28" height="6" rx="1.5" fill={tier.color2} stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.6" />
          {/* grip */}
          <rect x="96" y="114" width="8" height="18" fill={tier.color2} stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.5" />
          {/* pommel */}
          <circle cx="100" cy="136" r="4" fill={tier.color} stroke="#ffffff" strokeWidth="0.6" />
        </g>
      ))}
    </g>
  );
}

function Laurel({ id: _id, tier }: { id: string; tier: AnyTier }) {
  return (
    <g opacity="0.95">
      <path
        d="M36 108 C46 152 82 174 100 174 C118 174 154 152 164 108"
        fill="none"
        stroke={tier.color}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.75"
      />
      {[-48, -34, -20, -6, 20, 34, 48].map((deg, i) => (
        <ellipse
          key={i}
          cx={100 + Math.sin((deg * Math.PI) / 180) * 68}
          cy={104 + Math.cos((deg * Math.PI) / 180) * 68}
          rx="5.5"
          ry="10"
          fill={tier.color}
          opacity="0.85"
          transform={`rotate(${deg} 100 104)`}
        />
      ))}
      {/* bottom knot */}
      <circle cx="100" cy="174" r="4" fill={tier.color} stroke="#ffffff" strokeWidth="0.7" />
    </g>
  );
}

function EagleWings({ id, tier, span, feather }: { id: string; tier: AnyTier; span: number; feather: number }) {
  return (
    <g opacity="0.95">
      <path
        d={`M100 96 C${100 - span * 0.5} 78 ${100 - span} 82 ${100 - span - 6} 108 C${100 - span * 0.7} 100 ${100 - span * 0.3} 108 96 122 Z`}
        fill={`url(#${id}-metal)`}
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      <path
        d={`M100 96 C${100 + span * 0.5} 78 ${100 + span} 82 ${100 + span + 6} 108 C${100 + span * 0.7} 100 ${100 + span * 0.3} 108 104 122 Z`}
        fill={`url(#${id}-metal)`}
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      {Array.from({ length: feather }).map((_, i) => (
        <g key={i} opacity="0.65">
          <path
            d={`M${88 - i * 12} ${104 + i * 3} L${88 - i * 12 - (span - 20)} ${100 + i * 5}`}
            stroke="#ffffff"
            strokeOpacity="0.6"
            strokeWidth="0.8"
          />
          <path
            d={`M${112 + i * 12} ${104 + i * 3} L${112 + i * 12 + (span - 20)} ${100 + i * 5}`}
            stroke="#ffffff"
            strokeOpacity="0.6"
            strokeWidth="0.8"
          />
        </g>
      ))}
      {/* subtle glow tips */}
      <circle cx={100 - span - 6} cy="108" r="2.4" fill={tier.color} />
      <circle cx={100 + span + 6} cy="108" r="2.4" fill={tier.color} />
    </g>
  );
}

function Eagle({ id, tier }: { id: string; tier: AnyTier }) {
  return (
    <g>
      {/* body */}
      <path
        d="M100 46 C92 46 88 52 88 58 C88 64 94 68 100 68 C106 68 112 64 112 58 C112 52 108 46 100 46 Z"
        fill={`url(#${id}-metal)`}
        stroke="#ffffff"
        strokeOpacity="0.7"
        strokeWidth="0.8"
      />
      {/* head */}
      <circle cx="100" cy="44" r="6" fill={`url(#${id}-metal)`} stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.7" />
      {/* beak */}
      <path d="M100 46 L94 50 L100 50 Z" fill={tier.color} />
      {/* spread wings small */}
      <path d="M88 60 C76 56 66 60 60 68 C72 66 82 68 90 72 Z" fill={`url(#${id}-metal2)`} stroke="#ffffff" strokeOpacity="0.6" strokeWidth="0.7" />
      <path d="M112 60 C124 56 134 60 140 68 C128 66 118 68 110 72 Z" fill={`url(#${id}-metal2)`} stroke="#ffffff" strokeOpacity="0.6" strokeWidth="0.7" />
      {/* tail */}
      <path d="M96 66 L92 78 L100 74 L108 78 L104 66 Z" fill={`url(#${id}-metal)`} stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.6" />
    </g>
  );
}

function RankCrown({ id, tier, level }: { id: string; tier: AnyTier; level: 1 | 2 | 3 }) {
  const yOffset = level === 1 ? 0 : level === 2 ? -6 : -10;
  return (
    <g transform={`translate(0 ${yOffset})`}>
      <path
        d="M72 34 L84 18 L94 30 L100 12 L106 30 L116 18 L128 34 L124 44 L76 44 Z"
        fill={`url(#${id}-metal)`}
        stroke="#ffffff"
        strokeOpacity="0.75"
        strokeWidth="1"
      />
      <circle cx="84" cy="22" r="2.4" fill={tier.color} stroke="#ffffff" strokeWidth="0.6" />
      <circle cx="116" cy="22" r="2.4" fill={tier.color} stroke="#ffffff" strokeWidth="0.6" />
      <circle cx="100" cy="14" r={level >= 2 ? 3.2 : 2.6} fill={`url(#${id}-gem)`} stroke="#ffffff" strokeWidth="0.7" />
      {level >= 3 && (
        <>
          <path d="M60 40 L100 4 L140 40" fill="none" stroke={tier.color} strokeOpacity="0.6" strokeWidth="1" />
          <circle cx="60" cy="40" r="2.4" fill={tier.color} />
          <circle cx="140" cy="40" r="2.4" fill={tier.color} />
        </>
      )}
    </g>
  );
}
