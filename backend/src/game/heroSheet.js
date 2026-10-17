import { emptyElementMap } from "./elements.js";

// Максимум жизней = 25 × Телосложение (3 → 75).
export const HP_PER_CONSTITUTION = 25;

/**
 * Средний физический удар: Сила ÷ 3, не меньше 1. В бою каждый удар
 * округляется случайно (Сила 5 → 1 или 2 в пропорции 1/3 и 2/3), поэтому
 * каждое очко Силы работает, а не только кратные трём.
 */
export const averageDamage = (strength) => Math.max(1, strength / 3);

/** Диапазон удара для показа в интерфейсе: 3 → «1 - 1», 5 → «1 - 2», 10 → «3 - 4». */
export const damageRange = (strength) => {
  const average = averageDamage(strength);
  return { min: Math.max(1, Math.floor(average)), max: Math.max(1, Math.ceil(average)) };
};

/**
 * Боевые показатели, которые выводятся из характеристик. Одни и те же
 * значения показываются в интерфейсе и используются в бою, поэтому
 * повышенная характеристика меняется везде сразу.
 *  - урон — от Силы (диапазон между ближайшими целыми),
 *  - шанс на удар — Искусство атаки, шанс на защиту — Искусство защиты,
 *  - броня — из экипировки (пока постоянная, берётся из БД).
 */
export const deriveCombat = (user) => {
  const range = damageRange(user.strength);
  return {
    damageMin: range.min,
    damageMax: range.max,
    armor: user.armor,
    hitChance: user.attack_skill,
    blockChance: user.defense_skill,
  };
};

/**
 * Бонусы стихий героя от экипировки (руны). Экипировки пока нет, поэтому
 * везде 0; когда она появится, значения нужно собирать здесь.
 */
export const heroElements = () => ({
  attack: emptyElementMap(),
  resist: emptyElementMap(),
});

/** Боевой лист героя на момент начала миссии (hp — текущие жизни). */
export const buildHeroSheet = (user, hp) => {
  const combat = deriveCombat(user);
  return {
    name: user.hero_name,
    level: user.level,
    strength: user.strength,
    giftedness: user.giftedness,
    constitution: user.constitution,
    luck: user.luck,
    attackSkill: user.attack_skill,
    defenseSkill: user.defense_skill,
    damageMin: combat.damageMin,
    damageMax: combat.damageMax,
    damageAverage: averageDamage(user.strength),
    armor: combat.armor,
    hpMax: user.max_hp,
    hp,
    elements: heroElements(),
  };
};
