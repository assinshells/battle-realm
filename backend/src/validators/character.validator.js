import { ValidationException } from "../exceptions/auth.exceptions.js";
import { UPGRADABLE_ATTRIBUTES } from "../constants/game.constants.js";

export const validateUpgradeAttributeRequest = (body) => {
  const attribute = body?.attribute;
  const valid =
    typeof attribute === "string" &&
    Object.hasOwn(UPGRADABLE_ATTRIBUTES, attribute);

  if (!valid) {
    throw new ValidationException("Validation failed", [
      `attribute must be one of: ${Object.keys(UPGRADABLE_ATTRIBUTES).join(", ")}`,
    ]);
  }
};
