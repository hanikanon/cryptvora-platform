
import { useId } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

/* ---------- Sparkline ---------- */
export function Sparkline({
  data,
  color = "var(--gain)",
  width = 90,
  height = 30,
}: {
  data: number[]
  color?: string
  width?: number
  height?: number
}) {
  const id = useId()
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`)
    .join(" ")
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#spark-${id})`} />
    </svg>
  )
}

/* ---------- Candlestick ---------- */
type Candle = { t: number; o: number; h: number; l: number; c: number; v: number }
export function CandlestickChart({ data, height = 360 }: { data: Candle[]; height?: number }) {
  const width = 1000
  const padTop = 12
  const padBottom = 60
  const chartH = height - padBottom
  const highs = data.map((d) => d.h)
  const lows = data.map((d) => d.l)
  const max = Math.max(...highs)
  const min = Math.min(...lows)
  const range = max - min || 1
  const step = width / data.length
  const candleW = Math.max(2, step * 0.6)
  const y = (v: number) => padTop + (1 - (v - min) / range) * (chartH - padTop)
  const gain = "var(--gain)"
  const loss = "var(--loss)"

  const volMax = Math.max(...data.map((d) => d.v))
  const gridLines = 5

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
        {Array.from({ length: gridLines }).map((_, i) => {
          const gy = padTop + (i / (gridLines - 1)) * (chartH - padTop)
          const price = max - (i / (gridLines - 1)) * range
          return (
            <g key={i}>
              <line x1="0" y1={gy} x2={width} y2={gy} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 4" />
              <text x={width - 4} y={gy - 3} textAnchor="end" fontSize="10" fill="var(--muted-foreground)" className="tnum">
                {price.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </text>
            </g>
          )
        })}
        {data.map((d, i) => {
          const x = i * step + step / 2
          const up = d.c >= d.o
          const color = up ? gain : loss
          const vh = (d.v / volMax) * 44
          return (
            <g key={i}>
              <rect x={x - candleW / 2} y={height - padBottom + 12} width={candleW} height={vh} fill={color} opacity="0.22" />
              <line x1={x} y1={y(d.h)} x2={x} y2={y(d.l)} stroke={color} strokeWidth="1" />
              <rect
                x={x - candleW / 2}
                y={Math.min(y(d.o), y(d.c))}
                width={candleW}
                height={Math.max(1.5, Math.abs(y(d.o) - y(d.c)))}
                fill={color}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ---------- Area chart ---------- */
export function GradientArea({
  data,
  dataKey,
  xKey,
  color = "var(--gain)",
  height = 200,
}: {
  data: Record<string, unknown>[]
  dataKey: string
  xKey: string
  color?: string
  height?: number
}) {
  const id = useId()
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey={xKey} hide />
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
          labelStyle={{ color: "var(--muted-foreground)" }}
        />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#area-${id})`} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/* ---------- Bar chart (PnL / ROI / weekly) ---------- */
export function SignedBars({
  data,
  dataKey,
  xKey,
  height = 200,
}: {
  data: Record<string, unknown>[]
  dataKey: string
  xKey: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
        <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: "var(--muted)", opacity: 0.3 }}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
        />
        <Bar dataKey={dataKey} radius={[3, 3, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={(d[dataKey] as number) >= 0 ? "var(--gain)" : "var(--loss)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function VolumeBars({ data, height = 120 }: { data: { t: string; vol: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
        <XAxis dataKey="t" hide />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: "var(--muted)", opacity: 0.3 }}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
        />
        <Bar dataKey="vol" radius={[2, 2, 0, 0]} fill="var(--cyan)" opacity={0.7} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ---------- Donut (allocation) ---------- */
export function DonutChart({
  data,
  height = 200,
}: {
  data: { name: string; value: number; color: string }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="62%"
          outerRadius="92%"
          paddingAngle={2}
          stroke="var(--card)"
          strokeWidth={2}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

/* ---------- Depth chart ---------- */
export function DepthChart({ data, height = 160 }: { data: { price: number; bid: number; ask: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="depth-bid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gain)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--gain)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="depth-ask" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--loss)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--loss)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="price" hide />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--popover-foreground)",
          }}
        />
        <Area type="step" dataKey="bid" stroke="var(--gain)" strokeWidth={1.5} fill="url(#depth-bid)" />
        <Area type="step" dataKey="ask" stroke="var(--loss)" strokeWidth={1.5} fill="url(#depth-ask)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/* ---------- Radial gauge (risk) ---------- */
export function RiskGauge({ value, size = 160 }: { value: number; size?: number }) {
  const stroke = 12
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const startAngle = 135
  const sweep = 270
  const circumference = 2 * Math.PI * r
  const arcLen = (sweep / 360) * circumference
  const progress = (value / 100) * arcLen
  const color = value < 40 ? "var(--gain)" : value < 70 ? "var(--gold)" : "var(--loss)"
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--muted)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${arcLen} ${circumference}`}
        transform={`rotate(${startAngle} ${cx} ${cy})`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
        transform={`rotate(${startAngle} ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="30" fontWeight="700" fill="var(--foreground)" className="tnum">
        {value}
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
        Risk Score
      </text>
    </svg>
  )
}

/* ---------- Progress ring (win rate) ---------- */
export function ProgressRing({
  value,
  size = 140,
  color = "var(--gain)",
  label = "Win Rate",
}: {
  value: number
  size?: number
  color?: string
  label?: string
}) {
  const stroke = 12
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--foreground)" className="tnum">
        {value}%
      </text>
      <text x={size / 2} y={size / 2 + 20} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
        {label}
      </text>
    </svg>
  )
}
