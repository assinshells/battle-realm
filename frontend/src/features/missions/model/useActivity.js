import { useEffect, useState } from "react";
import { useMissionStore } from "@features/missions/model/useMissionStore.js";

/**
 * useActivity — чем сейчас занят персонаж (работа или ожидание после миссии),
 * для страниц, которые в этом случае показывают таймер-заглушку.
 *
 * Возвращает { loaded, activity, nowMs }:
 *  - loaded   — состояние уже получено с сервера,
 *  - activity — занятие или null (ожидание после миссии кончается само, как
 *               только серверное время доходит до конца),
 *  - nowMs    — текущее серверное время (мс), обновляется раз в секунду.
 */
export function useActivity() {
  const activity = useMissionStore((s) => s.activity);
  const loaded = useMissionStore((s) => s.loaded);
  const offsetMs = useMissionStore((s) => s.offsetMs);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const nowMs = now + offsetMs;
  const over =
    activity?.kind === "mission" && nowMs >= Date.parse(activity.endsAt);

  return { loaded, activity: over ? null : activity, nowMs };
}
