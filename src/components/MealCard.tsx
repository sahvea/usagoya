import { useState, useRef } from "react";
import type { Card, FilterKey } from "../types";
import { CARD_META } from "../config";
import { getAnimationPool } from "../utils/pick";
import { FilterChips } from "./FilterChips";
import { SlotMachine } from "./SlotMachine";
import { CardActions } from "./CardActions";
import styles from "./MealCard.module.css";

interface Props {
  card: Card;
  animatingCardId: string | null;
  pendingResult: {
    id: string;
    result: { main: string; side: string | null };
  } | null;
  onFilterToggle: (cardId: string, filter: FilterKey) => void;
  onGenerateSingle: (card: Card) => void;
  onSkip: (card: Card) => void;
  onRerollSide: (card: Card) => void;
  onToggleNoSide: (cardId: string) => void;
  onConfirm: (cardId: string) => void;
  onUnconfirm: (cardId: string) => void;
  onRemove?: (cardId: string) => void;
  onRename?: (cardId: string, name: string) => void;
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
  onRename,
  onAnimDone,
  collapsed,
}: Props) => {
  const meta = CARD_META[card.type];
  const isAnimating = card.animating;
  const pending = pendingResult?.id === card.id ? pendingResult.result : null;
  const animOptions = getAnimationPool(card.type, card.activeFilters);
  const isLocked = card.confirmed;
  const displayMain = pending?.main ?? card.result.main;

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setEditValue(card.name ?? "");
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = () => {
    setEditing(false);
    onRename?.(card.id, editValue.trim());
  };

  const displayLabel =
    card.type === "special" ? card.name || meta.label : meta.label;

  return (
    <div
      className={`${styles.card} ${card.confirmed ? styles.confirmed : ""}`}
    >
      <div className={styles.header}>
        <span className={styles.icon}>{meta.icon}</span>
        {card.type === "special" && onRename ? (
          editing ? (
            <input
              ref={inputRef}
              name="card-name"
              className={styles.labelInput}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit();
                if (e.key === "Escape") setEditing(false);
              }}
              maxLength={32}
              autoFocus
            />
          ) : (
            <span
              className={styles.labelEditable}
              onClick={startEdit}
              title="Нажмите для переименования"
            >
              {displayLabel}
              <svg
                className={styles.editIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </span>
          )
        ) : (
          <span className={styles.label}>{displayLabel}</span>
        )}
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
          onGenerateSingle={
            !isLocked && !isAnimating ? () => onGenerateSingle(card) : undefined
          }
        />
        {!collapsed &&
          !card.result.noSide &&
          (pending?.side ?? card.result.side) && (
            <div className={styles.side}>
              <span className={styles.sideLabel}>Гарнир:</span>{" "}
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
