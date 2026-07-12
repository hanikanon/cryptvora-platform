import { useState } from "react";
import {
  X,
  Palette,
  RotateCcw,
  Check,
  Search,
  MessageSquare,
  Users,
  ImageIcon,
  FileText,
  LinkIcon,
  Calendar,
  Megaphone,
  CalendarDays,
  BarChart2,
  Flame,
  Pin,
  GraduationCap,
  BadgeCheck,
  Crown,
  MapPin,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./atoms";
import { CARD_GALLERY } from "./cards-extra";
import {
  ANNOUNCEMENTS,
  EVENTS,
  POLL,
  DISCUSSIONS,
  EDUCATION,
  PROFILE,
  DIRECT_MESSAGES,
} from "./data";
import {
  type ChatSettings,
  type Wallpaper,
  type Density,
  type BubbleStyle,
} from "./settings";

/* ---------------- Reusable Sheet ---------------- */
export function Sheet({
  open,
  onClose,
  title,
  icon: Icon,
  children,
  width = "w-[400px]",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: any;
  children: React.ReactNode;
  width?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm animate-fade-up" onClick={onClose} />
      <div
        className={cn("absolute right-0 top-0 flex h-full max-w-[92vw] flex-col bg-background shadow-elevated", width)}
        style={{ animation: "slide-up-panel 0.3s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-4 glass">
          {Icon && <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="h-4 w-4" /></span>}
          <h3 className="flex-1 text-base font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-surface"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto thin-scroll p-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Chat Customizer ---------------- */
const WALLPAPERS: { id: Wallpaper; label: string; group: string; cls: string }[] = [
  { id: "default", label: "Default", group: "Wallpapers", cls: "chat-bg-default bg-background" },
  { id: "aurora", label: "Aurora", group: "Wallpapers", cls: "chat-bg-aurora bg-background" },
  { id: "sunset", label: "Sunset", group: "Wallpapers", cls: "chat-bg-sunset bg-background" },
  { id: "ocean", label: "Ocean", group: "Wallpapers", cls: "chat-bg-ocean bg-background" },
  { id: "mint", label: "Mint", group: "Wallpapers", cls: "chat-bg-mint bg-background" },
  { id: "dots", label: "Dots", group: "Wallpapers", cls: "chat-bg-dots bg-background" },
  { id: "grid", label: "Grid", group: "Wallpapers", cls: "chat-bg-grid bg-background" },
  { id: "blur", label: "Blur", group: "Wallpapers", cls: "chat-bg-blur bg-background" },
  { id: "solid-lavender", label: "Lavender", group: "Solid colors", cls: "chat-bg-solid-lavender" },
  { id: "solid-slate", label: "Slate", group: "Solid colors", cls: "chat-bg-solid-slate" },
  { id: "solid-cream", label: "Cream", group: "Solid colors", cls: "chat-bg-solid-cream" },
];

export function ChatCustomizer({
  open,
  onClose,
  settings,
  update,
  reset,
}: {
  open: boolean;
  onClose: () => void;
  settings: ChatSettings;
  update: (p: Partial<ChatSettings>) => void;
  reset: () => void;
}) {
  const groups = ["Wallpapers", "Solid colors"];
  const densities: { id: Density; label: string; hint: string }[] = [
    { id: "comfortable", label: "Comfortable", hint: "Roomy spacing" },
    { id: "compact", label: "Compact", hint: "Dense & fast" },
  ];
  const bubbles: { id: BubbleStyle; label: string }[] = [
    { id: "rounded", label: "Rounded" },
    { id: "modern", label: "Modern" },
    { id: "minimal", label: "Minimal" },
  ];
  return (
    <Sheet open={open} onClose={onClose} title="Customize Chat" icon={Palette}>
      {groups.map((g) => (
        <div key={g} className="mb-5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{g}</p>
          <div className="grid grid-cols-3 gap-2.5">
            {WALLPAPERS.filter((w) => w.group === g).map((w) => (
              <button
                key={w.id}
                onClick={() => update({ wallpaper: w.id })}
                className={cn(
                  "group relative aspect-[4/5] overflow-hidden rounded-2xl border-2 transition",
                  settings.wallpaper === w.id ? "border-primary shadow-glow" : "border-border hover:border-primary/40",
                )}
              >
                <span className={cn("absolute inset-0", w.cls)} />
                <span className="absolute inset-x-1.5 bottom-1.5 rounded-lg bg-card/80 py-0.5 text-center text-[10px] font-semibold text-foreground backdrop-blur-sm">{w.label}</span>
                {settings.wallpaper === w.id && (
                  <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full gradient-primary text-primary-foreground"><Check className="h-3 w-3" /></span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Message density</p>
        <div className="grid grid-cols-2 gap-2.5">
          {densities.map((d) => (
            <button
              key={d.id}
              onClick={() => update({ density: d.id })}
              className={cn(
                "rounded-2xl border-2 p-3 text-left transition",
                settings.density === d.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40",
              )}
            >
              <p className={cn("text-sm font-bold", settings.density === d.id ? "text-primary" : "text-foreground")}>{d.label}</p>
              <p className="text-[11px] text-muted-foreground">{d.hint}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Bubble style</p>
        <div className="grid grid-cols-3 gap-2.5">
          {bubbles.map((b) => (
            <button
              key={b.id}
              onClick={() => update({ bubble: b.id })}
              className={cn(
                "rounded-2xl border-2 p-2.5 transition",
                settings.bubble === b.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40",
              )}
            >
              <span
                className={cn(
                  "mb-1.5 block h-6 gradient-bubble",
                  b.id === "rounded" && "rounded-2xl rounded-tr-md",
                  b.id === "modern" && "rounded-lg",
                  b.id === "minimal" && "rounded-md",
                )}
              />
              <span className={cn("text-[11px] font-semibold", settings.bubble === b.id ? "text-primary" : "text-foreground")}>{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={reset}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-2.5 text-sm font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-primary"
      >
        <RotateCcw className="h-4 w-4" /> Reset to default
      </button>
    </Sheet>
  );
}

/* ---------------- Search Overlay ---------------- */
const SEARCH_TABS = [
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "users", label: "Users", icon: Users },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "files", label: "Files", icon: FileText },
  { id: "links", label: "Links", icon: LinkIcon },
  { id: "date", label: "By date", icon: Calendar },
];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState("messages");
  const [q, setQ] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[8vh]">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-up" onClick={onClose} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-popover shadow-elevated animate-scale-in">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search messages, users, media, files, links…"
            className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">Esc</kbd>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-2 py-2 no-scrollbar">
          {SEARCH_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                tab === t.id ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-surface",
              )}
            >
              <t.icon className="h-3.5 w-3.5" />{t.label}
            </button>
          ))}
        </div>
        <div className="max-h-[46vh] overflow-y-auto thin-scroll p-2">
          {tab === "users" ? (
            DIRECT_MESSAGES.map((d) => (
              <button key={d.id} className="flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition hover:bg-surface">
                <Avatar name={d.name} size={38} status={d.status} tier={d.tier} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{d.name}</p>
                  <p className="truncate text-xs text-muted-foreground">@{d.handle}</p>
                </div>
              </button>
            ))
          ) : tab === "date" ? (
            <div className="p-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Jump to date</p>
              <div className="flex flex-wrap gap-2">
                {["Today", "Yesterday", "This week", "Last month", "Custom…"].map((d) => (
                  <button key={d} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary">{d}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid place-items-center gap-2 py-12 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary"><Search className="h-6 w-6" /></span>
              <p className="text-sm font-semibold text-foreground">Search {SEARCH_TABS.find((t) => t.id === tab)?.label.toLowerCase()}</p>
              <p className="max-w-xs text-xs text-muted-foreground">Start typing to find {tab} across Alpha Signals and your conversations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Card Gallery ---------------- */
export function CardGallerySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="Crypto Cards" icon={BarChart2} width="w-[440px]">
      <div className="flex flex-col items-center gap-5">
        {CARD_GALLERY.map((c) => (
          <div key={c.label} className="w-full">
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{c.label}</p>
            <div className="flex justify-center">{c.node}</div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

/* ---------------- Community ---------------- */
export function CommunitySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="Community" icon={Megaphone}>
      <section className="mb-5">
        <div className="mb-2 flex items-center gap-1.5"><Megaphone className="h-4 w-4 text-primary" /><p className="text-sm font-bold text-foreground">Announcements</p></div>
        <div className="space-y-2">
          {ANNOUNCEMENTS.map((a) => (
            <div key={a.title} className="rounded-2xl border border-border bg-card p-3 shadow-xs">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">{a.tag}</span>
                <span className="text-[11px] text-muted-foreground">{a.time} ago</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{a.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-2 flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-primary" /><p className="text-sm font-bold text-foreground">Events</p></div>
        <div className="space-y-2">
          {EVENTS.map((e) => (
            <div key={e.title} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><CalendarDays className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{e.title}</p>
                <p className="text-[11px] text-muted-foreground">{e.when} · {e.host}</p>
              </div>
              <button className="rounded-full gradient-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-glow">Join</button>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-2 flex items-center gap-1.5"><BarChart2 className="h-4 w-4 text-primary" /><p className="text-sm font-bold text-foreground">Community Poll</p></div>
        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-xs">
          <p className="mb-2.5 text-sm font-semibold text-foreground">{POLL.question}</p>
          <div className="space-y-2">
            {POLL.options.map((o) => (
              <button key={o.label} className="relative w-full overflow-hidden rounded-xl border border-border py-2 text-left">
                <span className="absolute inset-y-0 left-0 bg-primary-soft" style={{ width: `${o.pct}%` }} />
                <span className="relative flex items-center justify-between px-3 text-xs font-semibold text-foreground">
                  <span>{o.label}</span><span className="text-primary">{o.pct}%</span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">{POLL.votes.toLocaleString()} votes</p>
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-2 flex items-center gap-1.5"><Flame className="h-4 w-4 text-loss" /><p className="text-sm font-bold text-foreground">Trending discussions</p></div>
        <div className="space-y-1.5">
          {DISCUSSIONS.map((d) => (
            <button key={d.title} className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition hover:bg-surface">
              {d.pinned ? <Pin className="h-3.5 w-3.5 shrink-0 text-primary" /> : d.hot ? <Flame className="h-3.5 w-3.5 shrink-0 text-loss" /> : <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{d.title}</span>
              <span className="text-[11px] text-muted-foreground">{d.replies}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-primary" /><p className="text-sm font-bold text-foreground">Featured education</p></div>
        <div className="space-y-2">
          {EDUCATION.map((e) => (
            <div key={e.title} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/12 text-gold"><GraduationCap className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{e.title}</p>
                <p className="text-[11px] text-muted-foreground">{e.level} · {e.mins} min</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Sheet>
  );
}

/* ---------------- Profile ---------------- */
export function ProfileSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="Profile" icon={BadgeCheck}>
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="h-24 gradient-primary" />
        <div className="px-4 pb-4">
          <div className="-mt-9 mb-2 flex items-end justify-between">
            <Avatar name={PROFILE.name} size={72} tier={PROFILE.tier} className="ring-4 ring-card rounded-full" />
            <div className="mb-1 flex gap-1.5">
              {PROFILE.verified && <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary"><BadgeCheck className="h-3 w-3" />Verified</span>}
              {PROFILE.premium && <span className="inline-flex items-center gap-1 rounded-full bg-gold/12 px-2 py-0.5 text-[10px] font-bold text-gold"><Crown className="h-3 w-3" />Premium</span>}
            </div>
          </div>
          <h3 className="text-lg font-extrabold text-foreground">{PROFILE.name}</h3>
          <p className="text-xs text-muted-foreground">@{PROFILE.handle}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{PROFILE.bio}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{PROFILE.country}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{PROFILE.joined}</span>
            <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-gold" />{PROFILE.favoriteCoin}</span>
            <span className="inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" />{PROFILE.style}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-xs">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Portfolio Level</p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-extrabold text-primary">💎 {PROFILE.portfolioLevel}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-xs">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Trader Level</p>
          <p className="mt-0.5 text-sm font-extrabold text-gold">{PROFILE.traderLevel}</p>
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-2.5">
        {Object.entries(PROFILE.stats).map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-border bg-card p-3 text-center shadow-xs">
            <p className="font-mono text-sm font-bold text-foreground">{v}</p>
            <p className="text-[10px] capitalize text-muted-foreground">{k}</p>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Achievements</p>
        <div className="grid grid-cols-2 gap-2.5">
          {PROFILE.achievements.map((a) => (
            <div key={a.label} className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2.5 shadow-xs">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface text-lg">{a.icon}</span>
              <span className="text-xs font-semibold text-foreground">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
