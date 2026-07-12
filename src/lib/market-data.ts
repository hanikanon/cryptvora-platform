/* Deterministic mock market data for the Cryptvora terminal.
   All numbers are seeded so server/client render identically. */

export type Coin = {
  symbol: string
  name: string
  price: number
  change24h: number
  volume: number
  marketCap: number
  spark: number[]
}

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function spark(seed: number, base: number, drift: number) {
  const rnd = seeded(seed)
  const out: number[] = []
  let v = base
  for (let i = 0; i < 32; i++) {
    v += (rnd() - 0.5 + drift * 0.15) * base * 0.02
    out.push(Number(v.toFixed(2)))
  }
  return out
}

export const COINS: Coin[] = [
  { symbol: "BTC", name: "Bitcoin", price: 97432.5, change24h: 2.41, volume: 42.1e9, marketCap: 1920e9, spark: spark(1, 95000, 1) },
  { symbol: "ETH", name: "Ethereum", price: 3618.22, change24h: 3.87, volume: 21.4e9, marketCap: 435e9, spark: spark(2, 3500, 1.2) },
  { symbol: "SOL", name: "Solana", price: 238.91, change24h: 6.14, volume: 6.8e9, marketCap: 112e9, spark: spark(3, 220, 1.6) },
  { symbol: "BNB", name: "BNB", price: 712.44, change24h: -1.22, volume: 2.1e9, marketCap: 103e9, spark: spark(4, 720, -0.6) },
  { symbol: "XRP", name: "Ripple", price: 2.418, change24h: -3.05, volume: 5.9e9, marketCap: 137e9, spark: spark(5, 2.5, -0.9) },
  { symbol: "ADA", name: "Cardano", price: 1.078, change24h: 4.42, volume: 1.6e9, marketCap: 38e9, spark: spark(6, 1.0, 1.1) },
  { symbol: "AVAX", name: "Avalanche", price: 42.63, change24h: 5.28, volume: 1.1e9, marketCap: 17e9, spark: spark(7, 40, 1.3) },
  { symbol: "DOGE", name: "Dogecoin", price: 0.3921, change24h: -2.14, volume: 3.2e9, marketCap: 57e9, spark: spark(8, 0.4, -0.5) },
  { symbol: "LINK", name: "Chainlink", price: 24.18, change24h: 7.91, volume: 0.9e9, marketCap: 15e9, spark: spark(9, 22, 1.8) },
  { symbol: "TON", name: "Toncoin", price: 5.42, change24h: 1.12, volume: 0.4e9, marketCap: 13e9, spark: spark(10, 5.3, 0.4) },
  { symbol: "DOT", name: "Polkadot", price: 8.14, change24h: -1.88, volume: 0.5e9, marketCap: 11e9, spark: spark(11, 8.3, -0.5) },
  { symbol: "MATIC", name: "Polygon", price: 0.612, change24h: 3.02, volume: 0.6e9, marketCap: 6e9, spark: spark(12, 0.59, 0.9) },
]

export type Candle = { t: number; o: number; h: number; l: number; c: number; v: number }

export function generateCandles(seed = 42, count = 90, start = 92000): Candle[] {
  const rnd = seeded(seed)
  const out: Candle[] = []
  let prev = start
  for (let i = 0; i < count; i++) {
    const o = prev
    const vol = (rnd() - 0.48) * start * 0.02
    const c = Math.max(start * 0.7, o + vol)
    const h = Math.max(o, c) + rnd() * start * 0.008
    const l = Math.min(o, c) - rnd() * start * 0.008
    out.push({
      t: i,
      o: Number(o.toFixed(2)),
      h: Number(h.toFixed(2)),
      l: Number(l.toFixed(2)),
      c: Number(c.toFixed(2)),
      v: Number((rnd() * 1200 + 200).toFixed(0)),
    })
    prev = c
  }
  return out
}

export function generateSeries(seed: number, count: number, base: number, drift = 1) {
  const rnd = seeded(seed)
  let v = base
  const out: { i: number; value: number }[] = []
  for (let i = 0; i < count; i++) {
    v += (rnd() - 0.45 + drift * 0.1) * base * 0.03
    out.push({ i, value: Number(Math.max(base * 0.4, v).toFixed(2)) })
  }
  return out
}

export const portfolioGrowth = Array.from({ length: 30 }, (_, i) => {
  const base = 180000
  const v = base + i * 4200 + Math.sin(i / 2) * 9000
  return { day: `D${i + 1}`, value: Number(v.toFixed(0)) }
})

export const pnlData = Array.from({ length: 24 }, (_, i) => {
  const rnd = seeded(100 + i)
  return { h: `${i}:00`, pnl: Number(((rnd() - 0.4) * 4200).toFixed(0)) }
})

export const volumeData = Array.from({ length: 20 }, (_, i) => {
  const rnd = seeded(200 + i)
  return { t: `${i}`, vol: Number((rnd() * 900 + 120).toFixed(0)) }
})

export const monthlyRoi = [
  { m: "Jan", roi: 8.2 }, { m: "Feb", roi: -3.1 }, { m: "Mar", roi: 12.4 },
  { m: "Apr", roi: 5.6 }, { m: "May", roi: 18.9 }, { m: "Jun", roi: -6.2 },
  { m: "Jul", roi: 9.4 }, { m: "Aug", roi: 14.1 }, { m: "Sep", roi: 4.3 },
  { m: "Oct", roi: 21.7 }, { m: "Nov", roi: 11.2 }, { m: "Dec", roi: 16.8 },
]

export const weeklyPerf = [
  { d: "Mon", value: 3200 }, { d: "Tue", value: -1400 }, { d: "Wed", value: 5100 },
  { d: "Thu", value: 2200 }, { d: "Fri", value: 6400 }, { d: "Sat", value: -900 },
  { d: "Sun", value: 1800 },
]

export const allocation = [
  { name: "BTC", value: 42, color: "var(--gold)" },
  { name: "ETH", value: 27, color: "var(--cyan)" },
  { name: "SOL", value: 14, color: "var(--gain)" },
  { name: "Stables", value: 11, color: "var(--chart-5)" },
  { name: "Alts", value: 6, color: "var(--loss)" },
]

export type Position = {
  symbol: string
  side: "LONG" | "SHORT"
  size: number
  entry: number
  mark: number
  leverage: number
  pnl: number
  roe: number
}

export const openPositions: Position[] = [
  { symbol: "BTCUSDT", side: "LONG", size: 1.24, entry: 94210, mark: 97432, leverage: 10, pnl: 3995.28, roe: 34.2 },
  { symbol: "ETHUSDT", side: "LONG", size: 18.5, entry: 3480, mark: 3618, leverage: 5, pnl: 2553.0, roe: 19.8 },
  { symbol: "SOLUSDT", side: "SHORT", size: 120, entry: 248, mark: 238.91, leverage: 8, pnl: 1090.8, roe: 29.3 },
  { symbol: "XRPUSDT", side: "SHORT", size: 4200, entry: 2.36, mark: 2.418, leverage: 6, pnl: -243.6, roe: -14.7 },
  { symbol: "AVAXUSDT", side: "LONG", size: 210, entry: 39.8, mark: 42.63, leverage: 4, pnl: 594.3, roe: 28.4 },
]

export type Trade = {
  time: string
  symbol: string
  side: "BUY" | "SELL"
  price: number
  amount: number
  total: number
}

export const recentTrades: Trade[] = Array.from({ length: 14 }, (_, i) => {
  const rnd = seeded(500 + i)
  const buy = rnd() > 0.5
  const price = 97432 + (rnd() - 0.5) * 120
  const amount = Number((rnd() * 0.8 + 0.02).toFixed(3))
  return {
    time: `12:${(59 - i).toString().padStart(2, "0")}:0${i % 9}`,
    symbol: "BTC/USDT",
    side: buy ? "BUY" : "SELL",
    price: Number(price.toFixed(1)),
    amount,
    total: Number((price * amount).toFixed(2)),
  }
})

export const orderHistory = Array.from({ length: 10 }, (_, i) => {
  const rnd = seeded(700 + i)
  const coins = ["BTC", "ETH", "SOL", "BNB", "XRP"]
  const c = coins[i % coins.length]
  return {
    id: `CV${(90210 + i).toString()}`,
    symbol: `${c}/USDT`,
    type: (["Limit", "Market", "Stop"] as const)[i % 3],
    side: rnd() > 0.5 ? ("BUY" as const) : ("SELL" as const),
    price: Number((rnd() * 90000 + 100).toFixed(2)),
    filled: `${Math.round(rnd() * 100)}%`,
    status: (["Filled", "Partial", "Canceled"] as const)[i % 3],
  }
})

export function buildOrderBook(mid = 97432.5) {
  const rnd = seeded(999)
  const asks = Array.from({ length: 12 }, (_, i) => {
    const price = mid + (i + 1) * (4 + rnd() * 3)
    const amount = Number((rnd() * 2.4 + 0.05).toFixed(3))
    return { price: Number(price.toFixed(1)), amount, total: Number((price * amount).toFixed(0)) }
  }).reverse()
  const bids = Array.from({ length: 12 }, (_, i) => {
    const price = mid - (i + 1) * (4 + rnd() * 3)
    const amount = Number((rnd() * 2.4 + 0.05).toFixed(3))
    return { price: Number(price.toFixed(1)), amount, total: Number((price * amount).toFixed(0)) }
  })
  return { asks, bids, mid }
}

export const depthData = (() => {
  const book = buildOrderBook()
  let bidCum = 0
  let askCum = 0
  const bids = [...book.bids].map((b) => {
    bidCum += b.amount
    return { price: b.price, bid: Number(bidCum.toFixed(2)), ask: 0 }
  })
  const asks = [...book.asks].reverse().map((a) => {
    askCum += a.amount
    return { price: a.price, bid: 0, ask: Number(askCum.toFixed(2)) }
  })
  return [...bids.reverse(), ...asks]
})()

/* Market heatmap tiles */
export const heatmap = COINS.map((c) => ({
  symbol: c.symbol,
  change: c.change24h,
  size: Math.log10(c.marketCap),
}))

/* Wallet balances */
export const wallets = {
  spot: { total: 128420.55, available: 96210.2, locked: 32210.35, pnl: 4210.5 },
  futures: { total: 84210.18, available: 51200.0, locked: 33010.18, pnl: 7982.68 },
  funding: { total: 32100.4, available: 32100.4, locked: 0, pnl: 0 },
  margin: { total: 41520.9, available: 28110.5, locked: 13410.4, pnl: -1204.2 },
}

export type WalletKey = keyof typeof wallets

export const walletAssets = [
  { asset: "BTC", name: "Bitcoin", amount: 0.842, value: 82018.0, alloc: 44 },
  { asset: "ETH", name: "Ethereum", amount: 12.4, value: 44866.0, alloc: 24 },
  { asset: "SOL", name: "Solana", amount: 84.2, value: 20116.0, alloc: 11 },
  { asset: "USDT", name: "Tether", amount: 21400, value: 21400.0, alloc: 12 },
  { asset: "BNB", name: "BNB", amount: 12.1, value: 8620.0, alloc: 5 },
  { asset: "LINK", name: "Chainlink", amount: 320, value: 7737.0, alloc: 4 },
]

export const transactions = [
  { type: "Deposit", asset: "USDT", amount: 15000, time: "Today 09:41", status: "Completed", network: "TRC20" },
  { type: "Withdraw", asset: "BTC", amount: 0.25, time: "Today 08:12", status: "Completed", network: "BTC" },
  { type: "Transfer", asset: "ETH", amount: 4.2, time: "Yesterday 22:05", status: "Completed", network: "Internal" },
  { type: "Deposit", asset: "SOL", amount: 120, time: "Yesterday 14:33", status: "Completed", network: "SOL" },
  { type: "Withdraw", asset: "USDT", amount: 8200, time: "2 days ago", status: "Pending", network: "ERC20" },
  { type: "Transfer", asset: "BNB", amount: 6.5, time: "3 days ago", status: "Completed", network: "Internal" },
]

/* Exchanges for API center */
export const exchanges = [
  { name: "Binance", status: "connected", latency: 12, color: "var(--gold)" },
  { name: "Bybit", status: "connected", latency: 18, color: "var(--gold)" },
  { name: "OKX", status: "connected", latency: 21, color: "var(--foreground)" },
  { name: "KuCoin", status: "syncing", latency: 34, color: "var(--gain)" },
  { name: "Coinbase", status: "disconnected", latency: 0, color: "var(--cyan)" },
] as const

/* Calendar PnL for the month */
export function monthPnl(seed = 321) {
  const rnd = seeded(seed)
  return Array.from({ length: 35 }, (_, i) => {
    const inMonth = i >= 2 && i < 32
    const pnl = inMonth ? Number(((rnd() - 0.42) * 5200).toFixed(0)) : null
    return { day: inMonth ? i - 1 : null, pnl }
  })
}

export const economicEvents = [
  { date: "Jul 10", title: "US CPI (YoY)", impact: "high", tag: "CPI", time: "13:30" },
  { date: "Jul 15", title: "FOMC Rate Decision", impact: "high", tag: "FOMC", time: "19:00" },
  { date: "Jul 18", title: "ARB Token Unlock", impact: "medium", tag: "Unlock", time: "00:00" },
  { date: "Jul 22", title: "ETH ETF Inflow Report", impact: "medium", tag: "ETF", time: "16:00" },
  { date: "Jul 25", title: "Non-Farm Payrolls", impact: "high", tag: "NFP", time: "13:30" },
  { date: "Jul 29", title: "OP Token Unlock", impact: "low", tag: "Unlock", time: "00:00" },
]

export const newsFeed = [
  { source: "Cryptvora Wire", time: "2m", title: "BTC reclaims $97K as spot ETF inflows hit weekly record", tag: "Markets" },
  { source: "Bloomberg", time: "14m", title: "Fed signals data-dependent stance ahead of July FOMC", tag: "Macro" },
  { source: "Reuters", time: "38m", title: "Ethereum staking yield climbs after Pectra upgrade adoption", tag: "ETH" },
  { source: "Cryptvora Wire", time: "1h", title: "Solana network throughput sets new mainnet high", tag: "SOL" },
  { source: "CoinDesk", time: "2h", title: "Institutional desks rotate into large-cap alts", tag: "Flows" },
]
