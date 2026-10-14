import { create } from "zustand";
import {
  getWorldMapRequest,
  getCityRequest,
} from "@features/world/api/world.api.js";
import { toUserMessage } from "@shared/lib/authErrors.js";

const initialState = {
  map: null,
  mapError: null,
  // Город хранится вместе с тем, что запрашивали (cityKey), чтобы страница
  // не показала город от предыдущего открытия.
  city: null,
  cityKey: null,
  cityError: null,
};

let cityRequestId = 0; // отбрасываем ответы устаревших запросов

export const useWorldStore = create((set) => ({
  ...initialState,

  loadMap: async () => {
    set({ mapError: null });
    try {
      const { cities } = await getWorldMapRequest();
      set({ map: cities });
    } catch (err) {
      set({ mapError: toUserMessage(err) });
    }
  },

  loadCity: async (cityRef) => {
    const requestId = ++cityRequestId;
    set({ city: null, cityKey: null, cityError: null });
    try {
      const city = await getCityRequest(cityRef);
      if (requestId === cityRequestId) {
        set({ city, cityKey: String(cityRef) });
      }
    } catch (err) {
      if (requestId === cityRequestId) set({ cityError: toUserMessage(err) });
    }
  },

  clear: () => {
    cityRequestId++;
    set(initialState);
  },
}));
