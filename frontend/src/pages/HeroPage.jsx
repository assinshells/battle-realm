import { PageState } from "@shared/ui/PageState.jsx";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { CharacterTab } from "@widgets/character/ui/CharacterTab.jsx";

/**
 * HeroPage — страница «Герой».
 */
export function HeroPage() {
  const profile = useProfileStore((s) => s.profile);
  const failed = useProfileStore((s) => s.failed);
  const ready = Boolean(profile?.character);

  return (
    <div className="container-fluid p-4">
      <h1 className="h3 mb-3">Герой</h1>
      <PageState
        loading={!ready && !failed}
        error={
          !ready && failed
            ? "Не удалось загрузить данные персонажа. Обновите страницу."
            : null
        }
      >
        {ready && <CharacterTab profile={profile} />}
      </PageState>
    </div>
  );
}
