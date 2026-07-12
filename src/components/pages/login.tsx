import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/components/providers"
import { AuthBackground } from "@/components/auth/auth-background"
import { Logo } from "@/components/brand"
import { TELEGRAM_URL } from "@/lib/nav"
import {
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Send,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Sparkles,
} from "lucide-react"

export default function LoginPage() {
  const { login, user, ready } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ready && user) navigate({ to: "/", replace: true })
  }, [ready, user, navigate])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(false)
    setLoading(true)
    setTimeout(() => {
      const ok = login(username, password)
      if (ok) {
        navigate({ to: "/" })
      } else {
        setError(true)
        setLoading(false)
      }
    }, 650)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <AuthBackground />

      <div className="relative z-10 grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_1fr] items-center">
        {/* Left: brand narrative (desktop) */}
        <div className="hidden lg:flex flex-col gap-6 pr-6">
          <Logo size={34} />
          <div>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground">
              The institutional crypto terminal, <span className="text-gain">reserved for members.</span>
            </h1>
            <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground">
              Live markets, futures execution, risk engines and multi-exchange API connectivity — engineered to compete with
              the desks you already trust.
            </p>
          </div>
          <ul className="flex flex-col gap-3 text-[13px] text-muted-foreground">
            {[
              "Encrypted, read-only exchange API connections",
              "Real-time PnL, risk scoring and portfolio analytics",
              "Signals, alerts and access issued via Telegram bot",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gain/12 text-gain">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-6 pt-2">
            <div>
              <p className="text-xl font-bold text-foreground tnum">$4.2B+</p>
              <p className="text-[11px] text-muted-foreground">Monthly volume</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xl font-bold text-foreground tnum">120k+</p>
              <p className="text-[11px] text-muted-foreground">Verified members</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xl font-bold text-foreground tnum">18ms</p>
              <p className="text-[11px] text-muted-foreground">Median latency</p>
            </div>
          </div>
        </div>

        {/* Right: auth panel */}
        <div className="glass metallic-border relative rounded-2xl p-6 sm:p-8 panel-shadow">
          <div className="lg:hidden mb-6 flex justify-center">
            <Logo size={30} />
          </div>

          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold">
              <Sparkles className="h-3 w-3" /> Members access
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Sign in to Cryptvora</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">Enter the credentials issued by the Crypto bot.</p>
          </div>

          <form onSubmit={handleSubmit} className={error ? "animate-shake" : ""}>
            <div className="space-y-3.5">
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Username</span>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setError(false)
                    }}
                    placeholder="hanibadji"
                    autoComplete="username"
                    className="h-11 w-full rounded-xl border border-input bg-secondary/50 pl-10 pr-3 text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Password</span>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError(false)
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-11 w-full rounded-xl border border-input bg-secondary/50 pl-10 pr-10 text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-loss/30 bg-loss/10 px-3 py-2 text-[12px] text-loss">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Invalid credentials. Access is issued only through the Crypto Telegram bot.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary)_78%,black)] text-[14px] font-semibold text-primary-foreground glow-gain transition-transform active:scale-[0.99] disabled:opacity-70"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
              ) : (
                <>
                  Access Terminal <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Access via bot</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="rounded-xl border border-border bg-secondary/40 p-3.5">
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              Only <span className="font-medium text-foreground">Telegram bot users</span> can access the platform.
              Credentials are generated through the Crypto Telegram bot.
            </p>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-cyan/40 bg-cyan/10 text-[13px] font-semibold text-cyan transition-colors hover:bg-cyan/15"
            >
              <Send className="h-4 w-4" /> Open @CryptvoraBot
            </a>
          </div>

          <div className="mt-4 rounded-lg border border-gold/25 bg-gold/[0.06] px-3 py-2 text-[11px] text-muted-foreground">
            <span className="font-semibold text-gold">Demo access</span> — username{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-foreground">hanibadji</code> · password{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-foreground">hani2005</code>
          </div>
        </div>
      </div>
    </div>
  )
}
