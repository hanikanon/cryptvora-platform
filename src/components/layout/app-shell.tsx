import { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/components/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MarketTicker } from "@/components/layout/market-ticker";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LogoMark } from "@/components/brand";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const pathname = useLocation({ select: (l) => l.pathname });
  const isChat = pathname.startsWith("/community");
  const isFeed = pathname === "/" || pathname.startsWith("/explore") || pathname.startsWith("/create");

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <LogoMark size={40} />
          <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex bg-background", isChat ? "h-[100dvh] overflow-hidden" : "min-h-screen")}>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        {!isChat && !isFeed && <MarketTicker />}
        <main className={cn("flex-1", isChat ? "min-h-0 overflow-hidden" : "pb-24 lg:pb-6")}>
          {children}
        </main>
      </div>
      {!isChat && <MobileNav />}
    </div>
  );
}
