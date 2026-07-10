import { Pin, Bell, ImageIcon, FileText, LinkIcon, ChevronRight } from "lucide-react";
import { Avatar } from "./atoms";
import { CryptoCard } from "./cards";
import { MEMBERS_ONLINE, PINNED } from "./data";

export function RightPanel() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto bg-background px-4 py-5 thin-scroll">
      {/* room hero */}
      <div className="rounded-3xl border border-border bg-card p-5 text-center shadow-soft">
        <span className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-3xl">
          ⚡
        </span>
        <h3 className="text-base font-bold text-foreground">Alpha Signals</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Real-time trade ideas & market structure from the Cryptvora desk.
        </p>
        <div className="mt-3 flex items-center justify-center gap-4 text-xs">
          <div>
            <p className="font-mono text-sm font-bold text-foreground">12.4k</p>
            <p className="text-muted-foreground">members</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="font-mono text-sm font-bold text-gain">842</p>
            <p className="text-muted-foreground">online</p>
          </div>
        </div>
      </div>

      {/* pinned */}
      <div>
        <div className="mb-2 flex items-center gap-1.5 px-1">
          <Pin className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Pinned
          </span>
        </div>
        <button className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left shadow-xs transition hover:border-primary/30">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <Bell className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{PINNED.title}</p>
            <p className="truncate text-xs text-muted-foreground">by {PINNED.by}</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </div>

      {/* live market */}
      <div>
        <div className="mb-2 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Live market
          </span>
        </div>
        <CryptoCard />
      </div>

      {/* online members */}
      <div>
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Online — 842
          </span>
        </div>
        <div className="space-y-1">
          {MEMBERS_ONLINE.map((m) => (
            <div
              key={m.name}
              className="flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 transition hover:bg-surface"
            >
              <Avatar name={m.name} size={32} status="online" tier={m.tier} />
              <span className="text-sm font-medium text-foreground">{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* shared */}
      <div>
        <div className="mb-2 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Shared
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: ImageIcon, label: "Media", n: 128 },
            { icon: FileText, label: "Files", n: 34 },
            { icon: LinkIcon, label: "Links", n: 76 },
          ].map((s) => (
            <button
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card py-3 shadow-xs transition hover:border-primary/30"
            >
              <s.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold text-foreground">{s.n}</span>
              <span className="text-[10px] text-muted-foreground">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
