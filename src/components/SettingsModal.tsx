import { useState, useEffect, useRef } from "react";
import type { MealFlat, TelegramConfig } from "../types";
import { meals as defaultMeals } from "../data/meals";
import { loadCustomMeals, saveCustomMeals } from "../utils/storage";
import { flattenMeals, unflattenMeals } from "../utils/mealFlat";
import { MEAL_CATEGORIES, MEAL_SECTIONS } from "../config";
import styles from "./SettingsModal.module.css";

interface Props {
  config: TelegramConfig;
  onSave: (config: TelegramConfig) => void;
  onClose: () => void;
}

type Tab = "telegram" | "meals";

export const SettingsModal = ({ config, onSave, onClose }: Props) => {
  const [tab, setTab] = useState<Tab>("telegram");
  const [token, setToken] = useState(config.token);
  const [chatId, setChatId] = useState(config.chatId);
  const [mealFlat, setMealFlat] = useState<MealFlat>(() =>
    flattenMeals(loadCustomMeals() ?? defaultMeals),
  );

  const pendingFocusRef = useRef<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!pendingFocusRef.current) return;
    inputRefs.current[pendingFocusRef.current]?.focus();
    pendingFocusRef.current = null;
  }, [mealFlat]);

  const handleSave = () => {
    onSave({ token: token.trim(), chatId: chatId.trim() });
    saveCustomMeals(unflattenMeals(mealFlat));
    onClose();
  };

  const handleReset = () => {
    setMealFlat(flattenMeals(defaultMeals));
  };

  const updateItem = (key: string, i: number, val: string) =>
    setMealFlat((prev) => ({
      ...prev,
      [key]: prev[key].map((x, j) => (j === i ? val : x)),
    }));

  const removeItem = (key: string, i: number) =>
    setMealFlat((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, j) => j !== i),
    }));

  const addItem = (key: string) => {
    setMealFlat((prev) => {
      const newItems = [...prev[key], ""];
      pendingFocusRef.current = `${key}-${newItems.length - 1}`;
      return { ...prev, [key]: newItems };
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Настройки</h2>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "telegram" ? styles.tabActive : ""}`}
            onClick={() => setTab("telegram")}
          >
            Telegram
          </button>
          <button
            className={`${styles.tab} ${tab === "meals" ? styles.tabActive : ""}`}
            onClick={() => setTab("meals")}
          >
            Меню
          </button>
        </div>

        <div className={styles.content}>
          {tab === "telegram" && (
            <>
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
            </>
          )}

          {tab === "meals" && (
            <div className={styles.mealEditor}>
              {MEAL_SECTIONS.map((section) => {
                const cats = MEAL_CATEGORIES.filter(
                  (c) => c.section === section,
                );
                return (
                  <div key={section} className={styles.section}>
                    <div className={styles.sectionTitle}>{section}</div>
                    {cats.map((cat) => (
                      <div key={cat.key} className={styles.catGroup}>
                        <div className={styles.catLabel}>{cat.label}</div>
                        {mealFlat[cat.key].map((item, i) => (
                          <div key={i} className={styles.listItem}>
                            <input
                              ref={(el) => {
                                inputRefs.current[`${cat.key}-${i}`] = el;
                              }}
                              className={styles.itemInput}
                              value={item}
                              onChange={(e) =>
                                updateItem(cat.key, i, e.target.value)
                              }
                              placeholder="Название блюда"
                            />
                            <button
                              className={styles.delBtn}
                              onClick={() => removeItem(cat.key, i)}
                              aria-label="Удалить"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          className={styles.addBtn}
                          onClick={() => addItem(cat.key)}
                        >
                          + Добавить
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {tab === "meals" && (
            <button className={styles.resetBtn} onClick={handleReset}>
              Сбросить к стандартным
            </button>
          )}
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
