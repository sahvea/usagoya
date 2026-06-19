import type { MealsData } from "../data/meals";
import type { MealFlat } from "../types";

export const flattenMeals = (m: MealsData): MealFlat => ({
  "breakfast.eggs": [...m.breakfast.eggs],
  "breakfast.alternatives": [...m.breakfast.alternatives],
  "lunch.soups": [...m.lunch.soups],
  "dinner.chicken": [...m.dinner.main.chicken],
  "dinner.beef": [...m.dinner.main.beef],
  "dinner.pork": [...m.dinner.main.pork],
  "dinner.fish": [...m.dinner.main.fish],
  "dinner.side": [...m.dinner.side],
  "special.salads": [...m.special.salads],
  "special.appetizers": [...m.special.appetizers],
  "special.savory_pastry": [...m.special.savory_pastry],
  "special.sweet_pastry": [...m.special.sweet_pastry],
});

export const unflattenMeals = (flat: MealFlat): MealsData => ({
  breakfast: {
    eggs: flat["breakfast.eggs"].filter(Boolean),
    alternatives: flat["breakfast.alternatives"].filter(Boolean),
  },
  lunch: {
    soups: flat["lunch.soups"].filter(Boolean),
  },
  dinner: {
    main: {
      chicken: flat["dinner.chicken"].filter(Boolean),
      beef: flat["dinner.beef"].filter(Boolean),
      pork: flat["dinner.pork"].filter(Boolean),
      fish: flat["dinner.fish"].filter(Boolean),
    },
    side: flat["dinner.side"].filter(Boolean),
  },
  special: {
    salads: flat["special.salads"].filter(Boolean),
    appetizers: flat["special.appetizers"].filter(Boolean),
    savory_pastry: flat["special.savory_pastry"].filter(Boolean),
    sweet_pastry: flat["special.sweet_pastry"].filter(Boolean),
  },
});
