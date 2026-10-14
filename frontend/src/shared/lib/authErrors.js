// Backend отдаёт технические сообщения на английском. Игроку показываем
// понятный русский текст, выбирая его по коду ошибки (см. normalizeError
// в shared/api/axios.js и exceptions/auth.exceptions.js на backend).
const MESSAGES = {
  AUTHENTICATION_FAILED: "Неверный e-mail или пароль.",
  EMAIL_TAKEN: "Этот e-mail уже зарегистрирован.",
  HERO_NAME_TAKEN: "Это имя героя уже занято. Выберите другое.",
  NOT_FOUND: "Аккаунт с таким e-mail не найден.",
  OTP_INVALID: "Неверный код. Проверьте цифры и попробуйте ещё раз.",
  OTP_EXPIRED: "Код устарел или попытки закончились. Запросите новый.",
  AUTHORIZATION_FAILED: "Ссылка для смены пароля устарела. Начните заново.",
  CITY_NOT_FOUND: "Этот город пока недоступен.",
  INSUFFICIENT_SILVER: "Недостаточно серебра для повышения.",
  UPGRADE_CONFLICT: "Данные изменились. Попробуйте ещё раз.",
  RATE_LIMIT_EXCEEDED: "Слишком много попыток. Подождите немного.",
  VALIDATION_FAILED: "Проверьте правильность введённых данных.",
};

// Подробности валидации (error.details) — тоже по-русски.
const DETAILS = {
  "valid email is required": "Введите корректный e-mail.",
  "password must be at least 6 characters":
    "Пароль должен быть не короче 6 символов.",
  "heroName must be 3-20 characters: letters, digits, space, _ or -":
    "Имя героя: от 3 до 20 символов — буквы, цифры, пробел, «_» или «-».",
  "otpCode is required": "Введите код из письма.",
  "Passwords do not match": "Пароли не совпадают.",
  "confirmPassword is required": "Повторите пароль.",
  "verifiedToken is required": "Ссылка для смены пароля устарела. Начните заново.",
};

export const toUserMessage = (err) => {
  if (err?.status === 0) return "Нет связи с сервером. Попробуйте позже.";

  if (err?.code === "VALIDATION_FAILED" && err.details?.length) {
    const known = err.details.map((d) => DETAILS[d]).filter(Boolean);
    if (known.length) return [...new Set(known)].join(" ");
  }

  return MESSAGES[err?.code] ?? "Что-то пошло не так. Попробуйте ещё раз.";
};
