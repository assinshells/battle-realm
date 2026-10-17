/**
 * Чем сейчас занят игрок (или null):
 *  - { kind: "mission", ... } — ожидание после миссии (награда уже зачислена),
 *  - { kind: "work", finished, ... } — работа (finished — оплату можно принять).
 * Итог боя сюда НЕ входит: его игрок видит один раз сразу после боя, а
 * сохранённый итог (mission_runs.result) пойдёт в будущую систему сообщений.
 */
export const toActivityDto = ({ run, work }) => {
  if (run?.waiting) {
    return {
      kind: "mission",
      startedAt: run.started_at,
      endsAt: run.ends_at,
      finished: false,
    };
  }
  if (work) {
    return {
      kind: "work",
      startedAt: work.started_at,
      endsAt: work.ends_at,
      finished: work.finished,
    };
  }
  return null;
};
