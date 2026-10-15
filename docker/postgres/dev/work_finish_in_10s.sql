-- ТОЛЬКО ДЛЯ ТЕСТОВ: текущая работа закончится через 10 секунд.
--
-- Запуск (dev-окружение из docker/dev/compose.yml):
--   docker exec -i chat-postgres-dev psql -U postgre -d postgre \
--     < docker/postgres/dev/work_finish_in_10s.sql
-- или одной командой:
--   docker exec chat-postgres-dev psql -U postgre -d postgre \
--     -c "UPDATE work_sessions SET ends_at = NOW() + interval '10 seconds'"

UPDATE work_sessions SET ends_at = NOW() + interval '10 seconds';

-- Закончить работу мгновенно (появится кнопка «Принять оплату»):
-- UPDATE work_sessions SET ends_at = NOW();
