import { useSlotAnimation } from '../hooks/useSlotAnimation';
import styles from './SlotMachine.module.css';

interface Props {
  options: string[];
  finalValue: string | null;
  running: boolean;
  onDone: () => void;
  onGenerateSingle?: () => void;
}

export const SlotMachine = ({ options, finalValue, running, onDone, onGenerateSingle }: Props) => {
  const { displayText, wobble, running: isRunning } = useSlotAnimation(
    options,
    finalValue,
    running,
    onDone
  );

  if (!finalValue && !isRunning) {
    return (
      <button className={styles.empty} onClick={onGenerateSingle} disabled={!onGenerateSingle} aria-label="Сгенерировать">
        <span className={styles.emptyIcon}>🎲</span>
      </button>
    );
  }

  const Tag = onGenerateSingle ? 'button' : 'div';

  return (
    <Tag
      className={`${styles.tile} ${onGenerateSingle ? styles.tileClickable : ''}`}
      {...(onGenerateSingle ? { onClick: onGenerateSingle } : {})}
    >
      <span
        className={styles.text}
        style={{ transform: wobble, transition: isRunning ? 'transform 0.06s ease' : 'transform 0.22s ease' }}
      >
        {displayText}
      </span>
      {onGenerateSingle && <span className={styles.tileIcon}>🎲</span>}
    </Tag>
  );
};
