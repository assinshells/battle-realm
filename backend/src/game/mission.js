import { createRng, clamp } from "./rng.js";
import { referenceStat } from "./levels.js";
import { buildHeroSheet } from "./heroSheet.js";
import { BESTIARY } from "./bestiary.js";
import { generateMob } from "./mob.js";
import { simulateBattle } from "./battle.js";
import { computeEncounterRewards } from "./rewards.js";

// Базовая сложность обычного моба и вожака (множитель к эталону уровня).
const NORMAL_DIFFICULTY = 0.85;
const ELITE_DIFFICULTY = 1.0;

// Один бой на каждые 20 очков миссий: короткая 1, средняя 2, длинная 3.
// Последний бой длинной миссии — с вожаком.
const encounterPlan = (encounters) =>
  Array.from({ length: encounters }, (_, i) => ({
    elite: encounters === 3 && i === 2,
  }));

/**
 * Поправка сложности по мощи героя: герой, отставший от эталонной кривой
 * уровня, получает мобов чуть слабее, опередивший её — чуть сильнее
 * (0.75–1.15). Прокачка всё равно ощутима, но и слабого не раздавят.
 */
const adaptation = (hero) => {
  const average =
    (hero.strength + hero.giftedness + hero.constitution +
      hero.luck + hero.attackSkill + hero.defenseSkill) / 6;
  const ratio = average / referenceStat(hero.level);
  return clamp(0.6 + 0.4 * ratio, 0.75, 1.15);
};

const introText = (area, kind, mob, index) => {
  if (mob.elite) return area.intros.elite.replace("{name}", mob.name);
  if (index > 0) return area.intros.next.replace("{name}", mob.name);
  return area.intros.first[kind].replace("{name}", mob.name);
};

/**
 * Проводит всю миссию: создаёт мобов, считает бои и награды. Чистая функция
 * без обращений к БД — при одном зерне результат всегда одинаковый.
 *
 * user     — строка игрока из БД (характеристики, уровень, опыт),
 * heroHp   — текущие жизни на старте,
 * areaCode — code локации (ключ бестиария),
 * kind     — light | dark, encounters — число боёв (1–3), seed — зерно.
 */
export const runMission = ({ user, heroHp, areaCode, kind, encounters, seed }) => {
  const area = BESTIARY[areaCode];
  const rng = createRng(seed);
  const hero = buildHeroSheet(user, heroHp);

  const { min, max } = area.levelBand;
  const mobLevel = clamp(user.level, min, max);
  const grind = user.level > max ? Math.max(0.2, 1 - 0.1 * (user.level - max)) : 1;
  const adapt = adaptation(hero);

  const rewardHero = { level: user.level, maxXp: user.max_xp, luck: user.luck };
  const unused = [...area.pools[kind]];
  const results = [];
  let hp = heroHp;

  encounterPlan(encounters).forEach(({ elite }, index) => {
    // Мобы в одной миссии не повторяются (пока в пуле есть другие).
    const pool = unused.length ? unused : area.pools[kind];
    const tpl = rng.pick(pool);
    unused.splice(unused.indexOf(tpl), 1);

    const base = elite ? ELITE_DIFFICULTY : NORMAL_DIFFICULTY;
    const mob = generateMob({ tpl, level: mobLevel, difficulty: base * adapt, elite, rng });

    const hpBefore = hp;
    const battle = simulateBattle({ ...hero, hp }, mob, rng);
    const rewards = computeEncounterRewards({
      outcome: battle.outcome, kind, elite, mobLevel, hero: rewardHero, grind, rng,
    });
    hp = battle.heroHpAfter;

    results.push({
      index,
      intro: introText(area, kind, mob, index),
      mob,
      outcome: battle.outcome,
      dealtByHero: battle.dealtByHero,
      dealtByMob: battle.dealtByMob,
      hpBefore,
      hpAfter: hp,
      events: battle.events,
      rewards,
    });
  });

  const totals = results.reduce(
    (sum, e) => ({
      silver: sum.silver + e.rewards.silver,
      xp: sum.xp + e.rewards.xp,
      karma: sum.karma + e.rewards.karma,
      wins: sum.wins + (e.outcome === "win" ? 1 : 0),
      draws: sum.draws + (e.outcome === "draw" ? 1 : 0),
      losses: sum.losses + (e.outcome === "loss" || e.outcome === "ko" ? 1 : 0),
    }),
    { silver: 0, xp: 0, karma: 0, wins: 0, draws: 0, losses: 0 },
  );

  return {
    seed,
    kind,
    hero: { ...hero, hp: heroHp },
    encounters: results,
    totals: { ...totals, hpLost: heroHp - hp, hpAfter: hp },
  };
};
