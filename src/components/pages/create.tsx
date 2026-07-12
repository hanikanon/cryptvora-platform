import { useRef, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { ImagePlus, X, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CreatePostPage() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [symbol, setSymbol] = useState("BTC/USDT")
  const [side, setSide] = useState<"LONG" | "SHORT">("LONG")

  function pick(file?: File | null) {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/" })}
          className="grid h-9 w-9 place-items-center rounded-full bg-secondary/60 text-foreground hover:bg-secondary"
          aria-label="Cancel"
        >
          <X className="h-4 w-4" />
        </button>
        <h1 className="text-[15px] font-semibold text-foreground">New post</h1>
        <button
          disabled={!preview}
          onClick={() => navigate({ to: "/" })}
          className="rounded-full bg-primary px-4 py-1.5 text-[12px] font-semibold text-primary-foreground disabled:opacity-40"
        >
          Share
        </button>
      </header>

      {/* Uploader */}
      <button
        onClick={() => fileRef.current?.click()}
        className={cn(
          "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-card transition hover:bg-accent",
          preview && "border-solid",
        )}
      >
        {preview ? (
          <img src={preview} alt="Selected chart" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus className="h-8 w-8" />
            <span className="text-[13px] font-semibold text-foreground">Upload chart or PnL screenshot</span>
            <span className="text-[11px]">PNG, JPG · square framing works best</span>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </button>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground">Symbol</span>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="h-10 rounded-xl border border-input bg-secondary/60 px-3 text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground">Direction</span>
          <div className="grid grid-cols-2 gap-1 rounded-xl border border-input bg-secondary/60 p-1">
            {(["LONG", "SHORT"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSide(s)}
                className={cn(
                  "flex items-center justify-center gap-1 rounded-lg py-1.5 text-[12px] font-bold transition",
                  side === s
                    ? s === "LONG"
                      ? "bg-gain/20 text-gain"
                      : "bg-loss/20 text-loss"
                    : "text-muted-foreground",
                )}
              >
                {s === "LONG" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-muted-foreground">Caption</span>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Share your setup, entry, targets, invalidation…"
          rows={5}
          className="rounded-xl border border-input bg-secondary/60 p-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </label>
    </div>
  )
}