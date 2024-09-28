import { Request, Response } from "express";
import { TWeatherHttpService } from "../../../services/weather/http/weather.service";

export const WeatherHttpMiddleware = (http: TWeatherHttpService) => {
  return {
    getCurrent: async (req: Request, res: Response) => {
      try {
        const current = await http.getCurrent(req.query.location as string);
        res.json(current);
      } catch (e) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
      }
    },
    getForecast: async (req: Request, res: Response) => {
      try {
        const forecast = await http.getForecast(req.query.location as string);
        res.json(forecast);
      } catch (e) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
      }
    },
  };
};
