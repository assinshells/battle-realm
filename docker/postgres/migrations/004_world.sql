-- Мир: города, локации и текущий город игрока.
-- Для УЖЕ существующей базы (init.sql выполняется только на пустой).
-- Все существующие игроки оказываются в стартовом городе (id = 1).
-- Запуск (после 003): psql -U <user> -d <db> -f 004_world.sql
BEGIN;

-- Мир: города и их локации.
-- Город доступен игроку, когда его уровень >= cities.min_level.
CREATE TABLE IF NOT EXISTS cities (
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(64) NOT NULL UNIQUE,
    min_level INTEGER NOT NULL DEFAULT 1 CHECK (min_level >= 1)
);

CREATE TABLE IF NOT EXISTS locations (
    id         SERIAL PRIMARY KEY,
    city_id    INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name       VARCHAR(64) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    UNIQUE (city_id, name)
);

-- Стартовый город (id = 1 — город по умолчанию для новых игроков, 1 уровень).
-- Названия города и локаций — временные, замените на свои.
INSERT INTO cities (id, name, min_level) VALUES (1, 'Ривенхолд', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (city_id, name, sort_order) VALUES
    (1, 'Рыночная площадь', 1),
    (1, 'Кузница', 2),
    (1, 'Таверна', 3),
    (1, 'Городские ворота', 4)
ON CONFLICT (city_id, name) DO NOTHING;

SELECT setval(pg_get_serial_sequence('cities', 'id'), GREATEST((SELECT max(id) FROM cities), 1));

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS city_id INTEGER NOT NULL DEFAULT 1 REFERENCES cities(id);

COMMIT;
