import styles from "./Header.module.css";

interface Props {
  date: string;
  onDateChange: (date: string) => void;
  onGenerate: () => void;
  onSendAll: () => void;
  onOpenSettings: () => void;
  onToggleCollapsed: () => void;
  collapsed: boolean;
  generating: boolean;
  hasResults: boolean;
}

export const Header = ({
  date,
  onDateChange,
  onGenerate,
  onSendAll,
  onOpenSettings,
  onToggleCollapsed,
  collapsed,
  generating,
  hasResults,
}: Props) => {
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.logo}>🥕</span>
          <span className={styles.name}>Usagoya</span>
        </div>
      </div>

      <div className={styles.controls}>
        <input
          type="date"
          className={styles.datePicker}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          aria-label="Выбор даты"
        />
        <button
          className={`${styles.generateBtn} ${generating ? styles.generating : ""}`}
          onClick={onGenerate}
          disabled={generating}
        >
          {generating ? "Генерирую..." : "✦ Сгенерировать"}
        </button>
        {hasResults && (
          <button
            className={styles.sendAllBtn}
            onClick={onSendAll}
            disabled={generating}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ flexShrink: 0 }}
            >
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.85-.74 1.06-1.5.66L12.89 16.7l-1.93 1.88c-.21.21-.41.39-.73.4z" />
            </svg>
            Отправить
          </button>
        )}
        <div className={styles.rightBtns}>
          <button
            className={`${styles.settingsBtn} ${styles.collapseBtn}`}
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Развернуть карточки" : "Свернуть карточки"}
          >
            {collapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M200-200v-240h80v160h160v80H200Zm480-320v-160H520v-80h240v240h-80Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M440-440v240h-80v-160H200v-80h240Zm160-320v160h160v80H520v-240h80Z" />
              </svg>
            )}
          </button>
          <button
            className={styles.settingsBtn}
            onClick={onOpenSettings}
            aria-label="Настройки Telegram"
          >
            ⚙
          </button>
        </div>
      </div>
    </header>
  );
};
