import { Heart, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function PostTile({
  pnl,
  pair,
  tone,
  likes,
  comments,
  spark,
}: {
  pnl: string
  pair: string
  tone: "gain" | "loss"
  likes: number
  comments: number
  spark: number[]
}) {
  const w = 100
  const h = 100
  const step = w / (spark.length - 1)
  const points = spark.map((v, i) => `${i * step},${h - v}`).join(" ")
  const areaPoints = `0,${h} ${points} ${w},${h}`
  const color = tone === "gain" ? "var(--gain)" : "var(--loss)"

  return (
    <div className="group relative aspect-square overflow-hidden bg-card">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-70">
        <defs>
          <linearGradient id={`fill-${pair}-${pnl}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#fill-${pair}-${pnl})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

      <div className="pointer-events-none absolute bottom-1.5 left-2 right-2">
        <p className={cn("text-[13px] font-extrabold tnum drop-shadow", tone === "gain" ? "text-gain" : "text-loss")}>{pnl}</p>
        <p className="text-[9px] font-medium text-white/85">{pair}</p>
      </div>

      {/* Instagram-style hover overlay with engagement counts */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-4 bg-black/0 opacity-0 transition-all duration-150 group-hover:bg-black/45 group-hover:opacity-100">
        <span className="flex items-center gap-1 text-[12px] font-bold text-white">
          <Heart className="h-4 w-4 fill-white" /> {likes >= 1000 ? `${(likes / 1000).toFixed(1)}K` : likes}
        </span>
        <span className="flex items-center gap-1 text-[12px] font-bold text-white">
          <MessageCircle className="h-4 w-4 fill-white" /> {comments}
        </span>
      </div>
    </div>
  )
}
