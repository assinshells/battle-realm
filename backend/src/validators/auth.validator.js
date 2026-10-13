import { ValidationException } from "../exceptions/auth.exceptions.js";

const isNonEmptyString = (val) =>
  typeof val === "string" && val.trim().length > 0;
const isValidEmail = (val) =>
  typeof val === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
const isValidPassword = (val) => typeof val === "string" && val.length >= 6;
// 3–20 символов: буквы любых языков, цифры, пробел, "_" и "-";
// пробелов в начале и в конце быть не может.
const HERO_NAME_REGEX = /^[\p{L}\p{N}_-][\p{L}\p{N} _-]{1,18}[\p{L}\p{N}_-]$/u;
const isValidHeroName = (val) =>
  typeof val === "string" && HERO_NAME_REGEX.test(val.trim());

export const validateLoginRequest = (body) => {
  const errors = [];
  if (!isValidEmail(body.email)) errors.push("valid email is required");
  if (!isValidPassword(body.password))
    errors.push("password must be at least 6 characters");
  if (errors.length) throw new ValidationException("Validation failed", errors);
};

export const validateRegisterRequest = (body) => {
  const errors = [];
  if (!isValidEmail(body.email)) errors.push("valid email is required");
  if (!isValidPassword(body.password))
    errors.push("password must be at least 6 characters");
  if (!isValidHeroName(body.heroName))
    errors.push("heroName must be 3-20 characters: letters, digits, space, _ or -");
  if (errors.length) throw new ValidationException("Validation failed", errors);
};

export const validateForgotPasswordRequest = (body) => {
  const errors = [];
  if (!isValidEmail(body.email))
    errors.push("valid email is required");
  if (errors.length) throw new ValidationException("Validation failed", errors);
};

export const validateVerifyOtpRequest = (body) => {
  const errors = [];
  if (!isValidEmail(body.email))
    errors.push("valid email is required");
  if (!isNonEmptyString(body.otpCode)) errors.push("otpCode is required");
  if (errors.length) throw new ValidationException("Validation failed", errors);
};

export const validateResetPasswordRequest = (body) => {
  const errors = [];
  if (!isNonEmptyString(body.verifiedToken))
    errors.push("verifiedToken is required");
  if (!isValidPassword(body.password))
    errors.push("password must be at least 6 characters");
  if (!isNonEmptyString(body.confirmPassword))
    errors.push("confirmPassword is required");
  if (body.password !== body.confirmPassword)
    errors.push("Passwords do not match");
  if (errors.length) throw new ValidationException("Validation failed", errors);
};
