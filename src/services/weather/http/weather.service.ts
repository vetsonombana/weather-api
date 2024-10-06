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
import { TForecastService } from "../../forecast/forecast.service";

export type TWeatherHttpService = {
  getCurrent: (location: string) => Promise<unknown>;
  getForecast: (location: string) => Promise<unknown>;
};

export const WeatherHttpService = (
  axios: Axios,
  redis: RedisClientType,
  forecastService: TForecastService
): TWeatherHttpService => {
  return {
    getCurrent: async (location: string) => {
      try {
        const { data } = await axios.get<CurrentWeather>(
          `/current?city=${location}`
        );
        const weather = data.data[0];
        const current = {
          description: weather.weather.description,
          temperature: weather.temp,
          wind_speed: weather.wind_spd,
          humidity: weather.rh,
        };

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
          `/forecast/daily?city=${location}&days=7`
        );

        const weathers = data.data;
        const summarized = forecastService.summarize(weathers);
        const forecast = {
          temperature_trend: forecastService.getTrend(
            summarized.temperature_trend
          ),
          pressure_trend: forecastService.getTrend(summarized.pressure_trend),
          general_trend: forecastService.getTrend(
            (summarized.temperature_trend + summarized.pressure_trend) / 2
          ),
          wind_speed_avg: summarized.sum_wind_speed / weathers.length,
        };

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
