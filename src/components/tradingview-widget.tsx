import { useEffect, useRef, useId } from "react"
import { useTheme } from "@/components/providers"

/**
 * Embeds TradingView's free "Advanced Real-Time Chart" widget.
 * No API key required — this is TradingView's public embed script.
 * Docs: https://www.tradingview.com/widget/advanced-chart/
 */
export function TradingViewWidget({
  symbol = "BINANCE:BTCUSDT",
  height = 380,
  interval = "60",
}: {
  symbol?: string
  height?: number
  interval?: string
}) {
  const container = useRef<HTMLDivElement>(null)
  const uid = useId().replace(/:/g, "")
  const { theme } = useTheme()

  useEffect(() => {
    const node = container.current
    if (!node) return
    node.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme: theme === "dark" ? "dark" : "light",
      style: "1",
      locale: "en",
      backgroundColor: theme === "dark" ? "rgba(10, 10, 15, 1)" : "rgba(255, 255, 255, 1)",
      gridColor: theme === "dark" ? "rgba(42, 42, 54, 0.35)" : "rgba(0, 0, 0, 0.06)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
    })
    node.appendChild(script)
  }, [symbol, interval, theme, uid])

  return (
    <div className="rounded-lg overflow-hidden" style={{ height }}>
      <div className="tradingview-widget-container h-full w-full" ref={container}>
        <div className="tradingview-widget-container__widget h-full w-full" />
      </div>
    </div>
  )
}
