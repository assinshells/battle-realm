import { ValidationException } from "../exceptions/auth.exceptions.js";

const MAX_INT4 = 2147483647; // предел PostgreSQL INTEGER

/**
 * Разбирает параметр :cityId — "current" или положительное целое.
 * Возвращает "current" либо число.
 */
export const parseCityRef = (raw) => {
  if (raw === "current") return raw;

  if (/^\d+$/.test(raw)) {
    const id = Number(raw);
    if (id >= 1 && id <= MAX_INT4) return id;
  }
  throw new ValidationException("Validation failed", [
    'cityId must be a positive integer or "current"',
  ]);
};

/** Разбирает параметр :locationId — положительное целое. */
export const parseLocationId = (raw) => {
  if (/^\d+$/.test(raw)) {
    const id = Number(raw);
    if (id >= 1 && id <= MAX_INT4) return id;
  }
  throw new ValidationException("Validation failed", [
    "locationId must be a positive integer",
  ]);
};
