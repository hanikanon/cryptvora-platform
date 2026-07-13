export type Tier = "DIAMOND" | "GOLD" | "PLATINUM" | "SILVER" | "BRONZE"

export type UserProfile = {
  username: string
  name: string
  bio: string
  tier: Tier
  verified?: boolean
  stats: { posts: number; followers: string; following: number }
  winRate: number
  posts: { id: string; pnl: string; pair: string; tone: "gain" | "loss" }[]
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
      { id: "1", pnl: "+18.4%", pair: "BTC/USDT", tone: "gain" },
      { id: "2", pnl: "+6.1%", pair: "ETH/USDT", tone: "gain" },
      { id: "3", pnl: "-2.3%", pair: "SOL/USDT", tone: "loss" },
      { id: "4", pnl: "+41.0%", pair: "AVAX/USDT", tone: "gain" },
      { id: "5", pnl: "+3.8%", pair: "LINK/USDT", tone: "gain" },
      { id: "6", pnl: "+12.6%", pair: "BNB/USDT", tone: "gain" },
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
      { id: "1", pnl: "+12.3%", pair: "SOL/USDT", tone: "gain" },
      { id: "2", pnl: "+8.9%", pair: "SOL/USDT", tone: "gain" },
      { id: "3", pnl: "+22.1%", pair: "JUP/USDT", tone: "gain" },
      { id: "4", pnl: "-4.0%", pair: "WIF/USDT", tone: "loss" },
      { id: "5", pnl: "+15.7%", pair: "SOL/USDT", tone: "gain" },
      { id: "6", pnl: "+5.2%", pair: "RAY/USDT", tone: "gain" },
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
      { id: "1", pnl: "-1.4%", pair: "ETH/USDT", tone: "loss" },
      { id: "2", pnl: "+9.2%", pair: "ETH/USDT", tone: "gain" },
      { id: "3", pnl: "+3.1%", pair: "ARB/USDT", tone: "gain" },
      { id: "4", pnl: "+14.8%", pair: "OP/USDT", tone: "gain" },
      { id: "5", pnl: "-3.6%", pair: "ETH/USDT", tone: "loss" },
      { id: "6", pnl: "+7.4%", pair: "ETH/USDT", tone: "gain" },
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
      { id: "1", pnl: "+4.4%", pair: "BTC/USDT", tone: "gain" },
      { id: "2", pnl: "+1.2%", pair: "BTC/USDT", tone: "gain" },
      { id: "3", pnl: "-5.8%", pair: "DOGE/USDT", tone: "loss" },
      { id: "4", pnl: "+6.6%", pair: "ADA/USDT", tone: "gain" },
      { id: "5", pnl: "+2.0%", pair: "BTC/USDT", tone: "gain" },
      { id: "6", pnl: "-1.1%", pair: "XRP/USDT", tone: "loss" },
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
