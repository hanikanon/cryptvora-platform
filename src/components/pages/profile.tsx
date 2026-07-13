
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { Send, Award, Users, Gift, GraduationCap, Check, Settings as SettingsIcon, Grid3x3, Clapperboard, UserSquare2, Camera } from "lucide-react"
import { Panel, PanelHeader, Chip } from "@/components/ui/panel"
import { ProgressRing } from "@/components/charts"
import { PostTile } from "@/components/post-tile"
import { USERS, CURRENT_USERNAME } from "@/lib/users"
import { TELEGRAM_URL } from "@/lib/nav"
import { cn } from "@/lib/utils"

const LEVELS = [
  { name: "Bronze", color: "#b06a35" },
  { name: "Silver", color: "#b8bcc4" },
  { name: "Gold", color: "var(--gold)" },
  { name: "Platinum", color: "#4fd1c5" },
  { name: "Diamond", color: "var(--cyan)" },
]
const CURRENT_LEVEL = 2 // Gold
const LEVEL_PROGRESS = 68

const academy = [
  { title: "Crypto Fundamentals", done: true },
  { title: "Technical Analysis 101", done: true },
  { title: "Risk & Position Sizing", done: true },
  { title: "Futures & Leverage", done: false },
  { title: "Advanced Order Flow", done: false },
]

const POSTS = USERS[CURRENT_USERNAME].posts

export default function ProfilePage() {
  const [tab, setTab] = useState<"posts" | "reels" | "tagged">("posts")
  return (
    <div className="flex flex-col gap-4 p-3 md:p-5">
      {/* Instagram-style profile header */}
      <Panel className="p-5">
        <div className="flex items-start gap-5 md:gap-8">
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold/30 to-gold/5 text-3xl font-bold text-gold ring-2 ring-gold/40 md:h-24 md:w-24">
              H
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-[color:var(--background)] ring-2 ring-card">
              GLD
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h1 className="truncate text-lg font-semibold text-foreground">hanibadji</h1>
              <Link
                to="/settings"
                aria-label="Settings"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground md:hidden"
              >
                <SettingsIcon className="h-5 w-5" />
              </Link>
            </div>

            {/* Stats row — Instagram style */}
            <div className="mt-3 flex items-center gap-6">
              <StatCol value="86" label="Posts" />
              <StatCol value="12.4K" label="Followers" />
              <StatCol value="248" label="Following" />
            </div>

            <div className="mt-3 hidden md:block">
              <p className="text-xs font-semibold text-foreground">Hani Badji</p>
              <p className="text-xs text-muted-foreground">Full-time trader · sharing setups & PnL</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Send className="h-3.5 w-3.5 text-cyan" />
                @hanibadji · Telegram verified
                <Chip tone="gain">Active</Chip>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground md:hidden">
          Full-time trader · sharing setups & PnL
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Link
            to="/settings"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
          >
            Edit profile
          </Link>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-cyan/30 bg-cyan/10 py-2 text-xs font-semibold text-cyan hover:bg-cyan/20"
          >
            <Send className="h-3.5 w-3.5" />
            Crypto Bot
          </a>
          <Link
            to="/settings"
            aria-label="Settings"
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition hover:bg-accent md:flex"
          >
            <SettingsIcon className="h-4 w-4" />
          </Link>
        </div>
      </Panel>

      {/* Posts / Reels / Tagged tabs — Instagram grid */}
      <Panel className="overflow-hidden p-0">
        <div className="relative flex items-center border-b border-border">
          {(
            [
              { key: "posts", icon: Grid3x3 },
              { key: "reels", icon: Clapperboard },
              { key: "tagged", icon: UserSquare2 },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "flex flex-1 items-center justify-center py-3 text-[11px] font-semibold uppercase tracking-wide transition-colors",
                tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="h-4 w-4" />
            </button>
          ))}
          <span
            aria-hidden
            className="absolute bottom-0 h-[2px] w-1/3 bg-foreground transition-transform duration-200 ease-out"
            style={{ transform: `translateX(${["posts", "reels", "tagged"].indexOf(tab) * 100}%)` }}
          />
        </div>

        {tab === "posts" ? (
          <div className="grid grid-cols-3 gap-[2px] bg-border">
            {POSTS.map((p) => (
              <PostTile key={p.id} pnl={p.pnl} pair={p.pair} tone={p.tone} likes={p.likes} comments={p.comments} spark={p.spark} />
            ))}
            <button className="flex aspect-square flex-col items-center justify-center gap-1.5 bg-card text-muted-foreground transition hover:text-foreground">
              <Camera className="h-5 w-5" />
              <span className="text-[9px] font-medium">New post</span>
            </button>
          </div>
        ) : (
          <div className="grid h-40 place-items-center text-xs text-muted-foreground">
            {tab === "reels" ? "No reels yet" : "No tagged posts"}
          </div>
        )}
      </Panel>

      {/* Level progression */}
      <Panel>
        <PanelHeader
          title="Level Progression"
          subtitle="Trade volume unlocks higher tiers"
          icon={<Award className="h-4 w-4 text-gold" />}
          action={
            <Link to="/levels" className="text-[11px] font-semibold text-primary hover:underline">
              View all levels
            </Link>
          }
        />
        <div className="p-5">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-border" />
            <div
              className="absolute left-0 top-4 h-0.5 bg-gold transition-all"
              style={{ width: `${(CURRENT_LEVEL / (LEVELS.length - 1)) * 100}%` }}
            />
            {LEVELS.map((l, i) => (
              <div key={l.name} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all",
                    i <= CURRENT_LEVEL ? "text-[color:var(--background)]" : "bg-card text-muted-foreground",
                  )}
                  style={{
                    background: i <= CURRENT_LEVEL ? l.color : undefined,
                    borderColor: i <= CURRENT_LEVEL ? l.color : "var(--border)",
                  }}
                >
                  {i < CURRENT_LEVEL ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn("text-[10px] font-medium", i <= CURRENT_LEVEL ? "text-foreground" : "text-muted-foreground")}>
                  {l.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Progress to Platinum</span>
              <span className="tnum font-semibold text-gold">{LEVEL_PROGRESS}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-to-r from-gold to-cyan" style={{ width: `${LEVEL_PROGRESS}%` }} />
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Referral stats */}
        <Panel className="lg:col-span-2">
          <PanelHeader title="Referral Statistics" subtitle="Invite via your Telegram link" icon={<Users className="h-4 w-4 text-cyan" />} />
          <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
            <MiniStat label="Total Referrals" value="248" tone="cyan" />
            <MiniStat label="Active Traders" value="176" tone="gain" />
            <MiniStat label="Commission" value="$12,480" tone="gold" />
            <MiniStat label="This Month" value="$1,920" tone="gain" />
          </div>
          <div className="border-t border-border p-4">
            <p className="mb-2 text-[11px] text-muted-foreground">Your referral link</p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-input px-3 py-2">
              <code className="flex-1 truncate text-xs text-foreground">https://t.me/CryptvoraBot?start=ref_hanibadji</code>
              <button className="rounded-md bg-gold px-3 py-1 text-[11px] font-semibold text-[color:var(--background)]">Copy</button>
            </div>
          </div>
        </Panel>

        {/* Rewards ring */}
        <Panel className="flex flex-col items-center justify-center gap-2 p-5">
          <p className="text-[13px] font-semibold text-foreground">Rewards Earned</p>
          <ProgressRing value={74} color="var(--gold)" label="Claimed" size={150} />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Gift className="h-3.5 w-3.5 text-gold" />
            3 rewards available
          </div>
        </Panel>
      </div>

      {/* Academy */}
      <Panel>
        <PanelHeader title="Completed Academy" subtitle="3 of 5 modules complete" icon={<GraduationCap className="h-4 w-4 text-gain" />} />
        <ul className="divide-y divide-border/60">
          {academy.map((m, i) => (
            <li key={i} className="flex items-center justify-between px-4 py-3 text-xs">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    m.done ? "bg-gain/15 text-gain" : "bg-muted text-muted-foreground",
                  )}
                >
                  {m.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={m.done ? "text-foreground" : "text-muted-foreground"}>{m.title}</span>
              </div>
              <Chip tone={m.done ? "gain" : "muted"}>{m.done ? "Completed" : "Locked"}</Chip>
            </li>
          ))}
        </ul>
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

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: "gain" | "cyan" | "gold" }) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-3">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 text-lg font-semibold tnum",
          tone === "gain" && "text-gain",
          tone === "cyan" && "text-cyan",
          tone === "gold" && "text-gold",
        )}
      >
        {value}
      </p>
    </div>
  )
}
