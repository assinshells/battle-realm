import { create } from "zustand";
import { forgotPasswordRequest } from "@features/auth/forgot-password/api/forgotPassword.api.js";
import { toUserMessage } from "@shared/lib/authErrors.js";

export const useForgotPasswordStore = create((set) => ({
  loading: false,
  error: null,

  submit: async ({ email }, onSuccess) => {
    set({ loading: true, error: null });
    try {
      await forgotPasswordRequest({ email });
      onSuccess();
    } catch (err) {
      set({ error: toUserMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
