import { RedisClientType } from "redis";
import { CurrentWeatherData } from "../../../types/weather/current";
import { ForecastWeatherData } from "../../../types/weather/forecast";

export type TWeatherCacheService = {
  getCurrent: (location: string) => Promise<CurrentWeatherData | null>;
  getForecast: (location: string) => Promise<ForecastWeatherData[] | null>;
};

export const WeatherCacheService = (
  redis: RedisClientType
): TWeatherCacheService => {
  return {
    getCurrent: async (location: string) => {
      try {
        const current = await redis.get(`current-${location.toLowerCase()}`);
        if (!current) return null;
        return JSON.parse(current);
      } catch (e) {
        return null;
      }
    },
    getForecast: async (location: string) => {
      try {
        const forecast = await redis.get(`forecast-${location.toLowerCase()}`);
        if (!forecast) return null;
        return JSON.parse(forecast);
      } catch (e) {
        return null;
      }
    },
  };
};
