import { pool } from "../config/database.js";

/** Выполняет fn(client) в одной транзакции (commit при успехе, иначе rollback). */
const transaction = async (fn) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const MissionRepository = {
  transaction,

  /** Есть ли у игрока работа (в том числе законченная, но не принятая). */
  async hasWork(db, userId) {
    const { rows } = await db.query(
      "SELECT 1 FROM work_sessions WHERE user_id = $1",
      [userId],
    );
    return rows.length > 0;
  },

  /**
   * Последняя миссия игрока (с сохранённым итогом) или null. waiting — время ожидания ещё не вышло
   * (считает БД), serverNow — время БД в этот момент.
   */
  async findRun(db, userId) {
    const { rows } = await db.query(
      `SELECT m.location_id, m.kind, m.length, m.started_at, m.ends_at, m.result,
              m.ends_at > NOW() AS waiting, NOW() AS server_now
       FROM mission_runs m WHERE m.user_id = $1`,
      [userId],
    );
    return rows[0] ?? null;
  },

  /**
   * Зачисляет итог миссии одним запросом: серебро и «добычу», опыт и уровень,
   * карму, счётчики боёв, жизни и очки миссий (вместе с отсчётом их
   * восстановления).
   * Карма зачитывается против противоположной: сначала гасит её, остаток идёт
   * в свою сторону (тёмная 10 + светлая 11 → светлая 1, тёмная 0); в минус не уходит.
   */
  async applyOutcome(client, userId, o) {
    await client.query(
      `UPDATE users SET
         silver = silver + $2,
         loot_gained = loot_gained + $2,
         level = $3, xp = $4, max_xp = $5,
         light_karma = CASE $6::text
           WHEN 'light' THEN light_karma + GREATEST($7 - dark_karma, 0)
           WHEN 'dark'  THEN GREATEST(light_karma - $7, 0)
           ELSE light_karma END,
         dark_karma = CASE $6::text
           WHEN 'dark'  THEN dark_karma + GREATEST($7 - light_karma, 0)
           WHEN 'light' THEN GREATEST(dark_karma - $7, 0)
           ELSE dark_karma END,
         wins = wins + $8, draws = draws + $9, losses = losses + $10,
         hp = $11, hp_updated_at = $12,
         mission_points = $13, mission_points_updated_at = $14
       WHERE id = $1`,
      [
        userId, o.silver, o.level, o.xp, o.maxXp, o.karmaKind, o.karma,
        o.wins, o.draws, o.losses, o.hp, o.hpUpdatedAt,
        o.missionPoints, o.missionPointsUpdatedAt,
      ],
    );
  },

  /** Сохраняет итог миссии вместо предыдущего; ожидание — minutes минут. */
  async saveRun(client, { userId, locationId, kind, length, minutes, result }) {
    await client.query(
      `INSERT INTO mission_runs
         (user_id, location_id, kind, length, started_at, ends_at, result)
       VALUES ($1, $2, $3, $4, NOW(), NOW() + make_interval(mins => $5), $6)
       ON CONFLICT (user_id) DO UPDATE SET
         location_id = EXCLUDED.location_id, kind = EXCLUDED.kind,
         length = EXCLUDED.length, started_at = EXCLUDED.started_at,
         ends_at = EXCLUDED.ends_at, result = EXCLUDED.result`,
      [userId, locationId, kind, length, minutes, JSON.stringify(result)],
    );
  },
};
