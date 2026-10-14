import { create } from "zustand";
import { upgradeAttributeRequest } from "@features/character/api/upgradeAttribute.api.js";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { toUserMessage } from "@shared/lib/authErrors.js";

// Ошибки, после которых данные на экране могли устареть — перечитываем профиль.
const STALE_DATA_CODES = ["INSUFFICIENT_SILVER", "UPGRADE_CONFLICT"];

export const useUpgradeStore = create((set, get) => ({
  upgrading: null, // ключ повышаемой характеристики или null
  error: null,

  upgrade: async (attribute) => {
    if (get().upgrading) return; // одно повышение за раз
    set({ upgrading: attribute, error: null });
    try {
      const profile = await upgradeAttributeRequest(attribute);
      useProfileStore.getState().setProfile(profile);
    } catch (err) {
      set({ error: toUserMessage(err) });
      if (STALE_DATA_CODES.includes(err.code)) {
        useProfileStore.getState().fetchProfile();
      }
    } finally {
      set({ upgrading: null });
    }
  },

  clearError: () => set({ error: null }),
}));
