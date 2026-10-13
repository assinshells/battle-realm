import { create } from "zustand";
import { resetPasswordRequest } from "@features/auth/reset-password/api/resetPassword.api.js";
import { toUserMessage } from "@shared/lib/authErrors.js";

export const useResetPasswordStore = create((set) => ({
  loading: false,
  error: null,

  reset: async ({ verifiedToken, password, confirmPassword }, onSuccess) => {
    if (password !== confirmPassword) {
      set({ error: "Пароли не совпадают." });
      return;
    }
    set({ loading: true, error: null });
    try {
      await resetPasswordRequest({ verifiedToken, password, confirmPassword });
      onSuccess();
    } catch (err) {
      set({ error: toUserMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
