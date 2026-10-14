import {
  User,
  Shield,
  SlidersHorizontal,
  Globe,
  Map as MapIcon,
  ScrollText,
  Swords,
  Trophy,
} from "lucide-react";
import { HeroPage } from "@pages/HeroPage.jsx";
import { AttributesPage } from "@pages/AttributesPage.jsx";
import { WorldMapPage } from "@pages/WorldMapPage.jsx";
import { MissionsPage } from "@pages/MissionsPage.jsx";
import { BattlesPage } from "@pages/BattlesPage.jsx";
import { RatingPage } from "@pages/RatingPage.jsx";

/**
 * Меню приложения для авторизованного пользователя.
 * Элемент с Page — страница; элемент с children — раскрывающаяся группа
 * (сама страницей не является). Порядок = порядок в сайдбаре.
 */
export const APP_MENU = [
  {
    id: "character",
    label: "Персонаж",
    icon: User,
    children: [
      { id: "hero", label: "Герой", icon: Shield, Page: HeroPage },
      {
        id: "attributes",
        label: "Характеристики",
        icon: SlidersHorizontal,
        Page: AttributesPage,
      },
    ],
  },
  {
    id: "world",
    label: "Мир",
    icon: Globe,
    children: [
      { id: "world-map", label: "Карта мира", icon: MapIcon, Page: WorldMapPage },
      { id: "missions", label: "Миссии", icon: ScrollText, Page: MissionsPage },
    ],
  },
  { id: "battles", label: "Битвы", icon: Swords, Page: BattlesPage },
  { id: "rating", label: "Рейтинг", icon: Trophy, Page: RatingPage },
];

/** Все страницы одним списком (без групп). */
export const APP_PAGES = APP_MENU.flatMap((item) => item.children ?? [item]);

/** Страница, которая открывается после входа. */
export const DEFAULT_PAGE_ID = "hero";
