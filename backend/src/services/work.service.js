import { UserRepository } from "../repositories/user.repository.js";
import { WorkRepository } from "../repositories/work.repository.js";
import { AccessTokenInvalidException } from "../exceptions/auth.exceptions.js";
import { WorkInProgressException } from "../exceptions/game.exceptions.js";
import { workReward } from "../constants/work.constants.js";
import {
  toWorkCatalogDto,
  toActiveWorkDto,
  toSettledWorkDto,
} from "../dto/work.dto.js";

/**
 * Состояние работы для интерфейса. serverNow — время сервера, по нему
 * клиент считает прогресс (часы на устройстве игрока могут врать).
 */
const buildState = async (userId, settled) => {
  const user = await UserRepository.findById(userId);
  if (!user) throw new AccessTokenInvalidException();

  const [active, serverNow] = await Promise.all([
    WorkRepository.findActive(userId),
    WorkRepository.now(),
  ]);

  return {
    serverNow,
    catalog: toWorkCatalogDto(user.level),
    active: toActiveWorkDto(active),
    settled: toSettledWorkDto(settled),
  };
};

export const WorkService = {
  /**
   * Зачисляет награду, если работа закончилась. Вызывается при каждом
   * обращении к работе и при загрузке профиля, так что фонового процесса
   * не нужно. Возвращает зачисленную работу или null.
   */
  settleFinished(userId) {
    return WorkRepository.settleFinished(userId);
  },

  async getState(userId) {
    const settled = await WorkRepository.settleFinished(userId);
    return buildState(userId, settled);
  },

  async start(userId, workType, hours) {
    // Закончившаяся работа сначала зачисляется, потом можно брать новую.
    const settled = await WorkRepository.settleFinished(userId);

    const user = await UserRepository.findById(userId);
    if (!user) throw new AccessTokenInvalidException();

    const reward = workReward(workType, hours, user.level);
    const started = await WorkRepository.start({
      userId,
      workType,
      hours,
      rewardSilver: reward.silver,
      rewardKarma: reward.karma,
      karmaKind: reward.karmaKind,
    });
    if (!started) throw new WorkInProgressException();

    return buildState(userId, settled);
  },

  /** Отмена незаконченной работы — ничего не зачисляется. */
  async cancel(userId) {
    // Если работа как раз закончилась, она честно зачисляется, а не отменяется.
    const settled = await WorkRepository.settleFinished(userId);
    await WorkRepository.cancelUnfinished(userId);
    return buildState(userId, settled);
  },
};
