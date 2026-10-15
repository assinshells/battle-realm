import { WorkService } from "../services/work.service.js";
import { validateStartWorkRequest } from "../validators/work.validator.js";
import { HTTP_STATUS } from "../constants/auth.constants.js";

/**
 * WorkController — только routing-логика: запрос → сервис → ответ.
 */
const handler = (action) => async (req, res, next) => {
  try {
    const state = await action(req);
    res.status(HTTP_STATUS.OK).json({ success: true, ...state });
  } catch (err) {
    next(err);
  }
};

export const WorkController = {
  state: handler((req) => WorkService.getState(req.userId)),

  start: handler((req) => {
    validateStartWorkRequest(req.body);
    return WorkService.start(req.userId, req.body.type, req.body.hours);
  }),

  cancel: handler((req) => WorkService.cancel(req.userId)),

  claim: handler((req) => WorkService.claim(req.userId)),
};
