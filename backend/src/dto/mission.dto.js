/** Последняя миссия: итог боя целиком и состояние ожидания. */
export const toMissionRunDto = (run) =>
  run && {
    locationId: run.location_id,
    kind: run.kind,
    length: run.length,
    startedAt: run.started_at,
    endsAt: run.ends_at,
    // Ожидание идёт — работу и новую миссию брать нельзя.
    waiting: run.waiting,
    result: run.result,
  };
