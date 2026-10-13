import { UserRepository } from "../repositories/user.repository.js";
import { TokenService } from "./token.service.js";
import { OtpService } from "./otp.service.js";
import { PasswordProvider } from "../providers/password.provider.js";
import { EmailAdapter } from "../adapters/email.adapter.js";
import {
  AccessTokenInvalidException,
  AuthenticationException,
  ConflictException,
  NotFoundException,
  AuthorizationException,
} from "../exceptions/auth.exceptions.js";
import { AUTH_ERRORS } from "../constants/auth.constants.js";
import { STAT_UPGRADE_PRICE } from "../constants/game.constants.js";

export const AuthService = {
  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      await PasswordProvider.burn(password);
      throw new AuthenticationException();
    }

    const valid = await PasswordProvider.verify(password, user.password_hash);
    if (!valid) throw new AuthenticationException();

    return TokenService.issueTokenPair(user.id);
  },

  async register({ email, password, heroName }) {
    const passwordHash = await PasswordProvider.hash(password);
    const created = await UserRepository.create({
      email,
      passwordHash,
      heroName,
    });
    if (created) return { success: true };

    // create() вернул null — сработало одно из UNIQUE-ограничений.
    // Выясняем какое, чтобы показать понятную ошибку.
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException(AUTH_ERRORS.EMAIL_TAKEN, "EMAIL_TAKEN");
    }
    throw new ConflictException(
      AUTH_ERRORS.HERO_NAME_TAKEN,
      "HERO_NAME_TAKEN",
    );
  },

  async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    // Пользователя удалили, а токен ещё жив — считаем токен недействительным.
    if (!user) throw new AccessTokenInvalidException();

    return {
      id: user.id,
      email: user.email,
      heroName: user.hero_name,
      stats: {
        level: user.level,
        hp: user.hp,
        maxHp: user.max_hp,
        xp: user.xp,
        maxXp: user.max_xp,
        silver: user.silver,
        rubies: user.rubies,
      },
      character: {
        // Подробная информация. null в orderName/orderRank = "нет ордена".
        details: {
          orderName: user.order_name,
          orderRank: user.order_rank,
          lootGained: user.loot_gained,
          lootLost: user.loot_lost,
          tournamentsWon: user.tournaments_won,
          wins: user.wins,
          draws: user.draws,
          losses: user.losses,
        },
        // Характеристики, которые игрок может повышать.
        attributes: {
          strength: user.strength,
          giftedness: user.giftedness,
          constitution: user.constitution,
          luck: user.luck,
          attackSkill: user.attack_skill,
          defenseSkill: user.defense_skill,
        },
        // Боевые показатели.
        combat: {
          damageMin: user.damage_min,
          damageMax: user.damage_max,
          armor: user.armor,
          karma: user.karma,
          hitChance: user.hit_chance,
          blockChance: user.block_chance,
        },
        upgradePrice: STAT_UPGRADE_PRICE,
      },
    };
  },

  async forgotPassword({ email }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new NotFoundException();

    const otp = await OtpService.generateOtp(user.id);
    await EmailAdapter.sendOtp(email, otp);
    return { success: true };
  },

  async verifyOtp({ email, otpCode }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new NotFoundException();

    await OtpService.validateOtp(user.id, otpCode);
    await OtpService.invalidateOtp(user.id);

    const verifiedToken = await OtpService.createVerifiedToken(user.id);
    return { verifiedToken };
  },

  async resetPassword({ verifiedToken, password }) {
    const userId = await OtpService.consumeVerifiedToken(verifiedToken);
    if (!userId)
      throw new AuthorizationException(AUTH_ERRORS.RESET_TOKEN_INVALID);

    const passwordHash = await PasswordProvider.hash(password);
    await UserRepository.updatePassword(userId, passwordHash);
    return { success: true };
  },

  async refreshTokens({ refreshToken }) {
    return TokenService.rotateRefreshToken(refreshToken);
  },

  async logout({ refreshToken }) {
    await TokenService.revokeRefreshToken(refreshToken);
    return { success: true };
  },
};