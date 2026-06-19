import { meals as defaultMeals } from "../data/meals";
import { loadCustomMeals } from "./storage";
import type { CardType, FilterKey, MealResult } from "../types";

const getMeals = () => loadCustomMeals() ?? defaultMeals;

const randomFrom = (arr: string[]): string =>
  arr[Math.floor(Math.random() * arr.length)];

const filtered = (arr: string[], excluded: string[]): string[] => {
  if (arr.length === 0) return arr;
  const available = arr.filter((o) => !excluded.includes(o));
  return available.length > 0 ? available : arr;
};

export const pickBreakfast = (
  activeFilters: FilterKey[],
  excluded: string[],
): MealResult => {
  const bk = getMeals().breakfast;
  const categories = (activeFilters as string[]).filter(
    (f) => f in bk,
  ) as (keyof typeof bk)[];
  const options =
    categories.length > 0
      ? categories.flatMap((cat) => bk[cat])
      : Object.values(bk).flat();
  return { main: randomFrom(filtered(options, excluded)), side: null };
};

export const pickLunch = (
  activeFilters: FilterKey[],
  excluded: string[],
): MealResult => {
  const ln = getMeals().lunch;
  const categories = (activeFilters as string[]).filter(
    (f) => f in ln,
  ) as (keyof typeof ln)[];
  const options =
    categories.length > 0
      ? categories.flatMap((cat) => ln[cat])
      : Object.values(ln).flat();
  return { main: randomFrom(filtered(options, excluded)), side: null };
};

export const pickDinner = (
  activeFilters: FilterKey[],
  excludedMain: string[],
  excludedSide: string[],
): MealResult => {
  const mainMap = getMeals().dinner.main;
  const sideMap = getMeals().dinner.side;
  const categories = (activeFilters as string[]).filter(
    (f) => f in mainMap,
  ) as (keyof typeof mainMap)[];
  const mainOptions =
    categories.length > 0
      ? categories.flatMap((cat) => mainMap[cat])
      : Object.values(mainMap).flat();

  return {
    main: randomFrom(filtered(mainOptions, excludedMain)),
    side: randomFrom(filtered(sideMap, excludedSide)),
  };
};

export const pickSpecial = (
  activeFilters: FilterKey[],
  excluded: string[],
): MealResult => {
  const sp = getMeals().special;
  const categories = (activeFilters as string[]).filter(
    (f) => f in sp,
  ) as (keyof typeof sp)[];
  let options =
    categories.length > 0
      ? categories.flatMap((cat) => sp[cat])
      : Object.values(sp).flat();
  if (options.length === 0) options = Object.values(sp).flat();
  return { main: randomFrom(filtered(options, excluded)), side: null };
};

export const pickSide = (excludedSide: string[]): string =>
  randomFrom(filtered(getMeals().dinner.side, excludedSide));

export const getAnimationPool = (
  type: CardType,
  activeFilters: FilterKey[],
): string[] => {
  if (type === "breakfast") {
    const bk = getMeals().breakfast;
    const categories = (activeFilters as string[]).filter(
      (f) => f in bk,
    ) as (keyof typeof bk)[];
    return categories.length > 0
      ? categories.flatMap((cat) => bk[cat])
      : Object.values(bk).flat();
  }
  if (type === "lunch") {
    const ln = getMeals().lunch;
    const categories = (activeFilters as string[]).filter(
      (f) => f in ln,
    ) as (keyof typeof ln)[];
    return categories.length > 0
      ? categories.flatMap((cat) => ln[cat])
      : Object.values(ln).flat();
  }
  if (type === "dinner") {
    const mainMap = getMeals().dinner.main;
    const categories = (activeFilters as string[]).filter(
      (f) => f in mainMap,
    ) as (keyof typeof mainMap)[];
    return categories.length > 0
      ? categories.flatMap((cat) => mainMap[cat])
      : Object.values(mainMap).flat();
  }
  const sp = getMeals().special;
  const categories = (activeFilters as string[]).filter(
    (f) => f in sp,
  ) as (keyof typeof sp)[];
  let options =
    categories.length > 0
      ? categories.flatMap((cat) => sp[cat])
      : Object.values(sp).flat();
  if (options.length === 0) options = Object.values(sp).flat();
  return options;
};
