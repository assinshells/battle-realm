import { apiClient } from "@shared/api/axios.js";

/**
 * Все три запроса возвращают одно и то же состояние работы:
 * { serverNow, catalog, active, settled }
 *  - serverNow — время сервера (по нему считается прогресс),
 *  - catalog   — виды работ и награды за 1–8 часов,
 *  - active    — текущая работа или null,
 *  - settled   — работа, которая только что закончилась и зачислена, или null.
 */
export const getWorkRequest = () =>
  apiClient.get("/api/work").then((r) => r.data);

/** @param {{ type: "gate"|"field"|"robbery", hours: number }} dto */
export const startWorkRequest = (dto) =>
  apiClient.post("/api/work/start", dto).then((r) => r.data);

export const cancelWorkRequest = () =>
  apiClient.post("/api/work/cancel").then((r) => r.data);
