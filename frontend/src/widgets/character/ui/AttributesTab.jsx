import { useEffect } from "react";
import { Coins, Plus } from "lucide-react";
import { InfoList } from "@shared/ui/InfoCard.jsx";
import { useUpgradeStore } from "@features/character/model/useUpgradeStore.js";

const UPGRADABLE = [
  { key: "strength", label: "Сила" },
  { key: "giftedness", label: "Одарённость" },
  { key: "constitution", label: "Телосложение" },
  { key: "luck", label: "Удача" },
  { key: "attackSkill", label: "Искусство атаки" },
  { key: "defenseSkill", label: "Искусство защиты" },
];

/**
 * AttributesTab — вкладка «Характеристики»: одна карточка, разделённая
 * пополам. Слева — базовые характеристики с ценой повышения и кнопкой
 * (активна, только если хватает серебра), справа — боевые показатели.
 *
 * profile — ответ GET /api/auth/me.
 */
export function AttributesTab({ profile }) {
  const { stats, character } = profile;
  const { attributes, combat, upgradePrices } = character;
  const { upgrading, error, upgrade, clearError } = useUpgradeStore();

  // Ошибка прошлого повышения не должна висеть при возврате на вкладку.
  useEffect(() => {
    clearError();
  }, [clearError]);

  const combatRows = [
    { label: "Пункты жизни", value: `${stats.hp} / ${stats.maxHp}` },
    { label: "Карма", value: combat.karma },
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
              {UPGRADABLE.map(({ key, label }) => {
                const price = upgradePrices[key];
                const canAfford = stats.silver >= price;
                const busy = upgrading === key;

                return (
                  <li
                    key={key}
                    className="list-group-item d-flex align-items-center gap-3 px-0"
                  >
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{label}</div>
                      <small className="text-muted d-flex flex-wrap column-gap-3">
                        <span>Базовое значение: {attributes[key]}</span>
                        <span className="d-flex align-items-center gap-1">
                          Цена: {price}
                          <Coins size={14} />
                        </span>
                      </small>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 text-nowrap"
                      disabled={!canAfford || upgrading !== null}
                      onClick={() => upgrade(key)}
                      aria-label={`Повысить характеристику «${label}» за ${price} серебра`}
                      title={canAfford ? undefined : "Недостаточно серебра"}
                    >
                      Повысить
                      {busy ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          aria-hidden="true"
                        />
                      ) : (
                        <Plus size={16} />
                      )}
                    </button>
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
