import { create } from "zustand";
import {
  getWorkRequest,
  startWorkRequest,
  cancelWorkRequest,
} from "@features/work/api/work.api.js";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { toUserMessage } from "@shared/lib/authErrors.js";

const initialState = {
  catalog: null,
  active: null,
  // serverNow − время устройства на момент ответа: прибавив его к Date.now(),
  // получаем серверное время, даже если часы на устройстве идут неправильно.
  offsetMs: 0,
  loaded: false,
  loading: false,
  busy: false,
  error: null,
  result: null, // работа, зачисленная при последнем обновлении
};

export const useWorkStore = create((set, get) => ({
  ...initialState,

  applyState: (data) => {
    set({
      catalog: data.catalog,
      active: data.active,
      offsetMs: Date.parse(data.serverNow) - Date.now(),
      loaded: true,
      error: null,
    });
    if (data.settled) {
      set({ result: data.settled });
      // Серебро и карма изменились — обновляем профиль (панель, «Карма»).
      useProfileStore.getState().fetchProfile();
    }
  },

  loadWork: async () => {
    if (get().loading) return; // запрос уже идёт
    set({ loading: true });
    try {
      get().applyState(await getWorkRequest());
    } catch (err) {
      set({ error: toUserMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  /** Берёт работу. Возвращает true при успехе. */
  start: async (type, hours) => {
    set({ busy: true, error: null, result: null });
    try {
      get().applyState(await startWorkRequest({ type, hours }));
      return true;
    } catch (err) {
      set({ error: toUserMessage(err) });
      // Работа уже идёт (например, взята с другого устройства) — подтянем её.
      if (err.code === "WORK_IN_PROGRESS") await get().loadWork();
      return false;
    } finally {
      set({ busy: false });
    }
  },

  /** Отменяет работу (ничего не зачисляется). Возвращает true при успехе. */
  cancel: async () => {
    set({ busy: true, error: null, result: null });
    try {
      get().applyState(await cancelWorkRequest());
      return true;
    } catch (err) {
      set({ error: toUserMessage(err) });
      return false;
    } finally {
      set({ busy: false });
    }
  },

  clear: () => set(initialState),
}));
