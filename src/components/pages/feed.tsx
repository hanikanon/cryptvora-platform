import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Play, TrendingUp, TrendingDown } from "lucide-react"
import { COINS } from "@/lib/market-data"
import { fmtNum, fmtPct } from "@/lib/format"
import { cn } from "@/lib/utils"

type Tier = "DIAMOND" | "GOLD" | "PLATINUM" | "SILVER"

type Post = {
  id: string
  user: string
  handle: string
  tier: Tier
  timeAgo: string
  symbol: string
  side: "LONG" | "SHORT"
  pnl: number
  caption: string
  likes: number
  comments: number
  liked?: boolean
  saved?: boolean
}

const POSTS: Post[] = [
  {
    id: "p1",
    user: "hanibadji",
    handle: "@hanibadji",
    tier: "GOLD",
    timeAgo: "12m",
    symbol: "BTC/USDT",
    side: "LONG",
    pnl: 4.82,
    caption:
      "BTC broke the 96.4K resistance with clean volume. Riding this leg to 99.2K, invalidation at 95.1K. Patience paid off — third confirmation on the 4H structure.",
    likes: 1284,
    comments: 96,
  },
  {
    id: "p2",
    user: "solqueen",
    handle: "@solqueen",
    tier: "DIAMOND",
    timeAgo: "48m",
    symbol: "SOL/USDT",
    side: "LONG",
    pnl: 12.34,
    caption:
      "SOL flag breakout on the daily. Adding on retest of 232. This is the cleanest trend continuation on majors right now.",
    likes: 3420,
    comments: 214,
  },
  {
    id: "p3",
    user: "quantfox",
    handle: "@quantfox",
    tier: "PLATINUM",
    timeAgo: "2h",
    symbol: "ETH/USDT",
    side: "SHORT",
    pnl: -1.4,
    caption:
      "Trimmed the ETH short — stop moved to breakeven. Divergence on the 1H is fading, will re-enter on a lower high.",
    likes: 612,
    comments: 41,
  },
  {
    id: "p4",
    user: "alphaowl",
    handle: "@alphaowl",
    tier: "SILVER",
    timeAgo: "5h",
    symbol: "AVAX/USDT",
    side: "LONG",
    pnl: 7.9,
    caption: "AVAX reclaimed the range high. Simple textbook setup — targets 46 and 48.",
    likes: 210,
    comments: 17,
  },
]

const STORIES = [
  { user: "you", live: false, isYou: true },
  { user: "solqueen", live: true },
  { user: "hanibadji", live: false },
  { user: "quantfox", live: true },
  { user: "alphaowl", live: false },
  { user: "chartlab", live: false },
  { user: "trendrun", live: true },
  { user: "btcmax", live: false },
  { user: "eth_daily", live: false },
]

export default function FeedPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-2 pb-6">
      <StoriesBar />
      <div className="flex flex-col gap-2 px-0 sm:gap-4 sm:px-3 sm:pt-3">
        {POSTS.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  )
}

/* ---------------- Stories ---------------- */

function StoriesBar() {
  const hidden = useHideOnScroll()
  return (
    <div
      className={cn(
        "sticky top-16 z-30 -mx-0 border-b border-border bg-background/85 backdrop-blur-xl",
        "transition-transform duration-300 will-change-transform",
        hidden && "-translate-y-[calc(100%+4rem)]",
      )}
    >
      <div className="flex gap-3 overflow-x-auto thin-scroll px-3 py-3">
        {STORIES.map((s, i) => (
          <StoryAvatar key={s.user + i} user={s.user} live={s.live} isYou={s.isYou} />
        ))}
      </div>
    </div>
  )
}

function StoryAvatar({ user, live, isYou }: { user: string; live?: boolean; isYou?: boolean }) {
  return (
    <Link
      to={isYou ? "/profile" : "/u/$username"}
      params={isYou ? undefined : { username: user }}
      className="flex w-16 shrink-0 flex-col items-center gap-1.5 active:scale-95 transition-transform"
    >
      <span
        className={cn(
          "relative grid h-16 w-16 place-items-center rounded-full p-[2px]",
          live
            ? "bg-gradient-to-tr from-loss via-gold to-primary"
            : isYou
              ? "bg-border"
              : "bg-gradient-to-tr from-primary via-primary-glow to-gain",
        )}
      >
        <span className="grid h-full w-full place-items-center rounded-full bg-background">
          <span
            className="grid h-[calc(100%-4px)] w-[calc(100%-4px)] place-items-center rounded-full text-sm font-bold text-foreground"
            style={{
              background: `linear-gradient(135deg, var(--primary) 0%, var(--gain) 100%)`,
              opacity: 0.85,
            }}
          >
            {isYou ? "+" : user[0].toUpperCase()}
          </span>
        </span>
        {live && (
          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-md bg-loss px-1.5 text-[8px] font-black text-white shadow-glow">
            LIVE
          </span>
        )}
      </span>
      <span className="max-w-full truncate text-[10px] text-muted-foreground">
        {isYou ? "Your story" : user}
      </span>
    </Link>
  )
}

/* ---------------- Post ---------------- */

function tierClass(tier: Tier) {
  switch (tier) {
    case "DIAMOND":
      return "bg-gradient-to-r from-cyan to-primary text-white"
    case "GOLD":
      return "bg-gradient-to-r from-gold to-[color:var(--gold)]/70 text-[color:var(--background)]"
    case "PLATINUM":
      return "bg-gradient-to-r from-[#4fd1c5] to-cyan text-[color:var(--background)]"
    case "SILVER":
      return "bg-gradient-to-r from-[#c0c4cc] to-[#8a8f99] text-[color:var(--background)]"
  }
}

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(!!post.liked)
  const [saved, setSaved] = useState(!!post.saved)
  const [expanded, setExpanded] = useState(false)
  const likes = post.likes + (liked && !post.liked ? 1 : 0)

  return (
    <article className="border-y border-border bg-card sm:rounded-2xl sm:border">
      {/* Header */}
      <header className="flex items-center gap-3 px-3 py-2.5">
        <Link
          to="/u/$username"
          params={{ username: post.user }}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-gain text-xs font-black text-white ring-1 ring-border"
        >
          {post.user[0].toUpperCase()}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link
              to="/u/$username"
              params={{ username: post.user }}
              className="truncate text-[13px] font-semibold text-foreground hover:underline"
            >
              {post.user}
            </Link>
            <span className={cn("rounded-md px-1.5 py-0.5 text-[9px] font-black tracking-wider", tierClass(post.tier))}>
              {post.tier}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {post.symbol} · {post.timeAgo}
          </span>
        </div>
        <button className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-accent">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </header>

      {/* Chart image */}
      <ChartArtwork symbol={post.symbol} side={post.side} pnl={post.pnl} />

      {/* Actions */}
      <div className="flex items-center px-2 py-2">
        <div className="flex flex-1 items-center justify-center gap-6">
          <IconAction onClick={() => setLiked((v) => !v)} label="Like">
            <Heart className={cn("h-6 w-6 transition", liked && "fill-loss text-loss scale-110")} />
          </IconAction>
          <IconAction label="Comment">
            <MessageCircle className="h-6 w-6" />
          </IconAction>
          <IconAction label="Share">
            <Send className="h-6 w-6" />
          </IconAction>
        </div>
        <IconAction onClick={() => setSaved((v) => !v)} label="Save">
          <Bookmark className={cn("h-6 w-6 transition", saved && "fill-primary text-primary")} />
        </IconAction>
      </div>

      {/* Meta */}
      <div className="px-3 pb-3">
        <p className="text-[13px] font-semibold text-foreground tnum">{fmtNum(likes, 0)} likes</p>
        <p className={cn("mt-1 text-[13px] leading-snug text-foreground", !expanded && "line-clamp-2")}>
          <span className="font-semibold">{post.user}</span>{" "}
          <span className="text-muted-foreground">{post.caption}</span>
        </p>
        {post.caption.length > 90 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-0.5 text-[12px] text-muted-foreground hover:text-foreground"
          >
            {expanded ? "show less" : "read more"}
          </button>
        )}
        <p className="mt-1 text-[11px] text-muted-foreground">View all {post.comments} comments</p>
      </div>
    </article>
  )
}

function IconAction({
  children,
  onClick,
  label,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  label: string
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-accent active:scale-90 transition",
        className,
      )}
    >
      {children}
    </button>
  )
}

/* ---------------- Chart artwork (fake screenshot) ---------------- */

function ChartArtwork({ symbol, side, pnl }: { symbol: string; side: "LONG" | "SHORT"; pnl: number }) {
  const coin = COINS.find((c) => symbol.startsWith(c.symbol)) ?? COINS[0]
  const s = coin.spark
  const min = Math.min(...s)
  const max = Math.max(...s)
  const pts = s
    .map((v, i) => {
      const x = (i / (s.length - 1)) * 100
      const y = 100 - ((v - min) / (max - min || 1)) * 100
      return `${x},${y}`
    })
    .join(" ")
  const areaPts = `0,100 ${pts} 100,100`
  const up = pnl >= 0
  const stroke = up ? "var(--gain)" : "var(--loss)"

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-background via-surface to-background">
      {/* grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(1 0 0 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* soft glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 60% at 50% 100%, ${up ? "oklch(0.78 0.17 152 / 0.18)" : "oklch(0.65 0.24 22 / 0.18)"} 0%, transparent 60%)`,
        }}
      />

      {/* Top badges */}
      <div className="absolute left-3 top-3 flex items-center gap-2">
        <span className="rounded-md bg-background/70 px-2 py-1 text-[11px] font-bold text-foreground backdrop-blur-md ring-1 ring-border">
          {symbol}
        </span>
        <span
          className={cn(
            "rounded-md px-2 py-1 text-[10px] font-black tracking-wider backdrop-blur-md ring-1",
            side === "LONG"
              ? "bg-gain/15 text-gain ring-gain/30"
              : "bg-loss/15 text-loss ring-loss/30",
          )}
        >
          {side}
        </span>
      </div>

      {/* PnL */}
      <div className="absolute right-3 top-3 flex flex-col items-end">
        <span className="text-[10px] text-muted-foreground">PnL</span>
        <span
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-0.5 text-[13px] font-bold tnum backdrop-blur-md ring-1",
            up ? "bg-gain/15 text-gain ring-gain/30" : "bg-loss/15 text-loss ring-loss/30",
          )}
        >
          {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {fmtPct(pnl)}
        </span>
      </div>

      {/* Chart svg */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-3/4 w-full">
        <defs>
          <linearGradient id={`fill-${symbol}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPts} fill={`url(#fill-${symbol})`} />
        <polyline points={pts} fill="none" stroke={stroke} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Price footer */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
        <div>
          <div className="text-[10px] text-muted-foreground">Entry</div>
          <div className="tnum text-[13px] font-semibold text-foreground">
            ${fmtNum(coin.price * (1 - pnl / 200), coin.price < 5 ? 3 : 0)}
          </div>
        </div>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-background/70 text-foreground backdrop-blur-md ring-1 ring-border">
          <Play className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}