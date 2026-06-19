import type { Card, TelegramConfig } from "../types";

const formatDate = (dateStr: string): string => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
};

const cardEmoji = (type: Card["type"]): string => {
  if (type === "breakfast") return "🌅";
  if (type === "lunch") return "☀️";
  if (type === "dinner") return "🌙";
  return "⭐";
};

const cardLabel = (card: Card): string => {
  if (card.type === "breakfast") return "Завтрак";
  if (card.type === "lunch") return "Обед";
  if (card.type === "dinner") return "Ужин";
  return card.name || "Special";
};

const formatSingleMessage = (card: Card): string => {
  const line = card.result.main ?? "";
  const side = card.result.side ? ` + ${card.result.side}` : "";
  return `${cardEmoji(card.type)} ${cardLabel(card)}: ${line}${side}`;
};

const formatAllMessage = (cards: Card[], date: string): string => {
  const header = `🗓 Меню на ${formatDate(date)}\n`;
  const lines = cards
    .filter((c) => c.result.main)
    .map((c) => {
      const side = c.result.side ? ` + ${c.result.side}` : "";
      return `${cardEmoji(c.type)} ${cardLabel(c)}: ${c.result.main}${side}`;
    });
  return header + "\n" + lines.join("\n");
};

const send = async (config: TelegramConfig, text: string): Promise<void> => {
  if (!config.token || !config.chatId) {
    throw new Error(
      "Telegram не настроен. Нужно добавить токен бота и Chat ID.",
    );
  }
  const res = await fetch(
    `https://api.telegram.org/bot${config.token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text,
        parse_mode: "HTML",
      }),
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { description?: string }).description ?? "Ошибка отправки",
    );
  }
};

export const sendCard = async (
  card: Card,
  config: TelegramConfig,
): Promise<void> => {
  await send(config, formatSingleMessage(card));
};

export const sendAll = async (
  cards: Card[],
  date: string,
  config: TelegramConfig,
): Promise<void> => {
  await send(config, formatAllMessage(cards, date));
};
