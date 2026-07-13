import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { UserPlus, UserCheck, MessageCircle, MoreHorizontal, Grid3x3, Clapperboard, UserSquare2, Camera, ChevronLeft } from "lucide-react"
import { Panel, Chip } from "@/components/ui/panel"
import { getUser, CURRENT_USERNAME, type Tier } from "@/lib/users"
import { cn } from "@/lib/utils"

function tierColor(tier: Tier) {
  switch (tier) {
    case "DIAMOND":
      return "bg-gradient-to-r from-cyan to-primary text-white"
    case "GOLD":
      return "bg-gradient-to-r from-gold to-[color:var(--gold)]/70 text-[color:var(--background)]"
    case "PLATINUM":
      return "bg-gradient-to-r from-[#4fd1c5] to-cyan text-[color:var(--background)]"
    case "SILVER":
      return "bg-gradient-to-r from-[#c0c4cc] to-[#8a8f99] text-[color:var(--background)]"
    case "BRONZE":
      return "bg-gradient-to-r from-[#b06a35] to-[#8a5228] text-white"
  }
}

export default function UserProfilePage({ username }: { username: string }) {
  const user = getUser(username)
  const isOwn = username === CURRENT_USERNAME
  const [tab, setTab] = useState<"posts" | "reels" | "tagged">("posts")
  const [following, setFollowing] = useState(false)

  // Viewing your own username through /u/:username redirects conceptually to the
  // full private profile — keep this page focused on the public view either way.
  return (
    <div className="flex flex-col gap-4 p-3 md:p-5">
      <div className="flex items-center gap-2 md:hidden">
        <Link to="/explore" aria-label="Back" className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-accent">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <span className="text-sm font-semibold text-foreground">{user.username}</span>
      </div>

      <Panel className="p-5">
        <div className="flex items-start gap-5 md:gap-8">
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-gain/10 text-3xl font-bold text-primary ring-2 ring-primary/30 md:h-24 md:w-24">
              {user.username[0]?.toUpperCase()}
            </div>
            <span className={cn("absolute -bottom-1 -right-1 flex h-6 items-center justify-center rounded-full px-1.5 text-[9px] font-bold ring-2 ring-card", tierColor(user.tier))}>
              {user.tier.slice(0, 3)}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-lg font-semibold text-foreground">{user.username}</h1>
              {user.verified && <Chip tone="cyan">Verified</Chip>}
            </div>

            <div className="mt-3 flex items-center gap-6">
              <StatCol value={String(user.stats.posts)} label="Posts" />
              <StatCol value={user.stats.followers} label="Followers" />
              <StatCol value={String(user.stats.following)} label="Following" />
            </div>

            <div className="mt-3 hidden md:block">
              <p className="text-xs font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.bio}</p>
              <p className="mt-1 text-[11px] text-gain">{user.winRate}% win rate</p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground md:hidden">{user.bio}</p>

        <div className="mt-4 flex items-center gap-2">
          {isOwn ? (
            <Link
              to="/profile"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
            >
              Go to my profile
            </Link>
          ) : (
            <>
              <button
                onClick={() => setFollowing((v) => !v)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition",
                  following
                    ? "border border-border text-foreground hover:bg-accent"
                    : "gradient-primary text-primary-foreground shadow-glow hover:opacity-90",
                )}
              >
                {following ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                {following ? "Following" : "Follow"}
              </button>
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-semibold text-foreground transition hover:bg-accent">
                <MessageCircle className="h-3.5 w-3.5" />
                Message
              </button>
              <button
                aria-label="More"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-foreground transition hover:bg-accent"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </Panel>

      <Panel className="overflow-hidden p-0">
        <div className="flex items-center border-b border-border">
          {(
            [
              { key: "posts", icon: Grid3x3 },
              { key: "reels", icon: Clapperboard },
              { key: "tagged", icon: UserSquare2 },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 border-t-2 py-3 text-[11px] font-semibold uppercase tracking-wide transition",
                tab === t.key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground",
              )}
            >
              <t.icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {tab === "posts" ? (
          user.posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-[2px] bg-border">
              {user.posts.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    "group relative flex aspect-square items-end justify-start overflow-hidden p-2",
                    p.tone === "gain" ? "bg-gradient-to-br from-gain/25 via-card to-card" : "bg-gradient-to-br from-loss/25 via-card to-card",
                  )}
                >
                  <div>
                    <p className={cn("text-[13px] font-extrabold tnum", p.tone === "gain" ? "text-gain" : "text-loss")}>{p.pnl}</p>
                    <p className="text-[9px] font-medium text-muted-foreground">{p.pair}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid h-40 place-items-center gap-1 text-center text-xs text-muted-foreground">
              <Camera className="mx-auto mb-1 h-6 w-6" />
              No posts yet
            </div>
          )
        ) : (
          <div className="grid h-40 place-items-center text-xs text-muted-foreground">
            {tab === "reels" ? "No reels yet" : "No tagged posts"}
          </div>
        )}
      </Panel>
    </div>
  )
}

function StatCol({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center md:items-start">
      <p className="text-sm font-bold tnum text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}
