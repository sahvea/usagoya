import type { Card } from '../types';
import styles from './CardActions.module.css';

interface Props {
  card: Card;
  onSkip: () => void;
  onRerollSide: () => void;
  onToggleNoSide: () => void;
  onConfirm: () => void;
  onUnconfirm: () => void;
}

export const CardActions = ({
  card,
  onSkip,
  onRerollSide,
  onToggleNoSide,
  onConfirm,
  onUnconfirm,
}: Props) => {
  if (!card.result.main) return null;

  const animating = card.animating;
  const actionDisabled = animating || card.confirmed;
  const noSide = card.result.noSide;

  return (
    <div className={styles.actions}>
      {!card.sent && (
        <>
          <button className={styles.btn} onClick={onSkip} disabled={actionDisabled}>
            <span className={styles.icon}>✕</span> Не в этот раз
          </button>
          {card.type === 'dinner' && (
            <>
              {!noSide && (
                <button className={styles.btn} onClick={onRerollSide} disabled={actionDisabled}>
                  <span className={styles.icon}>↔</span> Сменить гарнир
                </button>
              )}
              <button
                className={`${styles.btn} ${noSide ? styles.noSideActive : ''}`}
                onClick={onToggleNoSide}
                disabled={actionDisabled}
              >
                <span className={styles.icon}>{noSide ? '✓' : '○'}</span> Без гарнира
              </button>
            </>
          )}
          {card.confirmed ? (
            <button className={`${styles.btn} ${styles.confirmed}`} onClick={onUnconfirm} disabled={animating}>
              <span className={styles.icon}>✓</span> Подтверждено
            </button>
          ) : (
            <button className={`${styles.btn} ${styles.confirm}`} onClick={onConfirm} disabled={animating}>
              <span className={styles.icon}>✓</span> Подтвердить
            </button>
          )}
        </>
      )}
    </div>
  );
};
