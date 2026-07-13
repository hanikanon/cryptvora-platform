import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, LineChart, MessagesSquare, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Markets", href: "/markets", icon: LineChart },
  { label: "Community", href: "/community", icon: MessagesSquare },
  { label: "Portfolio", href: "/portfolio", icon: Wallet },
  { label: "Profile", href: "/profile", icon: User },
] as const;

export function MobileNav() {
  const pathname = useLocation({ select: (l) => l.pathname });

  return (
    <nav
      className={cn(
        "lg:hidden fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]",
        "border-t border-border bg-background/95 backdrop-blur-xl",
      )}
    >
      <ul className="mx-auto flex max-w-md items-center justify-between px-4">
        {TABS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link
                to={item.href}
                className="flex flex-col items-center gap-1 py-2.5"
                aria-label={item.label}
              >
                <item.icon
                  className={cn("h-[22px] w-[22px] transition-colors", active ? "text-primary" : "text-muted-foreground")}
                  strokeWidth={active ? 2.3 : 1.8}
                />
                <span className={cn("text-[9px] font-medium transition-colors", active ? "text-primary" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
