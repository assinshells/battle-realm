import { apiClient } from "@shared/api/axios.js";

/**
 * @param {{ heroName: string, email: string, password: string }} dto
 * @returns {Promise<{ success: boolean }>}
 */
export const registerRequest = (dto) =>
  apiClient.post("/api/auth/register", dto).then((r) => r.data);
