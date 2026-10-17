import { apiClient } from "@shared/api/axios.js";

/**
 * Состояние миссий игрока:
 * { serverNow, points: { current, max, regenPerHour }, hp: { current, max },
 *   busy: null | "work" | "mission", activity }
 * activity — чем занят игрок: { kind, startedAt, endsAt, finished } или null.
 * Итог боя здесь не приходит: его игрок видит один раз сразу после боя.
 */
export const getMissionStateRequest = () =>
  apiClient.get("/api/missions/state").then((r) => r.data);

/**
 * Отправляет игрока на миссию: бой считается сразу, награда зачисляется сразу.
 * Возвращает то же состояние + user (обновлённый профиль) + result (итог боя,
 * выдаётся один раз).
 * @param {{ locationId: number, kind: "light"|"dark", length: "short"|"medium"|"long" }} dto
 */
export const startMissionRequest = (dto) =>
  apiClient.post("/api/missions/start", dto).then((r) => r.data);
