// Правила работы: виды работ и расчёт награды.

export const WORK_MIN_HOURS = 1;
export const WORK_MAX_HOURS = 8;

/**
 * Виды работ. karmaKind: "light" | "dark" | null (нейтральная — без кармы).
 * Описания и названия — тексты по умолчанию, их можно менять.
 */
export const WORK_TYPES = Object.freeze({
  gate: {
    id: "gate",
    name: "Охрана ворот",
    description:
      "Стойте на страже городских ворот: проверяйте путников и не пропускайте нарушителей. Честная служба приносит серебро и светлую карму.",
    karmaKind: "light",
  },
  field: {
    id: "field",
    name: "Работа в поле",
    description:
      "Тяжёлый, но честный труд на полях за городом. На долгой смене платят больше, чем за другие работы, но ни светлой, ни тёмной кармы это не принесёт.",
    karmaKind: null,
  },
  robbery: {
    id: "robbery",
    name: "Грабёж",
    description:
      "Подстерегайте обозы и ночных путников на тёмных дорогах. Добыча верная, но слава дурная: вы получите серебро и тёмную карму.",
    karmaKind: "dark",
  },
});

// Серебро в час по уровню игрока. Задан только 1 уровень (2 серебра в час);
// для более высоких уровней действует значение ближайшего меньшего уровня.
const SILVER_PER_HOUR_BY_LEVEL = Object.freeze({ 1: 2 });

export const silverPerHour = (level) => {
  const levels = Object.keys(SILVER_PER_HOUR_BY_LEVEL).map(Number);
  const reached = levels.filter((l) => l <= level);
  return SILVER_PER_HOUR_BY_LEVEL[Math.max(...(reached.length ? reached : levels))];
};

// Очков кармы за каждые полные или начатые 2 часа работы.
const KARMA_PER_TWO_HOURS = 1;

/**
 * Награда за работу.
 *
 * Серебро = ставка × часы + floor(часы / 8), а для нейтральной работы
 * ещё + floor(часы / 3). Это даёт значения из задания:
 *   охрана/грабёж: 1 ч → 2, 2 → 4, 3 → 6, 4 → 8, 5 → 10, ..., 8 → 17
 *   нейтральная:   1 ч → 2, 2 → 4, 3 → 7, 4 → 9, 5 → 11, ..., 8 → 19
 * (значения для 6 и 7 часов в задании не названы — получены по той же формуле).
 *
 * Карма = ceil(часы / 2): 1 ч → 1, 2 → 1, 3 → 2, 4 → 2, 5 → 3, ..., 8 → 4
 * (только для видов работ с кармой).
 */
export const workReward = (typeId, hours, level) => {
  const type = WORK_TYPES[typeId];
  const neutralBonus = type.karmaKind ? 0 : Math.floor(hours / 3);

  return {
    silver:
      silverPerHour(level) * hours + Math.floor(hours / 8) + neutralBonus,
    karma: type.karmaKind
      ? Math.ceil(hours / 2) * KARMA_PER_TWO_HOURS
      : 0,
    karmaKind: type.karmaKind,
  };
};

export const WORK_ERRORS = Object.freeze({
  ALREADY_WORKING: "You are already working",
});
