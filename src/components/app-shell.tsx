import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldAlert, User, Activity, Sun, Moon, Languages, Trophy, BarChart3, MessagesSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { useI18n } from "@/lib/i18n";
import { CAPITAL_TIERS, getCapitalTier } from "@/lib/tiers";
import { TierBadge } from "@/components/tier-badge";

const NAV = [
  { to: "/app", key: "nav.overview", icon: Activity },
  { to: "/app/community", key: "nav.community", icon: MessagesSquare },
  { to: "/app/levels", key: "nav.levels", icon: Trophy },
  { to: "/app/leaderboards", key: "nav.leaderboards", icon: BarChart3 },
  { to: "/app/risk", key: "nav.risk", icon: ShieldAlert },
  { to: "/app/profile", key: "nav.profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, toggle } = useTheme();
  const { t, lang, setLang } = useI18n();
  const { current } = getCapitalTier(68_000);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <Link to="/app" className="flex items-center gap-2">
            <img src="/logo.png" alt="Cryptvora" className="h-8 w-8 rounded-lg object-cover ring-1 ring-primary/40" />
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-foreground">Cryptvora</p>
              <p className="text-[10px] text-muted-foreground">{t("brand.tag")}</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/app" }}
                className="group inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground data-[status=active]:bg-elevated data-[status=active]:text-foreground"
                activeProps={{ "data-status": "active" }}
              >
                <n.icon className="h-3.5 w-3.5" />
                {t(n.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <span className="hidden items-center gap-1.5 rounded-md border border-gain/25 bg-gain/10 px-2 py-1 text-[10px] font-semibold text-gain md:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gain" />
              {t("live.binance")}
            </span>
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-elevated px-2 text-[11px] font-semibold text-foreground hover:bg-muted"
              aria-label="Toggle language"
            >
              <Languages className="h-3.5 w-3.5" />
              {lang === "en" ? "EN" : "ع"}
            </button>
            <button
              onClick={toggle}
              className="grid h-8 w-8 place-items-center rounded-md border border-border bg-elevated text-foreground hover:bg-muted"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
            <Link
              to="/app/levels"
              className="hidden md:grid h-9 w-9 place-items-center rounded-full"
              title={`${current.name} tier`}
            >
              <TierBadge tier={current} size={36} />
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto border-t border-border/70 px-4 py-1.5 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/app" }}
              className={cn(
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-medium text-muted-foreground",
              )}
              activeProps={{ className: "bg-elevated text-foreground" }}
            >
              <n.icon className="h-3.5 w-3.5" />
              {t(n.key)}
            </Link>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-3 py-4 md:px-5 md:py-6">{children}</main>
    </div>
  );
}

export { CAPITAL_TIERS };
