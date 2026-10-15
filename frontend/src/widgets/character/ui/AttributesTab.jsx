import { useEffect } from "react";
import { Coins, Plus } from "lucide-react";
import { InfoList } from "@shared/ui/InfoCard.jsx";
import { KarmaAmount } from "@shared/ui/KarmaAmount.jsx";
import { useUpgradeStore } from "@features/character/model/useUpgradeStore.js";

// Пояснения под названием характеристики.
const UPGRADABLE = [
  {
    key: "strength",
    label: "Сила",
    hint: "Чем вы сильнее, тем больше повреждений вы нанесёте противнику.",
  },
  {
    key: "giftedness",
    label: "Одарённость",
    hint: "Чем больше одарённость, тем меньше урона вам нанесут.",
  },
  {
    key: "constitution",
    label: "Телосложение",
    hint: "Чем выше ваше телосложение, тем больше у вас пунктов жизни и быстрее идёт восстановление здоровья.",
  },
  {
    key: "luck",
    label: "Удача",
    hint: "Удача влияет на ваш шанс нанести критический удар, а также на количество награбленного серебра.",
  },
  {
    key: "attackSkill",
    label: "Искусство атаки",
    hint: "Чем выше ваш навык оружия, тем больше шанс ударить противника.",
  },
  {
    key: "defenseSkill",
    label: "Искусство защиты",
    hint: "Чем лучше вы управляетесь со своим щитом, тем меньше урона вы получите.",
  },
];

/** Карма героя одной строкой: светлая или тёмная (гасят друг друга), иначе 0. */
function KarmaBalance({ light, dark }) {
  if (light === 0 && dark === 0) return 0;
  return light >= dark ? (
    <KarmaAmount kind="light" amount={light} plus={false} label />
  ) : (
    <KarmaAmount kind="dark" amount={dark} plus={false} label />
  );
}

/**
 * AttributesTab — страница «Характеристики»: одна карточка, разделённая
 * пополам. Слева — характеристики: название, текущее значение, цена повышения
 * и кнопка «+» (активна, только если хватает серебра), под названием —
 * пояснение. Справа — боевые показатели.
 *
 * profile — ответ GET /api/auth/me.
 */
export function AttributesTab({ profile }) {
  const { stats, character } = profile;
  const { attributes, combat, upgradePrices, karmaPoints } = character;
  const { upgrading, error, upgrade, clearError } = useUpgradeStore();

  // Ошибка прошлого повышения не должна висеть при возврате на страницу.
  useEffect(() => {
    clearError();
  }, [clearError]);

  const combatRows = [
    { label: "Пункты жизни", value: `${stats.hp} / ${stats.maxHp}` },
    {
      label: "Карма",
      value: <KarmaBalance light={karmaPoints.light} dark={karmaPoints.dark} />,
    },
    { label: "Урон", value: `${combat.damageMin} - ${combat.damageMax}` },
    { label: "Броня", value: combat.armor },
    { label: "Шанс на удар", value: combat.hitChance },
    { label: "Шанс на защиту", value: combat.blockChance },
  ];

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-body d-md-flex">
          {/* Левая половина: повышение характеристик */}
          <div className="w-100">
            <h2 className="h6 text-muted mb-2">Базовые характеристики</h2>
            <ul className="list-group list-group-flush">
              {UPGRADABLE.map(({ key, label, hint }) => {
                const price = upgradePrices[key];
                const canAfford = stats.silver >= price;
                const busy = upgrading === key;

                return (
                  <li key={key} className="list-group-item px-0">
                    <div className="d-flex align-items-center gap-3">
                      <span className="fw-semibold flex-grow-1">{label}</span>
                      <span
                        className="fw-semibold"
                        title="Текущее значение"
                        aria-label={`${label}: ${attributes[key]}`}
                      >
                        {attributes[key]}
                      </span>
                      <span
                        className="d-flex align-items-center gap-1 text-nowrap"
                        title="Цена повышения"
                        aria-label={`Цена: ${price} серебра`}
                      >
                        <Coins size={16} aria-hidden="true" />
                        {price}
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm d-flex align-items-center"
                        disabled={!canAfford || upgrading !== null}
                        onClick={() => upgrade(key)}
                        aria-label={`Повысить характеристику «${label}» за ${price} серебра`}
                        title={canAfford ? "Повысить" : "Недостаточно серебра"}
                      >
                        {busy ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                          />
                        ) : (
                          <Plus size={16} />
                        )}
                      </button>
                    </div>
                    <small className="text-muted d-block mt-1">{hint}</small>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Разделитель */}
          <div className="vr d-none d-md-block mx-4" />
          <hr className="d-md-none" />

          {/* Правая половина: боевые показатели */}
          <div className="w-100">
            <h2 className="h6 text-muted mb-2">Боевые показатели</h2>
            <InfoList rows={combatRows} padded={false} />
          </div>
        </div>
      </div>
    </>
  );
}
