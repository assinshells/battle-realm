import {
  UPGRADABLE_ATTRIBUTES,
  attributeUpgradePrice,
} from "../constants/game.constants.js";
import { deriveCombat } from "../game/heroSheet.js";
import { regenerate } from "../game/regen.js";

/** Текущие жизни с учётом восстановления за прошедшее время. */
const currentHp = (user) =>
  user.db_now
    ? regenerate({
        value: user.hp,
        max: user.max_hp,
        perHour: user.hp_regen_per_hour,
        updatedAt: user.hp_updated_at,
        now: user.db_now,
      }).value
    : user.hp;

/**
 * toProfileDto — профиль игрока для интерфейса (GET /api/auth/me и ответ
 * на повышение характеристики). Принимает строку users из БД.
 */
export const toProfileDto = (user) => ({
  id: user.id,
  email: user.email,
  heroName: user.hero_name,
  stats: {
    level: user.level,
    hp: currentHp(user),
    maxHp: user.max_hp,
    hpRegenPerHour: user.hp_regen_per_hour,
    xp: user.xp,
    maxXp: user.max_xp,
    silver: user.silver,
    rubies: user.rubies,
  },
  character: {
    // Подробная информация. null в orderName/orderRank = "нет ордена".
    details: {
      orderName: user.order_name,
      orderRank: user.order_rank,
      lootGained: user.loot_gained,
      lootLost: user.loot_lost,
      tournamentsWon: user.tournaments_won,
      wins: user.wins,
      draws: user.draws,
      losses: user.losses,
    },
    // Характеристики, которые игрок может повышать.
    attributes: {
      strength: user.strength,
      giftedness: user.giftedness,
      constitution: user.constitution,
      luck: user.luck,
      attackSkill: user.attack_skill,
      defenseSkill: user.defense_skill,
    },
    // Цена следующего повышения каждой характеристики (серебро).
    upgradePrices: Object.fromEntries(
      Object.entries(UPGRADABLE_ATTRIBUTES).map(([key, column]) => [
        key,
        attributeUpgradePrice(user[column]),
      ]),
    ),
    // Счётчики кармы.
    karmaPoints: {
      light: user.light_karma,
      dark: user.dark_karma,
    },
    // Боевые показатели. Урон и шансы выводятся из характеристик, поэтому
    // меняются вместе с ними.
    combat: deriveCombat(user),
  },
});
