import { Search, Plus, Star, Hash, Users, Settings, LayoutDashboard } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Avatar, BrandMark } from "./atoms";
import { ROOMS, FAVORITES, DIRECT_MESSAGES, type Room } from "./data";

function RoomRow({
  room,
  active,
  onClick,
}: {
  room: Room;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition",
        active ? "bg-primary-soft" : "hover:bg-sidebar-accent",
      )}
    >
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg transition",
          active ? "bg-card shadow-xs" : "bg-surface",
        )}
      >
        {room.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className={cn("truncate text-sm font-semibold", active ? "text-primary" : "text-foreground")}>
            {room.name}
          </p>
          {room.live && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gain/12 px-1.5 py-0.5 text-[9px] font-bold text-gain">
              <span className="h-1 w-1 animate-pulse rounded-full bg-gain" />
              LIVE
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {room.members.toLocaleString()} members
        </p>
      </div>
      {room.unread ? (
        <span className="grid h-5 min-w-5 place-items-center rounded-full gradient-primary px-1.5 text-[11px] font-bold text-primary-foreground">
          {room.unread}
        </span>
      ) : null}
    </button>
  );
}

function SectionLabel({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 pb-1.5 pt-3.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        {children}
      </span>
    </div>
  );
}

export function LeftSidebar({
  active,
  onSelect,
  onOpenProfile,
  onCustomize,
}: {
  active: string;
  onSelect: (id: string) => void;
  onOpenProfile?: () => void;
  onCustomize?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* brand */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <BrandMark size={38} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[15px] font-extrabold tracking-tight text-foreground">Community</p>
          <p className="text-[11px] text-muted-foreground">Cryptvora network</p>
        </div>
        <Link
          to="/app"
          title="Back to dashboard"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"
        >
          <LayoutDashboard className="h-4 w-4" />
        </Link>
      </div>

      {/* search */}
      <div className="px-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-xs">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search rooms & people"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="hidden rounded-md bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="mt-1 flex-1 overflow-y-auto px-3 pb-4 thin-scroll">
        <SectionLabel icon={Star}>Favorites</SectionLabel>
        {FAVORITES.map((r) => (
          <RoomRow key={r.id} room={r} active={active === r.id} onClick={() => onSelect(r.id)} />
        ))}

        <SectionLabel icon={Hash}>Community Rooms</SectionLabel>
        {ROOMS.map((r) => (
          <RoomRow key={r.id} room={r} active={active === r.id} onClick={() => onSelect(r.id)} />
        ))}

        <div className="flex items-center justify-between pr-1">
          <SectionLabel icon={Users}>Direct Messages</SectionLabel>
          <button className="mt-1 grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-sidebar-accent hover:text-primary">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {DIRECT_MESSAGES.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition",
              active === d.id ? "bg-primary-soft" : "hover:bg-sidebar-accent",
            )}
          >
            <Avatar name={d.name} size={40} status={d.status} tier={d.tier} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-foreground">{d.name}</p>
                <span className="shrink-0 text-[10px] text-muted-foreground">{d.time}</span>
              </div>
              <p className="truncate text-xs text-muted-foreground">{d.last}</p>
            </div>
            {d.unread ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-full gradient-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                {d.unread}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* current user */}
      <div className="flex items-center gap-2.5 border-t border-sidebar-border px-3 py-3">
        <button onClick={onOpenProfile} className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl p-1 text-left transition hover:bg-sidebar-accent">
          <Avatar name="Jordan Rivers" size={38} status="online" tier="diamond" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">Jordan Rivers</p>
            <p className="truncate text-xs text-muted-foreground">@jordan · Diamond</p>
          </div>
        </button>
        <button onClick={onCustomize} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-sidebar-accent hover:text-primary">
          <Settings className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
