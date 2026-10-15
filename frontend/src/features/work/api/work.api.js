import { apiClient } from "@shared/api/axios.js";

/**
 * Все три запроса возвращают одно и то же состояние работы:
 * { serverNow, catalog, active }
 *  - serverNow — время сервера (по нему считается прогресс),
 *  - catalog   — виды работ и награды за 1–8 часов,
 *  - active    — работа, за которую ещё не получена оплата, или null;
 *                finished = true, когда время вышло и можно принять оплату.
 */
export const getWorkRequest = () =>
  apiClient.get("/api/work").then((r) => r.data);

/** @param {{ type: "gate"|"field"|"robbery", hours: number }} dto */
export const startWorkRequest = (dto) =>
  apiClient.post("/api/work/start", dto).then((r) => r.data);

export const cancelWorkRequest = () =>
  apiClient.post("/api/work/cancel").then((r) => r.data);

/** «Принять оплату»: зачисляет серебро и карму за законченную работу. */
export const claimWorkRequest = () =>
  apiClient.post("/api/work/claim").then((r) => r.data);
