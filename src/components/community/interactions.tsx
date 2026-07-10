import { useRef } from "react";
import {
  Reply,
  Copy,
  Forward,
  Bookmark,
  Save,
  Pin,
  Clock3,
  History,
  SmilePlus,
  CheckCheck,
  X,
  ChevronDown,
  Mic,
  Video,
  Image as ImageIcon,
  Sticker,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* Long-press + double-tap hook */
export function usePress({
  onLongPress,
  onDoubleTap,
}: {
  onLongPress?: () => void;
  onDoubleTap?: () => void;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastTap = useRef(0);
  const start = () => {
    if (onLongPress) timer.current = setTimeout(onLongPress, 480);
  };
  const clear = () => timer.current && clearTimeout(timer.current);
  const click = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) onDoubleTap?.();
    lastTap.current = now;
  };
  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onClick: click,
  };
}

const ACTIONS = [
  { icon: Reply, label: "Reply" },
  { icon: Copy, label: "Copy" },
  { icon: Forward, label: "Forward" },
  { icon: Pin, label: "Pin" },
  { icon: Bookmark, label: "Bookmark" },
  { icon: Save, label: "Save" },
  { icon: Clock3, label: "Schedule" },
  { icon: History, label: "Edit history" },
  { icon: CheckCheck, label: "Read receipts" },
];

const QUICK_EMOJI = ["❤️", "🔥", "😂", "👍", "🚀", "💯"];

export function QuickActionSheet({
  open,
  onClose,
  onReact,
}: {
  open: boolean;
  onClose: () => void;
  onReact: (e: string) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[65] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm animate-fade-up" onClick={onClose} />
      <div
        className="relative m-3 w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-popover shadow-elevated animate-scale-in"
      >
        <div className="flex items-center justify-center gap-1.5 border-b border-border p-3">
          {QUICK_EMOJI.map((e) => (
            <button
              key={e}
              onClick={() => {
                onReact(e);
                onClose();
              }}
              className="grid h-10 w-10 place-items-center rounded-full text-xl transition hover:scale-125 hover:bg-surface active:scale-95"
            >
              {e}
            </button>
          ))}
          <button className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-surface"><SmilePlus className="h-5 w-5" /></button>
        </div>
        <div className="grid grid-cols-3 gap-1 p-2">
          {ACTIONS.map((a) => (
            <button
              key={a.label}
              onClick={onClose}
              className="flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-center transition hover:bg-surface"
            >
              <a.icon className="h-5 w-5 text-primary" />
              <span className="text-[11px] font-medium text-foreground">{a.label}</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="flex w-full items-center justify-center gap-1.5 border-t border-border py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-surface">
          <X className="h-4 w-4" /> Close
        </button>
      </div>
    </div>
  );
}

/* Double-tap heart burst */
export function ReactionBurst({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      <span className="animate-pop text-4xl" style={{ animationDuration: "0.5s" }}>❤️</span>
    </span>
  );
}

export function ScrollToBottom({ show, onClick }: { show: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute bottom-4 right-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-primary shadow-elevated transition-all",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
      aria-label="Scroll to bottom"
    >
      <ChevronDown className="h-5 w-5" />
      <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-loss px-1 text-[9px] font-bold text-white ring-2 ring-card">3</span>
    </button>
  );
}

/* Composer attachment tray: voice / video / gif / sticker */
export function AttachTray({ open }: { open: boolean }) {
  if (!open) return null;
  const items = [
    { icon: Mic, label: "Voice", tint: "bg-primary-soft text-primary" },
    { icon: Video, label: "Video", tint: "bg-loss/12 text-loss" },
    { icon: ImageIcon, label: "GIF", tint: "bg-gain/12 text-gain" },
    { icon: Sticker, label: "Sticker", tint: "bg-gold/12 text-gold" },
  ];
  return (
    <div className="absolute bottom-full left-3 mb-2 grid grid-cols-4 gap-2 rounded-2xl border border-border bg-popover p-2.5 shadow-elevated animate-panel">
      {items.map((i) => (
        <button key={i.label} className="flex w-16 flex-col items-center gap-1.5 rounded-xl px-1 py-2 transition hover:bg-surface">
          <span className={cn("grid h-10 w-10 place-items-center rounded-xl", i.tint)}><i.icon className="h-5 w-5" /></span>
          <span className="text-[10px] font-medium text-foreground">{i.label}</span>
        </button>
      ))}
    </div>
  );
}
