import type { Card, FilterKey } from '../types';
import { CARD_META } from '../config';
import { getAnimationPool } from '../utils/pick';
import { FilterChips } from './FilterChips';
import { SlotMachine } from './SlotMachine';
import { CardActions } from './CardActions';
import styles from './MealCard.module.css';

interface Props {
  card: Card;
  animatingCardId: string | null;
  pendingResult: { id: string; result: { main: string; side: string | null } } | null;
  onFilterToggle: (cardId: string, filter: FilterKey) => void;
  onGenerateSingle: (card: Card) => void;
  onSkip: (card: Card) => void;
  onRerollSide: (card: Card) => void;
  onToggleNoSide: (cardId: string) => void;
  onConfirm: (cardId: string) => void;
  onUnconfirm: (cardId: string) => void;
  onRemove?: (cardId: string) => void;
  onAnimDone: (cardId: string) => void;
  collapsed: boolean;
}

export const MealCard = ({
  card,
  animatingCardId,
  pendingResult,
  onFilterToggle,
  onGenerateSingle,
  onSkip,
  onRerollSide,
  onToggleNoSide,
  onConfirm,
  onUnconfirm,
  onRemove,
  onAnimDone,
  collapsed,
}: Props) => {
  const meta = CARD_META[card.type];
  const isAnimating = card.animating;
  const pending = pendingResult?.id === card.id ? pendingResult.result : null;
  const animOptions = getAnimationPool(card.type, card.activeFilters);
  const isLocked = card.confirmed || card.sent;
  const displayMain = pending?.main ?? card.result.main;

  return (
    <div
      className={`${styles.card} ${card.confirmed ? styles.confirmed : ''} ${card.sent ? styles.sent : ''}`}
    >
      <div className={styles.header}>
        <span className={styles.icon}>{meta.icon}</span>
        <span className={styles.label}>{meta.label}</span>
        {onRemove && (
          <button
            className={styles.removeBtn}
            onClick={() => onRemove(card.id)}
            aria-label="Удалить карточку"
          >
            ✕
          </button>
        )}
      </div>

      {!collapsed && (
        <FilterChips
          type={card.type}
          activeFilters={card.activeFilters}
          disabled={isLocked || isAnimating}
          onToggle={(f) => onFilterToggle(card.id, f)}
        />
      )}

      <div className={styles.slot}>
        <SlotMachine
          options={animOptions}
          finalValue={displayMain}
          running={isAnimating && animatingCardId === card.id}
          onDone={() => onAnimDone(card.id)}
          onGenerateSingle={!isLocked && !isAnimating ? () => onGenerateSingle(card) : undefined}
        />
        {!collapsed && !card.result.noSide && (pending?.side ?? card.result.side) && (
          <div className={styles.side}>
            <span className={styles.sideLabel}>Гарнир:</span>{' '}
            {pending?.side ?? card.result.side}
          </div>
        )}
      </div>

      {!collapsed && (
        <CardActions
          card={card}
          onSkip={() => onSkip(card)}
          onRerollSide={() => onRerollSide(card)}
          onToggleNoSide={() => onToggleNoSide(card.id)}
          onConfirm={() => onConfirm(card.id)}
          onUnconfirm={() => onUnconfirm(card.id)}
        />
      )}
    </div>
  );
};
