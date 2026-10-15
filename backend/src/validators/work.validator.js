import { ValidationException } from "../exceptions/auth.exceptions.js";
import {
  WORK_TYPES,
  WORK_MIN_HOURS,
  WORK_MAX_HOURS,
} from "../constants/work.constants.js";

export const validateStartWorkRequest = (body) => {
  const errors = [];

  if (typeof body?.type !== "string" || !Object.hasOwn(WORK_TYPES, body.type)) {
    errors.push(`type must be one of: ${Object.keys(WORK_TYPES).join(", ")}`);
  }
  if (
    !Number.isInteger(body?.hours) ||
    body.hours < WORK_MIN_HOURS ||
    body.hours > WORK_MAX_HOURS
  ) {
    errors.push(
      `hours must be an integer from ${WORK_MIN_HOURS} to ${WORK_MAX_HOURS}`,
    );
  }

  if (errors.length) throw new ValidationException("Validation failed", errors);
};
