// Static mock data for the Community Chat design showcase.
// No backend, no chat logic — purely to populate the premium UI.

export type Tier = "diamond" | "gold" | "silver";

export interface Room {
  id: string;
  name: string;
  handle: string;
  emoji: string;
  members: number;
  unread?: number;
  live?: boolean;
  accent: string; // token-based tint class
}

export interface DirectMessage {
  id: string;
  name: string;
  handle: string;
  status: "online" | "away" | "offline";
  last: string;
  time: string;
  unread?: number;
  tier?: Tier;
}

export const ROOMS: Room[] = [
  { id: "signals", name: "Alpha Signals", handle: "alpha-signals", emoji: "⚡", members: 12480, unread: 24, live: true, accent: "primary" },
  { id: "spot", name: "Spot Trading", handle: "spot", emoji: "📈", members: 8213, unread: 3, accent: "gain" },
  { id: "defi", name: "DeFi & Yield", handle: "defi", emoji: "🌾", members: 5401, accent: "gold" },
  { id: "nft", name: "NFT Lounge", handle: "nft", emoji: "🎨", members: 3120, unread: 8, accent: "primary" },
  { id: "macro", name: "Macro & News", handle: "macro", emoji: "🌍", members: 6740, accent: "gain" },
];

export const FAVORITES: Room[] = [
  { id: "btc", name: "#bitcoin", handle: "bitcoin", emoji: "₿", members: 21033, live: true, accent: "gold" },
  { id: "eth", name: "#ethereum", handle: "ethereum", emoji: "Ξ", members: 15980, accent: "primary" },
];

export const DIRECT_MESSAGES: DirectMessage[] = [
  { id: "d1", name: "Elena Vasquez", handle: "elena", status: "online", last: "Just closed my BTC long 🎯", time: "2m", unread: 2, tier: "diamond" },
  { id: "d2", name: "Marcus Lee", handle: "marcus", status: "online", last: "Sending the portfolio breakdown", time: "14m", tier: "gold" },
  { id: "d3", name: "Aria Kane", handle: "aria", status: "away", last: "Chart looks bullish tbh", time: "1h", tier: "silver" },
  { id: "d4", name: "Devon Park", handle: "devon", status: "offline", last: "Thanks for the alpha 🙏", time: "3h" },
];

export type Reaction = { emoji: string; count: number; me?: boolean };

export type Message =
  | {
      id: string;
      kind: "text";
      author: string;
      handle: string;
      tier?: Tier;
      time: string;
      text: string;
      me?: boolean;
      reactions?: Reaction[];
      replyTo?: { author: string; text: string };
    }
  | {
      id: string;
      kind: "crypto";
      author: string;
      handle: string;
      tier?: Tier;
      time: string;
      me?: boolean;
    }
  | {
      id: string;
      kind: "news";
      author: string;
      handle: string;
      tier?: Tier;
      time: string;
      reactions?: Reaction[];
    }
  | {
      id: string;
      kind: "trade";
      author: string;
      handle: string;
      tier?: Tier;
      time: string;
      me?: boolean;
    }
  | {
      id: string;
      kind: "portfolio";
      author: string;
      handle: string;
      tier?: Tier;
      time: string;
    }
  | {
      id: string;
      kind: "image";
      author: string;
      handle: string;
      tier?: Tier;
      time: string;
      caption?: string;
      reactions?: Reaction[];
    }
  | {
      id: string;
      kind: "file";
      author: string;
      handle: string;
      tier?: Tier;
      time: string;
    };

export const MESSAGES: Message[] = [
  {
    id: "m1",
    kind: "text",
    author: "Elena Vasquez",
    handle: "elena",
    tier: "diamond",
    time: "09:41",
    text: "gm traders ☀️ market's waking up. Watching the 62k reclaim on BTC closely.",
    reactions: [{ emoji: "🔥", count: 12 }, { emoji: "👀", count: 5 }],
  },
  {
    id: "m2",
    kind: "crypto",
    author: "Elena Vasquez",
    handle: "elena",
    tier: "diamond",
    time: "09:42",
  },
  {
    id: "m3",
    kind: "text",
    author: "Marcus Lee",
    handle: "marcus",
    tier: "gold",
    time: "09:44",
    text: "Agreed. If we hold above the daily VWAP I'm adding. @elena what's your invalidation?",
    replyTo: { author: "Elena Vasquez", text: "Watching the 62k reclaim on BTC closely." },
    reactions: [{ emoji: "💯", count: 3 }],
  },
  {
    id: "m4",
    kind: "trade",
    author: "Marcus Lee",
    handle: "marcus",
    tier: "gold",
    time: "09:45",
  },
  {
    id: "m5",
    kind: "news",
    author: "Macro Desk",
    handle: "macrodesk",
    time: "09:48",
    reactions: [{ emoji: "🚀", count: 8 }, { emoji: "🧠", count: 2 }],
  },
  {
    id: "m6",
    kind: "text",
    author: "You",
    handle: "you",
    me: true,
    time: "09:50",
    text: "Loading up here. Invalidation is a clean loss of 60.8k on the 4h close for me 👇",
    reactions: [{ emoji: "🙌", count: 4, me: true }],
  },
  {
    id: "m7",
    kind: "portfolio",
    author: "You",
    handle: "you",
    time: "09:50",
  },
  {
    id: "m8",
    kind: "image",
    author: "Aria Kane",
    handle: "aria",
    tier: "silver",
    time: "09:53",
    caption: "My BTC setup — ascending triangle forming nicely.",
    reactions: [{ emoji: "📈", count: 9 }, { emoji: "🔥", count: 6 }],
  },
  {
    id: "m9",
    kind: "file",
    author: "Aria Kane",
    handle: "aria",
    tier: "silver",
    time: "09:54",
  },
];

export const CRYPTO = {
  symbol: "BTC",
  name: "Bitcoin",
  price: 62438.21,
  change: 3.42,
  spark: [38, 42, 40, 46, 44, 52, 58, 55, 63, 68, 64, 72],
};

export const NEWS = {
  source: "Bloomberg",
  time: "12 min ago",
  title: "Spot Bitcoin ETFs Log Record $1.2B Daily Inflow as Momentum Builds",
  excerpt: "Institutional demand accelerates into quarter-end, with BlackRock's fund leading net creations for a fifth consecutive session.",
};

export const TRADE = {
  side: "LONG" as const,
  pair: "BTC/USDT",
  entry: 61240,
  target: 68500,
  stop: 59800,
  leverage: "5x",
  pnl: 11.8,
};

export const PORTFOLIO = {
  total: 128940.55,
  change: 8.4,
  allocation: [
    { sym: "BTC", pct: 46, tint: "gold" },
    { sym: "ETH", pct: 28, tint: "primary" },
    { sym: "SOL", pct: 16, tint: "gain" },
    { sym: "USDC", pct: 10, tint: "muted" },
  ],
};

export const PINNED = {
  title: "Weekly Alpha Recap",
  by: "Elena Vasquez",
};

export const MEMBERS_ONLINE = [
  { name: "Elena", tier: "diamond" as Tier },
  { name: "Marcus", tier: "gold" as Tier },
  { name: "Aria", tier: "silver" as Tier },
  { name: "Devon", tier: "silver" as Tier },
  { name: "Kai", tier: "gold" as Tier },
];

/* ============================================================
 * Extended premium crypto card data (design showcase, no backend)
 * ============================================================ */

export interface CoinInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  glyph: string;
  tint: "gold" | "primary" | "gain" | "loss";
  spark: number[];
  cap: string;
  vol: string;
  rank: number;
}

export const COINS: Record<string, CoinInfo> = {
  BTC: { symbol: "BTC", name: "Bitcoin", price: 62438.21, change: 3.42, glyph: "₿", tint: "gold", cap: "$1.23T", vol: "$38.1B", rank: 1, spark: [38, 42, 40, 46, 44, 52, 58, 55, 63, 68, 64, 72] },
  ETH: { symbol: "ETH", name: "Ethereum", price: 3418.55, change: 2.18, glyph: "Ξ", tint: "primary", cap: "$411B", vol: "$18.4B", rank: 2, spark: [40, 41, 44, 43, 48, 47, 52, 56, 54, 60, 62, 66] },
  SOL: { symbol: "SOL", name: "Solana", price: 168.42, change: -1.24, glyph: "◎", tint: "gain", cap: "$77B", vol: "$4.1B", rank: 5, spark: [60, 58, 62, 57, 55, 53, 50, 52, 49, 47, 48, 45] },
  BNB: { symbol: "BNB", name: "BNB", price: 592.13, change: 0.86, glyph: "⬡", tint: "gold", cap: "$88B", vol: "$2.2B", rank: 4, spark: [50, 51, 49, 52, 53, 52, 55, 54, 57, 56, 58, 59] },
};

export const SIGNAL = {
  pair: "ETH/USDT",
  side: "LONG" as const,
  confidence: 82,
  entry: 3380,
  targets: [3520, 3680, 3900],
  stop: 3240,
  rr: "1:3.4",
  by: "Alpha Desk",
};

export const TRADE_IDEA = {
  title: "SOL reclaim setup",
  thesis: "Higher-low structure on the 4H with volume returning. Watching a clean reclaim of the range mid for continuation.",
  bias: "Bullish",
  timeframe: "4H",
  by: "Marcus Lee",
};

export const PNL = {
  pair: "BTC/USDT",
  side: "LONG" as const,
  roi: 148.6,
  pnl: 4820,
  entry: 58200,
  exit: 62438,
  leverage: "10x",
  by: "Elena Vasquez",
};

export const WALLET = {
  label: "Main Wallet",
  address: "0x7a2f…9c41",
  total: 84210.42,
  change: 5.2,
  chains: [
    { name: "Ethereum", pct: 54, tint: "primary" as const },
    { name: "Solana", pct: 28, tint: "gain" as const },
    { name: "Base", pct: 18, tint: "gold" as const },
  ],
};

export const TA = {
  pair: "BTC/USDT",
  summary: "Strong Buy",
  score: 78,
  indicators: [
    { name: "RSI (14)", val: "61.4", sig: "Buy" as const },
    { name: "MACD", val: "+142", sig: "Buy" as const },
    { name: "EMA 200", val: "59,820", sig: "Buy" as const },
    { name: "Stoch", val: "82.1", sig: "Neutral" as const },
  ],
};

export const MARKET = {
  title: "Market Overview",
  cap: "$2.41T",
  capChange: 2.9,
  vol: "$96.4B",
  sentiment: "Risk-On",
  note: "Breadth improving as majors lead. Altcoin rotation early but building.",
};

export const AI_ANALYSIS = {
  pair: "BTC/USDT",
  verdict: "Accumulate",
  confidence: 74,
  points: [
    "ETF inflows sustained for 5 sessions",
    "Funding neutral — no crowded longs",
    "Key support holding at 60.8k",
  ],
};

export const CALENDAR = {
  event: "US CPI Release",
  impact: "High" as const,
  when: "Today · 14:30 UTC",
  forecast: "3.1%",
  previous: "3.4%",
  country: "US",
};

export const EXCHANGES = [
  { name: "Binance", pair: "BTC/USDT", price: 62438.2, glyph: "🅱", tint: "gold" as const },
  { name: "Coinbase", pair: "BTC/USD", price: 62451.7, glyph: "Ⓒ", tint: "primary" as const },
  { name: "Kraken", pair: "BTC/USD", price: 62429.9, glyph: "🐙", tint: "gain" as const },
];

export const WATCHLIST = [
  { sym: "BTC", price: 62438, change: 3.42 },
  { sym: "ETH", price: 3418, change: 2.18 },
  { sym: "SOL", price: 168.4, change: -1.24 },
  { sym: "AVAX", price: 41.2, change: 4.8 },
  { sym: "LINK", price: 18.7, change: -0.6 },
];

export const COMPARE = {
  a: { sym: "BTC", change: 3.42, cap: "$1.23T", dom: "54%", vol: "$38B" },
  b: { sym: "ETH", change: 2.18, cap: "$411B", dom: "17%", vol: "$18B" },
};

export const FEAR_GREED = { value: 72, label: "Greed", yesterday: 65, week: 58 };

export const DOMINANCE = { btc: 54.2, eth: 17.1, others: 28.7, change: 0.4 };

export const TRENDING = [
  { sym: "PEPE", name: "Pepe", change: 24.1 },
  { sym: "WIF", name: "dogwifhat", change: 18.6 },
  { sym: "TIA", name: "Celestia", change: 12.3 },
  { sym: "SEI", name: "Sei", change: 9.4 },
];

export const GAINERS = [
  { sym: "PEPE", price: 0.0000112, change: 24.1 },
  { sym: "WIF", price: 2.84, change: 18.6 },
  { sym: "TIA", price: 8.12, change: 12.3 },
];

export const LOSERS = [
  { sym: "ORDI", price: 41.2, change: -9.8 },
  { sym: "APT", price: 8.44, change: -7.1 },
  { sym: "SUI", price: 1.62, change: -5.4 },
];

/* ---------- Community ---------- */
export const ANNOUNCEMENTS = [
  { title: "Cryptvora Pro launches Friday", by: "Team", time: "1h", tag: "Product" },
  { title: "New verified analysts onboarded", by: "Team", time: "1d", tag: "Community" },
];

export const EVENTS = [
  { title: "Live Market Breakdown", when: "Today · 18:00 UTC", host: "Elena Vasquez", going: 312 },
  { title: "DeFi Yield Workshop", when: "Sat · 15:00 UTC", host: "Marcus Lee", going: 148 },
];

export const POLL = {
  question: "Where does BTC close this week?",
  votes: 1284,
  options: [
    { label: "Above $65k", pct: 46 },
    { label: "$60k – $65k", pct: 38 },
    { label: "Below $60k", pct: 16 },
  ],
};

export const DISCUSSIONS = [
  { title: "Is the altseason finally here?", replies: 214, hot: true },
  { title: "Best cold storage in 2026?", replies: 96 },
  { title: "Reading funding rates like a pro", replies: 173, pinned: true },
];

export const EDUCATION = [
  { title: "Risk management masterclass", level: "Beginner", mins: 8 },
  { title: "Understanding market structure", level: "Intermediate", mins: 12 },
];

/* ---------- Profile ---------- */
export const PROFILE = {
  name: "Jordan Rivers",
  handle: "jordan",
  bio: "Full-time crypto trader · macro nerd · sharing setups & risk, not financial advice.",
  country: "🇸🇬 Singapore",
  joined: "Joined Mar 2023",
  tier: "diamond" as Tier,
  verified: true,
  premium: true,
  favoriteCoin: "BTC",
  style: "Swing Trader",
  portfolioLevel: "Whale",
  traderLevel: "Level 42",
  stats: { followers: "12.4k", winRate: "68%", trades: 1240 },
  achievements: [
    { icon: "🏆", label: "Top Caller" },
    { icon: "🎯", label: "Sniper" },
    { icon: "🔥", label: "30-day Streak" },
    { icon: "💎", label: "Diamond Hands" },
  ],
};
