import { create } from "zustand";
import { getProfileRequest } from "@features/profile/api/profile.api.js";

export const useProfileStore = create((set) => ({
  profile: null,
  loading: false,
  failed: false,

  fetchProfile: async () => {
    set({ loading: true, failed: false });
    try {
      set({ profile: await getProfileRequest() });
    } catch {
      // Сайдбар при ошибке покажет значения по умолчанию, а страницы,
      // которым нужны данные персонажа, — сообщение об ошибке (failed).
      set({ failed: true });
    } finally {
      set({ loading: false });
    }
  },

  clear: () => set({ profile: null, failed: false }),
}));
