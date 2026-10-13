import { create } from "zustand";
import { loginRequest } from "@features/auth/login/api/login.api.js";
import { AuthSession } from "@shared/lib/authSession.js";
import { toUserMessage } from "@shared/lib/authErrors.js";

export const useLoginStore = create((set) => ({
  loading: false,
  error: null,

  login: async ({ email, password }, onSuccess) => {
    set({ loading: true, error: null });
    try {
      const data = await loginRequest({ email, password });
      // refreshToken/csrfToken пришли как cookie (см. axios.js/backend);
      // в теле ответа — только accessToken, он живёт в памяти вкладки.
      AuthSession.setAccessToken(data.accessToken);
      onSuccess();
    } catch (err) {
      set({ error: toUserMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
