import { pool } from "../config/database.js";

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
              tournaments_won, wins, draws, losses
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

  async updatePassword(id, passwordHash) {
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      passwordHash,
      id,
    ]);
  },
};
