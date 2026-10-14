import { PageState } from "@shared/ui/PageState.jsx";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { AttributesTab } from "@widgets/character/ui/AttributesTab.jsx";

/**
 * AttributesPage — страница «Характеристики».
 */
export function AttributesPage() {
  const profile = useProfileStore((s) => s.profile);
  const failed = useProfileStore((s) => s.failed);
  const ready = Boolean(profile?.character);

  return (
    <div className="container-fluid p-4">
      <h1 className="h3 mb-3">Характеристики</h1>
      <PageState
        loading={!ready && !failed}
        error={
          !ready && failed
            ? "Не удалось загрузить данные персонажа. Обновите страницу."
            : null
        }
      >
        {ready && <AttributesTab profile={profile} />}
      </PageState>
    </div>
  );
}
