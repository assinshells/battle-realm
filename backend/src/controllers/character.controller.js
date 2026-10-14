import { CharacterService } from "../services/character.service.js";
import { validateUpgradeAttributeRequest } from "../validators/character.validator.js";
import { HTTP_STATUS } from "../constants/auth.constants.js";

/**
 * CharacterController — только routing-логика: запрос → сервис → ответ.
 */
export const CharacterController = {
  upgradeAttribute: async (req, res, next) => {
    try {
      validateUpgradeAttributeRequest(req.body);
      // req.userId выставляет authGuard из access-токена.
      const user = await CharacterService.upgradeAttribute(
        req.userId,
        req.body.attribute,
      );
      res.status(HTTP_STATUS.OK).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },
};
