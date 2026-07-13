import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: Search },
  { label: "Create", href: "/create", icon: PlusSquare },
  { label: "Portfolio", href: "/portfolio", icon: WalletIcon },
  { label: "Profile", href: "/profile", icon: null },
] as const;

function WalletIcon(props: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1" />
      <path d="M20 12h-4a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

export function MobileNav() {
  const pathname = useLocation({ select: (l) => l.pathname });

  return (
    <nav
      className={cn(
        "lg:hidden fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]",
        "border-t border-border bg-background/95 backdrop-blur-xl",
      )}
    >
      <ul className="mx-auto flex max-w-md items-center justify-between px-5">
        {TABS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                to={item.href}
                className="flex items-center justify-center py-3 px-2"
                aria-label={item.label}
              >
                {item.icon ? (
                  <item.icon
                    className={cn("h-[26px] w-[26px] transition-colors", active ? "text-foreground" : "text-muted-foreground")}
                    strokeWidth={active ? 2.3 : 1.8}
                  />
                ) : (
                  <span
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full text-[9px] font-bold transition-all",
                      active ? "ring-2 ring-foreground text-foreground" : "ring-1 ring-border text-muted-foreground",
                    )}
                  >
                    H
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
