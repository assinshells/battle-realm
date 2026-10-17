import { pool } from "../config/database.js";

export const WorldRepository = {
  /** Города, доступные игроку данного уровня. */
  async listCitiesForLevel(level) {
    const { rows } = await pool.query(
      "SELECT id, name, min_level FROM cities WHERE min_level <= $1 ORDER BY min_level, id",
      [level],
    );
    return rows;
  },

  async findCity(id) {
    const { rows } = await pool.query(
      "SELECT id, name, min_level FROM cities WHERE id = $1",
      [id],
    );
    return rows[0] ?? null;
  },

  /** Локация вместе с городом, которому она принадлежит. */
  async findLocation(id) {
    const { rows } = await pool.query(
      `SELECT l.id, l.name, l.code, l.city_id, c.name AS city_name, c.min_level
       FROM locations l JOIN cities c ON c.id = l.city_id
       WHERE l.id = $1`,
      [id],
    );
    return rows[0] ?? null;
  },

  async listLocations(cityId) {
    const { rows } = await pool.query(
      "SELECT id, name FROM locations WHERE city_id = $1 ORDER BY sort_order, id",
      [cityId],
    );
    return rows;
  },
};
