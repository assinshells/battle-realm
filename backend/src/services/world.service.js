import { UserRepository } from "../repositories/user.repository.js";
import { WorldRepository } from "../repositories/world.repository.js";
import { AccessTokenInvalidException } from "../exceptions/auth.exceptions.js";
import {
  CityNotFoundException,
  LocationNotFoundException,
} from "../exceptions/game.exceptions.js";
import { MISSION_LENGTHS } from "../constants/game.constants.js";
import { BESTIARY } from "../game/bestiary.js";
import { regenerate } from "../game/regen.js";

const getUser = async (userId) => {
  const user = await UserRepository.findById(userId);
  // Пользователя удалили, а токен ещё жив — считаем токен недействительным.
  if (!user) throw new AccessTokenInvalidException();
  return user;
};

export const WorldService = {
  /** Карта мира: города, доступные игроку по уровню. */
  async getMap(userId) {
    const user = await getUser(userId);
    const cities = await WorldRepository.listCitiesForLevel(user.level);

    return {
      cities: cities.map((city) => ({
        id: city.id,
        name: city.name,
        isCurrent: city.id === user.city_id,
      })),
    };
  },

  /**
   * Город с его локациями. cityRef — id города или "current"
   * (город, в котором игрок находится сейчас).
   */
  async getCity(userId, cityRef) {
    const user = await getUser(userId);
    const cityId = cityRef === "current" ? user.city_id : cityRef;

    const city = await WorldRepository.findCity(cityId);
    // Город ещё не открыт для уровня игрока — для него его "нет".
    if (!city || city.min_level > user.level) {
      throw new CityNotFoundException();
    }

    const locations = await WorldRepository.listLocations(city.id);
    return {
      id: city.id,
      name: city.name,
      isCurrent: city.id === user.city_id,
      locations: locations.map(({ id, name }) => ({ id, name })),
    };
  },

  /**
   * Локация и данные для её страницы: очки миссий игрока и длины миссий.
   * Локация, город которой ещё не открыт игроку по уровню, для него «не существует».
   */
  async getLocation(userId, locationId) {
    const user = await getUser(userId);

    const location = await WorldRepository.findLocation(locationId);
    if (!location || location.min_level > user.level) {
      throw new LocationNotFoundException();
    }

    return {
      id: location.id,
      name: location.name,
      cityId: location.city_id,
      cityName: location.city_name,
      missions: {
        // Миссии есть только у локаций с бестиарием.
        available: Boolean(location.code && BESTIARY[location.code]),
        points: regenerate({
          value: user.mission_points,
          max: user.mission_points_max,
          perHour: user.mission_points_regen_per_hour,
          updatedAt: user.mission_points_updated_at,
          now: user.db_now,
        }).value,
        maxPoints: user.mission_points_max,
        regenPerHour: user.mission_points_regen_per_hour,
        lengths: MISSION_LENGTHS,
      },
    };
  },
};
