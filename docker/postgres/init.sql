CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email = lower(email)),
    password_hash TEXT NOT NULL,
    hero_name VARCHAR(20) NOT NULL CHECK (char_length(hero_name) BETWEEN 3 AND 20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Параметры героя. DEFAULT-значения = стартовые параметры нового игрока.
    level  INTEGER NOT NULL DEFAULT 1   CHECK (level >= 1),
    hp     INTEGER NOT NULL DEFAULT 75  CHECK (hp >= 0),      -- пункты жизни
    max_hp INTEGER NOT NULL DEFAULT 75  CHECK (max_hp > 0),
    xp     INTEGER NOT NULL DEFAULT 0   CHECK (xp >= 0),      -- очки опыта
    max_xp INTEGER NOT NULL DEFAULT 5   CHECK (max_xp > 0),   -- опыта до следующего уровня
    silver INTEGER NOT NULL DEFAULT 200 CHECK (silver >= 0),
    rubies INTEGER NOT NULL DEFAULT 0   CHECK (rubies >= 0),
    CONSTRAINT users_hp_within_max CHECK (hp <= max_hp),

    -- Характеристики (стартовые значения = DEFAULT).
    strength      INTEGER NOT NULL DEFAULT 3 CHECK (strength >= 1),      -- Сила
    giftedness    INTEGER NOT NULL DEFAULT 3 CHECK (giftedness >= 1),    -- Одарённость
    constitution  INTEGER NOT NULL DEFAULT 3 CHECK (constitution >= 1),  -- Телосложение
    luck          INTEGER NOT NULL DEFAULT 3 CHECK (luck >= 1),          -- Удача
    attack_skill  INTEGER NOT NULL DEFAULT 3 CHECK (attack_skill >= 1),  -- Искусство атаки
    defense_skill INTEGER NOT NULL DEFAULT 3 CHECK (defense_skill >= 1), -- Искусство защиты

    -- Боевые показатели.
    damage_min   INTEGER NOT NULL DEFAULT 1 CHECK (damage_min >= 0),
    damage_max   INTEGER NOT NULL DEFAULT 1 CHECK (damage_max >= 0),
    armor        INTEGER NOT NULL DEFAULT 1 CHECK (armor >= 0),
    karma        INTEGER NOT NULL DEFAULT 0,
    hit_chance   INTEGER NOT NULL DEFAULT 3 CHECK (hit_chance >= 0),     -- Шанс на удар
    block_chance INTEGER NOT NULL DEFAULT 3 CHECK (block_chance >= 0),   -- Шанс на защиту
    CONSTRAINT users_damage_range CHECK (damage_min <= damage_max),

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
