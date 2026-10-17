import { UserRepository } from "../repositories/user.repository.js";
import { WorkRepository } from "../repositories/work.repository.js";
import { AccessTokenInvalidException } from "../exceptions/auth.exceptions.js";
import {
  MissionInProgressException,
  WorkInProgressException,
  WorkNotFinishedException,
} from "../exceptions/game.exceptions.js";
import { workReward } from "../constants/work.constants.js";
import {
  toWorkCatalogDto,
  toActiveWorkDto,
  toClaimedWorkDto,
} from "../dto/work.dto.js";

/**
 * Состояние работы для интерфейса. serverNow — время сервера, по нему
 * клиент считает прогресс (часы на устройстве игрока могут врать).
 */
const buildState = async (userId) => {
  const user = await UserRepository.findById(userId);
  if (!user) throw new AccessTokenInvalidException();

  const active = await WorkRepository.findActive(userId);
  const serverNow = active ? active.server_now : await WorkRepository.now();

  return {
    serverNow,
    catalog: toWorkCatalogDto(user.level),
    active: toActiveWorkDto(active),
  };
};

export const WorkService = {
  getState: (userId) => buildState(userId),

  async start(userId, workType, hours) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new AccessTokenInvalidException();

    const reward = workReward(workType, hours, user.level);
    // Пока прошлая работа не принята (даже законченная), новую взять нельзя.
    const status = await WorkRepository.start({
      userId,
      workType,
      hours,
      rewardSilver: reward.silver,
      rewardKarma: reward.karma,
      karmaKind: reward.karmaKind,
    });
    // Нельзя брать работу, пока игрок «отсутствует» после миссии.
    if (status === "mission") throw new MissionInProgressException();
    if (status === "working") throw new WorkInProgressException();

    return buildState(userId);
  },

  /**
   * Отмена работы — ничего не зачисляется. Законченную работу отменить нельзя
   * (иначе можно случайно потерять оплату): состояние вернётся с finished.
   */
  async cancel(userId) {
    await WorkRepository.cancelUnfinished(userId);
    return buildState(userId);
  },

  /** «Принять оплату»: зачисляет серебро и карму за законченную работу. */
  async claim(userId) {
    const claimed = await WorkRepository.claimFinished(userId);
    if (!claimed) throw new WorkNotFinishedException();

    return { ...(await buildState(userId)), claimed: toClaimedWorkDto(claimed) };
  },
};
