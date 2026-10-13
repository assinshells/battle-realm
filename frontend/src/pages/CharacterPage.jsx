import { useState } from "react";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { CharacterTab } from "@widgets/character/ui/CharacterTab.jsx";
import { AttributesTab } from "@widgets/character/ui/AttributesTab.jsx";

const TABS = [
  { id: "character", label: "Персонаж", Content: CharacterTab },
  { id: "attributes", label: "Характеристики", Content: AttributesTab },
];

/**
 * CharacterPage — страница «Персонаж» с двумя вкладками:
 * «Персонаж» (подробная информация) и «Характеристики» (прокачка).
 */
export function CharacterPage() {
  const profile = useProfileStore((s) => s.profile);
  const failed = useProfileStore((s) => s.failed);
  const [activeId, setActiveId] = useState(TABS[0].id);

  const active = TABS.find((tab) => tab.id === activeId) ?? TABS[0];

  return (
    <div className="container-fluid p-4">
      <h1 className="visually-hidden">Персонаж</h1>

      <ul className="nav nav-tabs mb-3" role="tablist">
        {TABS.map(({ id, label }) => (
          <li key={id} className="nav-item" role="presentation">
            <button
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={id === activeId}
              aria-controls="character-tabpanel"
              className={`nav-link ${id === activeId ? "active" : ""}`}
              onClick={() => setActiveId(id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div
        id="character-tabpanel"
        role="tabpanel"
        aria-labelledby={`tab-${active.id}`}
      >
        {profile?.character ? (
          <active.Content profile={profile} />
        ) : failed ? (
          <div className="alert alert-danger" role="alert">
            Не удалось загрузить данные персонажа. Обновите страницу.
          </div>
        ) : (
          <div className="d-flex justify-content-center p-5">
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Загрузка…</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
