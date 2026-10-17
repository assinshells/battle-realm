import { create } from "zustand";
import {
  getMissionStateRequest,
  startMissionRequest,
} from "@features/missions/api/missions.api.js";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { toUserMessage } from "@shared/lib/authErrors.js";

const initialState = {
  points: null,
  hp: null,
  busy: null,
  run: null,
  // serverNow − время устройства на момент ответа (см. useWorkStore).
  offsetMs: 0,
  loaded: false,
  loading: false,
  starting: false,
  error: null,
};

export const useMissionStore = create((set, get) => ({
  ...initialState,

  applyState: (data) => {
    set({
      points: data.points,
      hp: data.hp,
      busy: data.busy,
      run: data.run,
      offsetMs: Date.parse(data.serverNow) - Date.now(),
      loaded: true,
      error: null,
    });
  },

  loadState: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      get().applyState(await getMissionStateRequest());
    } catch (err) {
      set({ error: toUserMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  /** Отправляет на миссию. Возвращает true при успехе. */
  start: async (dto) => {
    set({ starting: true, error: null });
    try {
      const data = await startMissionRequest(dto);
      get().applyState(data);
      // Серебро, опыт, уровень, жизни и карма уже изменились — обновляем профиль.
      useProfileStore.getState().setProfile(data.user);
      return true;
    } catch (err) {
      set({ error: toUserMessage(err) });
      // Данные на экране могли устареть (очки, жизни, занятость) — перечитаем.
      get().loadState();
      return false;
    } finally {
      set({ starting: false });
    }
  },

  clearError: () => set({ error: null }),
  clear: () => set(initialState),
}));
