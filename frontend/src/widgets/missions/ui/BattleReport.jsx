import { Coins, Heart, Star } from "lucide-react";
import { KarmaAmount } from "@shared/ui/KarmaAmount.jsx";
import {
  ELEMENT_LABELS,
  OUTCOME_LABELS,
  PROFIT_LABELS,
  formatEvent,
} from "@shared/lib/battleLog.js";

const OUTCOME_CLASS = {
  win: "text-bg-success",
  draw: "text-bg-secondary",
  loss: "text-bg-danger",
  ko: "text-bg-danger",
};

const OUTCOME_TITLES = {
  win: (mob) => `${mob} повержен`,
  draw: (mob) => `Бой с противником «${mob}» закончился вничью`,
  loss: (mob) => `Победил ${mob}`,
  ko: (mob) => `Вас вырубил ${mob}`,
};

const round = (value) => Math.round(value);

/** Таблица характеристик бойца (герой или моб); числа моба дробные — округляем. */
function StatTable({ title, fighter, hpNow }) {
  const rows = [
    ["Сила", round(fighter.strength)],
    ["Одарённость", round(fighter.giftedness)],
    ["Телосложение", round(fighter.constitution)],
    ["Удача", round(fighter.luck)],
    ["Шанс на удар", round(fighter.attackSkill)],
    ["Шанс на защиту", round(fighter.defenseSkill)],
    ["Урон", `${fighter.damageMin} - ${fighter.damageMax}`],
    ["Броня", round(fighter.armor)],
    ["Жизни", `${round(hpNow)} / ${round(fighter.hpMax)}`],
  ];

  // Стихии: только те, у которых есть бонус урона или сопротивление.
  for (const element of Object.keys(ELEMENT_LABELS)) {
    const attack = fighter.elements.attack[element];
    const resist = fighter.elements.resist[element];
    if (attack > 0 || resist > 0) {
      const parts = [];
      if (attack > 0) parts.push(`урон +${round(attack * 10) / 10}`);
      if (resist > 0) parts.push(`сопр. ${Math.round(resist * 100)}%`);
      rows.push([ELEMENT_LABELS[element], parts.join(", ")]);
    }
  }

  return (
    <div className="card h-100">
      <div className="card-header fw-semibold text-truncate">{title}</div>
      <ul className="list-group list-group-flush small">
        {rows.map(([label, value]) => (
          <li key={label} className="list-group-item d-flex justify-content-between gap-3">
            <span>{label}</span>
            <span className="fw-semibold text-end">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * BattleReport — отчёт об одном бое: вступление, итог и награды, таблицы
 * характеристик героя и моба, ход боя.
 *
 * encounter — бой из итога миссии, hero — герой на старте миссии.
 */
export function BattleReport({ encounter, hero }) {
  const { mob, rewards, outcome } = encounter;
  const hpLost = encounter.hpBefore - encounter.hpAfter;

  return (
    <section className="mb-4" aria-label={`Бой с противником: ${mob.name}`}>
      <p className="fst-italic text-muted">{encounter.intro}</p>

      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span className={`badge ${OUTCOME_CLASS[outcome]}`}>
              {OUTCOME_LABELS[outcome]}
            </span>
            <span className="fw-semibold">{OUTCOME_TITLES[outcome](mob.name)}</span>
          </div>

          <div className="d-flex flex-wrap column-gap-4 row-gap-1">
            <span className="d-inline-flex align-items-center gap-1" title="Серебро">
              <Coins size={16} aria-hidden="true" />
              {PROFIT_LABELS[rewards.profit]}: <strong>{rewards.silver}</strong>
            </span>
            <span className="d-inline-flex align-items-center gap-1" title="Опыт">
              <Star size={16} aria-hidden="true" />
              Опыт: <strong>{rewards.xp}</strong>
            </span>
            {rewards.karma > 0 && (
              <KarmaAmount kind={rewards.karmaKind} amount={rewards.karma} label />
            )}
            <span className="d-inline-flex align-items-center gap-1" title="Жизни">
              <Heart size={16} aria-hidden="true" />
              Потеряно жизней: <strong>{hpLost}</strong>
            </span>
          </div>

          <div className="small text-muted mt-2">
            Нанесено вами: {encounter.dealtByHero} · Получено вами: {encounter.dealtByMob}
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <StatTable title={hero.name} fighter={hero} hpNow={encounter.hpBefore} />
        </div>
        <div className="col-12 col-md-6">
          <StatTable title={mob.name} fighter={mob} hpNow={mob.hpMax} />
        </div>
      </div>

      <h3 className="h6 text-muted">Ход боя</h3>
      <ul className="list-group list-group-flush small">
        {encounter.events.map((event, index) => {
          const line = formatEvent(event, hero.name, mob.name);
          return (
            <li
              key={index}
              className={`list-group-item px-0 py-1 ${
                line.tone === "muted" ? "text-muted" : ""
              } ${line.tone === "crit" ? "fw-semibold" : ""}`}
            >
              <span className="fw-semibold">{line.actor}</span> {line.text}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
