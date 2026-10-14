import { PageState } from "@shared/ui/PageState.jsx";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { KarmaPanel } from "@widgets/character/ui/KarmaPanel.jsx";

/**
 * KarmaPage — страница «Карма»: герой и счётчики светлой и тёмной кармы.
 */
export function KarmaPage() {
  const profile = useProfileStore((s) => s.profile);
  const failed = useProfileStore((s) => s.failed);
  const ready = Boolean(profile?.character);

  return (
    <div className="container-fluid p-4">
      <h1 className="h3 mb-3">Карма</h1>
      <PageState
        loading={!ready && !failed}
        error={
          !ready && failed
            ? "Не удалось загрузить данные персонажа. Обновите страницу."
            : null
        }
      >
        {ready && <KarmaPanel profile={profile} />}
      </PageState>
    </div>
  );
}
