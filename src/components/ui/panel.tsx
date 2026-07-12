import { cn } from "@/lib/utils"

export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card panel-shadow",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function PanelHeader({
  title,
  subtitle,
  action,
  icon,
  className,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3 border-b border-border px-4 py-3", className)}>
      <div className="flex items-center gap-2 min-w-0">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function Chip({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode
  tone?: "muted" | "gain" | "loss" | "gold" | "cyan"
  className?: string
}) {
  const tones: Record<string, string> = {
    muted: "bg-muted text-muted-foreground",
    gain: "bg-gain/12 text-gain",
    loss: "bg-loss/12 text-loss",
    gold: "bg-gold/12 text-gold",
    cyan: "bg-cyan/12 text-cyan",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tnum",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
