-- Счётчики светлой и тёмной кармы (страница «Карма»).
-- Для УЖЕ существующей базы (init.sql выполняется только на пустой).
-- Существующие игроки получают 0 / 0.
-- Запуск (после 004): psql -U <user> -d <db> -f 005_karma.sql
BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS light_karma INTEGER NOT NULL DEFAULT 0 CHECK (light_karma >= 0),
  ADD COLUMN IF NOT EXISTS dark_karma  INTEGER NOT NULL DEFAULT 0 CHECK (dark_karma >= 0);

COMMIT;
