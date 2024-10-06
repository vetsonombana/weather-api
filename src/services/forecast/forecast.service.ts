import { ForecastWeatherData } from "../../types/weather/forecast";

export const ForecastService = {
  summarize: (weathers: ForecastWeatherData[]) => {
    const evaluate = (prev: number | null, next: number) => {
      if (!prev) return 0;
      return next - prev;
    };

    return weathers.reduce(
      (prev, curr) => {
        prev.sum_wind_speed += curr.wind_spd;
        prev.temperature_trend += evaluate(prev.prev_temp, curr.temp);
        prev.pressure_trend += evaluate(prev.prev_pressure, curr.pres);
        prev.prev_pressure = curr.pres;
        prev.prev_temp = curr.temp;
        return prev;
      },
      {
        sum_wind_speed: 0,
        prev_temp: null as null | number,
        prev_pressure: null as null | number,
        temperature_trend: 0,
        pressure_trend: 0,
      }
    );
  },
  getTrend: (value: number, factor: number = 2) => {
    if (value >= -factor && value <= factor) {
      return "Stable";
    } else if (value < -factor) {
      return "Growing Down";
    } else if (value > factor) {
      return "Growing Up";
    }
  },
};

export type TForecastService = typeof ForecastService;
