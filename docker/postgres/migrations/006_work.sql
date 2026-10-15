-- Работа (страница «Работа»).
-- Для УЖЕ существующей базы (init.sql выполняется только на пустой).
-- Запуск (после 005): psql -U <user> -d <db> -f 006_work.sql
BEGIN;

-- Работа: у игрока может быть только одна активная работа.
-- Награда фиксируется при взятии работы и зачисляется по окончании времени
-- (ends_at считается по времени БД, то есть серверному).
CREATE TABLE IF NOT EXISTS work_sessions (
    user_id       INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    work_type     VARCHAR(32) NOT NULL,
    hours         INTEGER NOT NULL CHECK (hours BETWEEN 1 AND 8),
    started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at       TIMESTAMPTZ NOT NULL,
    reward_silver INTEGER NOT NULL CHECK (reward_silver >= 0),
    reward_karma  INTEGER NOT NULL DEFAULT 0 CHECK (reward_karma >= 0),
    karma_kind    VARCHAR(5) CHECK (karma_kind IN ('light', 'dark')),
    CHECK (ends_at > started_at),
    CHECK ((karma_kind IS NULL) = (reward_karma = 0))
);

COMMIT;
