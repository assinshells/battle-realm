import { CircleUserRound } from "lucide-react";

/**
 * Avatar — аватар героя. Пока картинок нет, это иконка пользователя.
 * Когда появятся настоящие аватары, достаточно изменить только этот компонент.
 *
 * size — размер в пикселях.
 */
export function Avatar({ size = 28, className = "" }) {
  return (
    <CircleUserRound
      size={size}
      className={className}
      strokeWidth={1.5}
      aria-hidden="true"
    />
  );
}
