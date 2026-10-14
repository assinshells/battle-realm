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
});
