-- Бой в миссиях:
--  * у локаций появляется code — код бестиария миссий (у пещеры 'cave');
--  * очки миссий: максимум и момент, от которого идёт восстановление; то же для жизней;
--  * максимум жизней = 25 × Телосложение (для существующих игроков пересчитывается);
--  * урон, шанс на удар и на защиту выводятся из характеристик — колонки удаляются;
--  * таблица последней миссии игрока (итог боя и таймер ожидания).
-- Для УЖЕ существующей базы (init.sql выполняется только на пустой).
-- Запуск (после 008): psql -U <user> -d <db> -f 009_combat.sql
BEGIN;

ALTER TABLE locations ADD COLUMN IF NOT EXISTS code VARCHAR(32);
UPDATE locations SET code = 'cave' WHERE name = 'Пещера' AND code IS NULL;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS hp_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS mission_points_max INTEGER NOT NULL DEFAULT 120
    CHECK (mission_points_max > 0),
  ADD COLUMN IF NOT EXISTS mission_points_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE users
  ADD CONSTRAINT users_mission_points_within_max CHECK (mission_points <= mission_points_max);

-- Максимум жизней по Телосложению (сдвигаем и текущие жизни на ту же величину).
UPDATE users
SET hp = hp + (25 * constitution - max_hp),
    max_hp = 25 * constitution,
    hp_regen_per_hour = ROUND(25 * constitution * 11.0 / 75)
WHERE max_hp <> 25 * constitution;

ALTER TABLE users
  DROP COLUMN IF EXISTS damage_min,
  DROP COLUMN IF EXISTS damage_max,
  DROP COLUMN IF EXISTS hit_chance,
  DROP COLUMN IF EXISTS block_chance;

CREATE TABLE IF NOT EXISTS mission_runs (
    user_id     INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    kind        VARCHAR(5) NOT NULL CHECK (kind IN ('light', 'dark')),
    length      VARCHAR(6) NOT NULL CHECK (length IN ('short', 'medium', 'long')),
    started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at     TIMESTAMPTZ NOT NULL,
    result      JSONB NOT NULL,
    CHECK (ends_at > started_at)
);

COMMIT;
