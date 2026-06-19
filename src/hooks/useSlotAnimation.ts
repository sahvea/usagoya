import { useEffect, useRef, useState } from 'react';

interface SlotState {
  displayText: string;
  wobble: string;
  running: boolean;
}

export const useSlotAnimation = (
  options: string[],
  finalValue: string | null,
  running: boolean,
  onDone: () => void
) => {
  const [state, setState] = useState<SlotState>({
    displayText: finalValue ?? '',
    wobble: '',
    running: false,
  });
  const frameRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Sync display text when finalValue changes outside of animation
  useEffect(() => {
    if (!running) {
      setState((s) => ({ ...s, displayText: finalValue ?? '' }));
    }
  }, [finalValue, running]);

  useEffect(() => {
    if (!running || !finalValue || options.length === 0) return;

    frameRef.current = 0;
    const total = 24;

    const tick = () => {
      const frame = frameRef.current;

      if (frame >= total) {
        setState({ displayText: finalValue!, wobble: 'scale(1.05)', running: false });
        setTimeout(() => {
          setState((s) => ({ ...s, wobble: '' }));
          onDoneRef.current();
        }, 150);
        return;
      }

      const delay = frame < 8 ? 55 : frame < 15 ? 95 : frame < 20 ? 155 : 250;
      const text = options[Math.floor(Math.random() * options.length)];
      const rx = (Math.random() - 0.5) * 16;
      const ry = (Math.random() - 0.5) * 10;
      const s = 0.91 + Math.random() * 0.13;
      const wobble = `rotate(${rx}deg) scale(${s}) translateY(${ry}px)`;

      setState({ displayText: text, wobble, running: true });
      frameRef.current += 1;
      timerRef.current = setTimeout(tick, delay);
    };

    tick();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [running, finalValue, options]);

  return state;
};
