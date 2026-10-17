import { randomInt } from "node:crypto";
import { pool } from "../config/database.js";
import { UserRepository } from "../repositories/user.repository.js";
import { WorldRepository } from "../repositories/world.repository.js";
import { MissionRepository } from "../repositories/mission.repository.js";
import { WorkRepository } from "../repositories/work.repository.js";
import { AccessTokenInvalidException } from "../exceptions/auth.exceptions.js";
import {
  HpTooLowException,
  LocationNotFoundException,
  MissionInProgressException,
  MissionsUnavailableException,
  NotEnoughMissionPointsException,
  WorkInProgressException,
} from "../exceptions/game.exceptions.js";
import { MISSION_LENGTHS } from "../constants/game.constants.js";
import { BESTIARY } from "../game/bestiary.js";
import { regenerate } from "../game/regen.js";
import { applyXp } from "../game/levels.js";
import { runMission } from "../game/mission.js";
import { toProfileDto } from "../dto/profile.dto.js";
import { toActivityDto } from "../dto/mission.dto.js";

const regenPoints = (user) =>
  regenerate({
    value: user.mission_points,
    max: user.mission_points_max,
    perHour: user.mission_points_regen_per_hour,
    updatedAt: user.mission_points_updated_at,
    now: user.db_now,
  });

const regenHp = (user) =>
  regenerate({
    value: user.hp,
    max: user.max_hp,
    perHour: user.hp_regen_per_hour,
    updatedAt: user.hp_updated_at,
    now: user.db_now,
  });

/** Состояние миссий игрока: очки, жизни и чем он сейчас занят. */
const buildState = async (userId) => {
  const user = await UserRepository.findById(userId);
  if (!user) throw new AccessTokenInvalidException();

  const [run, work] = await Promise.all([
    MissionRepository.findRun(pool, userId),
    WorkRepository.findActive(userId),
  ]);

  const points = regenPoints(user);
  const hp = regenHp(user);
  const activity = toActivityDto({ run, work });

  return {
    serverNow: user.db_now,
    points: {
      current: points.value,
      max: user.mission_points_max,
      regenPerHour: user.mission_points_regen_per_hour,
    },
    hp: { current: hp.value, max: user.max_hp },
    busy: activity?.kind ?? null,
    activity,
  };
};

export const MissionService = {
  getState: (userId) => buildState(userId),

  /**
   * Отправляет игрока на миссию. Бой считается сразу, награда зачисляется
   * сразу, а игрок «отсутствует» (не может брать работу и новую миссию)
   * столько минут, сколько очков миссии потрачено: 20 / 40 / 60.
   *
   * Всё выполняется в одной транзакции с блокировкой строки игрока, поэтому
   * двойной клик или две вкладки не дадут потратить очки дважды.
   */
  async start(userId, { locationId, kind, length }) {
    const lengthDef = MISSION_LENGTHS.find((item) => item.id === length);

    const result = await MissionRepository.transaction(async (client) => {
      const user = await UserRepository.findByIdForUpdate(client, userId);
      if (!user) throw new AccessTokenInvalidException();

      const location = await WorldRepository.findLocation(locationId);
      if (!location || location.min_level > user.level) {
        throw new LocationNotFoundException();
      }
      if (!location.code || !BESTIARY[location.code]) {
        throw new MissionsUnavailableException();
      }

      // Одно занятие за раз: работа или ожидание после миссии.
      if (await MissionRepository.hasWork(client, userId)) {
        throw new WorkInProgressException();
      }
      const lastRun = await MissionRepository.findRun(client, userId);
      if (lastRun?.waiting) throw new MissionInProgressException();

      const points = regenPoints(user);
      if (points.value < lengthDef.cost) throw new NotEnoughMissionPointsException();

      const hp = regenHp(user);
      if (hp.value < Math.ceil((user.max_hp * lengthDef.minHpPercent) / 100)) {
        throw new HpTooLowException();
      }

      const mission = runMission({
        user,
        heroHp: hp.value,
        areaCode: location.code,
        kind,
        encounters: lengthDef.encounters,
        seed: randomInt(0, 2 ** 32),
      });

      const leveled = applyXp(
        { level: user.level, xp: user.xp, maxXp: user.max_xp },
        mission.totals.xp,
      );

      await MissionRepository.applyOutcome(client, userId, {
        silver: mission.totals.silver,
        level: leveled.level,
        xp: leveled.xp,
        maxXp: leveled.maxXp,
        karmaKind: kind,
        karma: mission.totals.karma,
        wins: mission.totals.wins,
        draws: mission.totals.draws,
        losses: mission.totals.losses,
        hp: mission.totals.hpAfter,
        hpUpdatedAt: hp.updatedAt,
        missionPoints: points.value - lengthDef.cost,
        missionPointsUpdatedAt: points.updatedAt,
      });

      const result = {
        locationName: location.name,
        cityName: location.city_name,
        length,
        minutes: lengthDef.minutes,
        cost: lengthDef.cost,
        ...mission,
        totals: {
          ...mission.totals,
          levelsGained: leveled.levelsGained,
          levelAfter: leveled.level,
        },
      };

      // Итог сохраняется в БД (для будущей системы сообщений) ...
      await MissionRepository.saveRun(client, {
        userId,
        locationId: location.id,
        kind,
        length,
        minutes: lengthDef.minutes,
        result,
      });
      return result;
    });

    // Свежие данные после зачисления: профиль (серебро, жизни, карма, уровень)
    // и состояние (таймер ожидания). ... а игроку итог отдаётся один раз,
    // в ответе на старт; повторно по API он не выдаётся.
    const [state, freshUser] = await Promise.all([
      buildState(userId),
      UserRepository.findById(userId),
    ]);
    return { ...state, user: toProfileDto(freshUser), result };
  },
};
