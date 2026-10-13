import { ChevronsUpDown, CircleUserRound } from "lucide-react";
import { LogoutButton } from "@features/auth/logout/ui/LogoutButton.jsx";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";

/**
 * SidebarContent — меню и подвал сайдбара (аватар, имя героя, дропдаун
 * с выходом). Возвращает фрагмент: родитель — flex-колонка, меню
 * прокручивается, подвал всегда внизу.
 *
 * collapsed — показывать только иконки (свёрнутый сайдбар на десктопе).
 */
export function SidebarContent({
  items,
  activeId,
  onSelect,
  onLogout,
  collapsed = false,
}) {
  const profile = useProfileStore((s) => s.profile);
  const heroName = profile?.heroName ?? "Герой";
  const level = profile?.stats?.level;
  const center = collapsed ? "justify-content-center" : "";

  return (
    <>
      <nav
        className="nav nav-pills flex-column flex-nowrap gap-1 p-2 flex-grow-1 overflow-y-auto"
        aria-label="Основное меню"
      >
        {items.map(({ id, label, icon: Icon }) => {
          const active = id === activeId;
          return (
            <button
              key={id}
              type="button"
              className={`nav-link d-flex align-items-center gap-2 text-start ${center} ${
                active ? "active" : "link-body-emphasis"
              }`}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              title={collapsed ? label : undefined}
              onClick={() => onSelect(id)}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="text-truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-top p-2 dropup">
        <button
          type="button"
          className={`btn btn-light w-100 d-flex align-items-center gap-2 text-start ${center}`}
          data-bs-toggle="dropdown"
          aria-expanded="false"
          aria-label={`Меню пользователя ${heroName}`}
          title={collapsed ? (level ? `${heroName} · Уровень ${level}` : heroName) : undefined}
        >
          <CircleUserRound size={28} className="flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-grow-1 text-truncate lh-sm">
                <span className="d-block text-truncate">{heroName}</span>
                {level && (
                  <small className="d-block text-muted text-truncate">
                    Уровень {level}
                  </small>
                )}
              </span>
              <ChevronsUpDown size={16} className="flex-shrink-0 text-muted" />
            </>
          )}
        </button>

        <ul className="dropdown-menu shadow w-100">
          {profile?.email && (
            <>
              <li>
                <span className="dropdown-item-text small text-muted text-break">
                  {profile.email}
                </span>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
            </>
          )}
          <li>
            <LogoutButton
              onLoggedOut={onLogout}
              className="dropdown-item d-flex align-items-center text-danger"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
