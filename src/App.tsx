import { useReducer, useState, useCallback } from 'react';
import { reducer, makeInitialState, pickForCard, excludeAndPick, pickNewSide } from './reducer';
import type { Card, FilterKey } from './types';
import { CARD_META, CARD_LIMITS, ALL_CARD_TYPES } from './config';
import { sendAll } from './utils/telegram';
import { Header } from './components/Header';
import { MealCard } from './components/MealCard';
import { TelegramSettings } from './components/TelegramSettings';
import styles from './App.module.css';

const App = () => {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState);
  const [showSettings, setShowSettings] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [pendingResults, setPendingResults] = useState<
    Record<string, { main: string; side: string | null }>
  >({});
  const [error, setError] = useState<string | null>(null);

  const anyAnimating = state.cards.some((c) => c.animating);
  const hasResults = state.cards.some((c) => c.result.main);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  };

  const handleGenerate = () => {
    if (anyAnimating) return;
    const targets = state.cards.filter((c) => !c.confirmed && !c.sent);
    if (targets.length === 0) return;

    const newPending: Record<string, { main: string; side: string | null }> = {};
    targets.forEach((c) => {
      const result = pickForCard(c);
      newPending[c.id] = { main: result.main ?? '', side: result.side };
    });

    setPendingResults(newPending);
    targets.forEach((c, i) => {
      setTimeout(() => {
        dispatch({ type: 'SET_ANIMATING', cardId: c.id, animating: true });
      }, i * 150);
    });
  };

  const handleAnimDone = useCallback(
    (cardId: string) => {
      setPendingResults((prev) => {
        const pending = prev[cardId];
        if (!pending) return prev;
        dispatch({
          type: 'SET_RESULT',
          cardId,
          result: { main: pending.main, side: pending.side },
        });
        const next = { ...prev };
        delete next[cardId];
        return next;
      });
    },
    []
  );

  const handleReroll = (card: Card) => {
    if (card.confirmed || card.sent || card.animating) return;
    const result = pickForCard(card);
    setPendingResults((prev) => ({
      ...prev,
      [card.id]: { main: result.main ?? '', side: result.side },
    }));
    dispatch({ type: 'SET_ANIMATING', cardId: card.id, animating: true });
  };

  const handleSkip = (card: Card) => {
    if (card.confirmed || card.sent || card.animating) return;
    const { newExcluded, result } = excludeAndPick(card);

    dispatch({
      type: 'SET_CARDS',
      cards: state.cards.map((c) =>
        c.id === card.id ? { ...c, excludedToday: newExcluded, animating: true } : c
      ),
    });
    setPendingResults((prev) => ({
      ...prev,
      [card.id]: { main: result.main ?? '', side: result.side },
    }));
  };

  const handleToggleNoSide = (cardId: string) => {
    dispatch({ type: 'TOGGLE_NO_SIDE', cardId });
  };

  const handleRerollSide = (card: Card) => {
    if (card.type !== 'dinner' || card.confirmed || card.sent || card.animating) return;
    const newSide = pickNewSide(card);
    dispatch({ type: 'REROLL_SIDE', cardId: card.id, side: newSide });
  };

  const handleSendAll = async () => {
    if (!state.telegramConfig.token || !state.telegramConfig.chatId) {
      setShowSettings(true);
      return;
    }
    const active = state.cards.filter((c) => c.result.main);
    if (active.length === 0) return;
    try {
      await sendAll(active, state.date, state.telegramConfig);
      active.forEach((c) => dispatch({ type: 'MARK_SENT', cardId: c.id }));
    } catch (e) {
      showError((e as Error).message);
    }
  };

  const availableTypes = ALL_CARD_TYPES.filter(
    (t) => state.cards.filter((c) => c.type === t).length < CARD_LIMITS[t]
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Header
          date={state.date}
          onDateChange={(date) => dispatch({ type: 'SET_DATE', date })}
          onGenerate={handleGenerate}
          onSendAll={handleSendAll}
          onOpenSettings={() => setShowSettings(true)}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
          collapsed={collapsed}
          generating={anyAnimating}
          hasResults={hasResults}
        />

        <div className={styles.grid}>
          {state.cards.map((card) => (
            <MealCard
              key={card.id}
              card={card}
              animatingCardId={card.animating ? card.id : null}
              pendingResult={
                pendingResults[card.id]
                  ? { id: card.id, result: pendingResults[card.id] }
                  : null
              }
              onFilterToggle={(_cardId: string, filter: FilterKey) =>
                dispatch({ type: 'SET_FILTER', cardId: card.id, filter })
              }
              onGenerateSingle={handleReroll}
              onSkip={handleSkip}
              onRerollSide={handleRerollSide}
              onToggleNoSide={handleToggleNoSide}
              onConfirm={(cardId) => dispatch({ type: 'CONFIRM', cardId })}
              onUnconfirm={(cardId) => dispatch({ type: 'UNCONFIRM', cardId })}
              onRemove={(cardId) => dispatch({ type: 'REMOVE_CARD', cardId })}
              onRename={
                card.type === 'special'
                  ? (cardId, name) => dispatch({ type: 'RENAME_CARD', cardId, name })
                  : undefined
              }
              collapsed={collapsed}
              onAnimDone={handleAnimDone}
            />
          ))}

          {availableTypes.length > 0 && (
            <div className={styles.addArea}>
              {availableTypes.map((t) => (
                <button
                  key={t}
                  className={styles.addTypeBtn}
                  onClick={() => dispatch({ type: 'ADD_CARD', cardType: t })}
                  disabled={anyAnimating}
                >
                  <span>{CARD_META[t].icon}</span>
                  <span>+ {CARD_META[t].label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}
      </div>

      {showSettings && (
        <TelegramSettings
          config={state.telegramConfig}
          onSave={(config) => dispatch({ type: 'SET_TELEGRAM', config })}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;
