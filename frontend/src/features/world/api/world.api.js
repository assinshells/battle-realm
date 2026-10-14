import { apiClient } from "@shared/api/axios.js";

/**
 * Города, открытые игроку по уровню.
 * @returns {Promise<{ cities: { id: number, name: string, isCurrent: boolean }[] }>}
 */
export const getWorldMapRequest = () =>
  apiClient.get("/api/world/map").then((r) => r.data);

/**
 * Город и его локации.
 * @param {number|"current"} cityRef id города или "current" (где игрок сейчас)
 * @returns {Promise<{ id, name, isCurrent, locations: { id, name }[] }>}
 */
export const getCityRequest = (cityRef) =>
  apiClient.get(`/api/world/cities/${cityRef}`).then((r) => r.data.city);
