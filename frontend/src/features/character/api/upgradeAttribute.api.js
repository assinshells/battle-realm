import { apiClient } from "@shared/api/axios.js";

/**
 * Повысить характеристику на +1 за серебро.
 * @param {"strength"|"giftedness"|"constitution"|"luck"|"attackSkill"|"defenseSkill"} attribute
 * @returns {Promise<object>} обновлённый профиль (как GET /api/auth/me)
 */
export const upgradeAttributeRequest = (attribute) =>
  apiClient
    .post("/api/character/attributes/upgrade", { attribute })
    .then((r) => r.data.user);
