import { MissionService } from "../services/mission.service.js";
import { validateStartMissionRequest } from "../validators/mission.validator.js";
import { HTTP_STATUS } from "../constants/auth.constants.js";

/**
 * MissionController — только routing-логика: запрос → сервис → ответ.
 */
export const MissionController = {
  state: async (req, res, next) => {
    try {
      const state = await MissionService.getState(req.userId);
      res.status(HTTP_STATUS.OK).json({ success: true, ...state });
    } catch (err) {
      next(err);
    }
  },

  start: async (req, res, next) => {
    try {
      validateStartMissionRequest(req.body);
      const { locationId, kind, length } = req.body;
      const result = await MissionService.start(req.userId, { locationId, kind, length });
      res.status(HTTP_STATUS.OK).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },
};
