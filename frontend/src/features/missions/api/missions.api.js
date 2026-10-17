import { apiClient } from "@shared/api/axios.js";

/**
 * Состояние миссий игрока:
 * { serverNow, points: { current, max, regenPerHour }, hp: { current, max },
 *   busy: null | "work" | "mission", run }
 * run — последняя миссия (итог боя с ходом боя и наградами) или null;
 * run.waiting — игрок ещё «отсутствует», работу и новую миссию брать нельзя.
 */
export const getMissionStateRequest = () =>
  apiClient.get("/api/missions/state").then((r) => r.data);

/**
 * Отправляет игрока на миссию: бой считается сразу, награда зачисляется сразу.
 * Возвращает то же состояние + user (обновлённый профиль).
 * @param {{ locationId: number, kind: "light"|"dark", length: "short"|"medium"|"long" }} dto
 */
export const startMissionRequest = (dto) =>
  apiClient.post("/api/missions/start", dto).then((r) => r.data);
