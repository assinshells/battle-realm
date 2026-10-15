-- 1) Генерация пунктов жизни в час (по умолчанию 11).
-- 2) Убираем отдельную колонку karma: карма теперь только light_karma / dark_karma.
-- Для УЖЕ существующей базы (init.sql выполняется только на пустой).
-- Запуск (после 006): psql -U <user> -d <db> -f 007_hp_regen_karma.sql
BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS hp_regen_per_hour INTEGER NOT NULL DEFAULT 11
    CHECK (hp_regen_per_hour >= 0);

ALTER TABLE users DROP COLUMN IF EXISTS karma;

COMMIT;
