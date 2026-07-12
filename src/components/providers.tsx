import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UnlockCelebrationProvider } from "./unlock-celebration";

/* ---------------- Theme ---------------- */
type Theme = "dark" | "light";
type ThemeCtx = { theme: Theme; toggle: () => void };
const ThemeContext = createContext<ThemeCtx>({ theme: "light", toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

/* ---------------- Language ---------------- */
export const LANGUAGES = [
  { code: "ar", label: "العربية", short: "AR" },
  { code: "en", label: "English", short: "EN" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "es", label: "Español", short: "ES" },
  { code: "tr", label: "Türkçe", short: "TR" },
  { code: "ru", label: "Русский", short: "RU" },
  { code: "id", label: "Indonesia", short: "ID" },
] as const;
type LangCode = (typeof LANGUAGES)[number]["code"];
type LangCtx = { lang: LangCode; setLang: (l: LangCode) => void };
const LanguageContext = createContext<LangCtx>({ lang: "en", setLang: () => {} });
export const useLanguage = () => useContext(LanguageContext);

/* ---------------- Auth (demo) ---------------- */
type AuthCtx = {
  user: string | null;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  ready: boolean;
};
const AuthContext = createContext<AuthCtx>({
  user: null,
  login: () => false,
  logout: () => {},
  ready: false,
});
export const useAuth = () => useContext(AuthContext);

const DEMO_USER = "hanibadji";
const DEMO_PASS = "hani2005";

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLangState] = useState<LangCode>("en");
  const [user, setUser] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = (localStorage.getItem("cv-theme") as Theme) || "dark";
    const l = (localStorage.getItem("cv-lang") as LangCode) || "en";
    const u = localStorage.getItem("cv-user");
    setTheme(t === "light" ? "light" : "dark");
    setLangState(l);
    setUser(u);
    setReady(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("cv-theme", next);
      return next;
    });
  }, []);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    localStorage.setItem("cv-lang", l);
  }, []);

  const login = useCallback((u: string, p: string) => {
    if (u.trim().toLowerCase() === DEMO_USER && p === DEMO_PASS) {
      localStorage.setItem("cv-user", u.trim());
      setUser(u.trim());
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cv-user");
    setUser(null);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <LanguageContext.Provider value={{ lang, setLang }}>
        <AuthContext.Provider value={{ user, login, logout, ready }}>
          <UnlockCelebrationProvider>{children}</UnlockCelebrationProvider>
        </AuthContext.Provider>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}
