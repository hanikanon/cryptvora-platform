import { Link, useLocation } from "@tanstack/react-router";
import { Logo } from "@/components/brand";
import { NAV_MAIN, NAV_ACCOUNT, TELEGRAM_URL } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Send, Zap } from "lucide-react";

export function Sidebar() {
  const pathname = useLocation({ select: (l) => l.pathname });

  return (
    <aside className="hidden lg:flex w-[248px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
      <div className="flex h-16 items-center px-5 border-b border-sidebar-border">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Terminal
        </p>
        <ul className="space-y-0.5">
          {NAV_MAIN.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                  <span className="truncate">{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="px-3 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Account
        </p>
        <ul className="space-y-0.5">
          {NAV_ACCOUNT.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3">
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="block rounded-2xl border border-sidebar-border bg-elevated p-3 transition-colors hover:border-primary/40"
        >
          <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-soft text-primary">
              <Send className="h-3.5 w-3.5" />
            </span>
            Crypto Bot
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            Signals, alerts &amp; access credentials via Telegram.
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary">
            <Zap className="h-3 w-3" /> Open @CryptvoraBot
          </div>
        </a>
      </div>
    </aside>
  );
}
