import { referenceStat } from "./levels.js";
import { averageDamage, damageRange, HP_PER_CONSTITUTION } from "./heroSheet.js";
import { emptyElementMap } from "./elements.js";
import { LEVEL_TITLES } from "./bestiary.js";

// Броня моба как доля его эталонного физического удара. У героя броня идёт из
// экипировки (пока постоянная), поэтому у мобов она небольшая.
const ARMOR_PER_STAT = 0.25;

const round2 = (value) => Math.round(value * 100) / 100;
const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1);

/** Название моба: титул по уровню + имя шаблона, у вожака — пометка. */
const mobName = (tpl, level, elite) => {
  const title = LEVEL_TITLES.find((t) => level >= t.from);
  const base = title ? `${title[tpl.gender]} ${lowerFirst(tpl.name)}` : tpl.name;
  return elite ? `${base} (вожак)` : base;
};

/**
 * Создаёт моба.
 *
 * Характеристики = эталон уровня × вес шаблона × сложность × разброс ±8%.
 * Всё остальное (жизни, урон, броня, стихия) выводится из них теми же
 * правилами, что у героя, поэтому моб «растёт» вместе с уровнем.
 *
 * tpl        — шаблон из бестиария,
 * level      — уровень моба,
 * difficulty — общий множитель силы (уже с поправкой на мощь героя),
 * elite      — вожак.
 */
export const generateMob = ({ tpl, level, difficulty, elite, rng }) => {
  const ref = referenceStat(level);
  const scale = difficulty * tpl.power;
  // Характеристики моба дробные (в интерфейсе округляются): так сила мобов
  // меняется плавно даже на первых уровнях, где значения совсем малы.
  const stat = (weight) =>
    Math.max(1, round2(ref * weight * scale * rng.float(0.92, 1.08)));

  const strength = stat(tpl.weights.str);
  const giftedness = stat(tpl.weights.gift);
  const constitution = stat(tpl.weights.con);
  const luck = stat(tpl.weights.luck);
  const attackSkill = stat(tpl.weights.att);
  const defenseSkill = stat(tpl.weights.def);

  const range = damageRange(strength);
  const attack = emptyElementMap();
  const resist = emptyElementMap();
  if (tpl.element) {
    attack[tpl.element] = round2((ref / 3) * tpl.elementShare * scale);
    resist[tpl.element] = tpl.ownResist;
  }

  return {
    templateId: tpl.id,
    name: mobName(tpl, level, elite),
    level,
    elite,
    strength,
    giftedness,
    constitution,
    luck,
    attackSkill,
    defenseSkill,
    damageMin: range.min,
    damageMax: range.max,
    damageAverage: averageDamage(strength),
    armor: round2(ARMOR_PER_STAT * (ref / 3) * tpl.armor * scale),
    hpMax: round2(HP_PER_CONSTITUTION * constitution),
    elements: { attack, resist },
  };
};
