import { InfoCard } from "@shared/ui/InfoCard.jsx";

const NONE = "---";
const number = (value) => value.toLocaleString("ru-RU");

/**
 * CharacterTab — вкладка «Персонаж»: карточки «Подробная информация»
 * и «Характеристики».
 *
 * profile — ответ GET /api/auth/me.
 */
export function CharacterTab({ profile }) {
  const { stats, character } = profile;
  const { details, attributes, combat } = character;

  const detailRows = [
    { label: "Уровень", value: stats.level },
    { label: "Орден", value: details.orderName ?? NONE },
    { label: "Ранг ордена", value: details.orderRank ?? NONE },
    { label: "Добыча (получено)", value: number(details.lootGained) },
    { label: "Добыча (потеряно)", value: number(details.lootLost) },
    { label: "Выигранные турниры", value: number(details.tournamentsWon) },
    { label: "Победы", value: number(details.wins) },
    { label: "Ничьи", value: number(details.draws) },
    { label: "Поражения", value: number(details.losses) },
  ];

  const characteristicRows = [
    { label: "Сила", value: attributes.strength },
    { label: "Одарённость", value: attributes.giftedness },
    { label: "Телосложение", value: attributes.constitution },
    { label: "Удача", value: attributes.luck },
    { label: "Искусство атаки", value: attributes.attackSkill },
    { label: "Искусство защиты", value: attributes.defenseSkill },
    { label: "Урон", value: `${combat.damageMin} - ${combat.damageMax}` },
    { label: "Броня", value: combat.armor },
  ];

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-6">
        <InfoCard title="Подробная информация" rows={detailRows} />
      </div>
      <div className="col-12 col-lg-6">
        <InfoCard title="Характеристики" rows={characteristicRows} />
      </div>
    </div>
  );
}
