import { ValidationException } from "../exceptions/auth.exceptions.js";
import { MISSION_KINDS, MISSION_LENGTHS } from "../constants/game.constants.js";

const MAX_INT4 = 2147483647;

export const validateStartMissionRequest = (body) => {
  const errors = [];

  if (!Number.isInteger(body?.locationId) || body.locationId < 1 || body.locationId > MAX_INT4) {
    errors.push("locationId must be a positive integer");
  }
  if (!MISSION_KINDS.includes(body?.kind)) {
    errors.push(`kind must be one of: ${MISSION_KINDS.join(", ")}`);
  }
  if (!MISSION_LENGTHS.some((item) => item.id === body?.length)) {
    errors.push(
      `length must be one of: ${MISSION_LENGTHS.map((item) => item.id).join(", ")}`,
    );
  }

  if (errors.length) throw new ValidationException("Validation failed", errors);
};
