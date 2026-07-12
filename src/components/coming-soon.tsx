import { Panel } from "@/components/ui/panel"
import { TELEGRAM_URL } from "@/lib/nav"
import { Send } from "lucide-react"

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-4 p-3 md:p-5">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Panel className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/12 text-gold">
          <Send className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title} module is being provisioned</p>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground text-pretty">
            Access to this institutional module is granted through the Crypto Telegram Bot. Connect your account to unlock the full terminal.
          </p>
        </div>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 px-4 py-2.5 text-xs font-semibold text-cyan hover:bg-cyan/20"
        >
          <Send className="h-4 w-4" />
          Open Crypto Bot
        </a>
      </Panel>
    </div>
  )
}
