import { useState } from "react"
import { Logo, LogoMark } from "@/components/brand"
import { Bell, MessageCircle } from "lucide-react"
import { DirectMessagesSheet } from "@/components/layout/direct-messages"
import { cn } from "@/lib/utils"

/**
 * Simplified header — Cryptvora premium.
 * Only: greeting, search, notifications, portfolio summary.
 * Language / theme / profile dropdown live in Settings & Profile.
 */
export function Header() {
  const [dmOpen, setDmOpen] = useState(false)
  const [dmOpen, setDmOpen] = useState(false)
  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:px-5",
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="lg:hidden">
          <LogoMark size={28} />
        </span>
        <span className="hidden lg:flex">
          <Logo size={28} />
        </span>
        <span className="ml-1 hidden sm:inline-flex rounded-md bg-primary/12 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-primary">
          BETA
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setDmOpen(true)}
          aria-label="Direct messages"
          className="relative grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-accent active:scale-95 transition"
        >
          <MessageCircle className="h-[22px] w-[22px]" />
          <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-loss px-1 text-[9px] font-bold text-white">
            3
          </span>
        </button>
        <button
          aria-label="Notifications"
          className="relative grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-accent active:scale-95 transition"
        >
          <Bell className="h-[22px] w-[22px]" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-loss animate-pulse-ring" />
        </button>
      </div>
    </header>
    <DirectMessagesSheet open={dmOpen} onOpenChange={setDmOpen} />
    </>
  )
}
