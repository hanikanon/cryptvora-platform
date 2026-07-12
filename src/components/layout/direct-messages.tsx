import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Search, Send, Phone, Video, MoreHorizontal, ArrowLeft, Smile, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Thread = {
  id: string
  user: string
  handle: string
  last: string
  time: string
  unread?: number
  online?: boolean
}

type Msg = { id: string; from: "me" | "them"; text: string; time: string }

const THREADS: Thread[] = [
  { id: "t1", user: "solqueen", handle: "@solqueen", last: "SOL setup still valid — see the retest", time: "2m", unread: 2, online: true },
  { id: "t2", user: "quantfox", handle: "@quantfox", last: "Nice, closed my ETH short at BE", time: "18m", online: true },
  { id: "t3", user: "hanibadji", handle: "@hanibadji", last: "You in on the BTC leg?", time: "1h", unread: 1 },
  { id: "t4", user: "alphaowl", handle: "@alphaowl", last: "sent you a chart 📈", time: "3h" },
  { id: "t5", user: "chartlab", handle: "@chartlab", last: "gm", time: "1d" },
  { id: "t6", user: "trendrun", handle: "@trendrun", last: "AVAX reclaim looking clean", time: "2d" },
]

const MSGS: Record<string, Msg[]> = {
  t1: [
    { id: "m1", from: "them", text: "Did you see SOL just tapped 232?", time: "10:12" },
    { id: "m2", from: "me", text: "Yeah, sizing in on the retest.", time: "10:14" },
    { id: "m3", from: "them", text: "SOL setup still valid — see the retest", time: "10:20" },
  ],
  t2: [
    { id: "m1", from: "them", text: "Nice, closed my ETH short at BE", time: "09:48" },
    { id: "m2", from: "me", text: "GG. Waiting for a lower high.", time: "09:50" },
  ],
}

export function DirectMessagesSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [active, setActive] = useState<string | null>(null)
  const thread = THREADS.find((t) => t.id === active) ?? null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col bg-background border-l border-border"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Direct messages</SheetTitle>
        </SheetHeader>

        {!thread ? (
          <InboxView onOpen={(id) => setActive(id)} />
        ) : (
          <ChatView thread={thread} onBack={() => setActive(null)} />
        )}
      </SheetContent>
    </Sheet>
  )
}

function InboxView({ onOpen }: { onOpen: (id: string) => void }) {
  const [tab, setTab] = useState<"primary" | "requests">("primary")
  const unreadCount = THREADS.filter((t) => t.unread).length
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h2 className="text-lg font-bold text-foreground">Messages</h2>
        <button className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-accent">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-9 h-10 rounded-full bg-surface border-border"
          />
        </div>
      </div>
      <div className="flex items-center gap-5 border-b border-border px-4">
        {(["primary", "requests"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              "relative flex items-center gap-1.5 pb-2.5 pt-1 text-[13px] font-semibold transition-colors",
              tab === k ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {k === "primary" ? "Messages" : "Requests"}
            {k === "primary" && unreadCount > 0 && (
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-loss px-1 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
            {tab === k && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-foreground" />}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto thin-scroll">
        {tab === "requests" ? (
          <div className="grid h-full place-items-center px-8 text-center">
            <p className="text-sm text-muted-foreground">No message requests</p>
          </div>
        ) : (
        <ul className="divide-y divide-border/60">
          {THREADS.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => onOpen(t.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent/40 active:bg-accent transition"
              >
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary to-gain text-sm font-black text-white ring-1 ring-border">
                    {t.user[0].toUpperCase()}
                  </div>
                  {t.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gain ring-2 ring-background" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-foreground">{t.user}</span>
                    <span className="text-[11px] text-muted-foreground shrink-0">{t.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-[13px]",
                        t.unread ? "text-foreground font-medium" : "text-muted-foreground",
                      )}
                    >
                      {t.last}
                    </span>
                    {t.unread ? (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                        {t.unread}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
        )}
      </div>
    </>
  )
}

function ChatView({ thread, onBack }: { thread: Thread; onBack: () => void }) {
  const [draft, setDraft] = useState("")
  const msgs = MSGS[thread.id] ?? [
    { id: "m1", from: "them" as const, text: thread.last, time: thread.time },
  ]
  return (
    <>
      <div className="flex items-center gap-2 border-b border-border px-2 py-2">
        <button
          onClick={onBack}
          aria-label="Back"
          className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-gain text-xs font-black text-white ring-1 ring-border">
            {thread.user[0].toUpperCase()}
          </div>
          {thread.online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-gain ring-2 ring-background" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-foreground">{thread.user}</div>
          <div className="text-[11px] text-muted-foreground">
            {thread.online ? "Active now" : "Offline"}
          </div>
        </div>
        <button className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-accent">
          <Phone className="h-[18px] w-[18px]" />
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-accent">
          <Video className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-3 py-4 space-y-1">
        {msgs.map((m, i) => {
          const isLastMine = m.from === "me" && !msgs.slice(i + 1).some((x) => x.from === "me")
          return (
            <div key={m.id} className={cn("flex flex-col", m.from === "me" ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug",
                  m.from === "me"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-surface text-foreground rounded-bl-md border border-border/60",
                )}
              >
                {m.text}
              </div>
              <span className="mt-0.5 px-1 text-[10px] text-muted-foreground">
                {m.time}
                {isLastMine && " · Seen"}
              </span>
            </div>
          )
        })}
      </div>

      <div className="border-t border-border p-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        <div className="flex items-center gap-1.5 rounded-full bg-surface border border-border pl-1 pr-1 py-1">
          <button className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-accent">
            <Smile className="h-5 w-5" />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message…"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-accent">
            <ImageIcon className="h-5 w-5" />
          </button>
          <button
            disabled={!draft.trim()}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full transition",
              draft.trim()
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground",
            )}
          >
            <Send className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </>
  )
}