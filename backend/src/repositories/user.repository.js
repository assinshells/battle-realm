import { pool } from "../config/database.js";
import { UPGRADABLE_ATTRIBUTES } from "../constants/game.constants.js";

const UPGRADABLE_COLUMNS = new Set(Object.values(UPGRADABLE_ATTRIBUTES));

export const UserRepository = {
  async findByEmail(email) {
    const { rows } = await pool.query(
      "SELECT id, email, hero_name, password_hash FROM users WHERE email = $1",
      [email],
    );
    return rows[0] ?? null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT id, email, hero_name, password_hash,
              level, hp, max_hp, xp, max_xp, silver, rubies,
              strength, giftedness, constitution, luck, attack_skill, defense_skill,
              damage_min, damage_max, armor, karma, hit_chance, block_chance,
              order_name, order_rank, loot_gained, loot_lost,
              tournaments_won, wins, draws, losses, city_id
       FROM users WHERE id = $1`,
      [id],
    );
    return rows[0] ?? null;
  },

  async isHeroNameTaken(heroName) {
    const { rows } = await pool.query(
      "SELECT 1 FROM users WHERE lower(hero_name) = lower($1)",
      [heroName],
    );
    return rows.length > 0;
  },

  /**
   * Создаёт пользователя. Возвращает null, если e-mail ИЛИ имя героя уже
   * заняты — атомарно, за счёт UNIQUE-ограничений + ON CONFLICT DO NOTHING
   * (без гонки "проверил → вставил"). Какое именно ограничение сработало,
   * решает вызывающий код (см. AuthService.register).
   */
  async create({ email, passwordHash, heroName }) {
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, hero_name)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [email, passwordHash, heroName],
    );
    return rows[0] ?? null;
  },

  /**
   * Атомарно повышает характеристику на +1 и списывает серебро.
   * Выполняется только если значение характеристики всё ещё равно
   * expectedValue и серебра хватает — иначе ничего не меняется и
   * возвращается false (параллельный запрос успел раньше).
   */
  async upgradeAttribute({ userId, column, expectedValue, price }) {
    if (!UPGRADABLE_COLUMNS.has(column)) {
      throw new Error(`Column "${column}" is not upgradable`);
    }
    // column — только из белого списка выше, поэтому подстановка безопасна.
    const { rowCount } = await pool.query(
      `UPDATE users
       SET ${column} = ${column} + 1, silver = silver - $2
       WHERE id = $1 AND ${column} = $3 AND silver >= $2`,
      [userId, price, expectedValue],
    );
    return rowCount === 1;
  },

  async updatePassword(id, passwordHash) {
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      passwordHash,
      id,
    ]);
  },
};
