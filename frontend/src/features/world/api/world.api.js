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

/**
 * Локация и данные для её страницы.
 * @returns {Promise<{
 *   id: number, name: string, cityId: number, cityName: string,
 *   missions: {
 *     points: number, regenPerHour: number,
 *     lengths: { id: string, name: string, cost: number }[]
 *   }
 * }>}
 */
export const getLocationRequest = (locationId) =>
  apiClient.get(`/api/world/locations/${locationId}`).then((r) => r.data.location);
