-- 1) Локация «Рыночная площадь» переименована в «Пещера».
-- 2) Очки миссий игрока: свободные (по умолчанию 120) и восстановление в час (5).
-- Для УЖЕ существующей базы (init.sql выполняется только на пустой).
-- Запуск (после 007): psql -U <user> -d <db> -f 008_missions.sql
BEGIN;

UPDATE locations
SET name = 'Пещера'
WHERE name = 'Рыночная площадь'
  AND NOT EXISTS (
    SELECT 1 FROM locations x
    WHERE x.city_id = locations.city_id AND x.name = 'Пещера'
  );

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS mission_points INTEGER NOT NULL DEFAULT 120
    CHECK (mission_points >= 0),
  ADD COLUMN IF NOT EXISTS mission_points_regen_per_hour INTEGER NOT NULL DEFAULT 5
    CHECK (mission_points_regen_per_hour >= 0);

COMMIT;
