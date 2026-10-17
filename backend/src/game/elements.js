// Стихии. Бонус стихийного урона и сопротивление игрока придут из экипировки
// (руны); у мобов они заданы шаблоном.
export const ELEMENTS = Object.freeze(["fire", "cold", "lightning", "poison", "earth"]);

// Сопротивление стихии не может быть выше 75%: полной неуязвимости нет.
export const MAX_RESISTANCE = 0.75;

export const emptyElementMap = () =>
  Object.fromEntries(ELEMENTS.map((element) => [element, 0]));
