export const AUTH_SCREENS = Object.freeze({
  LOGIN: "login",
  REGISTER: "register",
  FORGOT: "forgot",
  OTP: "otp",
  RESET: "reset",
  APP: "app",
});

export const APP_NAME = "Battle Realm";
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

// Ссылки футера форм авторизации. Страницы должны существовать на сайте
// (или замените на полный URL).
export const LEGAL_LINKS = Object.freeze({
  terms: "/terms",
  privacy: "/privacy",
});

export const PASSWORD_MIN_LENGTH = 6;

// Имя героя: 3–20 символов, буквы любых языков, цифры, пробел, "_" и "-";
// пробелов в начале и в конце быть не может. Правило то же, что на backend
// (validators/auth.validator.js).
export const HERO_NAME_MIN = 3;
export const HERO_NAME_MAX = 20;
export const HERO_NAME_REGEX = /^[\p{L}\p{N}_-][\p{L}\p{N} _-]{1,18}[\p{L}\p{N}_-]$/u;
