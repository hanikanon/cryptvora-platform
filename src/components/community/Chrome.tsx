import {
  Menu,
  Search,
  Bell,
  Phone,
  Video,
  Info,
  Hash,
  MessageCircle,
  Users,
  Compass,
  Bookmark,
  X,
  Palette,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./atoms";

export function ConversationHeader({
  onOpenLeft,
  onOpenRight,
  onToggleNotif,
  onSearch,
  onCustomize,
  onCards,
}: {
  onOpenLeft: () => void;
  onOpenRight: () => void;
  onToggleNotif: () => void;
  onSearch: () => void;
  onCustomize: () => void;
  onCards: () => void;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card/80 px-3 md:px-6 glass">
      <button
        onClick={onOpenLeft}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-surface lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-lg">
        ⚡
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Hash className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <h2 className="truncate text-[15px] font-bold text-foreground">Alpha Signals</h2>
          <span className="hidden items-center gap-1 rounded-full bg-gain/12 px-1.5 py-0.5 text-[9px] font-bold text-gain sm:inline-flex">
            <span className="h-1 w-1 animate-pulse rounded-full bg-gain" />
            LIVE
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          <span className="font-semibold text-gain">842 online</span> · 12,480 members
        </p>
      </div>

      {/* facepile */}
      <div className="hidden items-center -space-x-2 sm:flex">
        {["Elena Vasquez", "Marcus Lee", "Aria Kane"].map((n) => (
          <Avatar key={n} name={n} size={30} className="ring-2 ring-card [&>span]:ring-0" />
        ))}
        <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-surface text-[10px] font-bold text-muted-foreground ring-2 ring-card">
          +99
        </span>
      </div>

      <div className="flex items-center gap-1">
        {[
          { Icon: LayoutGrid, on: onCards, hide: "hidden md:grid" },
          { Icon: Palette, on: onCustomize, hide: "hidden md:grid" },
          { Icon: Search, on: onSearch, hide: "grid" },
        ].map(({ Icon, on, hide }, i) => (
          <button
            key={i}
            onClick={on}
            className={cn(
              "h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-surface hover:text-primary",
              hide,
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
          </button>
        ))}
        <button
          onClick={onToggleNotif}
          className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-surface hover:text-primary"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-loss ring-2 ring-card" />
        </button>
        <button
          onClick={onOpenRight}
          className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-surface hover:text-primary xl:hidden"
        >
          <Info className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}

const NAV = [
  { icon: MessageCircle, label: "Chats", badge: 3, active: true },
  { icon: Compass, label: "Explore" },
  { icon: Users, label: "People" },
  { icon: Bookmark, label: "Saved" },
];

export function MobileBottomNav({ onOpenLeft }: { onOpenLeft: () => void }) {
  return <MobileBottomNavImpl onOpenLeft={onOpenLeft} />;
}

export function MobileBottomNavImpl({
  onOpenLeft,
  onExplore,
  onSaved,
}: {
  onOpenLeft: () => void;
  onExplore?: () => void;
  onSaved?: () => void;
}) {
  const handlers: Record<string, (() => void) | undefined> = {
    People: onOpenLeft,
    Explore: onExplore,
    Saved: onSaved,
  };
  return (
    <nav className="shrink-0 border-t border-border bg-card/90 px-4 pb-[env(safe-area-inset-bottom)] pt-2.5 glass lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {NAV.map((n) => (
          <button
            key={n.label}
            onClick={handlers[n.label]}
            className="flex flex-col items-center gap-0.5"
          >
            <span
              className={cn(
                "relative grid h-12 w-12 place-items-center rounded-full transition active:scale-90",
                n.active
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "bg-surface text-muted-foreground",
              )}
            >
              <n.icon className="h-[22px] w-[22px]" />
              {n.badge && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-loss px-1 text-[9px] font-bold text-white ring-2 ring-card">
                  {n.badge}
                </span>
              )}
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold",
                n.active ? "text-primary" : "text-muted-foreground",
              )}
            >
              {n.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export function NotificationPopover({ onClose }: { onClose: () => void }) {
  const items = [
    { name: "Elena Vasquez", text: "mentioned you in Alpha Signals", time: "2m", unread: true },
    { name: "Marcus Lee", text: "reacted 🔥 to your message", time: "18m", unread: true },
    { name: "Aria Kane", text: "shared a chart in NFT Lounge", time: "1h" },
    { name: "Macro Desk", text: "posted breaking news", time: "3h" },
  ];
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-2 top-16 z-50 w-[340px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-3xl border border-border bg-popover shadow-elevated animate-panel md:right-6">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 className="text-sm font-bold text-foreground">Notifications</h4>
          <button className="text-xs font-semibold text-primary hover:underline">Mark all read</button>
        </div>
        <div className="max-h-96 overflow-y-auto thin-scroll">
          {items.map((it, i) => (
            <button
              key={i}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-surface",
                it.unread && "bg-primary-soft/40",
              )}
            >
              <Avatar name={it.name} size={38} />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-foreground">
                  <span className="font-semibold">{it.name}</span>{" "}
                  <span className="text-muted-foreground">{it.text}</span>
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{it.time} ago</p>
              </div>
              {it.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export function Drawer({
  side,
  open,
  onClose,
  children,
}: {
  side: "left" | "right";
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm animate-fade-up" onClick={onClose} />
      <div
        className={cn(
          "absolute top-0 h-full w-[85%] max-w-sm bg-sidebar shadow-elevated",
          side === "left" ? "left-0" : "right-0",
        )}
        style={{ animation: "slide-up-panel 0.3s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-card text-muted-foreground shadow-xs"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
