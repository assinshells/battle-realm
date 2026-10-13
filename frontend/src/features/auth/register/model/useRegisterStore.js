import { create } from "zustand";
import { registerRequest } from "@features/auth/register/api/register.api.js";
import { toUserMessage } from "@shared/lib/authErrors.js";
import { HERO_NAME_REGEX } from "@shared/constants/auth.constants.js";

export const useRegisterStore = create((set) => ({
  loading: false,
  error: null,

  register: async ({ heroName, email, password }, onSuccess) => {
    if (!HERO_NAME_REGEX.test(heroName)) {
      set({
        error:
          "Имя героя: от 3 до 20 символов — буквы, цифры, пробел, «_» или «-».",
      });
      return;
    }
    set({ loading: true, error: null });
    try {
      await registerRequest({ heroName, email, password });
      onSuccess();
    } catch (err) {
      set({ error: toUserMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
