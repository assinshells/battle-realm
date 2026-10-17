-- ТОЛЬКО ДЛЯ ТЕСТОВ: ожидание после миссии закончится через 10 секунд.
-- (Награда за миссию зачисляется сразу после боя; таймер только не даёт брать
-- работу и новую миссию, пока игрок «отсутствует».)
--
-- Запуск (dev-окружение из docker/dev/compose.yml):
--   docker exec chat-postgres-dev psql -U postgre -d postgre \
--     -c "UPDATE mission_runs SET ends_at = NOW() + interval '10 seconds'"

UPDATE mission_runs SET ends_at = NOW() + interval '10 seconds';

-- Закончить ожидание мгновенно:
-- UPDATE mission_runs SET ends_at = NOW();

-- Полностью восстановить очки миссий и жизни:
-- UPDATE users SET mission_points = mission_points_max, mission_points_updated_at = NOW(),
--                  hp = max_hp, hp_updated_at = NOW();
