import { useEffect, useState } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { APP_NAME } from "@shared/constants/auth.constants.js";
import { Storage } from "@shared/lib/storage.js";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { SidebarContent } from "./SidebarContent.jsx";
import { StatsBar } from "./StatsBar.jsx";

const COLLAPSED_KEY = "sidebarCollapsed";

/**
 * AppLayout — общий шаблон экранов для авторизованного пользователя:
 * сайдбар слева + область контента.
 *
 *  - десктоп (≥ md): сайдбар слева, кнопкой сворачивается до иконок
 *    (состояние запоминается в localStorage);
 *  - мобильный (< md): сайдбар скрыт, верхняя панель с кнопкой «меню»
 *    открывает его как выезжающую панель (классы Bootstrap offcanvas).
 *
 * items    — дерево меню: [{ id, label, icon }] — страницы и
 *            [{ id, label, icon, children: [...] }] — раскрывающиеся группы,
 * activeId — id активной страницы,
 * onSelect — выбор страницы, onLogout — после выхода из аккаунта.
 */
export function AppLayout({ items, activeId, onSelect, onLogout, children }) {
  const [collapsed, setCollapsed] = useState(
    () => Storage.get(COLLAPSED_KEY) === "1",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const stats = useProfileStore((s) => s.profile?.stats);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e) => {
      // Если открыт дропдаун, Escape закрывает только его. Bootstrap ловит
      // клавиши на document в фазе перехвата, поэтому слушаем на window —
      // раньше него, пока дропдаун ещё открыт.
      if (e.key !== "Escape" || document.querySelector(".dropdown-menu.show")) {
        return;
      }
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [mobileOpen]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    Storage.set(COLLAPSED_KEY, next ? "1" : "0");
  };

  const handleMobileSelect = (id) => {
    onSelect(id);
    setMobileOpen(false);
  };

  const pages = items.flatMap((item) => item.children ?? [item]);
  const activeItem = pages.find((page) => page.id === activeId);
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const toggleLabel = collapsed ? "Развернуть меню" : "Свернуть меню";

  return (
    <div className="d-flex vh-100">
      {/* Десктопный сайдбар */}
      <aside
        className={`d-none d-md-flex flex-column vh-100 border-end bg-body-tertiary ${
          collapsed ? "col-md-auto" : "col-md-4 col-lg-3 col-xxl-2"
        }`}
      >
        <div
          className={`d-flex align-items-center gap-2 p-2 ${
            collapsed ? "justify-content-center" : "justify-content-between"
          }`}
        >
          {!collapsed && (
            <span className="fw-semibold px-2 text-truncate">
              {APP_NAME}
            </span>
          )}
          <button
            type="button"
            className="btn btn-light"
            onClick={toggleCollapsed}
            aria-label={toggleLabel}
            title={toggleLabel}
          >
            <ToggleIcon size={20} />
          </button>
        </div>

        <SidebarContent
          items={items}
          activeId={activeId}
          onSelect={onSelect}
          onLogout={onLogout}
          collapsed={collapsed}
        />
      </aside>

      {/* Мобильный сайдбар: классы Bootstrap offcanvas */}
      {mobileOpen && (
        <div
          className="offcanvas-backdrop fade show d-md-none"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`offcanvas offcanvas-start w-75 d-md-none ${
          mobileOpen ? "show" : ""
        }`}
        tabIndex={-1}
        role="dialog"
        aria-modal={mobileOpen}
        aria-label="Меню"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">{APP_NAME}</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Закрыть меню"
            onClick={() => setMobileOpen(false)}
          />
        </div>

        <SidebarContent
          items={items}
          activeId={activeId}
          onSelect={handleMobileSelect}
          onLogout={onLogout}
        />
      </aside>

      {/* Контент */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <header className="d-md-none d-flex align-items-center gap-2 border-bottom p-2">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu size={20} />
          </button>
          <span className="fw-semibold">{activeItem?.label ?? APP_NAME}</span>
        </header>

        <StatsBar stats={stats} />

        <main className="flex-grow-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
