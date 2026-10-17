// Уровни и опыт.

/**
 * Эталонное значение характеристики на уровне L: «примерно +1 к каждой
 * характеристике за уровень». От него считаются жизни, урон и сила мобов,
 * поэтому бой выглядит одинаково на любом уровне.
 */
export const referenceStat = (level) => 3 + (level - 1);

/** Сколько опыта нужно, чтобы с уровня L перейти на L+1 (5 на 1 уровне). */
export const xpToNextLevel = (level) => Math.round(5 * level ** 1.5);

/**
 * Начисляет опыт и повышает уровень, пока опыта хватает на следующий.
 * Возвращает новые level, xp, maxXp и сколько уровней получено.
 */
export const applyXp = ({ level, xp, maxXp }, gained) => {
  let currentLevel = level;
  let currentXp = xp + gained;
  let currentMax = maxXp;

  while (currentXp >= currentMax) {
    currentXp -= currentMax;
    currentLevel += 1;
    currentMax = xpToNextLevel(currentLevel);
  }

  return {
    level: currentLevel,
    xp: currentXp,
    maxXp: currentMax,
    levelsGained: currentLevel - level,
  };
};
