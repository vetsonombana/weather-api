import { Axios } from "axios";
import { RedisClientType } from "redis";
import {
  CurrentWeather,
  CurrentWeatherData,
} from "../../../types/weather/current";
import {
  ForecastWeather,
  ForecastWeatherData,
} from "../../../types/weather/forecast";

export type TWeatherHttpService = {
  getCurrent: (location: string) => Promise<CurrentWeatherData>;
  getForecast: (location: string) => Promise<ForecastWeatherData[]>;
};

export const WeatherHttpService = (
  axios: Axios,
  redis: RedisClientType
): TWeatherHttpService => {
  return {
    getCurrent: async (location: string) => {
      try {
        const { data } = await axios.get<CurrentWeather>(
          `/current?city=${location}`
        );
        const current = data.data[0];
        await redis.set(
          `current-${location.toLowerCase()}`,
          JSON.stringify(current),
          {
            EX: 3600,
          }
        );
        return current;
      } catch (e) {
        throw e;
      }
    },
    getForecast: async (location: string) => {
      try {
        const { data } = await axios.get<ForecastWeather>(
          `/forecast/daily?city=${location}&day=7`
        );
        const forecast = data.data;
        await redis.set(
          `forecast-${location.toLowerCase()}`,
          JSON.stringify(forecast),
          {
            EX: 3600,
          }
        );
        return forecast;
      } catch (e) {
        throw e;
      }
    },
  };
};
