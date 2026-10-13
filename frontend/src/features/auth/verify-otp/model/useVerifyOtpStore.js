import { create } from "zustand";
import { verifyOtpRequest } from "@features/auth/verify-otp/api/verifyOtp.api.js";
import { toUserMessage } from "@shared/lib/authErrors.js";

export const useVerifyOtpStore = create((set) => ({
  loading: false,
  error: null,

  verify: async ({ email, otpCode }, onSuccess) => {
    set({ loading: true, error: null });
    try {
      const data = await verifyOtpRequest({ email, otpCode });
      onSuccess(data.verifiedToken);
    } catch (err) {
      set({ error: toUserMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
