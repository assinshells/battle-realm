CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email = lower(email)),
    password_hash TEXT NOT NULL,
    hero_name VARCHAR(20) NOT NULL CHECK (char_length(hero_name) BETWEEN 3 AND 20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Имя героя уникально без учёта регистра ("Arthur" = "arthur").
CREATE UNIQUE INDEX IF NOT EXISTS users_hero_name_lower_idx ON users (lower(hero_name));
