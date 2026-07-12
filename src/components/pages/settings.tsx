import { useNavigate } from "@tanstack/react-router"
import { useTheme, useLanguage, useAuth, LANGUAGES } from "@/components/providers"
import { cn } from "@/lib/utils"
import {
  Moon,
  Sun,
  Globe,
  User as UserIcon,
  Shield,
  Bell,
  KeyRound,
  Palette,
  LogOut,
  ChevronRight,
  Check,
  Sparkles,
} from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const { theme, toggle } = useTheme()
  const { lang, setLang } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [langOpen, setLangOpen] = useState(false)

  const activeLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[1]

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-3 lg:p-6">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Account, security and platform preferences.
        </p>
      </div>

      {/* Account card */}
      <section className="rounded-3xl border border-border bg-card p-4 shadow-soft animate-fade-up">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground text-lg font-black shadow-glow">
            {(user ?? "T").slice(0, 1).toUpperCase()}
          </span>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{user ?? "Guest"}</p>
            <p className="flex items-center gap-1 text-[11px] text-gold">
              <Sparkles className="h-3 w-3" /> Diamond Member
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/profile" })}
            className="rounded-xl border border-border bg-secondary/60 px-3 py-1.5 text-[12px] font-semibold text-foreground hover:bg-secondary transition"
          >
            View profile
          </button>
        </div>
      </section>

      {/* Appearance */}
      <SettingsGroup title="Appearance">
        <SettingsRow
          icon={theme === "dark" ? Moon : Sun}
          label="Theme"
          value={theme === "dark" ? "Dark" : "Light"}
          onClick={toggle}
          action={
            <button
              onClick={toggle}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                theme === "dark" ? "bg-primary" : "bg-muted",
              )}
              aria-label="Toggle theme"
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-soft transition-transform",
                  theme === "dark" ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>
          }
        />

        <div className="relative">
          <SettingsRow
            icon={Globe}
            label="Language"
            value={activeLang.label}
            onClick={() => setLangOpen((v) => !v)}
          />
          {langOpen && (
            <div className="absolute right-4 top-14 z-20 w-52 rounded-2xl border border-border bg-popover p-1.5 shadow-elevated animate-scale-in">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code)
                    setLangOpen(false)
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-[13px] text-popover-foreground hover:bg-accent transition"
                >
                  <span>{l.label}</span>
                  {l.code === lang && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <SettingsRow icon={Palette} label="Chat wallpaper" value="Default" />
      </SettingsGroup>

      {/* Notifications */}
      <SettingsGroup title="Notifications">
        <SettingsRow icon={Bell} label="Price alerts" value="On" />
        <SettingsRow icon={Bell} label="Trade signals" value="On" />
        <SettingsRow icon={Bell} label="Community mentions" value="Off" />
      </SettingsGroup>

      {/* Security */}
      <SettingsGroup title="Security">
        <SettingsRow icon={Shield} label="Two-factor auth" value="Enabled" />
        <SettingsRow icon={KeyRound} label="API keys" value="3 active" />
        <SettingsRow icon={UserIcon} label="Session activity" />
      </SettingsGroup>

      {/* Sign out */}
      <section className="rounded-3xl border border-border bg-card p-2 shadow-soft animate-fade-up">
        <button
          onClick={() => {
            logout()
            navigate({ to: "/login" })
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[13px] font-semibold text-loss hover:bg-loss/10 transition"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-loss/10">
            <LogOut className="h-4 w-4" />
          </span>
          Sign out
        </button>
      </section>

      <p className="pb-6 text-center text-[11px] text-muted-foreground">
        Cryptvora · v1.0 · Premium
      </p>
    </div>
  )
}

function SettingsGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="animate-fade-up">
      <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        {children}
      </div>
    </section>
  )
}

function SettingsRow({
  icon: Icon,
  label,
  value,
  onClick,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: string
  onClick?: () => void
  action?: React.ReactNode
}) {
  const Comp = onClick ? "button" : "div"
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-3.5 py-3 text-left text-[13px] transition",
        onClick && "hover:bg-accent/60 active:scale-[0.997]",
      )}
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 font-medium text-foreground">{label}</span>
      {value && !action && (
        <span className="text-[12px] text-muted-foreground">{value}</span>
      )}
      {action ?? (onClick && <ChevronRight className="h-4 w-4 text-muted-foreground" />)}
    </Comp>
  )
}
