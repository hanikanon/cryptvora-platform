import { useState } from "react";
import { Reply, SmilePlus, CornerUpLeft, CheckCheck, Play, Mic, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, TierChip } from "./atoms";
import { CryptoCard, NewsCard, TradeCard, PortfolioCard, ImageCard, FileCard } from "./cards";
import { MESSAGES, type Message, type Reaction } from "./data";
import { DEFAULT_SETTINGS, type ChatSettings, type BubbleStyle } from "./settings";
import { usePress, QuickActionSheet, ReactionBurst } from "./interactions";

function bubbleRadius(style: BubbleStyle, me: boolean) {
  if (style === "minimal") return "rounded-lg";
  if (style === "modern") return me ? "rounded-xl rounded-br-sm" : "rounded-xl rounded-bl-sm";
  return me ? "rounded-2xl rounded-tr-md" : "rounded-2xl rounded-tl-md";
}

function Reactions({ reactions, me }: { reactions?: Reaction[]; me?: boolean }) {
  if (!reactions?.length) return null;
  return (
    <div className={cn("mt-1.5 flex flex-wrap gap-1", me && "justify-end")}>
      {reactions.map((r) => (
        <button
          key={r.emoji}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold transition hover:scale-105",
            r.me ? "border-primary/40 bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/30",
          )}
        >
          <span>{r.emoji}</span>
          <span className="tabular-nums">{r.count}</span>
        </button>
      ))}
      <button className="grid h-6 w-6 place-items-center rounded-full border border-border bg-card text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-primary">
        <SmilePlus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ReplyPreview({ to }: { to: { author: string; text: string } }) {
  return (
    <div className="mb-1.5 flex items-center gap-2 rounded-lg border-l-2 border-primary bg-primary-soft/60 px-2.5 py-1.5">
      <CornerUpLeft className="h-3 w-3 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-primary">{to.author}</p>
        <p className="truncate text-[11px] text-muted-foreground">{to.text}</p>
      </div>
    </div>
  );
}

function renderRich(text: string) {
  return text.split(/(\s+)/).map((tok, i) => {
    if (/^@\w+/.test(tok)) return <span key={i} className="rounded bg-primary-soft px-1 font-semibold text-primary">{tok}</span>;
    if (/^#\w+/.test(tok)) return <span key={i} className="font-semibold text-primary">{tok}</span>;
    if (/^(BTC|ETH|SOL|VWAP)$/.test(tok)) return <span key={i} className="rounded bg-gold/12 px-1 font-mono text-[0.92em] font-semibold text-gold">{tok}</span>;
    return tok;
  });
}

function Bubble({ m, settings, onOpenActions }: { m: Message; settings: ChatSettings; onOpenActions: () => void }) {
  const me = "me" in m && m.me;
  const hasCard = m.kind !== "text";
  const compact = settings.density === "compact";
  const [burst, setBurst] = useState(false);

  const press = usePress({
    onLongPress: onOpenActions,
    onDoubleTap: () => {
      setBurst(true);
      setTimeout(() => setBurst(false), 650);
    },
  });

  return (
    <div className={cn("group flex", compact ? "gap-2" : "gap-3", me && "flex-row-reverse")}>
      {!me ? (
        <Avatar name={m.author} size={compact ? 30 : 38} tier={m.tier} className="mt-0.5" />
      ) : (
        <div className={cn("shrink-0", compact ? "w-[30px]" : "w-[38px]")} />
      )}
      <div className={cn("relative flex min-w-0 max-w-[min(560px,82%)] flex-col", me && "items-end")}>
        <ReactionBurst show={burst} />
        <div className={cn("mb-1 flex items-center gap-2", me && "flex-row-reverse")}>
          <span className="text-[13px] font-bold text-foreground">{me ? "You" : m.author}</span>
          {!me && m.tier && <TierChip tier={m.tier} />}
          <span className="text-[11px] text-muted-foreground">{m.time}</span>
        </div>

        {m.kind === "text" && (
          <div
            {...press}
            className={cn(
              "cursor-pointer select-none text-sm leading-relaxed shadow-xs transition-transform active:scale-[0.99]",
              compact ? "px-3 py-1.5" : "px-3.5 py-2.5",
              bubbleRadius(settings.bubble, !!me),
              me ? "gradient-bubble text-primary-foreground" : "bg-bubble-in text-bubble-in-foreground",
              settings.wallpaper === "blur" && !me && "chat-blur-bubbles",
            )}
            style={me ? { boxShadow: "var(--shadow-glow)" } : undefined}
          >
            {m.replyTo && !me && <ReplyPreview to={m.replyTo} />}
            <p>{renderRich(m.text)}</p>
          </div>
        )}

        {hasCard && (
          <div className="animate-pop">
            {m.kind === "crypto" && <CryptoCard />}
            {m.kind === "news" && <NewsCard />}
            {m.kind === "trade" && <TradeCard />}
            {m.kind === "portfolio" && <PortfolioCard />}
            {m.kind === "image" && <ImageCard caption={m.kind === "image" ? m.caption : undefined} />}
            {m.kind === "file" && <FileCard />}
          </div>
        )}

        <div className={cn("flex items-center gap-1.5", me && "flex-row-reverse")}>
          <Reactions reactions={"reactions" in m ? m.reactions : undefined} me={me} />
          {me && <CheckCheck className="mt-1 h-3.5 w-3.5 text-primary" />}
        </div>
      </div>

      <button
        onClick={onOpenActions}
        className="mt-1 flex items-center self-start opacity-0 transition group-hover:opacity-100"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-surface hover:text-primary">
          <Reply className="h-3.5 w-3.5" />
        </span>
      </button>
    </div>
  );
}

/* Voice / Video / GIF demo bubbles */
function VoiceBubble({ settings }: { settings: ChatSettings }) {
  return (
    <div className={cn("group flex", settings.density === "compact" ? "gap-2" : "gap-3")}>
      <Avatar name="Kai Nakamura" size={settings.density === "compact" ? 30 : 38} tier="gold" className="mt-0.5" />
      <div className="flex min-w-0 flex-col">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[13px] font-bold text-foreground">Kai Nakamura</span>
          <span className="text-[11px] text-muted-foreground">09:56</span>
        </div>
        <div className="flex w-[240px] max-w-full items-center gap-3 rounded-2xl rounded-tl-md bg-bubble-in px-3.5 py-3">
          <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full gradient-primary text-primary-foreground shadow-glow"><Play className="h-4 w-4" /></button>
          <div className="flex flex-1 items-center gap-0.5">
            {[8, 14, 20, 12, 24, 16, 10, 22, 14, 18, 8, 12, 20, 10].map((h, i) => (
              <span key={i} className="w-1 rounded-full bg-primary/40" style={{ height: h }} />
            ))}
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">0:14</span>
        </div>
        <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground"><Mic className="h-3 w-3" />Voice message</span>
      </div>
    </div>
  );
}

function VideoBubble({ settings }: { settings: ChatSettings }) {
  return (
    <div className={cn("group flex", settings.density === "compact" ? "gap-2" : "gap-3")}>
      <Avatar name="Devon Park" size={settings.density === "compact" ? 30 : 38} className="mt-0.5" />
      <div className="flex min-w-0 flex-col">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[13px] font-bold text-foreground">Devon Park</span>
          <span className="text-[11px] text-muted-foreground">09:58</span>
        </div>
        <div className="relative h-40 w-[240px] max-w-full overflow-hidden rounded-2xl rounded-tl-md border border-border bg-gradient-to-br from-surface-2 to-primary-soft">
          <span className="absolute inset-0 opacity-40 mesh-bg" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-card/80 text-primary shadow-elevated backdrop-blur-sm"><Play className="h-5 w-5" /></span>
          </span>
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-foreground/60 px-1.5 py-0.5 text-[10px] font-semibold text-background"><Video className="h-3 w-3" />0:42</span>
        </div>
      </div>
    </div>
  );
}

export function DayDivider({ label }: { label: string }) {
  return (
    <div className="my-2 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-semibold text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <Avatar name="Elena Vasquez" size={30} />
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-bubble-in px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <span className="text-[11px] text-muted-foreground">Elena is typing…</span>
    </div>
  );
}

export function MessageList({ settings = DEFAULT_SETTINGS }: { settings?: ChatSettings }) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const compact = settings.density === "compact";

  return (
    <div className={cn("flex flex-col px-4 md:px-8", compact ? "gap-2.5 py-4" : "gap-5 py-6")}>
      <DayDivider label="Today" />
      {MESSAGES.map((m) => (
        <div key={m.id} className="animate-fade-up">
          <Bubble m={m} settings={settings} onOpenActions={() => setActionsOpen(true)} />
        </div>
      ))}
      <VoiceBubble settings={settings} />
      <VideoBubble settings={settings} />
      <TypingIndicator />
      <QuickActionSheet open={actionsOpen} onClose={() => setActionsOpen(false)} onReact={() => setActionsOpen(false)} />
    </div>
  );
}
