import { pool } from "../config/database.js";

const SESSION_COLUMNS = `work_type, hours, started_at, ends_at,
  reward_silver, reward_karma, karma_kind`;

export const WorkRepository = {
  /** Текущее время БД (серверное время). */
  async now() {
    const { rows } = await pool.query("SELECT NOW() AS now");
    return rows[0].now;
  },

  /** Активная (ещё не зачисленная) работа игрока или null. */
  async findActive(userId) {
    const { rows } = await pool.query(
      `SELECT ${SESSION_COLUMNS} FROM work_sessions WHERE user_id = $1`,
      [userId],
    );
    return rows[0] ?? null;
  },

  /**
   * Берёт работу. Время окончания считает БД. Возвращает false, если у игрока
   * уже есть работа (PRIMARY KEY user_id) — атомарно, без гонки.
   */
  async start({ userId, workType, hours, rewardSilver, rewardKarma, karmaKind }) {
    const { rowCount } = await pool.query(
      `INSERT INTO work_sessions
         (user_id, work_type, hours, ends_at, reward_silver, reward_karma, karma_kind)
       VALUES ($1, $2, $3, NOW() + make_interval(hours => $3), $4, $5, $6)
       ON CONFLICT (user_id) DO NOTHING`,
      [userId, workType, hours, rewardSilver, rewardKarma, karmaKind],
    );
    return rowCount === 1;
  },

  /** Отменяет ещё не законченную работу (ничего не зачисляется). */
  async cancelUnfinished(userId) {
    const { rowCount } = await pool.query(
      "DELETE FROM work_sessions WHERE user_id = $1 AND ends_at > NOW()",
      [userId],
    );
    return rowCount === 1;
  },

  /**
   * Зачисляет награду за законченную работу и удаляет её — одной транзакцией.
   * Серебро добавляется к основному счёту. Карма зачитывается против
   * противоположной: сначала гасит её, остаток идёт в свою сторону
   * (тёмная 10 + светлая 11 → светлая 1, тёмная 0); в минус не уходит.
   * Возвращает зачисленную работу или null, если закончившейся нет.
   * Параллельные вызовы безопасны: зачислит только тот, кто удалил строку.
   */
  async settleFinished(userId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query(
        `DELETE FROM work_sessions
         WHERE user_id = $1 AND ends_at <= NOW()
         RETURNING ${SESSION_COLUMNS}`,
        [userId],
      );
      const done = rows[0];
      if (!done) {
        await client.query("COMMIT");
        return null;
      }

      await client.query(
        `UPDATE users SET
           silver = silver + $2,
           light_karma = CASE $3::text
             WHEN 'light' THEN light_karma + GREATEST($4 - dark_karma, 0)
             WHEN 'dark'  THEN GREATEST(light_karma - $4, 0)
             ELSE light_karma END,
           dark_karma = CASE $3::text
             WHEN 'dark'  THEN dark_karma + GREATEST($4 - light_karma, 0)
             WHEN 'light' THEN GREATEST(dark_karma - $4, 0)
             ELSE dark_karma END
         WHERE id = $1`,
        [userId, done.reward_silver, done.karma_kind, done.reward_karma],
      );
      await client.query("COMMIT");
      return done;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
};
