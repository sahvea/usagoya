import type { FilterKey, CardType } from '../types';
import styles from './FilterChips.module.css';

interface ChipDef {
  key: FilterKey;
  label: string;
}

const CHIPS: Record<CardType, ChipDef[]> = {
  breakfast: [
    { key: 'eggs', label: 'яйца' },
    { key: 'alternatives', label: 'альтернативы' },
  ],
  lunch: [
    { key: 'soups', label: 'супы' },
  ],
  dinner: [
    { key: 'chicken', label: 'курица' },
    { key: 'beef', label: 'говядина' },
    { key: 'pork', label: 'свинина' },
    { key: 'fish', label: 'рыба' },
  ],
  special: [
    { key: 'salads', label: 'салаты' },
    { key: 'appetizers', label: 'закуски' },
    { key: 'savory_pastry', label: 'выпечка несладкая' },
    { key: 'sweet_pastry', label: 'выпечка сладкая' },
  ],
};

interface Props {
  type: CardType;
  activeFilters: FilterKey[];
  disabled: boolean;
  onToggle: (filter: FilterKey) => void;
}

export const FilterChips = ({ type, activeFilters, disabled, onToggle }: Props) => {
  const chips = CHIPS[type];

  return (
    <div className={styles.row}>
      {chips.map((chip) => {
        const active = activeFilters.includes(chip.key);
        return (
          <button
            key={chip.key}
            className={`${styles.chip} ${active ? styles.active : ''}`}
            onClick={() => onToggle(chip.key)}
            disabled={disabled}
            aria-pressed={active}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
};
