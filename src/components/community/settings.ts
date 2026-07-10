import { useEffect, useState } from "react";

export type Wallpaper =
  | "default"
  | "aurora"
  | "sunset"
  | "ocean"
  | "mint"
  | "solid-lavender"
  | "solid-slate"
  | "solid-cream"
  | "dots"
  | "grid"
  | "blur";

export type Density = "comfortable" | "compact";
export type BubbleStyle = "rounded" | "modern" | "minimal";

export interface ChatSettings {
  wallpaper: Wallpaper;
  density: Density;
  bubble: BubbleStyle;
}

export const DEFAULT_SETTINGS: ChatSettings = {
  wallpaper: "default",
  density: "comfortable",
  bubble: "rounded",
};

export const WALLPAPER_CLASS: Record<Wallpaper, string> = {
  default: "chat-bg-default",
  aurora: "chat-bg-aurora",
  sunset: "chat-bg-sunset",
  ocean: "chat-bg-ocean",
  mint: "chat-bg-mint",
  "solid-lavender": "chat-bg-solid-lavender",
  "solid-slate": "chat-bg-solid-slate",
  "solid-cream": "chat-bg-solid-cream",
  dots: "chat-bg-dots",
  grid: "chat-bg-grid",
  blur: "chat-bg-blur",
};

const KEY = "cryptvora.chat.settings";

export function useChatSettings() {
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const update = (patch: Partial<ChatSettings>) =>
    setSettings((s) => {
      const next = { ...s, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  const reset = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setSettings(DEFAULT_SETTINGS);
  };

  return { settings, update, reset };
}
