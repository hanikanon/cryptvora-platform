/**
 * Two-track progression system.
 *
 * CAPITAL_TIERS  — 20 tiers, thresholded on portfolio value ($).
 * TRADER_TIERS   — 20 tiers, thresholded on trader XP (activity, trades,
 *                  achievements, risk discipline, etc).
 *
 * Badges are rendered as inline SVG via <BadgeSVG /> — no image assets.
 */

export type CapitalTierKey =
  | "bronze" | "silver" | "gold" | "platinum" | "diamond"
  | "master" | "grandmaster" | "legend" | "mythic" | "immortal"
  | "titan" | "celestial" | "sovereign" | "ascendant" | "eternal"
  | "cosmic" | "universal" | "infinity" | "omniversal" | "genesis";

export type TraderTierKey =
  | "beginner" | "explorer" | "skilled" | "advanced" | "professional"
  | "elite" | "expert" | "veteran" | "strategist" | "masterTrader"
  | "grandmasterTrader" | "legendaryTrader" | "mythicTrader" | "titanTrader" | "immortalTrader"
  | "supremeTrader" | "apexTrader" | "quantumTrader" | "infiniteTrader" | "tradingLegend";

export type TierBracket = 1 | 2 | 3 | 4;

export type CapitalTier = {
  track: "capital";
  key: CapitalTierKey;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  min: number;
  color: string;
  color2: string;
  gradient: string;
  glow: string;
  perks: string[];
  perksAr: string[];
  /** Which silhouette bracket the badge falls into (1..4). */
  bracket: TierBracket;
  /** Rank inside the bracket (1..5), used for progressive detail. */
  rankInBracket: number;
  rewards: string[];
  rewardsAr: string[];
};

export type TraderTier = Omit<CapitalTier, "track" | "key"> & {
  track: "trader";
  key: TraderTierKey;
};

/* ------------------------------------------------------------------ */
/*  Capital tiers (portfolio value)                                    */
/* ------------------------------------------------------------------ */

export const CAPITAL_TIERS: CapitalTier[] = [
  // Bracket 1 — Heraldic shield · metallic foundation
  { track: "capital", key: "bronze", name: "Bronze", nameAr: "برونزي", tagline: "The forge begins", taglineAr: "بداية الرحلة", min: 0, color: "#c47a3f", color2: "#7a4520", gradient: "linear-gradient(135deg,#d99464,#7a4520)", glow: "0 0 24px -6px #b06a3599", bracket: 1, rankInBracket: 1, perks: ["Community access", "Weekly digest"], perksAr: ["دخول للمجتمع", "ملخص أسبوعي"], rewards: ["Bronze profile frame", "Starter badge"], rewardsAr: ["إطار برونزي", "شارة البداية"] },
  { track: "capital", key: "silver", name: "Silver", nameAr: "فضي", tagline: "Polished discipline", taglineAr: "انضباط صاعد", min: 10_000, color: "#c9ccd3", color2: "#8a8f98", gradient: "linear-gradient(135deg,#e8ecf1,#8a8f98)", glow: "0 0 26px -6px #c9ccd399", bracket: 1, rankInBracket: 2, perks: ["Signals", "Weekly report", "Basic academy"], perksAr: ["إشارات", "تقرير أسبوعي", "أكاديمية أساسية"], rewards: ["Silver profile frame", "Chat badge"], rewardsAr: ["إطار فضي", "شارة الدردشة"] },
  { track: "capital", key: "gold", name: "Gold", nameAr: "ذهبي", tagline: "Crowned consistency", taglineAr: "ثبات ذهبي", min: 25_000, color: "#e6b64a", color2: "#8a6a10", gradient: "linear-gradient(135deg,#f7d371,#8a6a10)", glow: "0 0 28px -6px #e6b64acc", bracket: 1, rankInBracket: 3, perks: ["Priority signals", "1:1 support", "Academy access"], perksAr: ["إشارات أولوية", "دعم فردي", "دخول الأكاديمية"], rewards: ["Gold username color", "Animated avatar border"], rewardsAr: ["لون اسم ذهبي", "إطار متحرك"] },
  { track: "capital", key: "platinum", name: "Platinum", nameAr: "بلاتيني", tagline: "Winged precision", taglineAr: "دقة بلاتينية", min: 50_000, color: "#a9c6e8", color2: "#4a6a80", gradient: "linear-gradient(135deg,#dbe9f7,#4a6a80)", glow: "0 0 30px -6px #a9c6e8cc", bracket: 1, rankInBracket: 4, perks: ["OTC desk", "Fee rebates", "Custom alerts"], perksAr: ["مكتب OTC", "خصومات رسوم", "تنبيهات مخصصة"], rewards: ["Platinum dashboard theme", "Telegram bot badge"], rewardsAr: ["ثيم لوحة بلاتيني", "شارة بوت تلغرام"] },
  { track: "capital", key: "diamond", name: "Diamond", nameAr: "ماسي", tagline: "Unbreakable clarity", taglineAr: "صفاء لا يُكسر", min: 100_000, color: "#58c8ee", color2: "#0f5a70", gradient: "linear-gradient(135deg,#a6e6fb,#0f5a70)", glow: "0 0 32px -6px #58c8eecc", bracket: 1, rankInBracket: 5, perks: ["Private desk", "0-fee routing", "Concierge"], perksAr: ["مكتب خاص", "بدون رسوم", "خدمة كونسيرج"], rewards: ["Diamond emoji pack", "Exclusive stickers"], rewardsAr: ["حزمة إيموجي ماسية", "ملصقات حصرية"] },

  // Bracket 2 — Laurel medallion · gemstone core
  { track: "capital", key: "master", name: "Master", nameAr: "ماستر", tagline: "Arcane command", taglineAr: "سيطرة الخبراء", min: 200_000, color: "#a78bfa", color2: "#4c1d95", gradient: "linear-gradient(135deg,#c4b5fd,#4c1d95)", glow: "0 0 34px -6px #a78bfacc", bracket: 2, rankInBracket: 1, perks: ["Structured products", "Portfolio review", "API keys"], perksAr: ["منتجات هيكلية", "مراجعة محفظة", "مفاتيح API"], rewards: ["Arcane profile effect", "Master emoji pack"], rewardsAr: ["تأثير أركاني", "حزمة إيموجي ماستر"] },
  { track: "capital", key: "grandmaster", name: "Grandmaster", nameAr: "جراند ماستر", tagline: "Blades of conviction", taglineAr: "قمة الاحتراف", min: 350_000, color: "#f4506b", color2: "#7f1d2d", gradient: "linear-gradient(135deg,#fb8a9d,#7f1d2d)", glow: "0 0 36px -6px #f4506bcc", bracket: 2, rankInBracket: 2, perks: ["Institutional pricing", "Direct market access", "Dedicated PM"], perksAr: ["أسعار مؤسسية", "وصول مباشر للسوق", "مدير محفظة مخصص"], rewards: ["Crimson chat aura", "Signature confetti"], rewardsAr: ["هالة قرمزية", "قصاصات مميزة"] },
  { track: "capital", key: "legend", name: "Legend", nameAr: "أسطوري", tagline: "Phoenix ascendant", taglineAr: "صعود الأسطورة", min: 500_000, color: "#f5a623", color2: "#92400e", gradient: "linear-gradient(135deg,#fbd57e,#92400e)", glow: "0 0 40px -4px #f5a623dd", bracket: 2, rankInBracket: 3, perks: ["White-glove desk", "Private events", "Custom strategies"], perksAr: ["خدمة كبار العملاء", "فعاليات خاصة", "استراتيجيات مخصصة"], rewards: ["Phoenix profile theme", "Legend username color"], rewardsAr: ["ثيم فينيكس", "لون اسم أسطوري"] },
  { track: "capital", key: "mythic", name: "Mythic", nameAr: "ميثيك", tagline: "Beyond the veil", taglineAr: "ما وراء الحدود", min: 750_000, color: "#2dd4bf", color2: "#134e4a", gradient: "linear-gradient(135deg,#7df3e3,#134e4a)", glow: "0 0 44px -4px #2dd4bfdd", bracket: 2, rankInBracket: 4, perks: ["Alpha research desk", "Pre-launch allocations", "Council seat"], perksAr: ["مكتب أبحاث ألفا", "تخصيصات مبكرة", "مقعد في المجلس"], rewards: ["Mythic collectible badge", "Seasonal reward"], rewardsAr: ["شارة ميثيك", "مكافأة موسمية"] },
  { track: "capital", key: "immortal", name: "Immortal", nameAr: "خالد", tagline: "Eternal radiance", taglineAr: "الإشعاع الأبدي", min: 1_000_000, color: "#f6dd8f", color2: "#a16207", gradient: "linear-gradient(135deg,#fdf3cd,#a16207 90%)", glow: "0 0 52px -2px #f6dd8fee", bracket: 2, rankInBracket: 5, perks: ["Founders circle", "Bespoke fund vehicles", "Lifetime privileges"], perksAr: ["دائرة المؤسسين", "أدوات استثمار خاصة", "امتيازات مدى الحياة"], rewards: ["Immortal aura effect", "Founders emoji"], rewardsAr: ["تأثير هالة الخالد", "إيموجي المؤسسين"] },

  // Bracket 3 — Winged crest · engraved wings + gem
  { track: "capital", key: "titan", name: "Titan", nameAr: "تيتان", tagline: "Molten resolve", taglineAr: "عزيمة صاهرة", min: 5_000_000, color: "#ff7a3d", color2: "#4b1607", gradient: "linear-gradient(135deg,#ff9a63,#4b1607)", glow: "0 0 56px -2px #ff7a3ddd", bracket: 3, rankInBracket: 1, perks: ["Institutional block desk", "Bespoke leverage", "Priority listings"], perksAr: ["مكتب صفقات مؤسسي", "رافعة مخصصة", "أولوية إدراج"], rewards: ["Titan wing frame", "Ember confetti"], rewardsAr: ["إطار جناح تيتان", "قصاصات جمرية"] },
  { track: "capital", key: "celestial", name: "Celestial", nameAr: "سماوي", tagline: "Nebula command", taglineAr: "قيادة السماء", min: 25_000_000, color: "#8b7dff", color2: "#241663", gradient: "linear-gradient(135deg,#b3a8ff,#241663)", glow: "0 0 60px -2px #8b7dffdd", bracket: 3, rankInBracket: 2, perks: ["Sovereign OTC", "Private syndicate", "Custom derivatives"], perksAr: ["OTC سيادي", "تحالف خاص", "مشتقات مخصصة"], rewards: ["Nebula profile theme", "Celestial sticker set"], rewardsAr: ["ثيم سديم", "طقم ملصقات سماوية"] },
  { track: "capital", key: "sovereign", name: "Sovereign", nameAr: "سيادي", tagline: "Crown of realms", taglineAr: "تاج الممالك", min: 100_000_000, color: "#34c98a", color2: "#0d3d2a", gradient: "linear-gradient(135deg,#7ee8b6,#0d3d2a)", glow: "0 0 64px -2px #34c98add", bracket: 3, rankInBracket: 3, perks: ["Family-office desk", "Board advisory", "Alpha co-investments"], perksAr: ["مكتب عائلي", "مستشار مجلس", "استثمارات ألفا مشتركة"], rewards: ["Sovereign crown badge", "Emerald aura"], rewardsAr: ["شارة تاج سيادي", "هالة زمردية"] },
  { track: "capital", key: "ascendant", name: "Ascendant", nameAr: "الصاعد", tagline: "Beyond mortal orbits", taglineAr: "فوق كل المدارات", min: 500_000_000, color: "#e2e8f0", color2: "#475569", gradient: "linear-gradient(135deg,#ffffff,#475569)", glow: "0 0 72px -2px #ffffffcc", bracket: 3, rankInBracket: 4, perks: ["Whitelabel infrastructure", "Custom vaults", "Global concierge"], perksAr: ["بنية خاصة", "خزائن مخصصة", "كونسيرج عالمي"], rewards: ["Ascendant halo", "Prismatic emoji"], rewardsAr: ["هالة الصاعد", "إيموجي منشوري"] },
  { track: "capital", key: "eternal", name: "Eternal", nameAr: "الأبدي", tagline: "Infinite dominion", taglineAr: "سيادة أبدية", min: 1_000_000_000, color: "#f5c542", color2: "#3b1f00", gradient: "linear-gradient(135deg,#ffe27a,#3b1f00 92%)", glow: "0 0 88px 0 #f5c542ee", bracket: 3, rankInBracket: 5, perks: ["Founding council", "Pre-market allocations", "Legacy vehicles"], perksAr: ["مجلس المؤسسين", "تخصيصات ما قبل السوق", "أدوات إرث"], rewards: ["Eternal profile frame", "Legacy sticker set"], rewardsAr: ["إطار أبدي", "طقم ملصقات الإرث"] },

  // Bracket 4 — Cosmic orb · orbital rings · celestial crown
  { track: "capital", key: "cosmic", name: "Cosmic", nameAr: "كوني", tagline: "Galactic mandate", taglineAr: "تفويض المجرة", min: 5_000_000_000, color: "#c084fc", color2: "#3b0764", gradient: "linear-gradient(135deg,#e9d5ff,#3b0764)", glow: "0 0 96px 0 #c084fcee", bracket: 4, rankInBracket: 1, perks: ["Galactic council", "Reserved allocations", "Private galaxy access"], perksAr: ["مجلس المجرة", "تخصيصات محجوزة", "دخول مجرّة خاصة"], rewards: ["Cosmic starfield theme", "Nebula confetti"], rewardsAr: ["ثيم مجال نجمي", "قصاصات السديم"] },
  { track: "capital", key: "universal", name: "Universal", nameAr: "كوني شامل", tagline: "The wielder of tides", taglineAr: "سيّد المدّ والجزر", min: 10_000_000_000, color: "#22d3ee", color2: "#0e3742", gradient: "linear-gradient(135deg,#a5f3fc,#0e3742)", glow: "0 0 108px 0 #22d3eeee", bracket: 4, rankInBracket: 2, perks: ["Universal desk", "Sovereign settlement", "Cross-galaxy alpha"], perksAr: ["مكتب كوني", "تسوية سيادية", "ألفا عبر المجرات"], rewards: ["Universal aura effect", "Astral emoji"], rewardsAr: ["تأثير هالة كونية", "إيموجي أثيري"] },
  { track: "capital", key: "infinity", name: "Infinity", nameAr: "لانهائي", tagline: "No horizon holds you", taglineAr: "لا أفق يحدّك", min: 50_000_000_000, color: "#f472b6", color2: "#500724", gradient: "linear-gradient(135deg,#fbcfe8,#500724)", glow: "0 0 120px 0 #f472b6ee", bracket: 4, rankInBracket: 3, perks: ["Infinite liquidity", "Custom protocol", "Legendary listing rights"], perksAr: ["سيولة لانهائية", "بروتوكول مخصص", "حقوق إدراج أسطورية"], rewards: ["Infinity halo", "Legendary sticker set"], rewardsAr: ["هالة اللانهاية", "طقم ملصقات أسطوري"] },
  { track: "capital", key: "omniversal", name: "Omniversal", nameAr: "متعدد الأكوان", tagline: "Sovereign of every plane", taglineAr: "سيّد كلّ العوالم", min: 250_000_000_000, color: "#38bdf8", color2: "#0c2340", gradient: "linear-gradient(135deg,#e0f2fe,#0c2340)", glow: "0 0 132px 0 #38bdf8ee", bracket: 4, rankInBracket: 4, perks: ["Omniversal syndicate", "Sovereign protocol", "Board of realms"], perksAr: ["نقابة متعددة الأكوان", "بروتوكول سيادي", "مجلس العوالم"], rewards: ["Omniversal crown", "Prismatic profile effect"], rewardsAr: ["تاج متعدد الأكوان", "تأثير منشوري"] },
  { track: "capital", key: "genesis", name: "Genesis", nameAr: "التكوين", tagline: "The first and final ledger", taglineAr: "السجل الأول والأخير", min: 1_000_000_000_000, color: "#fde047", color2: "#78350f", gradient: "linear-gradient(135deg,#ffffff,#fde047 40%,#78350f)", glow: "0 0 160px 0 #fde047ff", bracket: 4, rankInBracket: 5, perks: ["Genesis council", "Universal signatory", "Immortal legacy"], perksAr: ["مجلس التكوين", "توقيع كوني", "إرث خالد"], rewards: ["Genesis mythic frame", "Founding-signature emoji"], rewardsAr: ["إطار التكوين الأسطوري", "إيموجي التوقيع المؤسس"] },
];

/* ------------------------------------------------------------------ */
/*  Trader tiers (XP)                                                  */
/* ------------------------------------------------------------------ */

const traderThresholds = [
  0, 250, 600, 1_200, 2_000,
  3_200, 5_000, 7_500, 11_000, 16_000,
  23_000, 32_000, 45_000, 62_000, 85_000,
  115_000, 155_000, 210_000, 280_000, 380_000,
];

export const TRADER_TIERS: TraderTier[] = [
  // Bracket 1 — Compass rose · steady rise
  { track: "trader", key: "beginner", name: "Beginner", nameAr: "مبتدئ", tagline: "First orders placed", taglineAr: "أول صفقات", min: traderThresholds[0], color: "#94a3b8", color2: "#334155", gradient: "linear-gradient(135deg,#cbd5e1,#334155)", glow: "0 0 24px -6px #94a3b899", bracket: 1, rankInBracket: 1, perks: ["Journal enabled", "Starter missions"], perksAr: ["تفعيل الدفتر", "مهام البداية"], rewards: ["Newcomer chat badge"], rewardsAr: ["شارة الوافد"] },
  { track: "trader", key: "explorer", name: "Explorer", nameAr: "مستكشف", tagline: "Charting the market", taglineAr: "استكشاف السوق", min: traderThresholds[1], color: "#60a5fa", color2: "#1e3a8a", gradient: "linear-gradient(135deg,#bfdbfe,#1e3a8a)", glow: "0 0 26px -6px #60a5faaa", bracket: 1, rankInBracket: 2, perks: ["Signal previews", "3 exchange links"], perksAr: ["معاينة الإشارات", "3 روابط منصات"], rewards: ["Explorer emoji pack"], rewardsAr: ["حزمة إيموجي مستكشف"] },
  { track: "trader", key: "skilled", name: "Skilled", nameAr: "ماهر", tagline: "Reading the tape", taglineAr: "قراءة السوق", min: traderThresholds[2], color: "#22d3ee", color2: "#164e63", gradient: "linear-gradient(135deg,#a5f3fc,#164e63)", glow: "0 0 28px -6px #22d3eeaa", bracket: 1, rankInBracket: 3, perks: ["Risk dashboard", "Achievement tracker"], perksAr: ["لوحة المخاطر", "تتبع الإنجازات"], rewards: ["Skilled dashboard theme"], rewardsAr: ["ثيم لوحة ماهر"] },
  { track: "trader", key: "advanced", name: "Advanced", nameAr: "متقدم", tagline: "Sharpened edge", taglineAr: "حدة صاعدة", min: traderThresholds[3], color: "#34d399", color2: "#065f46", gradient: "linear-gradient(135deg,#a7f3d0,#065f46)", glow: "0 0 30px -6px #34d399aa", bracket: 1, rankInBracket: 4, perks: ["Advanced journal", "Multi-account"], perksAr: ["دفتر متقدم", "حسابات متعددة"], rewards: ["Advanced badge frame"], rewardsAr: ["إطار شارة متقدم"] },
  { track: "trader", key: "professional", name: "Professional", nameAr: "محترف", tagline: "Consistent alpha", taglineAr: "ألفا ثابت", min: traderThresholds[4], color: "#fbbf24", color2: "#78350f", gradient: "linear-gradient(135deg,#fde68a,#78350f)", glow: "0 0 32px -6px #fbbf24bb", bracket: 1, rankInBracket: 5, perks: ["Pro strategies", "Priority support"], perksAr: ["استراتيجيات محترفة", "دعم أولوية"], rewards: ["Pro username color"], rewardsAr: ["لون اسم محترف"] },

  // Bracket 2 — Crossed blades emblem
  { track: "trader", key: "elite", name: "Elite Trader", nameAr: "متداول نخبة", tagline: "Precision commander", taglineAr: "قائد الدقة", min: traderThresholds[5], color: "#a78bfa", color2: "#4c1d95", gradient: "linear-gradient(135deg,#ddd6fe,#4c1d95)", glow: "0 0 36px -4px #a78bfacc", bracket: 2, rankInBracket: 1, perks: ["Elite chat room", "Custom alerts"], perksAr: ["غرفة النخبة", "تنبيهات مخصصة"], rewards: ["Elite chat aura"], rewardsAr: ["هالة الدردشة النخبوية"] },
  { track: "trader", key: "expert", name: "Expert", nameAr: "خبير", tagline: "Master of edges", taglineAr: "سيد الحواف", min: traderThresholds[6], color: "#f472b6", color2: "#831843", gradient: "linear-gradient(135deg,#fbcfe8,#831843)", glow: "0 0 38px -4px #f472b6cc", bracket: 2, rankInBracket: 2, perks: ["Expert playbooks", "Signal creation"], perksAr: ["كتب لعب خبير", "إنشاء إشارات"], rewards: ["Expert seasonal frame"], rewardsAr: ["إطار موسمي خبير"] },
  { track: "trader", key: "veteran", name: "Veteran", nameAr: "مخضرم", tagline: "Battle-forged", taglineAr: "مصقول بالمعارك", min: traderThresholds[7], color: "#fb7185", color2: "#7f1d1d", gradient: "linear-gradient(135deg,#fecdd3,#7f1d1d)", glow: "0 0 40px -4px #fb7185cc", bracket: 2, rankInBracket: 3, perks: ["Veteran council", "Bespoke risk model"], perksAr: ["مجلس المخضرمين", "نموذج مخاطر خاص"], rewards: ["Veteran sticker set"], rewardsAr: ["طقم ملصقات مخضرم"] },
  { track: "trader", key: "strategist", name: "Strategist", nameAr: "استراتيجي", tagline: "Weaver of moves", taglineAr: "نسّاج الخطط", min: traderThresholds[8], color: "#38bdf8", color2: "#0c4a6e", gradient: "linear-gradient(135deg,#bae6fd,#0c4a6e)", glow: "0 0 42px -4px #38bdf8cc", bracket: 2, rankInBracket: 4, perks: ["Strategy vault", "Backtest engine"], perksAr: ["خزنة الاستراتيجيات", "محرك اختبار"], rewards: ["Strategist theme"], rewardsAr: ["ثيم استراتيجي"] },
  { track: "trader", key: "masterTrader", name: "Master Trader", nameAr: "متداول ماستر", tagline: "Total command", taglineAr: "سيطرة كاملة", min: traderThresholds[9], color: "#facc15", color2: "#713f12", gradient: "linear-gradient(135deg,#fef08a,#713f12)", glow: "0 0 46px -3px #facc15dd", bracket: 2, rankInBracket: 5, perks: ["Master lounge", "Advanced automations"], perksAr: ["صالة الماستر", "أتمتة متقدمة"], rewards: ["Master glow effect"], rewardsAr: ["تأثير توهج ماستر"] },

  // Bracket 3 — Phoenix wing sigil
  { track: "trader", key: "grandmasterTrader", name: "Grandmaster Trader", nameAr: "متداول جراند ماستر", tagline: "Peerless discipline", taglineAr: "انضباط لا يُضاهى", min: traderThresholds[10], color: "#f97316", color2: "#7c2d12", gradient: "linear-gradient(135deg,#fed7aa,#7c2d12)", glow: "0 0 50px -3px #f97316dd", bracket: 3, rankInBracket: 1, perks: ["Grandmaster desk", "Private events"], perksAr: ["مكتب جراند ماستر", "فعاليات خاصة"], rewards: ["Grandmaster frame"], rewardsAr: ["إطار جراند ماستر"] },
  { track: "trader", key: "legendaryTrader", name: "Legendary Trader", nameAr: "متداول أسطوري", tagline: "The tape whispers back", taglineAr: "السوق يهمس لك", min: traderThresholds[11], color: "#eab308", color2: "#713f12", gradient: "linear-gradient(135deg,#fef9c3,#713f12)", glow: "0 0 54px -3px #eab308ee", bracket: 3, rankInBracket: 2, perks: ["Legendary vault", "White-glove desk"], perksAr: ["خزنة أسطورية", "خدمة كبار العملاء"], rewards: ["Legendary username color"], rewardsAr: ["لون اسم أسطوري"] },
  { track: "trader", key: "mythicTrader", name: "Mythic Trader", nameAr: "متداول ميثيك", tagline: "Beyond charts", taglineAr: "ما وراء الرسوم", min: traderThresholds[12], color: "#14b8a6", color2: "#134e4a", gradient: "linear-gradient(135deg,#99f6e4,#134e4a)", glow: "0 0 58px -3px #14b8a6ee", bracket: 3, rankInBracket: 3, perks: ["Mythic research", "Pre-launch access"], perksAr: ["أبحاث ميثيك", "وصول مبكر"], rewards: ["Mythic aura"], rewardsAr: ["هالة ميثيك"] },
  { track: "trader", key: "titanTrader", name: "Titan Trader", nameAr: "متداول تيتان", tagline: "Immovable will", taglineAr: "إرادة راسخة", min: traderThresholds[13], color: "#ef4444", color2: "#4b1607", gradient: "linear-gradient(135deg,#fecaca,#4b1607)", glow: "0 0 62px -3px #ef4444ee", bracket: 3, rankInBracket: 4, perks: ["Titan block desk", "Custom leverage"], perksAr: ["مكتب صفقات تيتان", "رافعة مخصصة"], rewards: ["Titan wing frame"], rewardsAr: ["إطار جناح تيتان"] },
  { track: "trader", key: "immortalTrader", name: "Immortal Trader", nameAr: "متداول خالد", tagline: "Written in the ledger", taglineAr: "مسجّل في السجل", min: traderThresholds[14], color: "#f6dd8f", color2: "#a16207", gradient: "linear-gradient(135deg,#fdf3cd,#a16207)", glow: "0 0 68px -2px #f6dd8fee", bracket: 3, rankInBracket: 5, perks: ["Immortal circle", "Custom strategies"], perksAr: ["دائرة الخالدين", "استراتيجيات مخصصة"], rewards: ["Immortal chat aura"], rewardsAr: ["هالة دردشة الخالد"] },

  // Bracket 4 — Quantum core · orbital runes · legendary
  { track: "trader", key: "supremeTrader", name: "Supreme Trader", nameAr: "متداول أعلى", tagline: "Above the noise", taglineAr: "فوق الضجيج", min: traderThresholds[15], color: "#c084fc", color2: "#3b0764", gradient: "linear-gradient(135deg,#e9d5ff,#3b0764)", glow: "0 0 78px 0 #c084fcee", bracket: 4, rankInBracket: 1, perks: ["Supreme lounge", "Priority listings"], perksAr: ["صالة عليا", "أولوية إدراج"], rewards: ["Supreme profile effect"], rewardsAr: ["تأثير سامي"] },
  { track: "trader", key: "apexTrader", name: "Apex Trader", nameAr: "متداول القمة", tagline: "The peak is home", taglineAr: "القمة موطنك", min: traderThresholds[16], color: "#22d3ee", color2: "#0e3742", gradient: "linear-gradient(135deg,#a5f3fc,#0e3742)", glow: "0 0 88px 0 #22d3eeee", bracket: 4, rankInBracket: 2, perks: ["Apex council", "Custom derivatives"], perksAr: ["مجلس القمة", "مشتقات مخصصة"], rewards: ["Apex halo"], rewardsAr: ["هالة القمة"] },
  { track: "trader", key: "quantumTrader", name: "Quantum Trader", nameAr: "متداول كمّي", tagline: "Reads probability itself", taglineAr: "يقرأ الاحتمالات ذاتها", min: traderThresholds[17], color: "#f472b6", color2: "#500724", gradient: "linear-gradient(135deg,#fbcfe8,#500724)", glow: "0 0 98px 0 #f472b6ee", bracket: 4, rankInBracket: 3, perks: ["Quantum lab", "Alpha models"], perksAr: ["مختبر كمي", "نماذج ألفا"], rewards: ["Quantum sticker set"], rewardsAr: ["طقم ملصقات كمي"] },
  { track: "trader", key: "infiniteTrader", name: "Infinite Trader", nameAr: "متداول لانهائي", tagline: "Unbounded", taglineAr: "بلا حدود", min: traderThresholds[18], color: "#38bdf8", color2: "#0c2340", gradient: "linear-gradient(135deg,#e0f2fe,#0c2340)", glow: "0 0 116px 0 #38bdf8ee", bracket: 4, rankInBracket: 4, perks: ["Infinite vault", "Cross-realm alpha"], perksAr: ["خزنة لانهائية", "ألفا عبر العوالم"], rewards: ["Infinite frame"], rewardsAr: ["إطار لانهائي"] },
  { track: "trader", key: "tradingLegend", name: "Trading Legend", nameAr: "أسطورة التداول", tagline: "The name is the market", taglineAr: "اسمك هو السوق", min: traderThresholds[19], color: "#fde047", color2: "#78350f", gradient: "linear-gradient(135deg,#ffffff,#fde047 40%,#78350f)", glow: "0 0 160px 0 #fde047ff", bracket: 4, rankInBracket: 5, perks: ["Founding council", "Immortal legacy"], perksAr: ["مجلس المؤسسين", "إرث خالد"], rewards: ["Legend mythic frame", "Founding emoji"], rewardsAr: ["إطار أسطوري", "إيموجي المؤسس"] },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function findTier<T extends { min: number }>(tiers: T[], value: number) {
  let idx = 0;
  for (let i = 0; i < tiers.length; i++) if (value >= tiers[i].min) idx = i;
  const current = tiers[idx];
  const next = tiers[idx + 1];
  const span = next ? next.min - current.min : 1;
  const progress = next ? Math.max(0, Math.min(1, (value - current.min) / span)) : 1;
  const remaining = next ? Math.max(0, next.min - value) : 0;
  const percent = Math.round(progress * 100);
  return { current, next, index: idx, progress, remaining, percent };
}

export function getCapitalTier(capital: number) {
  return findTier(CAPITAL_TIERS, capital);
}

export function getTraderTier(xp: number) {
  return findTier(TRADER_TIERS, xp);
}

export function xpForLevel(level: number) {
  if (level <= 1) return 0;
  return Math.round(100 * Math.pow(level - 1, 1.6));
}

export function getActivityLevel(xp: number) {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  const currentThreshold = xpForLevel(level);
  const nextThreshold = xpForLevel(level + 1);
  const progress = Math.max(0, Math.min(1, (xp - currentThreshold) / (nextThreshold - currentThreshold)));
  return { level, xp, currentThreshold, nextThreshold, progress };
}

export const ACTIVITY_REWARDS = [
  { level: 5, label: "Custom avatar frame", labelAr: "إطار صورة مخصص" },
  { level: 10, label: "Advanced academy modules", labelAr: "وحدات أكاديمية متقدمة" },
  { level: 15, label: "Priority AI bot access", labelAr: "دخول أولوية لبوت الذكاء" },
  { level: 20, label: "Personal mentor session", labelAr: "جلسة مدرب شخصي" },
  { level: 30, label: "Elite trading room", labelAr: "غرفة التداول النخبوية" },
];

export const WEEKLY_QUESTS = [
  { id: "login", label: "Login 5 days", labelAr: "سجّل الدخول 5 أيام", xp: 50, target: 5 },
  { id: "journal", label: "Journal 10 trades", labelAr: "دوّن 10 صفقات", xp: 80, target: 10 },
  { id: "risk", label: "Respect risk rules 5 days", labelAr: "التزم بقواعد المخاطر 5 أيام", xp: 100, target: 5 },
  { id: "lesson", label: "Complete 3 lessons", labelAr: "أكمل 3 دروس", xp: 60, target: 3 },
];

/** Format a portfolio value nicely. */
export function fmtCapital(v: number) {
  if (v >= 1_000_000_000_000) return `$${(v / 1_000_000_000_000).toFixed(v % 1_000_000_000_000 === 0 ? 0 : 2)}T`;
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(v % 1_000_000_000 === 0 ? 0 : 1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 2)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
  return `$${v.toFixed(0)}`;
}

export function fmtXP(xp: number) {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(2)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return String(xp);
}

export type AnyTier = CapitalTier | TraderTier;
