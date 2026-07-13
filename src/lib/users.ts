export type Tier = "DIAMOND" | "GOLD" | "PLATINUM" | "SILVER" | "BRONZE"

export type UserProfile = {
  username: string
  name: string
  bio: string
  tier: Tier
  verified?: boolean
  stats: { posts: number; followers: string; following: number }
  winRate: number
  posts: { id: string; pnl: string; pair: string; tone: "gain" | "loss"; likes: number; comments: number; spark: number[] }[]
}

function spark(seed: number, up: boolean) {
  let s = seed
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const out: number[] = []
  let v = 50
  for (let i = 0; i < 16; i++) {
    v += (rnd() - (up ? 0.35 : 0.65)) * 14
    v = Math.max(8, Math.min(92, v))
    out.push(v)
  }
  return out
}

export const CURRENT_USERNAME = "hanibadji"

export const USERS: Record<string, UserProfile> = {
  hanibadji: {
    username: "hanibadji",
    name: "Hani Badji",
    bio: "Full-time trader · sharing setups & PnL",
    tier: "GOLD",
    verified: true,
    stats: { posts: 86, followers: "12.4K", following: 248 },
    winRate: 62,
    posts: [
      { id: "1", pnl: "+18.4%", pair: "BTC/USDT", tone: "gain", likes: 337, comments: 21, spark: spark(10, true) },
      { id: "2", pnl: "+6.1%", pair: "ETH/USDT", tone: "gain", likes: 474, comments: 34, spark: spark(17, true) },
      { id: "3", pnl: "-2.3%", pair: "SOL/USDT", tone: "loss", likes: 611, comments: 47, spark: spark(24, false) },
      { id: "4", pnl: "+41.0%", pair: "AVAX/USDT", tone: "gain", likes: 748, comments: 60, spark: spark(31, true) },
      { id: "5", pnl: "+3.8%", pair: "LINK/USDT", tone: "gain", likes: 885, comments: 73, spark: spark(38, true) },
      { id: "6", pnl: "+12.6%", pair: "BNB/USDT", tone: "gain", likes: 1022, comments: 86, spark: spark(45, true) },
    ],
  },
  solqueen: {
    username: "solqueen",
    name: "Sol Queen",
    bio: "SOL & majors · trend continuation setups",
    tier: "DIAMOND",
    verified: true,
    stats: { posts: 214, followers: "48.2K", following: 112 },
    winRate: 71,
    posts: [
      { id: "1", pnl: "+12.3%", pair: "SOL/USDT", tone: "gain", likes: 1159, comments: 99, spark: spark(52, true) },
      { id: "2", pnl: "+8.9%", pair: "SOL/USDT", tone: "gain", likes: 1296, comments: 112, spark: spark(59, true) },
      { id: "3", pnl: "+22.1%", pair: "JUP/USDT", tone: "gain", likes: 1433, comments: 125, spark: spark(66, true) },
      { id: "4", pnl: "-4.0%", pair: "WIF/USDT", tone: "loss", likes: 1570, comments: 138, spark: spark(73, false) },
      { id: "5", pnl: "+15.7%", pair: "SOL/USDT", tone: "gain", likes: 1707, comments: 151, spark: spark(80, true) },
      { id: "6", pnl: "+5.2%", pair: "RAY/USDT", tone: "gain", likes: 1844, comments: 164, spark: spark(87, true) },
    ],
  },
  quantfox: {
    username: "quantfox",
    name: "Quant Fox",
    bio: "Systematic strategies · ETH derivatives",
    tier: "PLATINUM",
    stats: { posts: 132, followers: "31.7K", following: 64 },
    winRate: 58,
    posts: [
      { id: "1", pnl: "-1.4%", pair: "ETH/USDT", tone: "loss", likes: 1981, comments: 177, spark: spark(94, false) },
      { id: "2", pnl: "+9.2%", pair: "ETH/USDT", tone: "gain", likes: 2118, comments: 10, spark: spark(101, true) },
      { id: "3", pnl: "+3.1%", pair: "ARB/USDT", tone: "gain", likes: 2255, comments: 23, spark: spark(108, true) },
      { id: "4", pnl: "+14.8%", pair: "OP/USDT", tone: "gain", likes: 2392, comments: 36, spark: spark(115, true) },
      { id: "5", pnl: "-3.6%", pair: "ETH/USDT", tone: "loss", likes: 2529, comments: 49, spark: spark(122, false) },
      { id: "6", pnl: "+7.4%", pair: "ETH/USDT", tone: "gain", likes: 2666, comments: 62, spark: spark(129, true) },
    ],
  },
  alphaowl: {
    username: "alphaowl",
    name: "Alpha Owl",
    bio: "Macro views · risk management first",
    tier: "SILVER",
    stats: { posts: 58, followers: "9.1K", following: 301 },
    winRate: 54,
    posts: [
      { id: "1", pnl: "+4.4%", pair: "BTC/USDT", tone: "gain", likes: 2803, comments: 75, spark: spark(136, true) },
      { id: "2", pnl: "+1.2%", pair: "BTC/USDT", tone: "gain", likes: 2940, comments: 88, spark: spark(143, true) },
      { id: "3", pnl: "-5.8%", pair: "DOGE/USDT", tone: "loss", likes: 3077, comments: 101, spark: spark(150, false) },
      { id: "4", pnl: "+6.6%", pair: "ADA/USDT", tone: "gain", likes: 3214, comments: 114, spark: spark(157, true) },
      { id: "5", pnl: "+2.0%", pair: "BTC/USDT", tone: "gain", likes: 3351, comments: 127, spark: spark(164, true) },
      { id: "6", pnl: "-1.1%", pair: "XRP/USDT", tone: "loss", likes: 3488, comments: 140, spark: spark(171, false) },
    ],
  },
}

export function getUser(username: string): UserProfile {
  return (
    USERS[username] ?? {
      username,
      name: username,
      bio: "Cryptvora trader",
      tier: "BRONZE",
      stats: { posts: 0, followers: "0", following: 0 },
      winRate: 0,
      posts: [],
    }
  )
}
