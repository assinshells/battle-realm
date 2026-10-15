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
import { toProfileDto } from "../dto/profile.dto.js";

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

    return toProfileDto(user);
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