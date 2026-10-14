import { UserRepository } from "../repositories/user.repository.js";
import { toProfileDto } from "../dto/profile.dto.js";
import {
  UPGRADABLE_ATTRIBUTES,
  GAME_ERRORS,
  attributeUpgradePrice,
} from "../constants/game.constants.js";
import {
  AccessTokenInvalidException,
  ConflictException,
} from "../exceptions/auth.exceptions.js";
import { InsufficientSilverException } from "../exceptions/game.exceptions.js";

// Сколько раз повторять, если параллельный запрос изменил данные игрока.
const MAX_ATTEMPTS = 3;

export const CharacterService = {
  /**
   * Повышает характеристику на +1 за серебро с основного счёта.
   * Цена = квадрат текущего значения (см. attributeUpgradePrice).
   * Возвращает обновлённый профиль.
   */
  async upgradeAttribute(userId, attribute) {
    const column = UPGRADABLE_ATTRIBUTES[attribute];

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const user = await UserRepository.findById(userId);
      if (!user) throw new AccessTokenInvalidException();

      const value = user[column];
      const price = attributeUpgradePrice(value);
      if (user.silver < price) throw new InsufficientSilverException();

      const upgraded = await UserRepository.upgradeAttribute({
        userId,
        column,
        expectedValue: value,
        price,
      });
      if (upgraded) {
        return toProfileDto(await UserRepository.findById(userId));
      }
      // Не прошло — параллельный запрос изменил значение или серебро.
      // Перечитываем актуальные данные и пробуем ещё раз.
    }

    throw new ConflictException(GAME_ERRORS.UPGRADE_CONFLICT, "UPGRADE_CONFLICT");
  },
};
