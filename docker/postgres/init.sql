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
    -- Бестиарий миссий: код набора мобов (например 'cave'); его могут делить
    -- несколько локаций. NULL — миссий в локации нет.
    code       VARCHAR(32),
    UNIQUE (city_id, name)
);

-- Стартовый город (id = 1 — город по умолчанию для новых игроков, 1 уровень).
-- Названия города и локаций — временные, замените на свои.
INSERT INTO cities (id, name, min_level) VALUES (1, 'Ривенхолд', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (city_id, name, sort_order, code) VALUES
    (1, 'Пещера', 1, 'cave'),
    (1, 'Кузница', 2, NULL),
    (1, 'Таверна', 3, NULL),
    (1, 'Городские ворота', 4, NULL)
ON CONFLICT (city_id, name) DO NOTHING;

SELECT setval(pg_get_serial_sequence('cities', 'id'), GREATEST((SELECT max(id) FROM cities), 1));

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email = lower(email)),
    password_hash TEXT NOT NULL,
    hero_name VARCHAR(20) NOT NULL CHECK (char_length(hero_name) BETWEEN 3 AND 20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Город, в котором сейчас находится игрок (по умолчанию стартовый).
    city_id INTEGER NOT NULL DEFAULT 1 REFERENCES cities(id),

    -- Параметры героя. DEFAULT-значения = стартовые параметры нового игрока.
    level  INTEGER NOT NULL DEFAULT 1   CHECK (level >= 1),
    hp     INTEGER NOT NULL DEFAULT 75  CHECK (hp >= 0),      -- пункты жизни
    max_hp INTEGER NOT NULL DEFAULT 75  CHECK (max_hp > 0),
    xp     INTEGER NOT NULL DEFAULT 0   CHECK (xp >= 0),      -- очки опыта
    max_xp INTEGER NOT NULL DEFAULT 5   CHECK (max_xp > 0),   -- опыта до следующего уровня
    silver INTEGER NOT NULL DEFAULT 200 CHECK (silver >= 0),
    rubies INTEGER NOT NULL DEFAULT 0   CHECK (rubies >= 0),
    CONSTRAINT users_hp_within_max CHECK (hp <= max_hp),
    hp_regen_per_hour INTEGER NOT NULL DEFAULT 11 CHECK (hp_regen_per_hour >= 0), -- генерация жизней в час
    hp_updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),  -- от этого момента идёт восстановление жизней

    -- Очки миссий: свободные и их восстановление в час.
    mission_points                 INTEGER NOT NULL DEFAULT 120 CHECK (mission_points >= 0),
    mission_points_regen_per_hour  INTEGER NOT NULL DEFAULT 5 CHECK (mission_points_regen_per_hour >= 0),
    mission_points_max             INTEGER NOT NULL DEFAULT 120 CHECK (mission_points_max > 0),
    mission_points_updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_mission_points_within_max CHECK (mission_points <= mission_points_max),

    -- Характеристики (стартовые значения = DEFAULT).
    strength      INTEGER NOT NULL DEFAULT 3 CHECK (strength >= 1),      -- Сила
    giftedness    INTEGER NOT NULL DEFAULT 3 CHECK (giftedness >= 1),    -- Одарённость
    constitution  INTEGER NOT NULL DEFAULT 3 CHECK (constitution >= 1),  -- Телосложение
    luck          INTEGER NOT NULL DEFAULT 3 CHECK (luck >= 1),          -- Удача
    attack_skill  INTEGER NOT NULL DEFAULT 3 CHECK (attack_skill >= 1),  -- Искусство атаки
    defense_skill INTEGER NOT NULL DEFAULT 3 CHECK (defense_skill >= 1), -- Искусство защиты

    -- Боевые показатели. Урон, шанс на удар и на защиту выводятся из
    -- характеристик (Сила, Искусство атаки и защиты), в БД не хранятся.
    armor        INTEGER NOT NULL DEFAULT 1 CHECK (armor >= 0),

    -- Счётчики кармы (страница «Карма»).
    light_karma INTEGER NOT NULL DEFAULT 0 CHECK (light_karma >= 0),
    dark_karma  INTEGER NOT NULL DEFAULT 0 CHECK (dark_karma >= 0),

    -- Подробная информация (NULL = "---").
    order_name      VARCHAR(64),
    order_rank      VARCHAR(64),
    loot_gained     INTEGER NOT NULL DEFAULT 0 CHECK (loot_gained >= 0),
    loot_lost       INTEGER NOT NULL DEFAULT 0 CHECK (loot_lost >= 0),
    tournaments_won INTEGER NOT NULL DEFAULT 0 CHECK (tournaments_won >= 0),
    wins            INTEGER NOT NULL DEFAULT 0 CHECK (wins >= 0),
    draws           INTEGER NOT NULL DEFAULT 0 CHECK (draws >= 0),
    losses          INTEGER NOT NULL DEFAULT 0 CHECK (losses >= 0)
);

-- Имя героя уникально без учёта регистра ("Arthur" = "arthur").
CREATE UNIQUE INDEX IF NOT EXISTS users_hero_name_lower_idx ON users (lower(hero_name));

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

-- Последняя миссия игрока: итог боя (JSON с ходом боя и наградами) и время,
-- до которого игрок «отсутствует». Награда уже зачислена в момент боя;
-- пока ends_at не наступил, брать работу или новую миссию нельзя.
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
