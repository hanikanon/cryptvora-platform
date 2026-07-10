"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

export function GradientArea({
  data,
  dataKey,
  xKey,
  color = "var(--gain)",
  height = 220,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey: string;
  color?: string;
  height?: number;
}) {
  const id = useId();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "var(--muted-foreground)" }} />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#area-${id})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function EquityLine({
  data,
  height = 220,
}: {
  data: { t: string; equity: number }[];
  height?: number;
}) {
  const id = useId();
  const first = data[0]?.equity ?? 0;
  const last = data[data.length - 1]?.equity ?? 0;
  const up = last >= first;
  const stroke = up ? "var(--gain)" : "var(--loss)";
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`eq-fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
            <stop offset="55%" stopColor={stroke} stopOpacity={0.08} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`eq-line-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor={stroke} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="2 6"
          stroke="color-mix(in oklch, var(--foreground) 8%, transparent)"
          vertical={false}
        />
        <XAxis
          dataKey="t"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          orientation="right"
          width={48}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          domain={["dataMin - 200", "dataMax + 200"]}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`
          }
        />
        <Tooltip
          cursor={{
            stroke: "color-mix(in oklch, var(--foreground) 20%, transparent)",
            strokeDasharray: "3 3",
          }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const v = payload[0].value as number;
            return (
              <div
                style={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "8px 10px",
                  fontSize: 11,
                  boxShadow: "0 12px 30px -12px rgb(0 0 0 / 0.6)",
                }}
              >
                <div style={{ color: "var(--muted-foreground)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {label}
                </div>
                <div style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>
                  ${v.toLocaleString()}
                </div>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="equity"
          stroke={`url(#eq-line-${id})`}
          strokeWidth={2.4}
          dot={false}
          activeDot={{
            r: 5,
            fill: "var(--card)",
            stroke: stroke,
            strokeWidth: 2.5,
          }}
          fill={`url(#eq-fill-${id})`}
          isAnimationActive
          animationDuration={900}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SignedBars({
  data,
  dataKey,
  xKey,
  height = 200,
}: {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }} barCategoryGap={6}>
        <CartesianGrid strokeDasharray="2 6" stroke="color-mix(in oklch, var(--foreground) 7%, transparent)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.25 }} contentStyle={tooltipStyle} />
        <Bar dataKey={dataKey} radius={[6, 6, 2, 2]} isAnimationActive animationDuration={700}>
          {data.map((d, i) => (
            <Cell key={i} fill={(d[dataKey] as number) >= 0 ? "var(--gain)" : "var(--loss)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({
  data,
  height = 220,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
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
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RiskGauge({ value, size = 180 }: { value: number; size?: number }) {
  const id = useId();
  const stroke = 14;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135;
  const sweep = 270;
  const circumference = 2 * Math.PI * r;
  const arcLen = (sweep / 360) * circumference;
  const progress = (Math.min(100, Math.max(0, value)) / 100) * arcLen;
  const color = value < 40 ? "var(--gain)" : value < 70 ? "var(--gold)" : "var(--loss)";
  const label = value < 40 ? "Low" : value < 70 ? "Moderate" : "High";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={`gauge-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gain)" />
          <stop offset="50%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="var(--loss)" />
        </linearGradient>
        <filter id={`gauge-glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="color-mix(in oklch, var(--foreground) 8%, transparent)"
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
        stroke={`url(#gauge-${id})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
        transform={`rotate(${startAngle} ${cx} ${cy})`}
        filter={`url(#gauge-glow-${id})`}
        style={{ transition: "stroke-dasharray 0.9s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="34" fontWeight={800} fill="var(--foreground)" className="tnum">
        {value}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="10" fontWeight={600} letterSpacing="1.5" fill={color}>
        {label.toUpperCase()}
      </text>
      <text x={cx} y={cy + 32} textAnchor="middle" fontSize="9" fill="var(--muted-foreground)" letterSpacing="1.2">
        RISK SCORE
      </text>
    </svg>
  );
}

export function ProgressRing({
  value,
  size = 150,
  color = "var(--gain)",
  label = "Win Rate",
  sub,
}: {
  value: number;
  size?: number;
  color?: string;
  label?: string;
  sub?: string;
}) {
  const id = useId();
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={`ring-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.7} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <filter id={`ring-glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="color-mix(in oklch, var(--foreground) 8%, transparent)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`url(#ring-${id})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        filter={`url(#ring-glow-${id})`}
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fontSize="28" fontWeight={800} fill="var(--foreground)" className="tnum">
        {value}
        {sub ? "" : "%"}
      </text>
      <text x={size / 2} y={size / 2 + 20} textAnchor="middle" fontSize="10" fill="var(--muted-foreground)" letterSpacing="1.2">
        {label}
      </text>
    </svg>
  );
}