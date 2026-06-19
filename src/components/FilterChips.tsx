import type { FilterKey, CardType } from '../types';
import { FILTER_CHIPS } from '../config';
import styles from './FilterChips.module.css';

interface Props {
  type: CardType;
  activeFilters: FilterKey[];
  disabled: boolean;
  onToggle: (filter: FilterKey) => void;
}

export const FilterChips = ({ type, activeFilters, disabled, onToggle }: Props) => {
  const chips = FILTER_CHIPS[type];

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
