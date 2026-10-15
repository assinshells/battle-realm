import { KARMA_KINDS } from "@shared/constants/karma.constants.js";

/**
 * KarmaAmount — иконка кармы и число: светлая — солнце, тёмная — луна.
 *
 * kind   — "light" | "dark",
 * amount — число (с "+", если plus = true),
 * label  — показывать ли название рядом.
 */
export function KarmaAmount({ kind, amount, plus = true, label = false }) {
  const { label: name, icon: Icon } = KARMA_KINDS[kind];
  return (
    <span
      className="d-inline-flex align-items-center gap-1"
      title={name}
      aria-label={`${name}: ${plus ? "+" : ""}${amount}`}
    >
      <Icon size={16} className="flex-shrink-0" aria-hidden="true" />
      {label && <span>{name}</span>}
      <span className="fw-semibold">
        {plus ? "+" : ""}
        {amount}
      </span>
    </span>
  );
}
