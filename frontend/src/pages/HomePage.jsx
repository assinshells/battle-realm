import { House } from "lucide-react";
import { PagePlaceholder } from "@shared/ui/PagePlaceholder.jsx";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";

/**
 * HomePage — главная страница после входа (заглушка).
 */
export function HomePage() {
  const heroName = useProfileStore((s) => s.profile?.heroName);

  return (
    <PagePlaceholder title="Главная" icon={House}>
      {heroName ? `Добро пожаловать, ${heroName}!` : "Добро пожаловать!"}
    </PagePlaceholder>
  );
}
