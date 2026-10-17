import { clamp } from "./rng.js";
import { ELEMENTS, MAX_RESISTANCE } from "./elements.js";
import { referenceStat } from "./levels.js";

// В каждом раунде оба бойца атакуют по разу.
export const BATTLE_ROUNDS = 10;
// Разница в снятых процентах жизней меньше этой доли — ничья.
const DRAW_THRESHOLD = 0.12;
const CRIT_MULTIPLIER = 1.5;

/**
 * Исход одной атаки: "miss" (промах), "block" (блок) или "hit" (попадание).
 *
 * Промах зависит от Искусства атаки атакующего против Искусства защиты цели,
 * блок — от обратной разницы. Берётся соотношение рейтингов, а не их разность,
 * поэтому шансы одинаковы на любом уровне (3 против 3 и 100 против 100).
 * При равных рейтингах: промах 25%, блок 15%, попадание 60%.
 */
const resolveAttack = (attacker, defender, rng) => {
  const ratio =
    (attacker.attackSkill - defender.defenseSkill) /
    (attacker.attackSkill + defender.defenseSkill);

  if (!rng.chance(clamp(0.75 + 0.2 * ratio, 0.4, 0.95))) return { result: "miss" };
  if (rng.chance(clamp(0.2 - 0.2 * ratio, 0.05, 0.4))) return { result: "block" };

  const crit = rng.chance(
    0.05 + (0.1 * attacker.luck) / (attacker.luck + referenceStat(attacker.level)),
  );
  let raw = rng.round(attacker.damageAverage);
  if (crit) raw *= CRIT_MULTIPLIER;

  // Броня снижает физический урон на долю armor / (armor + 2 × удар): чем
  // она больше относительно удара, тем сильнее защита, но полной защиты нет.
  // Благодаря этому броня одинаково работает на любом уровне. Стихийный урон
  // броня не снижает.
  const armorReduction = defender.armor / (defender.armor + 2 * raw);

  // Одарённость цели снижает весь входящий урон (до −30%).
  const giftedReduction =
    (0.3 * defender.giftedness) / (defender.giftedness + referenceStat(defender.level));
  const keep = 1 - giftedReduction;

  // Дробный урон округляется случайно, в среднем без потерь.
  const physical = Math.max(1, rng.round(raw * (1 - armorReduction) * keep));

  const elements = [];
  for (const element of ELEMENTS) {
    const bonus = attacker.elements.attack[element] ?? 0;
    if (bonus <= 0) continue;
    const resist = clamp(defender.elements.resist[element] ?? 0, 0, MAX_RESISTANCE);
    const amount = rng.round(bonus * (1 - resist) * keep);
    if (amount > 0) elements.push({ element, amount });
  }

  const damage = physical + elements.reduce((sum, e) => sum + e.amount, 0);

  return { result: "hit", crit, physical, elements, damage };
};

/**
 * Бой героя с мобом: 10 раундов, в каждом оба атакуют по разу, порядок
 * определяет жребий с небольшим перекосом по Удаче.
 *
 * Бой заканчивается раньше, если жизни героя дошли до нуля (нокаут —
 * поражение, герой остаётся с 1 жизнью) или жизни моба (победа). Иначе
 * побеждает тот, кто снял больший ПРОЦЕНТ жизней противника; разница меньше
 * 12% — ничья.
 *
 * hero.hp — текущие жизни героя на начало боя (жизни переходят из боя в бой),
 * hero.hpMax и mob.hpMax — максимумы (по ним считаются проценты).
 */
export const simulateBattle = (hero, mob, rng) => {
  let heroHp = hero.hp;
  let mobHp = mob.hpMax;
  let dealtByHero = 0;
  let dealtByMob = 0;
  let outcome = null;
  const events = [];

  rounds: for (let round = 1; round <= BATTLE_ROUNDS; round++) {
    const mobFirst = rng.chance(mob.luck / (hero.luck + mob.luck));
    const order = mobFirst
      ? [["mob", mob, hero], ["hero", hero, mob]]
      : [["hero", hero, mob], ["mob", mob, hero]];

    for (const [actor, attacker, defender] of order) {
      const attack = resolveAttack(attacker, defender, rng);
      const event = { round, actor, ...attack };

      if (attack.result === "hit") {
        if (actor === "hero") {
          mobHp -= attack.damage;
          dealtByHero += attack.damage;
        } else {
          heroHp -= attack.damage;
          dealtByMob += attack.damage;
        }
      }
      events.push(event);

      if (heroHp <= 0) {
        outcome = "ko";
        break rounds;
      }
      if (mobHp <= 0) {
        outcome = "win";
        break rounds;
      }
    }
  }

  if (!outcome) {
    const heroShare = dealtByHero / mob.hpMax;
    const mobShare = dealtByMob / hero.hpMax;
    const gap = Math.abs(heroShare - mobShare);

    if (gap <= DRAW_THRESHOLD * Math.max(heroShare, mobShare)) outcome = "draw";
    else outcome = heroShare > mobShare ? "win" : "loss";
  }

  return {
    outcome,
    events,
    dealtByHero,
    dealtByMob,
    heroHpAfter: Math.max(1, heroHp),
  };
};
