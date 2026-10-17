import { useState } from "react";
import { ChevronDown, ChevronRight, ChevronsUpDown } from "lucide-react";
import { Avatar } from "@shared/ui/Avatar.jsx";
import { LogoutButton } from "@features/auth/logout/ui/LogoutButton.jsx";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";

/** Пункт меню — страница. */
function NavButton({ item, active, onSelect, iconSize = 20 }) {
  const { id, label, icon: Icon } = item;
  return (
    <button
      type="button"
      className={`nav-link d-flex align-items-center gap-2 text-start ${
        active ? "active" : "link-body-emphasis"
      }`}
      aria-current={active ? "page" : undefined}
      onClick={() => onSelect(id)}
    >
      <Icon size={iconSize} className="flex-shrink-0" />
      <span className="text-truncate">{label}</span>
    </button>
  );
}

/** Пункт меню — раскрывающаяся группа: заголовок раскрывает вложенные пункты. */
function NavGroup({ item, activeId, onSelect }) {
  const { id, label, icon: Icon, children } = item;
  const hasActive = children.some((child) => child.id === activeId);
  const [open, setOpen] = useState(hasActive);

  // Если открыли страницу из этой группы другим путём (например, кликом по
  // городу на карте), группа раскрывается сама — активный пункт не прячется.
  const [seenActiveId, setSeenActiveId] = useState(activeId);
  if (seenActiveId !== activeId) {
    setSeenActiveId(activeId);
    if (hasActive) setOpen(true);
  }

  const panelId = `menu-group-${id}`;
  return (
    <div>
      <button
        type="button"
        className={`nav-link w-100 d-flex align-items-center gap-2 text-start link-body-emphasis ${
          hasActive ? "fw-semibold" : ""
        }`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        <Icon size={20} className="flex-shrink-0" />
        <span className="flex-grow-1 text-truncate">{label}</span>
        {open ? (
          <ChevronDown size={16} className="flex-shrink-0 text-muted" />
        ) : (
          <ChevronRight size={16} className="flex-shrink-0 text-muted" />
        )}
      </button>
      <div id={panelId} className={`collapse ${open ? "show" : ""}`}>
        <div className="nav nav-pills flex-column flex-nowrap gap-1 mt-1 ps-3">
          {children.map((child) => (
            <NavButton
              key={child.id}
              item={child}
              active={child.id === activeId}
              onSelect={onSelect}
              iconSize={18}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * SidebarContent — меню (страницы и раскрывающиеся группы) и подвал сайдбара
 * (аватар, имя героя, уровень, дропдаун с выходом). Возвращает фрагмент:
 * родитель — flex-колонка, меню прокручивается, подвал всегда внизу.
 */
export function SidebarContent({ items, activeId, onSelect, onLogout }) {
  const profile = useProfileStore((s) => s.profile);
  const heroName = profile?.heroName ?? "Герой";
  const level = profile?.stats?.level;

  return (
    <>
      <nav
        className="nav nav-pills flex-column flex-nowrap gap-1 p-2 flex-grow-1 overflow-y-auto"
        aria-label="Основное меню"
      >
        {items.map((item) =>
          item.children ? (
            <NavGroup
              key={item.id}
              item={item}
              activeId={activeId}
              onSelect={onSelect}
            />
          ) : (
            <NavButton
              key={item.id}
              item={item}
              active={item.id === activeId}
              onSelect={onSelect}
            />
          ),
        )}
      </nav>

      <div className="border-top p-2 dropup">
        <button
          type="button"
          className="btn btn-light w-100 d-flex align-items-center gap-2 text-start"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          aria-label={`Меню пользователя ${heroName}`}
        >
          <Avatar size={28} className="flex-shrink-0" />
          <span className="flex-grow-1 text-truncate lh-sm">
            <span className="d-block text-truncate">{heroName}</span>
            {level && (
              <small className="d-block text-muted text-truncate">
                Уровень {level}
              </small>
            )}
          </span>
          <ChevronsUpDown size={16} className="flex-shrink-0 text-muted" />
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
