import { Fragment } from "react";
import { Moon, Sun } from "lucide-react";

// Две половины карточки: светлая и тёмная миссии.
const MISSION_KINDS = [
  { id: "light", title: "Светлая миссия", icon: Sun, buttonClass: "btn-outline-primary" },
  { id: "dark", title: "Тёмная миссия", icon: Moon, buttonClass: "btn-outline-dark" },
];

/**
 * Почему кнопка неактивна (или null, если можно идти). Показывается во
 * всплывающей подсказке.
 */
const blockReason = ({ available, points, hp, length, starting }) => {
  if (!available) return "В этой локации миссий пока нет";
  if (starting) return "Отправляемся…";
  if (points !== null && points < length.cost) return "Недостаточно очков миссий";
  const needHp = Math.ceil((hp.max * length.minHpPercent) / 100);
  if (hp.current < needHp) return `Нужно не меньше ${needHp} жизней`;
  return null;
};

/**
 * LocationMissions — карточка локации: в шапке название, тело пополам
 * (слева светлая миссия, справа тёмная; кнопки «Короткая / Средняя / Длинная»
 * с ценой в очках миссий), в футере свободные очки миссий и подсказка.
 *
 * location — ответ GET /api/world/locations/:id,
 * state    — состояние миссий игрока (очки, жизни) или null,
 * starting — миссия отправляется, onStart(kind, lengthId) — нажатие кнопки.
 */
export function LocationMissions({ location, state, starting, onStart }) {
  const { missions } = location;
  // Очки и жизни берём из свежего состояния миссий, пока оно не загружено —
  // из данных локации.
  const points = state?.points?.current ?? missions.points;
  const hp = state?.hp ?? { current: Infinity, max: 1 };

  return (
    <div className="card">
      <div className="card-header fw-semibold fs-5">{location.name}</div>

      <div className="card-body d-md-flex">
        {MISSION_KINDS.map(({ id, title, icon: Icon, buttonClass }, index) => (
          <Fragment key={id}>
            {index > 0 && (
              <>
                <div className="vr d-none d-md-block mx-4" />
                <hr className="d-md-none" />
              </>
            )}

            <div className="w-100">
              <h2 className="h6 d-flex align-items-center gap-2 mb-3">
                <Icon size={18} />
                {title}
              </h2>
              <div className="d-grid gap-2">
                {missions.lengths.map((length) => {
                  const reason = blockReason({
                    available: missions.available,
                    points: state ? points : null,
                    hp,
                    length,
                    starting,
                  });
                  return (
                    <button
                      key={length.id}
                      type="button"
                      className={`btn ${buttonClass} d-flex justify-content-between align-items-center`}
                      disabled={reason !== null || !state}
                      onClick={() => onStart(id, length.id)}
                      title={reason ?? `${length.cost} очков миссий, ожидание ${length.minutes} мин.`}
                      aria-label={`${title}: ${length.name}, ${length.cost} очков миссий`}
                    >
                      <span>{length.name}</span>
                      <span className="fw-semibold">{length.cost}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Fragment>
        ))}
      </div>

      <div className="card-footer">
        <div>
          Свободные очки миссий: <span className="fw-semibold">{points}</span>
        </div>
        <small className="text-muted d-block">
          Подсказка: Очки миссий восстанавливаются на {missions.regenPerHour} в час.
        </small>
        <small className="text-muted d-block">
          После боя вы отсутствуете столько минут, сколько очков потрачено.
        </small>
      </div>
    </div>
  );
}
