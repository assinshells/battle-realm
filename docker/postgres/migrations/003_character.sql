-- Характеристики, боевые показатели и подробная информация о персонаже.
-- Для УЖЕ существующей базы (init.sql выполняется только на пустой).
-- Существующие игроки получают стартовые значения.
-- Запуск (после 002): psql -U <user> -d <db> -f 003_character.sql
BEGIN;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS strength      INTEGER NOT NULL DEFAULT 3 CHECK (strength >= 1),
  ADD COLUMN IF NOT EXISTS giftedness    INTEGER NOT NULL DEFAULT 3 CHECK (giftedness >= 1),
  ADD COLUMN IF NOT EXISTS constitution  INTEGER NOT NULL DEFAULT 3 CHECK (constitution >= 1),
  ADD COLUMN IF NOT EXISTS luck          INTEGER NOT NULL DEFAULT 3 CHECK (luck >= 1),
  ADD COLUMN IF NOT EXISTS attack_skill  INTEGER NOT NULL DEFAULT 3 CHECK (attack_skill >= 1),
  ADD COLUMN IF NOT EXISTS defense_skill INTEGER NOT NULL DEFAULT 3 CHECK (defense_skill >= 1),

  ADD COLUMN IF NOT EXISTS damage_min   INTEGER NOT NULL DEFAULT 1 CHECK (damage_min >= 0),
  ADD COLUMN IF NOT EXISTS damage_max   INTEGER NOT NULL DEFAULT 1 CHECK (damage_max >= 0),
  ADD COLUMN IF NOT EXISTS armor        INTEGER NOT NULL DEFAULT 1 CHECK (armor >= 0),
  ADD COLUMN IF NOT EXISTS karma        INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hit_chance   INTEGER NOT NULL DEFAULT 3 CHECK (hit_chance >= 0),
  ADD COLUMN IF NOT EXISTS block_chance INTEGER NOT NULL DEFAULT 3 CHECK (block_chance >= 0),

  ADD COLUMN IF NOT EXISTS order_name      VARCHAR(64),
  ADD COLUMN IF NOT EXISTS order_rank      VARCHAR(64),
  ADD COLUMN IF NOT EXISTS loot_gained     INTEGER NOT NULL DEFAULT 0 CHECK (loot_gained >= 0),
  ADD COLUMN IF NOT EXISTS loot_lost       INTEGER NOT NULL DEFAULT 0 CHECK (loot_lost >= 0),
  ADD COLUMN IF NOT EXISTS tournaments_won INTEGER NOT NULL DEFAULT 0 CHECK (tournaments_won >= 0),
  ADD COLUMN IF NOT EXISTS wins            INTEGER NOT NULL DEFAULT 0 CHECK (wins >= 0),
  ADD COLUMN IF NOT EXISTS draws           INTEGER NOT NULL DEFAULT 0 CHECK (draws >= 0),
  ADD COLUMN IF NOT EXISTS losses          INTEGER NOT NULL DEFAULT 0 CHECK (losses >= 0);

ALTER TABLE users ADD CONSTRAINT users_damage_range CHECK (damage_min <= damage_max);

COMMIT;
