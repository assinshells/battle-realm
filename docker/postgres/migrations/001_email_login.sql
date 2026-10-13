-- Переход на вход только по e-mail + имя героя вместо логина, без поля "пол".
-- Для УЖЕ существующей базы (init.sql выполняется только на пустой).
-- Запуск: psql -U <user> -d <db> -f 001_email_login.sql
BEGIN;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM users WHERE email IS NULL) THEN
    RAISE EXCEPTION 'Есть пользователи без e-mail — они не смогут войти. Заполните users.email и повторите.';
  END IF;
  IF EXISTS (SELECT lower(email) FROM users GROUP BY lower(email) HAVING count(*) > 1) THEN
    RAISE EXCEPTION 'Есть e-mail, различающиеся только регистром. Объедините дубликаты и повторите.';
  END IF;
  -- Старый login становится именем героя: он должен подходить под новые правила.
  IF EXISTS (SELECT 1 FROM users WHERE char_length(login) NOT BETWEEN 3 AND 20) THEN
    RAISE EXCEPTION 'Есть login короче 3 или длиннее 20 символов — переименуйте их перед миграцией.';
  END IF;
  IF EXISTS (SELECT lower(login) FROM users GROUP BY lower(login) HAVING count(*) > 1) THEN
    RAISE EXCEPTION 'Есть login, различающиеся только регистром — переименуйте их перед миграцией.';
  END IF;
END $$;

-- e-mail: обязательный, в нижнем регистре
UPDATE users SET email = lower(trim(email));
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_email_lowercase CHECK (email = lower(email));

-- имя героя = прежний login
ALTER TABLE users ADD COLUMN hero_name VARCHAR(20);
UPDATE users SET hero_name = login;
ALTER TABLE users ALTER COLUMN hero_name SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_hero_name_length CHECK (char_length(hero_name) BETWEEN 3 AND 20);
CREATE UNIQUE INDEX users_hero_name_lower_idx ON users (lower(hero_name));

-- лишнее
DROP INDEX IF EXISTS idx_users_login;
ALTER TABLE users DROP COLUMN login;
ALTER TABLE users DROP COLUMN gender;

COMMIT;
