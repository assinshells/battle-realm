/**
 * DTO — Data Transfer Objects.
 * Используются для явного описания входящих и исходящих данных.
 * Все поля типизированы через JSDoc.
 */

/**
 * @typedef {Object} LoginRequestDto
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterRequestDto
 * @property {string} email
 * @property {string} password
 * @property {string} heroName
 */

/**
 * @typedef {Object} ForgotPasswordDto
 * @property {string} email
 */

/**
 * @typedef {Object} VerifyOtpDto
 * @property {string} email
 * @property {string} otpCode
 */

/**
 * @typedef {Object} ResetPasswordDto
 * @property {string} verifiedToken
 * @property {string} password
 * @property {string} confirmPassword
 */

/**
 * @typedef {Object} AuthResponseDto
 * @property {boolean} success
 * @property {string|undefined} accessToken
 * @property {string|undefined} csrfToken
 * @property {string|undefined} verifiedToken
 *
 * Note: refreshToken is intentionally NOT part of the response body —
 * it's set as an httpOnly cookie by CookieProvider and never exposed to JS.
 */

/**
 * @typedef {Object} ErrorResponseDto
 * @property {boolean} success
 * @property {{ code: string, message: string, details?: string[] }} error
 */

// E-mail — единственный идентификатор пользователя. Приводим к нижнему
// регистру и обрезаем пробелы здесь, чтобы "User@Mail.com" и "user@mail.com"
// были одним и тем же аккаунтом (в БД стоит CHECK email = lower(email)).
const normalizeEmail = (email) => String(email).trim().toLowerCase();

export const toLoginRequestDto = (body) => ({
  email: normalizeEmail(body.email),
  password: body.password,
});

export const toRegisterRequestDto = (body) => ({
  email: normalizeEmail(body.email),
  password: body.password,
  heroName: String(body.heroName).trim(),
});

export const toForgotPasswordDto = (body) => ({
  email: normalizeEmail(body.email),
});

export const toVerifyOtpDto = (body) => ({
  email: normalizeEmail(body.email),
  otpCode: body.otpCode,
});

export const toResetPasswordDto = (body) => ({
  verifiedToken: body.verifiedToken,
  password: body.password,
  confirmPassword: body.confirmPassword,
});
