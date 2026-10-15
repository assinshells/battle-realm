import { create } from "zustand";
import {
  getWorldMapRequest,
  getCityRequest,
  getLocationRequest,
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
  location: null,
  locationKey: null,
  locationError: null,
};

// Номера запросов: ответы устаревших запросов отбрасываем.
let cityRequestId = 0;
let locationRequestId = 0;

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

  loadLocation: async (locationId) => {
    const requestId = ++locationRequestId;
    set({ location: null, locationKey: null, locationError: null });
    try {
      const location = await getLocationRequest(locationId);
      if (requestId === locationRequestId) {
        set({ location, locationKey: String(locationId) });
      }
    } catch (err) {
      if (requestId === locationRequestId) {
        set({ locationError: toUserMessage(err) });
      }
    }
  },

  clear: () => {
    cityRequestId++;
    locationRequestId++;
    set(initialState);
  },
}));
