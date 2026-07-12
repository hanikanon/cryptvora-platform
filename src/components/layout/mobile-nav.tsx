import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, Plus, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: Search },
  { label: "Create", href: "/create", icon: Plus, primary: true },
  { label: "Portfolio", href: "/portfolio", icon: Wallet },
  { label: "Profile", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = useLocation({ select: (l) => l.pathname });

  return (
      <nav
        className={cn(
          "lg:hidden fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]",
          "border-t border-border bg-background/85 backdrop-blur-xl",
        )}
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
          {TABS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            if (item.primary) {
              return (
                <li key={item.href} className="flex-1">
                  <Link
                    to={item.href}
                    className="flex flex-col items-center pt-1 pb-1.5"
                    aria-label={item.label}
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 -mt-4 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-glow transition-transform active:scale-95",
                        active && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </span>
                  </Link>
                </li>
              );
            }
            return (
              <li key={item.href} className="flex-1">
                <Link
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  )}
                  aria-label={item.label}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-full transition-all",
                      active ? "bg-primary-soft text-primary" : "text-muted-foreground",
                    )}
                  >
                    <item.icon className={cn("h-[22px] w-[22px]", active && "scale-105")} strokeWidth={active ? 2.4 : 2} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
  );
}
