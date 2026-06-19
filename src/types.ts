export type CardType = "breakfast" | "lunch" | "dinner" | "special";

export type BreakfastFilter = "eggs" | "alternatives";
export type LunchFilter = "soups";
export type DinnerFilter = "chicken" | "beef" | "pork" | "fish";
export type SpecialFilter =
  | "salads"
  | "appetizers"
  | "savory_pastry"
  | "sweet_pastry";
export type FilterKey =
  | BreakfastFilter
  | LunchFilter
  | DinnerFilter
  | SpecialFilter;

export interface MealResult {
  main: string | null;
  side: string | null;
  noSide?: boolean;
}

export type MealFlat = Record<string, string[]>;

export interface Card {
  id: string;
  type: CardType;
  name?: string;
  activeFilters: FilterKey[];
  result: MealResult;
  excludedToday: string[];
  confirmed: boolean;
  sent: boolean;
  animating: boolean;
}

export interface TelegramConfig {
  token: string;
  chatId: string;
}

export interface AppState {
  date: string;
  cards: Card[];
  telegramConfig: TelegramConfig;
}

export type AppAction =
  | { type: "SET_DATE"; date: string }
  | { type: "SET_CARDS"; cards: Card[] }
  | { type: "SET_FILTER"; cardId: string; filter: FilterKey }
  | { type: "SET_ANIMATING"; cardId: string; animating: boolean }
  | { type: "SET_RESULT"; cardId: string; result: MealResult }
  | { type: "REROLL_SIDE"; cardId: string; side: string }
  | { type: "EXCLUDE_AND_REROLL"; cardId: string }
  | { type: "CONFIRM"; cardId: string }
  | { type: "UNCONFIRM"; cardId: string }
  | { type: "MARK_SENT"; cardId: string }
  | { type: "ADD_CARD"; cardType: CardType }
  | { type: "REMOVE_CARD"; cardId: string }
  | { type: "RENAME_CARD"; cardId: string; name: string }
  | { type: "TOGGLE_NO_SIDE"; cardId: string }
  | { type: "SET_TELEGRAM"; config: TelegramConfig };
