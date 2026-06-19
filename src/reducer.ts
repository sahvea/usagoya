import type { AppAction, AppState, Card, FilterKey, MealResult } from "./types";
import { CARD_LIMITS, CARD_ORDER } from "./config";
import {
  loadCards,
  loadTelegramConfig,
  saveCards,
  saveTelegramConfig,
} from "./utils/storage";
import {
  pickBreakfast,
  pickLunch,
  pickDinner,
  pickSpecial,
  pickSide,
} from "./utils/pick";

const now = new Date();
const pad = (n: number) => String(n).padStart(2, "0");
const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

const makeDefaultCards = (): Card[] => [
  {
    id: "breakfast",
    type: "breakfast",
    activeFilters: [],
    result: { main: null, side: null },
    excludedToday: [],
    confirmed: false,
    sent: false,
    animating: false,
  },
  {
    id: "lunch",
    type: "lunch",
    activeFilters: [],
    result: { main: null, side: null },
    excludedToday: [],
    confirmed: false,
    sent: false,
    animating: false,
  },
  {
    id: "dinner",
    type: "dinner",
    activeFilters: [],
    result: { main: null, side: null },
    excludedToday: [],
    confirmed: false,
    sent: false,
    animating: false,
  },
];

export const makeInitialState = (): AppState => ({
  date: todayStr,
  cards: loadCards(todayStr) ?? makeDefaultCards(),
  telegramConfig: loadTelegramConfig(),
});

export const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_DATE": {
      saveCards(state.date, state.cards);
      const saved = loadCards(action.date);
      return {
        ...state,
        date: action.date,
        cards: saved ?? makeDefaultCards(),
      };
    }

    case "SET_CARDS":
      return { ...state, cards: action.cards };

    case "SET_FILTER": {
      const cards = state.cards.map((c) => {
        if (c.id !== action.cardId || c.confirmed || c.sent) return c;
        const has = c.activeFilters.includes(action.filter as FilterKey);
        const activeFilters = has
          ? c.activeFilters.filter((f) => f !== action.filter)
          : [...c.activeFilters, action.filter as FilterKey];
        return { ...c, activeFilters };
      });
      return { ...state, cards };
    }

    case "SET_ANIMATING": {
      const cards = state.cards.map((c) =>
        c.id === action.cardId ? { ...c, animating: action.animating } : c,
      );
      return { ...state, cards };
    }

    case "SET_RESULT": {
      const cards = state.cards.map((c) =>
        c.id === action.cardId
          ? { ...c, result: action.result, animating: false }
          : c,
      );
      const next = { ...state, cards };
      saveCards(state.date, next.cards);
      return next;
    }

    case "REROLL_SIDE": {
      const cards = state.cards.map((c) =>
        c.id === action.cardId
          ? {
              ...c,
              result: { ...c.result, side: action.side },
              animating: false,
            }
          : c,
      );
      const next = { ...state, cards };
      saveCards(state.date, next.cards);
      return next;
    }

    case "CONFIRM": {
      const cards = state.cards.map((c) =>
        c.id === action.cardId ? { ...c, confirmed: true } : c,
      );
      const next = { ...state, cards };
      saveCards(state.date, next.cards);
      return next;
    }

    case "UNCONFIRM": {
      const cards = state.cards.map((c) =>
        c.id === action.cardId ? { ...c, confirmed: false } : c,
      );
      const next = { ...state, cards };
      saveCards(state.date, next.cards);
      return next;
    }

    case "MARK_SENT": {
      const cards = state.cards.map((c) =>
        c.id === action.cardId ? { ...c, confirmed: true } : c,
      );
      const next = { ...state, cards };
      saveCards(state.date, next.cards);
      return next;
    }

    case "ADD_CARD": {
      const { cardType } = action;
      const existing = state.cards.filter((c) => c.type === cardType);
      if (existing.length >= CARD_LIMITS[cardType]) return state;

      let id: string;
      if (cardType === "special") {
        const nums = existing.map((c) => parseInt(c.id.replace("special-", "")));
        const num = [1, 2, 3].find((n) => !nums.includes(n)) ?? 1;
        id = `special-${num}`;
      } else {
        id = cardType;
      }

      const newCard: Card = {
        id,
        type: cardType,
        activeFilters: [],
        result: { main: null, side: null },
        excludedToday: [],
        confirmed: false,
        sent: false,
        animating: false,
      };

      const cards = [...state.cards, newCard].sort(
        (a, b) => (CARD_ORDER[a.id] ?? 9) - (CARD_ORDER[b.id] ?? 9),
      );
      return { ...state, cards };
    }

    case "REMOVE_CARD": {
      const cards = state.cards.filter((c) => c.id !== action.cardId);
      const next = { ...state, cards };
      saveCards(state.date, next.cards);
      return next;
    }

    case "RENAME_CARD": {
      const cards = state.cards.map((c) =>
        c.id === action.cardId ? { ...c, name: action.name || undefined } : c,
      );
      const next = { ...state, cards };
      saveCards(state.date, next.cards);
      return next;
    }

    case "TOGGLE_NO_SIDE": {
      const cards = state.cards.map((c) =>
        c.id === action.cardId
          ? { ...c, result: { ...c.result, noSide: !c.result.noSide } }
          : c,
      );
      const next = { ...state, cards };
      saveCards(state.date, next.cards);
      return next;
    }

    case "SET_TELEGRAM": {
      saveTelegramConfig(action.config);
      return { ...state, telegramConfig: action.config };
    }

    default:
      return state;
  }
};

export const pickForCard = (card: Card): MealResult => {
  if (card.type === "breakfast")
    return pickBreakfast(card.activeFilters, card.excludedToday);
  if (card.type === "lunch")
    return pickLunch(card.activeFilters, card.excludedToday);
  if (card.type === "dinner")
    return pickDinner(card.activeFilters, card.excludedToday, []);
  return pickSpecial(card.activeFilters, card.excludedToday);
};

export const excludeAndPick = (
  card: Card,
): { newExcluded: string[]; result: MealResult } => {
  const toExclude = card.result.main ?? "";
  const newExcluded = toExclude
    ? [...card.excludedToday, toExclude]
    : card.excludedToday;
  const tempCard = { ...card, excludedToday: newExcluded };
  return { newExcluded, result: pickForCard(tempCard) };
};

export const pickNewSide = (card: Card): string => {
  const currentSide = card.result.side ?? "";
  return pickSide(currentSide ? [currentSide] : []);
};
