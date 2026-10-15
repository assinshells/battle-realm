import { apiClient } from "@shared/api/axios.js";

/**
 * @returns {Promise<{
 *   id: number, email: string, heroName: string,
 *   stats: { level: number, hp: number, maxHp: number, hpRegenPerHour: number,
 *            xp: number, maxXp: number, silver: number, rubies: number },
 *   character: { details, attributes, upgradePrices, karmaPoints, combat }
 * }>}
 */
export const getProfileRequest = () =>
  apiClient.get("/api/auth/me").then((r) => r.data.user);
