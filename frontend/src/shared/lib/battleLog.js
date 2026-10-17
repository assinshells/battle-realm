// Тексты боя: превращают данные события (из итога миссии) в строки лога.

const ELEMENT_NAMES = {
  fire: "огненного",
  cold: "холодного",
  lightning: "электрического",
  poison: "ядовитого",
  earth: "земляного",
};

export const ELEMENT_LABELS = {
  fire: "Огонь",
  cold: "Холод",
  lightning: "Электричество",
  poison: "Яд",
  earth: "Земля",
};

export const OUTCOME_LABELS = {
  win: "Победа",
  draw: "Ничья",
  loss: "Поражение",
  ko: "Нокаут",
};

export const PROFIT_LABELS = {
  small: "Небольшая прибыль",
  normal: "Прибыль",
  large: "Большая прибыль",
};

/** "1 физического и 3 огненного урона". */
const damageText = (event) => {
  const parts = [`${event.physical} физического`];
  for (const { element, amount } of event.elements) {
    parts.push(`${amount} ${ELEMENT_NAMES[element]}`);
  }
  const last = parts.pop();
  return `${parts.length ? `${parts.join(", ")} и ` : ""}${last} урона`;
};

/**
 * Строка хода боя: кто атаковал и чем закончилась атака.
 * Возвращает { actor, text, tone } — tone: "hit" | "crit" | "muted".
 */
export const formatEvent = (event, heroName, mobName) => {
  const actor = event.actor === "hero" ? heroName : mobName;

  if (event.result === "miss") return { actor, text: "Промах.", tone: "muted" };
  if (event.result === "block") {
    return { actor, text: "Удар заблокирован.", tone: "muted" };
  }
  return {
    actor,
    text: `${event.crit ? "Критический удар! " : ""}Наносит удар: ${damageText(event)}.`,
    tone: event.crit ? "crit" : "hit",
  };
};
