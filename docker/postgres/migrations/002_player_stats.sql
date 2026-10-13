-- Параметры героя: уровень, жизни, опыт, серебро, рубины.
-- Для УЖЕ существующей базы (init.sql выполняется только на пустой).
-- Существующие игроки получают стартовые значения.
-- Запуск: psql -U <user> -d <db> -f 002_player_stats.sql
BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS level  INTEGER NOT NULL DEFAULT 1   CHECK (level >= 1),
  ADD COLUMN IF NOT EXISTS hp     INTEGER NOT NULL DEFAULT 75  CHECK (hp >= 0),
  ADD COLUMN IF NOT EXISTS max_hp INTEGER NOT NULL DEFAULT 75  CHECK (max_hp > 0),
  ADD COLUMN IF NOT EXISTS xp     INTEGER NOT NULL DEFAULT 0   CHECK (xp >= 0),
  ADD COLUMN IF NOT EXISTS max_xp INTEGER NOT NULL DEFAULT 5   CHECK (max_xp > 0),
  ADD COLUMN IF NOT EXISTS silver INTEGER NOT NULL DEFAULT 200 CHECK (silver >= 0),
  ADD COLUMN IF NOT EXISTS rubies INTEGER NOT NULL DEFAULT 0   CHECK (rubies >= 0);

ALTER TABLE users ADD CONSTRAINT users_hp_within_max CHECK (hp <= max_hp);

COMMIT;
