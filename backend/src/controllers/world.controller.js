import { WorldService } from "../services/world.service.js";
import { parseCityRef } from "../validators/world.validator.js";
import { HTTP_STATUS } from "../constants/auth.constants.js";

/**
 * WorldController — только routing-логика: запрос → сервис → ответ.
 */
export const WorldController = {
  map: async (req, res, next) => {
    try {
      const data = await WorldService.getMap(req.userId);
      res.status(HTTP_STATUS.OK).json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  city: async (req, res, next) => {
    try {
      const cityRef = parseCityRef(req.params.cityId);
      const city = await WorldService.getCity(req.userId, cityRef);
      res.status(HTTP_STATUS.OK).json({ success: true, city });
    } catch (err) {
      next(err);
    }
  },
};
