import { useState } from "react";
import type { TelegramConfig } from "../types";
import styles from "./TelegramSettings.module.css";

interface Props {
  config: TelegramConfig;
  onSave: (config: TelegramConfig) => void;
  onClose: () => void;
}

export const TelegramSettings = ({ config, onSave, onClose }: Props) => {
  const [token, setToken] = useState(config.token);
  const [chatId, setChatId] = useState(config.chatId);

  const handleSave = () => {
    onSave({ token: token.trim(), chatId: chatId.trim() });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Telegram</h2>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
        <p className={styles.hint}>
          Создайте бота через{" "}
          <a
            href="https://t.me/BotFather"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            @BotFather
          </a>
          , получите токен. Chat ID можно узнать у{" "}
          <a
            href="https://t.me/userinfobot"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            @userinfobot
          </a>
          .
        </p>
        <div className={styles.field}>
          <label className={styles.label}>Bot Token</label>
          <input
            className={styles.input}
            type="text"
            name="bot-token"
            placeholder="123456:ABC-DEF..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Chat ID</label>
          <input
            className={styles.input}
            type="text"
            name="chat-id"
            placeholder="-100123456789"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className={styles.footer}>
          <button className={styles.cancel} onClick={onClose}>
            Отмена
          </button>
          <button className={styles.save} onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};
