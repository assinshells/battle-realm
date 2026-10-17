/**
 * Ленивое восстановление (жизни, очки миссий): фонового процесса нет,
 * значение досчитывается по времени при каждом обращении.
 *
 * value, max   — сохранённое значение и максимум,
 * perHour      — скорость восстановления в час,
 * updatedAt    — момент, от которого идёт отсчёт (Date),
 * now          — текущее время БД (Date).
 *
 * Возвращает { value, updatedAt }. Дробная часть не теряется: отсчёт
 * сдвигается ровно на время, за которое набрались целые единицы. На
 * максимуме отсчёт начинается заново с текущего момента.
 */
export const regenerate = ({ value, max, perHour, updatedAt, now }) => {
  const nowMs = new Date(now).getTime();
  const updatedMs = new Date(updatedAt).getTime();

  if (value >= max) return { value, updatedAt: new Date(nowMs) };
  if (perHour <= 0 || nowMs <= updatedMs) return { value, updatedAt: new Date(updatedMs) };

  const gained = Math.floor(((nowMs - updatedMs) / 3600000) * perHour);
  if (gained <= 0) return { value, updatedAt: new Date(updatedMs) };

  const next = Math.min(max, value + gained);
  if (next >= max) return { value: max, updatedAt: new Date(nowMs) };

  return {
    value: next,
    updatedAt: new Date(updatedMs + (gained / perHour) * 3600000),
  };
};
