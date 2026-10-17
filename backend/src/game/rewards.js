import { referenceStat } from "./levels.js";

// Серебро за победу над обычным мобом = цена прокачки одной характеристики
// на этом уровне (значение², как в игре) ÷ N, где N — сколько побед должно
// её окупать: от 1.8 на 1 уровне до ~6 на 100-м.
const winsPerUpgrade = (level) => 1.8 + 0.042 * (level - 1);
const baseSilver = (level) => referenceStat(level) ** 2 / winsPerUpgrade(level);

// Доля порога следующего уровня, которую даёт победа над обычным мобом:
// 40% на 1 уровне (2 из 5 опыта), дальше падает.
const baseXpShare = (level) => 0.4 / (1 + 0.1 * (level - 1));

// Множители по исходу боя. Проигрыш не обнуляет серебро и карму
// (как в примерах боёв), но опыт даётся только за победу и ничью.
const OUTCOME = {
  win: { silver: 1, xp: 1, fullKarma: true },
  draw: { silver: 0.7, xp: 0.5, fullKarma: false },
  loss: { silver: 0.4, xp: 0, fullKarma: false },
  ko: { silver: 0.25, xp: 0, fullKarma: false },
};

// Светлые миссии дают больше опыта, тёмные — больше серебра.
const KIND = {
  light: { silver: 0.85, xp: 1.15 },
  dark: { silver: 1.15, xp: 0.85 },
};

const ELITE_MULTIPLIER = 1.6;

/**
 * Подпись прибыли: небольшая / обычная / большая. Считается по броску удачи
 * с учётом исхода боя, поэтому после поражения «большой» прибыли не бывает.
 */
const profitLabel = (share) => (share < 0.85 ? "small" : share > 1.15 ? "large" : "normal");

/**
 * Награда за один бой.
 *
 * outcome   — win | draw | loss | ko,
 * kind      — light | dark,
 * elite     — вожак (награда ×1.6, карма ×2),
 * mobLevel  — уровень моба (по нему считается серебро),
 * hero      — { level, maxXp, luck } героя на начало миссии,
 * grind     — штраф за слишком лёгкую локацию (1 — без штрафа).
 *
 * Прибыль колеблется от 0.6 до 1.4 базы; Удача выше эталона сдвигает бросок
 * вверх (до +20%).
 */
export const computeEncounterRewards = ({
  outcome, kind, elite, mobLevel, hero, grind, rng,
}) => {
  const o = OUTCOME[outcome];
  const k = KIND[kind];
  const eliteMult = elite ? ELITE_MULTIPLIER : 1;

  const luckBoost = Math.min(
    0.2,
    Math.max(0, 0.2 * (hero.luck / referenceStat(hero.level) - 1)),
  );
  const roll = rng.float(0.6, 1.4) * (1 + luckBoost);

  const silver = Math.max(
    1,
    Math.round(baseSilver(mobLevel) * roll * k.silver * o.silver * eliteMult * grind),
  );
  const xp = Math.round(
    baseXpShare(hero.level) * hero.maxXp * k.xp * o.xp * eliteMult * grind,
  );

  const fullKarma = elite ? 2 : 1;
  const karma = o.fullKarma ? fullKarma : Math.ceil(fullKarma / 2);

  return { silver, xp, karma, karmaKind: kind, profit: profitLabel(roll * o.silver) };
};
