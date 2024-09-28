import { NextFunction, Request, Response } from "express";
import { TWeatherCacheService } from "../../../services/weather/cache/weather.service";

export const WeatherCacheMiddleware = (cache: TWeatherCacheService) => {
  return {
    getCurrent: async (req: Request, res: Response, next: NextFunction) => {
      const current = await cache.getCurrent(req.query.location as string);
      if (!current) return next();
      res.json(current);
    },
    getForecast: async (req: Request, res: Response, next: NextFunction) => {
      const forecast = await cache.getForecast(req.query.location as string);
      if (!forecast) return next();
      res.json(forecast);
    },
  };
};
