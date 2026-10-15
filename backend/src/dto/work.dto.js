import {
  WORK_TYPES,
  WORK_MIN_HOURS,
  WORK_MAX_HOURS,
  silverPerHour,
  workReward,
} from "../constants/work.constants.js";

const hoursRange = () =>
  Array.from(
    { length: WORK_MAX_HOURS - WORK_MIN_HOURS + 1 },
    (_, i) => WORK_MIN_HOURS + i,
  );

/** Каталог работ для игрока данного уровня: все награды на 1–8 часов. */
export const toWorkCatalogDto = (level) => ({
  minHours: WORK_MIN_HOURS,
  maxHours: WORK_MAX_HOURS,
  silverPerHour: silverPerHour(level),
  types: Object.values(WORK_TYPES).map((type) => ({
    id: type.id,
    name: type.name,
    description: type.description,
    karmaKind: type.karmaKind,
    rewards: hoursRange().map((hours) => {
      const { silver, karma } = workReward(type.id, hours, level);
      return { hours, silver, karma };
    }),
  })),
});

const toRewardDto = (session) => ({
  silver: session.reward_silver,
  karma: session.reward_karma,
  karmaKind: session.karma_kind,
});

/**
 * Текущая работа (или null). finished = время вышло, оплату можно принять.
 * Пока работа не закончена, награда зачислена не будет.
 */
export const toActiveWorkDto = (session) =>
  session && {
    type: session.work_type,
    typeName: WORK_TYPES[session.work_type]?.name ?? session.work_type,
    hours: session.hours,
    startedAt: session.started_at,
    endsAt: session.ends_at,
    finished: session.finished,
    reward: toRewardDto(session),
  };

/** Принятая и зачисленная работа. */
export const toClaimedWorkDto = (session) =>
  session && {
    type: session.work_type,
    typeName: WORK_TYPES[session.work_type]?.name ?? session.work_type,
    hours: session.hours,
    reward: toRewardDto(session),
  };
