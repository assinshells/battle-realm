import { BaseException } from "./base.exception.js";
import { HTTP_STATUS } from "../constants/auth.constants.js";
import { GAME_ERRORS } from "../constants/game.constants.js";

export class InsufficientSilverException extends BaseException {
  constructor(message = GAME_ERRORS.NOT_ENOUGH_SILVER) {
    super(message, HTTP_STATUS.CONFLICT, "INSUFFICIENT_SILVER");
  }
}

export class CityNotFoundException extends BaseException {
  constructor(message = GAME_ERRORS.CITY_NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND, "CITY_NOT_FOUND");
  }
}
