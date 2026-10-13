import crypto from "crypto";

const HASH_KEYLEN = 64;
const SALT_LENGTH = 16;

const hashRaw = (password, salt) =>
  new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, HASH_KEYLEN, (err, key) => {
      if (err) reject(err);
      else resolve(key.toString("hex"));
    });
  });

// Фиксированная соль для "холостого" хеширования (см. burn()).
const DUMMY_SALT = "0".repeat(SALT_LENGTH * 2);

export const PasswordProvider = {
  async hash(password) {
    const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
    const hash = await hashRaw(password, salt);
    return `${salt}:${hash}`;
  },

  async verify(password, stored) {
    const parts = stored.split(":");
    if (parts.length !== 2) return false;

    const [salt, hash] = parts;
    if (!salt || !hash || hash.length !== HASH_KEYLEN * 2) return false;

    const candidate = await hashRaw(password, salt);
    return crypto.timingSafeEqual(
      Buffer.from(candidate, "hex"),
      Buffer.from(hash, "hex"),
    );
  },

  /**
   * Делает ту же дорогую работу, что и verify(), но результат не нужен.
   * Вызывается, когда пользователя нет, — чтобы вход с несуществующим
   * e-mail занимал столько же времени, сколько с неверным паролем,
   * и по времени ответа нельзя было определить, есть ли аккаунт.
   */
  async burn(password) {
    await hashRaw(password, DUMMY_SALT);
  },
};
