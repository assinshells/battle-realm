import {
  User,
  Shield,
  SlidersHorizontal,
  Scale,
  Globe,
  Map as MapIcon,
  ScrollText,
  Hammer,
  Swords,
  Trophy,
} from "lucide-react";
import { HeroPage } from "@pages/HeroPage.jsx";
import { AttributesPage } from "@pages/AttributesPage.jsx";
import { KarmaPage } from "@pages/KarmaPage.jsx";
import { WorldMapPage } from "@pages/WorldMapPage.jsx";
import { MissionsPage } from "@pages/MissionsPage.jsx";
import { WorkPage } from "@pages/WorkPage.jsx";
import { WorkProgressPage } from "@pages/WorkProgressPage.jsx";
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
      { id: "karma", label: "Карма", icon: Scale, Page: KarmaPage },
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
  { id: "work", label: "Работа", icon: Hammer, Page: WorkPage },
  { id: "battles", label: "Битвы", icon: Swords, Page: BattlesPage },
  { id: "rating", label: "Рейтинг", icon: Trophy, Page: RatingPage },
];

/** Страницы из меню одним списком (без групп). */
export const APP_PAGES = APP_MENU.flatMap((item) => item.children ?? [item]);

/**
 * Страницы, которых нет в меню: на них переходят из других страниц.
 * menuId — какой пункт меню подсвечивать, пока страница открыта.
 */
const HIDDEN_PAGES = [
  {
    id: "work-progress",
    label: "Работа",
    menuId: "work",
    Page: WorkProgressPage,
  },
];

/** Все страницы приложения (для поиска по id). */
export const ALL_PAGES = [...APP_PAGES, ...HIDDEN_PAGES];

/** Страница, которая открывается после входа. */
export const DEFAULT_PAGE_ID = "hero";
