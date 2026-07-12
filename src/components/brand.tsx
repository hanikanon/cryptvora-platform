import { cn } from "@/lib/utils"

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img
        src="/logo.png"
        alt="Cryptvora"
        width={size}
        height={size}
        className="rounded-[10px] object-cover"
        style={{ width: size, height: size }}
      />
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Cryptvora
      </span>
    </div>
  )
}

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <img
      src="/logo.png"
      alt="Cryptvora"
      width={size}
      height={size}
      className="rounded-[10px] object-cover"
      style={{ width: size, height: size }}
    />
  )
}
