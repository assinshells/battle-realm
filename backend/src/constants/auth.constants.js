export const AUTH_ERRORS = Object.freeze({
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_TAKEN: "Email already taken",
  HERO_NAME_TAKEN: "Hero name already taken",
  USER_NOT_FOUND: "User not found",
  OTP_EXPIRED: "OTP expired or not found",
  OTP_INVALID: "Invalid OTP",
  RESET_TOKEN_INVALID: "Reset token expired or invalid",
  UNAUTHORIZED: "Unauthorized",
  ACCESS_TOKEN_INVALID: "Access token missing or invalid",
  REFRESH_TOKEN_INVALID: "Refresh token expired or invalid",
  RATE_LIMIT_EXCEEDED: "Too many requests, please try again later",
  INTERNAL_ERROR: "Internal server error",
  VALIDATION_FAILED: "Validation failed",
  CSRF_TOKEN_INVALID: "Invalid or missing CSRF token",
});

// Cookie names for the httpOnly refresh-token flow. The refresh token
// itself never touches JS (httpOnly); the CSRF token cookie is
// intentionally readable by JS — that's what makes the double-submit
// pattern work (see middlewares/csrf.middleware.js).
export const COOKIE_NAMES = Object.freeze({
  refreshToken: "refreshToken",
  csrfToken: "csrfToken",
});

export const REDIS_KEYS = Object.freeze({
  refreshToken: (jti) => `refresh_token:${jti}`,
  otp: (uid) => `otp:${uid}`,
  otpVerified: (tok) => `otp_verified:${tok}`,
  otpAttempts: (uid) => `otp_attempts:${uid}`,
});

export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY: 429,
  INTERNAL: 500,
});