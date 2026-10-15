import { Fragment } from "react";
import { Moon, Sun } from "lucide-react";

// Две половины карточки: светлая и тёмная миссии.
const MISSION_KINDS = [
  { id: "light", title: "Светлая миссия", icon: Sun, buttonClass: "btn-outline-primary" },
  { id: "dark", title: "Тёмная миссия", icon: Moon, buttonClass: "btn-outline-dark" },
];

/**
 * LocationMissions — карточка локации: в шапке название, тело пополам
 * (слева светлая миссия, справа тёмная; кнопки «Короткая / Средняя / Длинная»
 * с ценой в очках миссий), в футере свободные очки миссий и подсказка.
 *
 * location — ответ GET /api/world/locations/:id.
 */
export function LocationMissions({ location }) {
  const { missions } = location;

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
                {missions.lengths.map((length) => (
                  <button
                    key={length.id}
                    type="button"
                    className={`btn ${buttonClass} d-flex justify-content-between align-items-center`}
                    // Запуск миссий пока не реализован: нужны их правила.
                    disabled
                    title="Запуск миссий скоро появится"
                    aria-label={`${title}: ${length.name}, ${length.cost} очков миссий`}
                  >
                    <span>{length.name}</span>
                    <span className="fw-semibold">{length.cost}</span>
                  </button>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>

      <div className="card-footer">
        <div>
          Свободные очки миссий:{" "}
          <span className="fw-semibold">{missions.points}</span>
        </div>
        <small className="text-muted">
          Подсказка: Очки миссий восстанавливаются на {missions.regenPerHour} в
          час.
        </small>
      </div>
    </div>
  );
}
