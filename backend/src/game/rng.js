/**
 * Генератор случайных чисел с зерном (mulberry32). Одно и то же зерно даёт
 * один и тот же бой, поэтому бой можно воспроизвести и проверить.
 */
export const createRng = (seed) => {
  let state = seed >>> 0;

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    /** Число в [0, 1). */
    next,
    /** true с вероятностью p. */
    chance: (p) => next() < p,
    /** Дробное число в [min, max). */
    float: (min, max) => min + (max - min) * next(),
    /** Целое число в [min, max]. */
    int: (min, max) => Math.floor(min + (max - min + 1) * next()),
    /**
     * Округление до целого с сохранением среднего: 2.3 → 2 в 70% случаев и
     * 3 в 30%. Так мелкие дробные значения (особенно на первых уровнях) не
     * теряются из-за округления.
     */
    round: (value) => {
      const whole = Math.floor(value);
      return whole + (next() < value - whole ? 1 : 0);
    },
    /** Случайный элемент массива. */
    pick: (items) => items[Math.floor(next() * items.length)],
  };
};

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
