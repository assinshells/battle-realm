import { Castle, Coins, Skull, Wheat } from "lucide-react";
import { KARMA_KINDS } from "@shared/constants/karma.constants.js";
import { KarmaAmount } from "@shared/ui/KarmaAmount.jsx";

const TYPE_ICONS = { gate: Castle, field: Wheat, robbery: Skull };
/**
 * WorkCard — карточка вида работы: описание, серебро за выбранное время,
 * карма (светлая или тёмная; у нейтральной работы не показывается) и
 * кнопка «Взять работу».
 *
 * type     — вид работы из каталога (id, name, description, karmaKind, rewards),
 * hours    — выбранное время, ч,
 * disabled — блокировка кнопки, onTake — нажатие «Взять работу».
 */
export function WorkCard({ type, hours, disabled, onTake }) {
  const Icon = TYPE_ICONS[type.id];
  const reward = type.rewards.find((item) => item.hours === hours);

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h2 className="h5 d-flex align-items-center gap-2">
          {Icon && <Icon size={22} className="flex-shrink-0" />}
          {type.name}
        </h2>
        <p className="card-text text-muted">{type.description}</p>

        <ul className="list-unstyled mt-auto mb-3">
          <li className="d-flex justify-content-between py-1">
            <span>Серебро за {hours} ч.</span>
            <span className="fw-semibold d-flex align-items-center gap-1">
              <Coins size={16} />
              {reward.silver}
            </span>
          </li>
          {type.karmaKind && (
            <li className="d-flex justify-content-between py-1">
              <span>{KARMA_KINDS[type.karmaKind].label}</span>
              <KarmaAmount kind={type.karmaKind} amount={reward.karma} />
            </li>
          )}
        </ul>

        <button
          type="button"
          className="btn btn-primary w-100"
          disabled={disabled}
          onClick={onTake}
        >
          Взять работу
        </button>
      </div>
    </div>
  );
}
