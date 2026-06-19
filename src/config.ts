import type { CardType, FilterKey } from "./types";

export const CARD_META: Record<CardType, { label: string; icon: string }> = {
  breakfast: { label: "Завтрак", icon: "🌅" },
  lunch: { label: "Обед", icon: "☀️" },
  dinner: { label: "Ужин", icon: "🌙" },
  special: { label: "Special", icon: "⭐" },
};

export const CARD_LIMITS: Record<CardType, number> = {
  breakfast: 1,
  lunch: 1,
  dinner: 1,
  special: 3,
};

export const CARD_ORDER: Record<string, number> = {
  breakfast: 0,
  lunch: 1,
  dinner: 2,
  "special-1": 3,
  "special-2": 4,
  "special-3": 5,
};

export const ALL_CARD_TYPES: CardType[] = [
  "breakfast",
  "lunch",
  "dinner",
  "special",
];

interface ChipDef {
  key: FilterKey;
  label: string;
}

export const FILTER_CHIPS: Record<CardType, ChipDef[]> = {
  breakfast: [
    { key: "eggs", label: "яйца" },
    { key: "alternatives", label: "альтернативы" },
  ],
  lunch: [{ key: "soups", label: "супы" }],
  dinner: [
    { key: "chicken", label: "курица" },
    { key: "beef", label: "говядина" },
    { key: "pork", label: "свинина" },
    { key: "fish", label: "рыба" },
  ],
  special: [
    { key: "salads", label: "салаты" },
    { key: "appetizers", label: "закуски" },
    { key: "savory_pastry", label: "выпечка несладкая" },
    { key: "sweet_pastry", label: "выпечка сладкая" },
  ],
};
