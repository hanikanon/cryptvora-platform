import {
  LayoutDashboard,
  Wallet,
  LineChart,
  CandlestickChart,
  Cable,
  ShieldAlert,
  CalendarDays,
  Newspaper,
  GraduationCap,
  User,
  Gift,
  Settings,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon };

export const NAV_MAIN: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Portfolio", href: "/portfolio", icon: Wallet },
  { label: "Markets", href: "/markets", icon: LineChart },
  { label: "Trading Terminal", href: "/trading", icon: CandlestickChart },
  { label: "Exchanges", href: "/exchanges", icon: Cable },
  { label: "Risk Management", href: "/risk", icon: ShieldAlert },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Academy", href: "/academy", icon: GraduationCap },
]

export const NAV_ACCOUNT: NavItem[] = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Levels", href: "/levels", icon: Trophy },
  { label: "Referral", href: "/referral", icon: Gift },
  { label: "Settings", href: "/settings", icon: Settings },
]

export const TELEGRAM_URL = "https://t.me/CryptvoraBot"
