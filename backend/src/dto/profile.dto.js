import {
  UPGRADABLE_ATTRIBUTES,
  attributeUpgradePrice,
} from "../constants/game.constants.js";

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
    hp: user.hp,
    maxHp: user.max_hp,
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
    // Боевые показатели.
    combat: {
      damageMin: user.damage_min,
      damageMax: user.damage_max,
      armor: user.armor,
      karma: user.karma,
      hitChance: user.hit_chance,
      blockChance: user.block_chance,
    },
  },
});
