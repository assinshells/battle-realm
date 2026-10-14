import { UserRepository } from "../repositories/user.repository.js";
import { WorldRepository } from "../repositories/world.repository.js";
import { AccessTokenInvalidException } from "../exceptions/auth.exceptions.js";
import { CityNotFoundException } from "../exceptions/game.exceptions.js";

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
};
