import { useState } from "react";
import {
  Plus,
  Smile,
  AtSign,
  Hash,
  ImageIcon,
  Paperclip,
  Send,
  TrendingUp,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./atoms";
import { COINS } from "./data";
import { CoinCard } from "./cards-extra";
import { AttachTray } from "./interactions";

type Hint = "mention" | "hashtag" | "crypto" | null;

const MENTIONS = [
  { name: "Elena Vasquez", handle: "elena" },
  { name: "Marcus Lee", handle: "marcus" },
  { name: "Aria Kane", handle: "aria" },
];
const HASHTAGS = [
  { tag: "bitcoin", posts: "21k" },
  { tag: "altseason", posts: "4.2k" },
  { tag: "defi", posts: "8.9k" },
];

function SuggestionPanel({ hint }: { hint: Hint }) {
  if (!hint) return null;
  return (
    <div className="absolute bottom-full left-3 mb-2 w-72 origin-bottom overflow-hidden rounded-2xl border border-border bg-popover shadow-elevated animate-panel">
      {hint === "mention" && (
        <div className="p-1.5">
          <p className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Mention a member
          </p>
          {MENTIONS.map((m) => (
            <button
              key={m.handle}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left transition hover:bg-surface"
            >
              <Avatar name={m.name} size={30} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                <p className="text-xs text-muted-foreground">@{m.handle}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {hint === "hashtag" && (
        <div className="p-1.5">
          <p className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Trending topics
          </p>
          {HASHTAGS.map((h) => (
            <button
              key={h.tag}
              className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left transition hover:bg-surface"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
                <Hash className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">#{h.tag}</p>
                <p className="text-xs text-muted-foreground">{h.posts} posts</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {hint === "crypto" && (
        <div className="p-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Attach live price
          </p>
          <div className="flex items-center gap-3 rounded-xl bg-surface p-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold/12 text-gold">₿</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Bitcoin</p>
              <p className="font-mono text-xs text-muted-foreground">BTC</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold text-foreground">$62,438</p>
              <p className="flex items-center justify-end gap-0.5 text-xs font-bold text-gain">
                <TrendingUp className="h-3 w-3" />
                +3.4%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Composer() {
  const [hint, setHint] = useState<Hint>(null);
  const [value, setValue] = useState("");
  const [tray, setTray] = useState(false);

  const toggle = (h: Hint) => setHint((cur) => (cur === h ? null : h));

  // Detect a coin symbol in the text → live preview card
  const symbol = value
    .toUpperCase()
    .match(/\b(BTC|ETH|SOL|BNB)\b/)?.[1];
  const coin = symbol ? COINS[symbol] : undefined;

  return (
    <div className="relative border-t border-border bg-card/80 px-3 py-3 md:px-6 md:py-4 glass">
      <SuggestionPanel hint={hint} />
      <AttachTray open={tray} />

      {coin && (
        <div className="mb-2 flex items-center gap-2 animate-pop">
          <span className="text-[11px] font-medium text-muted-foreground">Preview:</span>
          <CoinCard coin={coin} compact />
        </div>
      )}

      {/* smart hint chips */}
      <div className="mb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-medium text-muted-foreground">Try:</span>
        {[
          { h: "mention" as const, icon: AtSign, label: "@mention" },
          { h: "hashtag" as const, icon: Hash, label: "#topic" },
          { h: "crypto" as const, icon: TrendingUp, label: "$BTC" },
        ].map((c) => (
          <button
            key={c.h}
            onClick={() => toggle(c.h)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
              hint === c.h
                ? "border-primary/40 bg-primary-soft text-primary"
                : "border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-primary",
            )}
          >
            <c.icon className="h-3 w-3" />
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-2">
        <button
          onClick={() => setTray((v) => !v)}
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full transition hover:bg-primary-soft hover:text-primary",
            tray ? "gradient-primary text-primary-foreground shadow-glow rotate-45" : "bg-surface text-muted-foreground",
          )}
        >
          <Plus className="h-5 w-5 transition-transform" />
        </button>

        <div className="flex flex-1 items-end gap-1 rounded-3xl border border-border bg-card px-2 py-1.5 shadow-xs focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
          <textarea
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Message Alpha Signals…  type @, # or a symbol"
            className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <div className="flex shrink-0 items-center gap-0.5 pb-0.5">
            {[ImageIcon, Paperclip, Smile].map((Icon, i) => (
              <button
                key={i}
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-surface hover:text-primary"
              >
                <Icon className="h-[18px] w-[18px]" />
              </button>
            ))}
          </div>
        </div>

        <button
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full text-primary-foreground transition active:scale-95",
            value.trim() ? "gradient-primary shadow-glow" : "bg-muted-foreground/40",
          )}
        >
          {value.trim() ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
