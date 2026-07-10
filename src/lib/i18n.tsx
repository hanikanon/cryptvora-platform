import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

export const DICT: Dict = {
  "nav.overview": { en: "Overview", ar: "نظرة عامة" },
  "nav.community": { en: "Community", ar: "المجتمع" },
  "nav.risk": { en: "Risk Management", ar: "إدارة المخاطر" },
  "nav.profile": { en: "Profile", ar: "الملف الشخصي" },
  "nav.levels": { en: "Levels", ar: "المستويات" },
  "nav.leaderboards": { en: "Leaderboards", ar: "المتصدرون" },
  "brand.tag": { en: "Institutional trading suite", ar: "منصة التداول المؤسسية" },
  "live.binance": { en: "Live · Binance", ar: "مباشر · بينانس" },

  "dash.welcome": { en: "Welcome back", ar: "مرحبًا بعودتك" },
  "dash.subtitle": {
    en: "Your trading cockpit — performance, tiers and risk at a glance.",
    ar: "لوحة قيادتك — الأداء والمستويات والمخاطر في نظرة واحدة.",
  },
  "kpi.equity": { en: "Equity", ar: "رأس المال" },
  "kpi.dailyPnl": { en: "Daily PnL", ar: "ربح/خسارة اليوم" },
  "kpi.weeklyPnl": { en: "Weekly PnL", ar: "الأسبوع" },
  "kpi.monthlyPnl": { en: "Monthly PnL", ar: "الشهر" },
  "kpi.winRate": { en: "Win Rate", ar: "معدل الفوز" },
  "kpi.bestTrade": { en: "Best Trade", ar: "أفضل صفقة" },
  "kpi.worstTrade": { en: "Worst Trade", ar: "أسوأ صفقة" },
  "kpi.trades": { en: "trades", ar: "صفقة" },

  "levels.capital": { en: "Portfolio Level", ar: "مستوى المحفظة" },
  "levels.activity": { en: "Trader Level", ar: "مستوى المتداول" },
  "levels.next": { en: "Next", ar: "التالي" },
  "levels.locked": { en: "Locked", ar: "مغلق" },
  "levels.current": { en: "Current", ar: "الحالي" },
  "levels.progressToNext": { en: "Progress to next tier", ar: "التقدّم للمستوى التالي" },
  "levels.xp": { en: "XP", ar: "نقاط" },
  "levels.level": { en: "Level", ar: "مستوى" },
  "levels.streak": { en: "Streak", ar: "تسلسل" },
  "levels.quests": { en: "Weekly Quests", ar: "مهام أسبوعية" },
  "levels.rewards": { en: "Rewards", ar: "المكافآت" },
  "levels.recentXp": { en: "Recent XP events", ar: "أحدث النقاط" },
  "levels.title": { en: "Progression System", ar: "نظام التقدّم" },
  "levels.subtitle": {
    en: "Two parallel tracks · 20 tiers each · earn real privileges as you climb.",
    ar: "مساران متوازيان · 20 مستوى لكل مسار · امتيازات حقيقية مع كل ترقية.",
  },
  "levels.currentLevel": { en: "Current Level", ar: "المستوى الحالي" },
  "levels.pointsNeeded": { en: "needed for next level", ar: "متبقية للمستوى التالي" },
  "levels.nextRewards": { en: "Next rewards", ar: "مكافآت المستوى القادم" },
  "levels.journey": { en: "Your Journey", ar: "رحلتك" },
  "levels.allLevels": { en: "All Levels", ar: "جميع المستويات" },
  "levels.requirement": { en: "Requires", ar: "المتطلب" },
  "levels.unlocked": { en: "Unlocked", ar: "مفتوح" },
  "levels.maxTier": { en: "Highest level reached", ar: "وصلت لأعلى مستوى" },
  "levels.previewUpgrade": { en: "Preview upgrade", ar: "معاينة الترقية" },
  "levels.newLevel": { en: "Level Unlocked", ar: "مستوى جديد" },
  "levels.continue": { en: "Continue", ar: "متابعة" },
  "levels.you": { en: "You", ar: "أنت" },
  "levels.portfolio": { en: "Portfolio Track", ar: "مسار المحفظة" },
  "levels.trader": { en: "Trader Track", ar: "مسار المتداول" },
  "levels.portfolioDesc": {
    en: "Rises with your portfolio value.",
    ar: "يرتفع مع قيمة محفظتك.",
  },
  "levels.traderDesc": {
    en: "Earned through activity, trades, achievements and discipline.",
    ar: "يُكتسب من النشاط والصفقات والإنجازات والانضباط.",
  },
  "levels.perks": { en: "Perks", ar: "المزايا" },
  "levels.tierRewards": { en: "Tier rewards", ar: "مكافآت المستوى" },
  "levels.remaining": { en: "remaining", ar: "متبقٍ" },

  "lb.title": { en: "Leaderboards", ar: "المتصدرون" },
  "lb.subtitle": {
    en: "Live global rankings across both progression tracks.",
    ar: "ترتيب عالمي مباشر لكلا المسارين.",
  },
  "lb.portfolio": { en: "Top Portfolios", ar: "أعلى المحافظ" },
  "lb.traders": { en: "Top Traders", ar: "أفضل المتداولين" },
  "lb.rank": { en: "Rank", ar: "الترتيب" },
  "lb.trader": { en: "Trader", ar: "متداول" },
  "lb.tier": { en: "Tier", ar: "المستوى" },
  "lb.value": { en: "Value", ar: "القيمة" },
  "lb.xp": { en: "XP", ar: "النقاط" },
  "lb.you": { en: "You", ar: "أنت" },

  "risk.title": { en: "Risk Management", ar: "إدارة المخاطر" },
  "risk.rules": { en: "Risk Rules", ar: "قواعد المخاطر" },
  "risk.rules.desc": { en: "Your circuit breakers", ar: "حدودك التلقائية" },
  "risk.maxDaily": { en: "Max daily loss", ar: "الحد الأقصى للخسارة اليومية" },
  "risk.maxMonthly": { en: "Max monthly loss", ar: "الحد الأقصى للخسارة الشهرية" },
  "risk.maxRisk": { en: "Max risk per trade", ar: "الحد الأقصى للمخاطرة في الصفقة" },
  "risk.maxPos": { en: "Max concurrent positions", ar: "أقصى صفقات مفتوحة" },
  "risk.recos": { en: "Smart Recommendations", ar: "توصيات ذكية" },
  "risk.allGood": { en: "All rules respected. Keep the discipline.", ar: "كل القواعد محترمة. حافظ على الانضباط." },

  "profile.title": { en: "Trader Profile", ar: "الملف الشخصي للمتداول" },
  "profile.perks": { en: "Perks", ar: "المزايا" },
  "profile.tierLadder": { en: "Portfolio Tier Ladder", ar: "سُلَّم مستويات المحفظة" },
  "profile.activityPanel": { en: "Activity Progression", ar: "تقدم النشاط" },

  "action.addTrade": { en: "Add Trade", ar: "أضف صفقة" },
  "action.viewAll": { en: "View all", ar: "عرض الكل" },
  "theme.light": { en: "Light", ar: "فاتح" },
  "theme.dark": { en: "Dark", ar: "داكن" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; dir: "ltr" | "rtl" };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (stored === "ar" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch { /* noop */ }
  }, []);

  const t = useCallback((k: string) => DICT[k]?.[lang] ?? k, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "en" as Lang, setLang: () => {}, t: (k: string) => DICT[k]?.en ?? k, dir: "ltr" as const };
  return ctx;
}
