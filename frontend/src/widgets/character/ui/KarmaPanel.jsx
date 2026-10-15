import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Avatar } from "@shared/ui/Avatar.jsx";

const TABS = [
  { id: "light", label: "Светлая карма", icon: Sun, valueKey: "light" },
  { id: "dark", label: "Тёмная карма", icon: Moon, valueKey: "dark" },
];

/**
 * KarmaPanel — аватар и имя героя, переключатель «Светлая карма» /
 * «Тёмная карма» и счётчик выбранной кармы. По умолчанию выбрана вкладка,
 * где кармы больше (при равенстве — светлая).
 *
 * profile — ответ GET /api/auth/me.
 */
export function KarmaPanel({ profile }) {
  const { light, dark } = profile.character.karmaPoints;
  // Пока игрок сам не выбрал вкладку, активна та, где кармы больше
  // (при равенстве, в том числе 0 и 0, — светлая).
  const [chosenId, setChosenId] = useState(null);
  const activeId = chosenId ?? (dark > light ? "dark" : "light");
  const active = TABS.find((tab) => tab.id === activeId);
  const value = profile.character.karmaPoints[active.valueKey];

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Avatar size={72} className="flex-shrink-0" />
        <div className="text-truncate">
          <div className="h4 mb-0 text-truncate">{profile.heroName}</div>
          <div className="text-muted">Уровень {profile.stats.level}</div>
        </div>
      </div>

      <ul className="nav nav-pills mb-3" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => (
          <li key={id} className="nav-item" role="presentation">
            <button
              type="button"
              role="tab"
              id={`karma-tab-${id}`}
              aria-selected={id === activeId}
              aria-controls="karma-tabpanel"
              className={`nav-link d-flex align-items-center gap-2 ${
                id === activeId ? "active" : ""
              }`}
              onClick={() => setChosenId(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div
        id="karma-tabpanel"
        role="tabpanel"
        aria-labelledby={`karma-tab-${active.id}`}
        className="card text-center"
      >
        <div className="card-body py-4">
          <div className="text-muted mb-1">{active.label}</div>
          <div className="display-4 fw-semibold">
            {value.toLocaleString("ru-RU")}
          </div>
        </div>
      </div>
    </>
  );
}
