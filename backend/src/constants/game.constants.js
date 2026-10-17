// Игровые константы и правила.

// Характеристики, которые игрок может повышать: ключ в API → колонка в БД.
// Только эти колонки допускаются в SQL повышения (защита от инъекций).
export const UPGRADABLE_ATTRIBUTES = Object.freeze({
  strength: "strength",
  giftedness: "giftedness",
  constitution: "constitution",
  luck: "luck",
  attackSkill: "attack_skill",
  defenseSkill: "defense_skill",
});

/**
 * Цена повышения характеристики на +1 (в серебре) — квадрат её текущего
 * значения: 3 → 9, после повышения до 4 следующая цена — 16, и т. д.
 */
export const attributeUpgradePrice = (value) => value * value;

export const GAME_ERRORS = Object.freeze({
  NOT_ENOUGH_SILVER: "Not enough silver",
  UPGRADE_CONFLICT: "Attribute changed concurrently, try again",
  CITY_NOT_FOUND: "City not found or not available yet",
  LOCATION_NOT_FOUND: "Location not found or not available yet",
});

/**
 * Длины миссий. Стоимость в очках миссий = минуты ожидания после боя
 * (20 очков — 20 минут). Один бой на каждые 20 очков: короткая 1 бой,
 * средняя 2, длинная 3 (последний — с вожаком). minHpPercent — минимальный
 * запас жизней (в % от максимума), с которым можно отправиться на миссию.
 * Для каждой локации доступны миссии двух видов — светлая и тёмная.
 */
export const MISSION_LENGTHS = Object.freeze([
  { id: "short", name: "Короткая", cost: 20, minutes: 20, encounters: 1, minHpPercent: 25 },
  { id: "medium", name: "Средняя", cost: 40, minutes: 40, encounters: 2, minHpPercent: 40 },
  { id: "long", name: "Длинная", cost: 60, minutes: 60, encounters: 3, minHpPercent: 60 },
]);

export const MISSION_KINDS = Object.freeze(["light", "dark"]);

export const MISSION_ERRORS = Object.freeze({
  IN_PROGRESS: "You have not returned from the previous mission yet",
  NOT_ENOUGH_POINTS: "Not enough mission points",
  HP_TOO_LOW: "Not enough health to start this mission",
  UNAVAILABLE: "There are no missions in this location yet",
});
