import type { Card, TelegramConfig } from "../types";
import type { MealsData } from "../data/meals";

const TG_KEY = "usagoya-tg-config";

const dateKey = (date: string): string => `usagoya-${date}`;

export const saveCards = (date: string, cards: Card[]): void => {
  try {
    localStorage.setItem(dateKey(date), JSON.stringify(cards));
  } catch {
    // ignore storage errors
  }
};

export const loadCards = (date: string): Card[] | null => {
  try {
    const raw = localStorage.getItem(dateKey(date));
    if (!raw) return null;
    return JSON.parse(raw) as Card[];
  } catch {
    return null;
  }
};

export const saveTelegramConfig = (config: TelegramConfig): void => {
  try {
    localStorage.setItem(TG_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
};

export const loadTelegramConfig = (): TelegramConfig => {
  try {
    const raw = localStorage.getItem(TG_KEY);
    if (!raw) return { token: "", chatIds: [] };
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (typeof parsed.chatId === "string") {
      return {
        token: String(parsed.token ?? ""),
        chatIds: parsed.chatId ? [parsed.chatId] : [],
      };
    }
    return parsed as unknown as TelegramConfig;
  } catch {
    return { token: "", chatIds: [] };
  }
};

const MEALS_KEY = "usagoya-meals";

export const saveCustomMeals = (m: MealsData): void => {
  try {
    localStorage.setItem(MEALS_KEY, JSON.stringify(m));
  } catch {
    // ignore
  }
};

export const loadCustomMeals = (): MealsData | null => {
  try {
    const raw = localStorage.getItem(MEALS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MealsData;
  } catch {
    return null;
  }
};
