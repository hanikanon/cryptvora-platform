
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

const rnd = seeded(7)
const particles = Array.from({ length: 34 }, () => ({
  left: rnd() * 100,
  delay: rnd() * 12,
  duration: 10 + rnd() * 14,
  size: 1 + rnd() * 2.5,
  gold: rnd() > 0.7,
}))

const rnd2 = seeded(19)
const candles = Array.from({ length: 26 }, (_, i) => {
  const up = rnd2() > 0.45
  const h = 20 + rnd2() * 90
  const wickTop = rnd2() * 20
  const wickBottom = rnd2() * 20
  return { i, up, h, wickTop, wickBottom, top: 20 + rnd2() * 55 }
})

export function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* radial depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 70% 20%, color-mix(in oklch, var(--gain) 10%, transparent), transparent 60%), radial-gradient(900px 500px at 20% 80%, color-mix(in oklch, var(--cyan) 8%, transparent), transparent 60%)",
        }}
      />
      {/* animated grid */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* moving candlestick lights (bottom band) */}
      <svg className="absolute bottom-0 left-0 h-64 w-full opacity-30" viewBox="0 0 1000 260" preserveAspectRatio="none">
        {candles.map((c) => {
          const x = c.i * 40 + 12
          const color = c.up ? "var(--gain)" : "var(--loss)"
          const bodyTop = c.top
          return (
            <g key={c.i} style={{ animation: `flow-down ${8 + (c.i % 5)}s ease-in-out ${c.i * 0.2}s infinite`, transformOrigin: "center" }}>
              <line x1={x + 8} y1={bodyTop - c.wickTop} x2={x + 8} y2={bodyTop + c.h + c.wickBottom} stroke={color} strokeWidth="1.5" opacity="0.6" />
              <rect x={x} y={bodyTop} width="16" height={c.h} rx="2" fill={color} opacity="0.5" />
            </g>
          )
        })}
      </svg>

      {/* floating particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.gold ? "var(--gold)" : "var(--cyan)",
            boxShadow: `0 0 8px ${p.gold ? "var(--gold)" : "var(--cyan)"}`,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 120% at 50% 40%, transparent 55%, var(--background) 100%)" }}
      />
    </div>
  )
}
