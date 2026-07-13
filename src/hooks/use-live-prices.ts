import { useEffect, useRef, useState } from "react"
import { COINS, type Coin } from "@/lib/market-data"

/**
 * Maps our internal ticker symbols to CoinGecko coin ids.
 * CoinGecko's /simple/price endpoint is free, keyless and CORS-enabled,
 * so this fetch runs safely straight from the browser.
 */
const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  XRP: "ripple",
  ADA: "cardano",
  AVAX: "avalanche-2",
  DOGE: "dogecoin",
  LINK: "chainlink",
  TON: "the-open-network",
  DOT: "polkadot",
  MATIC: "matic-network",
}

type LiveCoin = Coin & { live?: boolean }

const REFRESH_MS = 25_000

let cache: LiveCoin[] | null = null
let cacheAt = 0
const listeners = new Set<(coins: LiveCoin[]) => void>()
let polling = false

async function fetchLivePrices(): Promise<LiveCoin[] | null> {
  try {
    const ids = Object.values(COINGECKO_IDS).join(",")
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
    )
    if (!res.ok) return null
    const data = await res.json()

    return COINS.map((c) => {
      const id = COINGECKO_IDS[c.symbol]
      const live = id ? data[id] : null
      if (!live || typeof live.usd !== "number") return c
      return {
        ...c,
        price: live.usd,
        change24h: typeof live.usd_24h_change === "number" ? live.usd_24h_change : c.change24h,
        volume: typeof live.usd_24h_vol === "number" ? live.usd_24h_vol : c.volume,
        marketCap: typeof live.usd_market_cap === "number" ? live.usd_market_cap : c.marketCap,
        live: true,
      }
    })
  } catch {
    return null
  }
}

function startPolling() {
  if (polling) return
  polling = true
  const tick = async () => {
    const fresh = await fetchLivePrices()
    if (fresh) {
      cache = fresh
      cacheAt = Date.now()
      listeners.forEach((cb) => cb(fresh))
    }
  }
  tick()
  setInterval(tick, REFRESH_MS)
}

/**
 * Returns COINS with live prices merged in once the first successful
 * fetch resolves. Falls back to the static seeded data (so layout never
 * breaks) until then, and silently keeps the fallback if the network
 * call fails — no loading spinners, no broken UI.
 */
export function useLivePrices(): { coins: LiveCoin[]; isLive: boolean; updatedAt: number } {
  const [coins, setCoins] = useState<LiveCoin[]>(cache ?? COINS)
  const [updatedAt, setUpdatedAt] = useState(cacheAt)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    startPolling()
    const cb = (fresh: LiveCoin[]) => {
      if (mounted.current) {
        setCoins(fresh)
        setUpdatedAt(Date.now())
      }
    }
    listeners.add(cb)
    if (cache) {
      setCoins(cache)
      setUpdatedAt(cacheAt)
    }
    return () => {
      mounted.current = false
      listeners.delete(cb)
    }
  }, [])

  return { coins, isLive: coins.some((c) => c.live), updatedAt }
}

export function useLiveCoin(symbol: string) {
  const { coins, isLive } = useLivePrices()
  return { coin: coins.find((c) => c.symbol === symbol) ?? COINS.find((c) => c.symbol === symbol)!, isLive }
}
