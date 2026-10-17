// Бестиарий: какие мобы живут в локации. Ключ — code локации в БД.
// Названия и тексты — по умолчанию, их можно менять.

// Архетипы: веса характеристик (среднее ≈ 1.0) и множитель брони.
const ARCHETYPES = {
  // Сильный и живучий.
  beast: { weights: { str: 1.3, gift: 0.8, con: 1.2, luck: 0.9, att: 1.0, def: 0.8 }, armor: 1.0 },
  // Часто попадает и критует.
  trickster: { weights: { str: 0.9, gift: 0.8, con: 0.8, luck: 1.3, att: 1.3, def: 0.9 }, armor: 0.6 },
  // Трудно пробить.
  guardian: { weights: { str: 0.9, gift: 1.2, con: 1.2, luck: 0.6, att: 0.7, def: 1.4 }, armor: 1.5 },
  // Без брони, опасен стихией.
  spirit: { weights: { str: 0.7, gift: 1.3, con: 0.7, luck: 1.1, att: 1.2, def: 1.0 }, armor: 0 },
};

/**
 * Шаблон моба.
 *  gender       — род названия (m, f, n) для титулов («Матёрый», «Матёрое»),
 *  element      — стихия атаки или null,
 *  elementShare — стихийный урон относительно обычного удара,
 *  power        — поправка силы шаблона (стихийные мобы слабее по характеристикам,
 *                 чтобы бой с ними оставался проходимым).
 */
const template = (id, name, gender, archetype, extra = {}) => ({
  id,
  name,
  gender,
  ...ARCHETYPES[archetype],
  element: null,
  elementShare: 0,
  ownResist: 0,
  power: 1,
  ...extra,
});

export const BESTIARY = {
  cave: {
    // Уровни, на которых мобы пещеры растут вместе с героем. Выше потолка
    // моб не усиливается, а награда падает (защита от фарма лёгкой локации).
    levelBand: { min: 1, max: 15 },

    intros: {
      first: {
        light: "Какие омерзительные твари обитают в этой пещере! Едва завидев их, вы тянетесь к оружию.",
        dark: "Внезапно на вас набрасывается {name}, чей покой вы осмелились нарушить.",
      },
      next: "Из мрака выступает новый противник: {name}.",
      elite: "Путь вам преграждает вожак: {name}.",
    },

    pools: {
      light: [
        template("fiend", "Исчадие пещеры", "n", "beast", { power: 0.92 }),
        template("spider", "Пещерный паук", "m", "trickster", {
          element: "poison", elementShare: 0.5, power: 0.99,
        }),
        template("frost_bat", "Ледяной нетопырь", "m", "trickster", {
          element: "cold", elementShare: 0.5, power: 0.98,
        }),
        template("acid_slime", "Слизень-кислотник", "m", "guardian", {
          element: "poison", elementShare: 0.5, power: 0.8,
        }),
      ],
      dark: [
        template("earth_ghost", "Земляной призрак", "m", "spirit", {
          element: "earth", elementShare: 1, ownResist: 0.5, power: 0.94,
        }),
        template("stone_guard", "Каменный страж", "m", "guardian", { power: 0.97 }),
        template("miner_ghost", "Дух шахтёра", "m", "spirit", {
          element: "cold", elementShare: 1, ownResist: 0.5, power: 0.94,
        }),
        template("crypt_keeper", "Хранитель склепа", "m", "guardian", {
          element: "poison", elementShare: 0.5, power: 0.8,
        }),
      ],
    },
  },
};

// Титулы мобов по уровню: чем выше уровень, тем грознее приставка.
export const LEVEL_TITLES = [
  { from: 60, m: "Древний", f: "Древняя", n: "Древнее" },
  { from: 30, m: "Свирепый", f: "Свирепая", n: "Свирепое" },
  { from: 10, m: "Матёрый", f: "Матёрая", n: "Матёрое" },
];
