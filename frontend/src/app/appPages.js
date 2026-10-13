import { User, Swords, Shield, Trophy } from "lucide-react";
import { CharacterPage } from "@pages/CharacterPage.jsx";
import { BattlesPage } from "@pages/BattlesPage.jsx";
import { HeroPage } from "@pages/HeroPage.jsx";
import { RatingPage } from "@pages/RatingPage.jsx";

/**
 * Разделы приложения для авторизованного пользователя.
 * Порядок = порядок пунктов в сайдбаре. Новый раздел — одна строка здесь
 * (+ страница в pages/).
 */
export const APP_PAGES = [
  { id: "character", label: "Персонаж", icon: User, Page: CharacterPage },
  { id: "battles", label: "Битвы", icon: Swords, Page: BattlesPage },
  { id: "hero", label: "Герой", icon: Shield, Page: HeroPage },
  { id: "rating", label: "Рейтинг", icon: Trophy, Page: RatingPage },
];
